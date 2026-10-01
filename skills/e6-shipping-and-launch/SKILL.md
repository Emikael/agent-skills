---
name: e6-shipping-and-launch
description: Use when preparing a production deployment or launch, running a pre-launch checklist, deciding what must be in place before shipping, producing a go/no-go assessment, setting up monitoring and alert readiness, planning staged rollout, opening a beta, or preparing and verifying a rollback strategy.
---

# Shipping and Launch

## Overview

Bind release decisions to current acceptance and operational evidence. Prepare recovery before deploying, observe actual user outcomes, and advance only when release gates pass.

## When to Use

- Preparing production features, significant releases, betas, data/infrastructure changes
- Assessing readiness or rehearsing rollout/recovery without a deployment request
- Explicit release-planning requests stay within that deliverable; they do not authorize production mutation

## Workflow Handoff

For a standalone engineering change with no active workflow, load `using-e6-agent-skills` and `../../references/workflow-contract.md`. With an active coordinator, perform this release step, record evidence, and return to that coordinator. Do not restart the lifecycle. Use `e6-caveman` for concise prose and bounded delegation; preserve exact commands, identifiers, and uncertainty.

## Process

### 1. Identify Candidate and Authority

Read project instructions, accepted criteria, current diff/commit/artifact, CI/local runtime evidence, environment/runbook, migrations, flags, SLO/rollout policy, and support/on-call ownership. Tie gates to candidate revision and target environment; stale green checks do not validate a changed candidate.

Honor existing session/repository authorization for publication/deployment. Complete local fixes, rehearsal, and reviewable readiness without repeated approval. Readiness work alone does not authorize merge, deploy, external notification, or destructive data changes.

Use `../../references/definition-of-done.md` as the standing floor. Record applicable gates as PASS, FAIL, UNVERIFIED, or reasoned N/A. Missing tools/access cannot become PASS. Resolve available failures and rerun affected checks before the decision.

### 2. Verify Relevant Launch Gates

| Area | Required evidence when applicable |
|---|---|
| Correctness | Candidate's acceptance tests, unit/integration/critical E2E, error paths, flag states, build/lint/types, reviewed final diff |
| Security | Boundary/auth review, redacted secrets check, dependency findings triaged under policy, headers/rate limits/CORS, data handling |
| Performance | Measured critical-path budgets, query/index behavior, bundle/assets and Core Web Vitals for web UI |
| Accessibility | Actual keyboard/focus, labels/errors, contrast, assistive-tech checks for UI; automated audit supplements behavior |
| Infrastructure | Target config, DNS/TLS/CDN when needed, healthy dependencies, schema/artifact compatibility, functioning health/logging |
| Documentation | Setup/API/user docs, relevant ADRs, changelog, runbook and recovery steps |

Use `e6-code-review-and-quality`, `e6-security-and-hardening`, `e6-performance-optimization`, and `e6-documentation-and-adrs` for substantive gaps. Load relevant checklists directly: `../../references/security-checklist.md`, `../../references/performance-checklist.md`, `../../references/accessibility-checklist.md`. Do not apply browser-only gates to workers or manufacture measurements.

Run app/service locally and in staging where available. Exercise accepted critical flows with representative data/failures. For web journeys, use `e6-browser-testing-with-devtools` or available browser capability; for desktop journeys, use available computer/runtime capability. Inspect console/network/server signals and observed outcomes. Build success or HTTP 200 does not prove checkout, auth, or a job works.

Specialist review depends on risk and missing coverage. Coordinator owns independent bounded assignments and deduplicates findings; no nested workers. Send candidate, criteria, scoped owned paths, and evidence pointers: a 500-word input target and a 200-word result target. Request decisive file:line findings/checks, not repeated full reports.

### 3. Prepare Controls and Recovery

Assign deploy monitor/rollback owner. Use `e6-observability-and-instrumentation` for critical metrics/alerts. Verify dashboards, log flow, and alert delivery for relevant failures (such as payment timeout/duplicate charge), not just configuration existence. Prepare support/on-call handoff; send notifications only when authorized.

