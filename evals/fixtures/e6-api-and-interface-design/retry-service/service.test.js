'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { createService } = require('./service');

test('first request returns its effect result', async () => {
  const submit = createService(async (amount) => ({ id: `effect-${amount}` }));
  assert.deepEqual(await submit({ tenantId: 'a', key: 'intent-1', amount: 20 }), {
    status: 201,
    body: { id: 'effect-20', amount: 20 },
  });
});
