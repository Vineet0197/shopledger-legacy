const test = require('node:test');
const assert = require('node:assert/strict');

const ledger = require('../lib/ledger');

test('string settlement amount is added numerically to the customer ledger', () => {
  const db = {
    nextSettlementId: 501,
    settlements: [],
    customers: [
      {
        id: 1,
        name: 'Meera Joshi',
        openingBalance: 450,
        totalBilled: 1982.01,
        totalSettled: 1200,
        creditLimit: 5000
      }
    ]
  };

  const result = ledger.recordSettlement(db, 1, '500', 'upi', 'Test settlement');

  assert.equal(result.customer.totalSettled, 1700);
  assert.equal(result.customer.balance, 732.01);
  assert.equal(result.settlement.amount, 500);
});