Use flags to decouple deploy/enablement when appropriate. Give each flag an owner, stable cohort policy, cleanup gate/date, and tested on/off behavior. Avoid nested flags. Flag off does not reverse writes, messages, charges, or other side effects.

Before GO, document and rehearse exact recovery with verified project tooling: compatible prior immutable artifact/deployment ID, sufficient flag changes, health/user-flow checks, owner, and recovery time. Git revert does not itself redeploy the prior artifact. Use `e6-deprecation-and-migration` for schema/data recovery; never invent database rollback commands or assume down migrations restore deleted data.

### 4. Set Rollout Decisions Before Deploying

Use project SLOs/error-budget policy, baseline/control cohort, minimum sample/traffic, observation window, and absolute limits. Relative comparisons need meaningful nonzero baselines. Insufficient traffic/evidence means HOLD; a quiet dashboard is not success. Define advance, investigate/hold, and rollback signals.

Without established thresholds, propose limits before enablement. Typical starting comparisons are errors within 10% of baseline and p95 within 20%; >2× errors or >50% latency regression may trigger rollback. Add absolute service/business/data-integrity limits. Data corruption or exploitable security failure requires immediate containment/recovery.

Budget constrains risk under actual service policy. Low budget slows rollout; exhausted budget normally freezes risky features for reliability. High burn can require HOLD despite acceptable current errors. Policy exceptions need explicit documented authority/mitigation; deadline pressure cannot turn failed evidence green.

### 5. Decide, Deploy When Authorized, Observe

Issue **GO**, **NO-GO**, or **HOLD**. GO needs current applicable acceptance/operational gates, proven recovery, and required review/authorization. Failed required gates mean NO-GO; missing decisive evidence means HOLD. List blockers and concrete actions to clear them. Accepted risk records an exception without falsifying checks.

For authorized rollout, promote verified artifact to staging, test, deploy with appropriate initial cohort/flag state, verify health/critical flow, then advance only when thresholds pass. Internal → 5% → 25% → 50% → 100% is illustrative; choose stages/windows from actual traffic/policy.

Observe errors/latency, client failures, business outcomes, integrity, and resource/queue signals. On red signals, follow rehearsed recovery and verify outcomes. Record artifact/environment/cohort/timestamps. Pending observation remains pending; arrange monitoring under authorization instead of silently waiting or claiming completion.

After a stable full rollout, remove expired flags/dead paths under cleanup plan, update operational docs, and return outcome/lessons to coordinator.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "Old green checks are enough" | Evidence must match candidate and changed acceptance behavior. |
| "The date cannot move" | Failed required tests or missing recovery remain blockers. |
| "Add alerts/rollback later" | Prove operational controls before GO. |
| "Canary has no errors" | Check traffic, sample, absolute limits, and burn rate. |
| "Flag off restores everything" | Side effects and data need recovery proof. |

## Red Flags

- GO from checklist prose, stale results, or unavailable runtime
- Health check as the only critical-flow evidence
- Missing alert delivery, recovery owner, or compatible rehearsal
- Advancing on zero traffic or ignoring budget/contractual gates
- Actions outside authorization or repeated permission despite existing authorization

## Verification

- [ ] Candidate/artifact, environment, criteria, authorization, and current evidence are explicit
- [ ] Local/staging and relevant browser/computer flows exercised; blocked checks stay UNVERIFIED
- [ ] Required tests/review and critical controls pass; N/A gates have reasons
- [ ] Compatible recovery rehearsed before GO, including data effects/ownership
- [ ] Thresholds, samples, windows, SLO/budget policy, and monitoring ownership recorded
- [ ] Verdict names blockers/path to clear them; pressure did not fabricate passes
- [ ] Authorized rollout/recovery has observed outcomes; pending observation stays pending
- [ ] Coordinator receives concise verdict/evidence, artifact/run IDs, and remaining actions
