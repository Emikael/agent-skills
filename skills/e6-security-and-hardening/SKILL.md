---
name: e6-security-and-hardening
description: Use when auditing or hardening input handlers, authentication/login flows against the OWASP Top Ten, authorization, data storage, uploads, webhooks, external integrations or server-side URL fetches; auditing dependencies or triaging package-manager audit findings and supply-chain risk; or handling personal data and privacy compliance.
---

# Security and Hardening

## Overview

Map trust boundaries/abuse cases, implement controls, and execute denied and legitimate paths. Trust follows the writer, not the delivery channel.

## When to Use

- User input, sessions, resource permissions, sensitive storage, payments, or external services.
- Uploads, webhooks, server-side fetches, dependency audits, privacy, or LLM/tool features.
- A scoped security review: report evidence and findings without making unrequested changes.

Not for ordinary readability work. Use `e6-code-simplification` for that.

## Workflow handoff

For standalone engineering work without an active workflow, load `using-e6-agent-skills`; otherwise keep the current coordinator. Audit-only work stays audit-only. Return threats, acceptance/runtime evidence, and remaining findings to the coordinator; authorized hardening continues through verification and review. Use `e6-caveman` for concise output and bounded delegation. Give independent reviewers exact boundaries and paths; no nested agents.

## Process

### 1. Establish context and authorization

Read instructions, acceptance criteria, handlers/callers, auth/data policy, topology, lockfile/manager, and controls. Use `e6-context-engineering` for missing context; read official docs through `e6-source-driven-development` when control semantics are uncertain.

Existing authorization covers requested reversible local auth/CORS/integration/upload/rate-limit changes. Ask only for missing decisions, expanded data collection, or destructive/external actions outside authorization. Complete concrete local work first; sensitivity alone does not require reapproval.

### 2. Threat-model the affected surface

Map assets/boundaries: requests/forms/files, APIs/webhooks/queues, LLM output, configuration, filenames, derived paths, and values supplied by another process. Internal-looking data can still be attacker-controlled.

Run STRIDE per boundary: spoofing, tampering, repudiation, disclosure, denial of service, privilege elevation. Convert threats into observable abuse and allowed acceptance cases. Prioritize reachable consequences; distinguish evidence from hypotheses.

### 3. Prove and implement the controls

Run a focused baseline. Use `e6-test-driven-development` for regression/abuse tests before fixes; verify legitimate paths too. For dependencies/infrastructure, use meaningful audit/config/runtime checks.

| Boundary | Required control |
|---|---|
| Injection/XSS | Parameterize queries; never interpolate input into SQL/NoSQL/shell. Encode output; sanitize unavoidable raw HTML with an allowlist. |
| Access/session | Authenticate protected routes and authorize the specific resource/tenant. Hash passwords with bcrypt/scrypt/argon2; secure/httpOnly/SameSite cookies with expiry; protect state changes with appropriate anti-CSRF token or trusted Origin checks. SameSite is defense in depth; never mutate on GET. |
| Headers/CORS/errors | Reuse framework security headers and restrictive CSP; explicit credentialed origins. Public responses use explicit field allowlists. Generic errors; redact logs. |
| Input/uploads | Parse allowlisted schema shape/length/range/format; downstream uses parsed values only. Bound upload size before buffering; verify actual content/type and safe storage/serving, not declared MIME or extension. |
| SSRF | Allowlist scheme/host/port; reject all private/reserved IPv4/IPv6 destinations, redirects, and URL credentials. Validate/pin the address actually used by transport or use a trusted egress filter; bound time and response bytes. Separate DNS validation does not prevent rebinding. |
| Destructive paths | Resolve symlinks; require allowlisted root, descendant depth, authenticated ownership evidence, and no check/use race. Stop on refusal; never broaden a fallback target. |
| Rate limits | Limit auth and relevant costly paths; tune to project abuse requirements. Shared counters across processes; test proxy/IP identity and distributed enforcement. |
| Secrets | Environment/secret store; placeholder `.env.example`, ignored real secrets. Inspect staged changes without printing secret values. Rotate exposed secrets before any authorized history cleanup. |

Load the matching [hardening pattern](references/hardening-patterns.md). Enforce its preconditions and caveats.

### 4. Handle dependency, privacy, and AI risks

**Dependencies:** Find the installation boundary; corroborate manifest/`packageManager`, lockfile, and CI, and stop on disagreement. Pin the manager. Block scripts before first execution; review exact sources, record narrow native approvals, and verify a clean frozen install. Run the native audit before release; triage critical/high reachability across runtime/build/test/deploy. Preview remediation, review changelog/lockfile, and test upgrades; never force-fix automatically. Audits miss new malicious/typosquatted packages: inspect provenance, ownership, release history, scripts, and transitive graph. Deferrals need reason, mitigation, owner, review date.

**Privacy:** Classify fields; collect only for a stated purpose; minimize PII, retention, and sharing. Provide testable export/deletion paths across applicable stores, caches/indexes/backups under the project's retention policy. Confirm applicable consent/legal basis/vendor agreements. Keep PII out of telemetry.

**AI:** Treat prompts/documents/model output as untrusted; schema-validate output and tool arguments, encode data, and enforce permissions in code. Keep secrets/cross-tenant data out of context; assume system prompts can leak. Scope tools/RAG per tenant; bound tokens, rate, recursion, and destructive actions within existing authorization.

Load applicable sections of `../../references/security-checklist.md` for manager policies and deeper sign-off checks.

### 5. Verify the actual path and review

Run abuse and allowed acceptance cases, required project gates, and the affected local API/job/CLI flow. For login/cookies/headers/CORS/upload UI, use `e6-browser-testing-with-devtools` and inspect actual browser behavior/responses. For transport controls, test that the prohibited connection/action never occurs; do not rely only on a rejected string.

Use `e6-code-review-and-quality`, fix supported findings, and re-check edits. Report commands/results, runtime evidence, risks, and blockers. An audit alone cannot prove security.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "Internal data is trusted" | Writer identity and permissions define trust. |
| "The framework/audit handles it" | Controls require correct use; audits match only known advisories. |
| "SameSite prevents CSRF" | It does not replace protecting state-changing requests. |
| "The hostname passed validation" | The connected address and redirects decide SSRF exposure. |

## Red Flags

- Untested abuse cases, client-only validation, missing resource authorization.
- Sensitive fields returned/logged by spread or full-body capture.
- Separate DNS check presented as safe transport; MIME header treated as verified bytes.
- Reapproval of requested local work, or unrequested destructive/external action.

## Verification

- [ ] Boundaries/assets/abuse cases and legitimate acceptance behavior are recorded.
- [ ] Denial/allowed tests and local/browser paths ran successfully.
- [ ] Input, auth, response, secret, transport, and path controls were checked when relevant.
- [ ] Applicable dependency findings and privacy/AI obligations have evidence or explicit limits.
- [ ] Review resolved supported in-scope findings; coordinator received commands, results, and blockers.
