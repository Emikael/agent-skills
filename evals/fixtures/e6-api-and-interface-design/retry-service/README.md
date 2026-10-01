# In-process retry contract

`createService(effect)` returns `submit({ tenantId, key, amount })` from
`service.js`. `effect(amount)` is asynchronous and returns `{ id }`. These are
local test effects, not real payments. Tests run with `node --test`.

Accepted behavior:

- First valid request returns status 201 and `{ id, amount }`.
- Scope a key to tenant and operation. Distinct tenants may use the same key.
- Same tenant/key/amount after success replays the original result without
  another effect.
- Same tenant/key with a changed amount returns 422 with the error envelope
  `{ error: { code: "IDEMPOTENCY_PAYLOAD_MISMATCH", message: string } }`.
- Concurrent same-tenant/key requests: claim before awaiting `effect`; a
  duplicate while pending returns 409 with the same envelope and code
  `IDEMPOTENCY_IN_PROGRESS`. Only one effect may execute.
- If the effect throws, its outcome may be unknown. Return 503 with code
  `OUTCOME_UNKNOWN`, retain the claim, and do not execute the effect again
  automatically for that intent.

This fixture is deliberately in-memory. The task does not include durable
storage, TTL or restart recovery. State that limitation; do not claim crash-safe
production idempotency. Preserve the accepted error envelope for every failure.
