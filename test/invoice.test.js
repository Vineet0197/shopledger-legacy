const test = require('node:test');
const assert = require('node:assert/strict');

const invoice = require('../lib/invoice');
const pricing = require('../lib/pricing');

function sampleOrder(overrides = {}) {
  return {
    id: 42,
    date: '22/11/2026',
    customer: 'Test Customer',
    paymentMode: 'cash',
    status: 'completed',
    items: [
      {
        id: 1,
        name: 'Rice',
        sku: 'GRN-001',
        hsn: '1006',
        price: 1000,
        qty: 3
      }
    ],
    ...overrides
  };
}

test('invoice uses the billed HSN GST slab', () => {
  const order = sampleOrder();
  const invoiceFigures = invoice.computeInvoiceFigures(order);
  const billedFigures = pricing.computeTotals(order.items, '');

  assert.equal(invoiceFigures.rows[0].gstPercent, billedFigures.lines[0].gstPercent);
  assert.equal(invoiceFigures.rows[0].lineTax, billedFigures.lines[0].tax);
  assert.equal(invoiceFigures.tax, billedFigures.tax);
  assert.equal(invoiceFigures.cgst, billedFigures.cgst);
  assert.equal(invoiceFigures.sgst, billedFigures.sgst);
  assert.equal(invoiceFigures.total, billedFigures.total);
});

test('invoice applies the billed coupon discount and matches the billed total', () => {
  const order = sampleOrder({ coupon: 'SAVE10' });
  const invoiceFigures = invoice.computeInvoiceFigures(order);
  const billedFigures = pricing.computeTotals(order.items, order.coupon);

  assert.equal(invoiceFigures.subtotal, 3000);
  assert.equal(billedFigures.discount, 150);
  assert.equal(billedFigures.tax, 142.5);
  assert.equal(billedFigures.total, 2992.5);
  assert.equal(invoiceFigures.discount, billedFigures.discount);
  assert.equal(invoiceFigures.tax, billedFigures.tax);
  assert.equal(invoiceFigures.rows[0].lineTax, billedFigures.lines[0].tax);
  assert.equal(invoiceFigures.cgst, 71.25);
  assert.equal(invoiceFigures.sgst, 71.25);
  assert.equal(invoiceFigures.total, billedFigures.total);

  const html = invoice.render({ ...order, total: billedFigures.total });
  assert.match(html, /Invoice Total<\/td><td class="r">₹2992\.50/);
  assert.doesNotMatch(html, /Accountant Reconciliation Notice/);
});
