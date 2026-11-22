const test = require('node:test');
const assert = require('node:assert/strict');

const orders = require('../lib/orders');

const sampleOrders = [
  { id: 1008, date: '15/03/2022', status: 'completed' },
  { id: 1007, date: '04/03/2022', status: 'pending' },
  { id: 1004, date: '30/01/2022', status: 'completed' },
  { id: 1001, date: '28/12/2021', status: 'completed' }
];

test('order list sorts DD/MM/YYYY dates newest first', () => {
  const result = orders.list({ orders: sampleOrders }, {});

  assert.deepEqual(result.map((order) => order.id), [1008, 1007, 1004, 1001]);
});

test('ISO date range includes only orders within the inclusive date bounds', () => {
  const result = orders.list(
    { orders: sampleOrders },
    { from: '2022-01-01', to: '2022-01-31' }
  );

  assert.deepEqual(result.map((order) => order.id), [1004]);
});
