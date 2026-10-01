---
name: e6-observability-and-instrumentation
description: Use when adding structured logging, metrics, distributed tracing, or actionable alerting; instrumenting a production endpoint, service, job, retry, queue, or external integration; or improving telemetry after production behavior was hard to diagnose.
---

# Observability and Instrumentation

## Overview

Instrument operator questions alongside the feature. Verify emitted signals, context, and failure paths before completion.

## When to Use

- A production feature adds I/O, retries, workers, queues, or external calls.
- Operators cannot explain a failure from current telemetry.
- Logging, metrics, traces, alerts, or runbooks need implementation/review.

For an active incident use `e6-debugging-and-error-recovery`; for measured slowness use `e6-performance-optimization`. Launch monitoring/rollback belongs to `e6-shipping-and-launch`.

## Workflow handoff

For standalone engineering work with no active workflow, load `using-e6-agent-skills`; otherwise keep the current coordinator. Instrument alongside implementation, then return signal acceptance, local/runtime evidence, and limits to it. Use `e6-caveman` for concise output and bounded delegation. Give independent inspections exact signal questions, paths, and safe test destination; no nested agents.

## Process

### 1. Load context and define working signals

Read instructions, acceptance criteria, feature/callers, existing telemetry/exporters, dashboards, SLOs, and operator requirements. Use `e6-context-engineering` for missing context. Reuse the supported stack.

Write 2–4 on-call questions before editing: recovery, failure class, latency, duplicate actions, affected operations. Map questions to signals and observable acceptance cases: success/retry/exhaustion/errors, correlation, bounded dimensions, redaction, output inspection.

### 2. Pick signals deliberately

| Signal | Question | Cost |
|---|---|---|
| Structured event log | What happened in this case and why? | Per event; volume grows with traffic. |
| Metric | How often/how fast in aggregate? | Per series; label combinations determine cost. |
| Trace | Where did time go across work/services? | Per request; sampling/export matters. |

Emit only useful signals. Account for exporter failure, buffering, retention, and overhead; telemetry must not break business operations.

### 3. Implement logs and context

Use stable events and allowlisted structured fields. Levels: error for actionable failure/invariant violation, warn for handled degradation, info for significant business events, debug off by default in production. Never log secrets, tokens, full PII, auth headers, or whole bodies/raw gateway responses. Sanitize external error metadata.

Generate correlation IDs or accept bounded, validated IDs under project trust policy. Never copy arbitrary request headers into logs/responses. Propagate context through HTTP/queue/async boundaries. For shared sinks, stamp an allowlisted `entryPoint` where the run starts and propagate it with the run ID; do not infer origin downstream.

Example: `{ event: 'payment_retry_failed', requestId, entryPoint, provider, errorCode, attempt }`. Use safe identifiers/bounded error classes and existing schema; `entryPoint` avoids ECS `source.*`.

### 4. Implement metrics and traces

For new request/dependency paths use RED: rate, errors, duration. For relevant resources use USE: utilization, saturation, errors. Latency uses histograms with useful buckets and queryable percentiles, not averages alone. Define retry attempts vs final operations so counts mean what operators expect.

Labels come from fixed sets: route template, method, status class, provider, bounded failure class. Never use user/tenant/request IDs, raw URLs, email, or error text as labels. Those safe, scoped details belong in logs/traces when policy allows.

Use existing tracing or OpenTelemetry when choosing a new vendor-neutral stack. Initialize before instrumented modules, configure/export to the actual sink, and flush on bounded shutdown where needed. Propagate W3C trace context or the supported equivalent across services and queues; add manual spans only for meaningful internal work. Span attributes also need redaction and cardinality discipline.

Choose a sampling topology explicitly. Low head sampling drops traces before a tail sampler can see errors; it cannot guarantee retaining all errors. For error retention via tail sampling, send candidate traces to that collector and document cost/buffering. Test context and export, beyond SDK initialization.

### 5. Make alerts actionable

Page on symptoms users feel: error rate, latency, queue age, missing completion. Use cause/saturation signals for investigation or alerts when they predict an actionable failure under the project's SLOs. Reuse severity conventions; choose threshold and duration from SLO/historical evidence. Do not page on isolated retries/restarts.

Every alert needs an owner/runbook: meaning, first check, action/escalation. Store with project runbooks and update after incidents. Dashboards answer defined questions.

Test the rule and receiver in an authorized sandbox/test destination. Do not lower a live production threshold or notify people without existing authorization. Restore temporary configuration. A local receiver proves local wiring; actual production delivery remains a separate stated verification limit when unavailable.

### 6. Execute signal acceptance and inspect output

Use `e6-test-driven-development` for meaningful telemetry contracts. Drive deterministic success, retry, exhaustion, timeout, or queue paths through the local entry point. Capture log/metric/span output or inspect the local collector; confirm event fields/counts, durations, bounded labels, correlation, and no sensitive data.

For a browser feature, use `e6-browser-testing-with-devtools` to exercise the interaction and inspect client/server correlation, errors, and network behavior. With staging/collector access, diagnose a safe induced failure from telemetry and follow its request. Otherwise state local evidence and missing remote proof.

Test alert evaluation/receiver and runbook links. Use `e6-code-review-and-quality`; fix findings and re-check signals. Load applicable sections of `../../references/observability-checklist.md` for deeper checks.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "More logs means more visibility" | Queryable signals answering defined questions beat noise. |
| "SDK started, tracing works" | Export and context continuity need observed output. |
| "ID labels make debugging easier" | Unbounded series can exhaust the metrics backend. |
| "We'll test the pager later" | Verify safe rule/receiver wiring now and state remote limits. |

## Red Flags

- Prose-only logs, raw secrets/errors, unbounded labels, or unvalidated IDs.
- Retries/external calls with no operation outcome signal.
- Broken queue context, incompatible sampling claims, or unobserved exporter output.
- Claimed staging/notification verification without execution; temporary thresholds left altered.

## Verification

- [ ] Defined questions map to emitted signals and exercised acceptance paths.
- [ ] Actual structured output is correlated, attributed, bounded, and redacted.
- [ ] Metrics/spans export with correct counts, duration, and continuous context.
- [ ] Alert rule/authorized test receiver/runbook were checked; temporary config restored.
- [ ] Relevant local/browser behavior and review ran; coordinator received evidence and limits.
