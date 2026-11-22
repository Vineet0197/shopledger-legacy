const test = require('node:test');
const assert = require('node:assert/strict');

const inventory = require('../lib/inventory');
const orders = require('../lib/orders');

test('inventory check allows buying the exact sellable quantity', () => {
  const products = [
    { id: 6, name: 'A2 Gir Cow Ghee 500ml', stock: 1, reserved: 0 },
    { id: 11, name: 'Byadgi Kashmiri Chilli Powder 500g', stock: 4, reserved: 3 }
  ];

  assert.deepEqual(inventory.check(products, [{ id: 6, qty: 1 }]), { ok: true });
  assert.deepEqual(inventory.check(products, [{ id: 11, qty: 1 }]), { ok: true });
  assert.deepEqual(inventory.check(products, [{ id: 6, qty: 2 }]), {
    ok: false,
    msg: 'A2 Gir Cow Ghee 500ml is out of stock (1 sellable available)'
  });
});

test('cancelling an order restores physical stock without changing reserved stock', () => {
  const db = {
    products: [
      { id: 6, name: 'A2 Gir Cow Ghee 500ml', stock: 1, reserved: 0 },
      { id: 4, name: 'Cold-Pressed Sunflower Oil 1L', stock: 20, reserved: 4 }
    ],
    orders: [
      {
        id: 1007,
        customer: 'Suresh Deshmukh',
        paymentMode: 'cash',
        status: 'pending',
        items: [
          { id: 6, name: 'A2 Gir Cow Ghee 500ml', qty: 2 },
          { id: 4, name: 'Cold-Pressed Sunflower Oil 1L', qty: 2 }
        ]
      }
    ]
  };

  const result = orders.cancel(db, 1007, 'Test cancellation');

  assert.equal(result.ok, true);
  assert.equal(result.order.status, 'cancelled');
  assert.equal(db.products[0].stock, 3);
  assert.equal(db.products[1].stock, 22);
  assert.equal(db.products[1].reserved, 4);
});
