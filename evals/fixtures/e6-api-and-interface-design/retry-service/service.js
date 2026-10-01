'use strict';

function createService(effect) {
  const completed = new Map();
  return async function submit({ tenantId, key, amount }) {
    const previous = completed.get(key);
    if (previous) return previous;
    const result = await effect(amount);
    const response = { status: 201, body: { id: result.id, amount } };
    completed.set(key, response);
    return response;
  };
}

module.exports = { createService };
