---
name: e6-deprecation-and-migration
description: Use when deprecating or sunsetting old systems, APIs, libraries, or features; migrating users and consumers from one implementation to another; deciding whether to maintain or remove legacy code; or changing a production database schema without downtime, including renaming or dropping a column with expand/contract.
---

# Deprecation and Migration

## Overview

Remove maintenance burden while preserving consumer behavior and data. An announcement is not a completed migration; measured usage and tested recovery decide when removal is safe.

## When to Use

- Replacing/consolidating systems, public APIs, libraries, and features
- Planning safe shutdown or deciding whether legacy code still earns maintenance
- Migrating production schemas/data with mixed app versions
- Plan removability at design time; clean boundaries make future migration cheaper

## Workflow Handoff

For a standalone engineering change with no active workflow, load `using-e6-agent-skills` and `../../references/workflow-contract.md`. With an active coordinator, perform this migration step, record evidence, and return to that coordinator. Do not restart the lifecycle. Use `e6-caveman` for concise prose and bounded delegation; preserve exact commands, identifiers, and uncertainty.

## Process

### 1. Discover Consumers and Obligations

Read project instructions, interface/schema history, existing migrations/tooling, consumer inventory, telemetry, support/contact ownership, published contracts, notice windows, and retention/export obligations. Include jobs, queues/retries, offline clients, integrations, and versions that may return during rollback. Inspect scoped dependencies; no observed traffic alone proves nobody depends on a system.

Compare unique value, maintenance/security cost, and migration cost. Maintain systems supplying required unique value. Hyrum's Law applies: consumers can depend on undocumented timing, errors, auth, or side effects. Capture observable behaviors as migration acceptance criteria and characterization/contract tests before changing them.

### 2. Prepare Replacement and Transition

A replacement must cover critical use cases, have migration docs, and demonstrate representative runtime/canary behavior. For an explicitly authorized shutdown without replacement, provide a viable transition such as data export and explain lost functionality; do not invent a replacement or silently block the requested shutdown.

Choose advisory deprecation for optional migration; use a compulsory deadline when documented risk/cost requires it. Honor contractual notice periods. Set owner, cohorts, communication channels, support path, compatibility window, measured advancement/removal criteria, and recovery plan. Reach reseller/indirect consumers. The infrastructure owner supplies tooling or backward-compatible updates and helps consumers migrate.

Select a pattern:

- **Strangler:** route cohorts from old to new, compare outcomes, retain a working rollback route.
- **Adapter:** preserve old interface semantics while the backend changes.
- **Feature flag:** switch stable consumer cohorts; test both paths and assign owner/cleanup gate.

Move one consumer/cohort at a time. Identify touchpoints, migrate, run acceptance/edge/error checks, compare behavior, and confirm no regressions before advancing. Exercise actual local/staging API, browser, or desktop journeys as relevant. Reuse `e6-test-driven-development` and `e6-debugging-and-error-recovery` for implementation/failures. Local rehearsals do not authorize production mutation.

### 3. Expand/Contract Database Changes

Old/new app and job versions must work during rolling deploys. Do not rename/drop a live column in place. For `name` → `full_name`:

1. **Expand:** add nullable `full_name`. Check engine-specific locks/resources/runtime behavior; additive does not automatically mean nonblocking.
2. **Dual-write:** update every live writer to populate both values. Verify inserts/updates and mixed-version behavior; drain/account for writers updating only the old shape.
3. **Backfill:** run resumable, throttled batches with checkpoints. Make writes idempotent and concurrency-safe with appropriate transactions/version conditions; stale batches must not overwrite newer writes. Test interruption/resume and concurrent updates.
4. **Switch reads:** verify missing-value counts, source/destination parity, and ongoing writer consistency. Switch reads while preserving dual-write and an established rollback window. Bake using measured criteria.
5. **Contract:** after old readers/writers, retries/jobs, and permitted rollback versions are gone, stop old writes. Later, separately, remove the old column. This boundary may be irreversible.

Rehearse on a disposable representative database. Test old/new readers/writers at compatible phases, parity, locks, and acceptance paths. Use engine-supported nonblocking index creation where needed (for example PostgreSQL `CREATE INDEX CONCURRENTLY`, outside an incompatible transaction wrapper).

### 4. Prove Recovery Before Cutover

Distinguish app rollback, schema rollback, data restoration, and roll-forward. A `down` recreating an empty dropped column does not restore data. Stopping dual-write can make an older app read stale values; document when old-version rollback is no longer allowed.

For reversible phases, run supported rollback locally and prove behavioral/data recovery. For destructive/irreversible phases, record preserved backups/replay source and a tested restore or roll-forward procedure, recovery point/time objectives, owner, and authorized production boundary. Verify actual migration tool commands against current official documentation; never invent rollback commands.

Hand cohort, artifact/schema compatibility, recovery evidence, and remaining gates to `e6-shipping-and-launch`. Do not apply destructive production steps merely because a plan exists.

### 5. Remove and Preserve History

Removal requires completed notice obligations, consumer confirmation, and zero old usage over a representative observation window with known telemetry coverage. Cover infrequent jobs/offline clients or confirm migration directly. Calendar deadlines and brief idle periods are insufficient.

Remove obsolete live code, tests, configuration, and current usage docs within authorized scope. Preserve historical ADRs/changelogs and useful migration/tombstone notices. Recheck dependencies and representative runtime after cleanup. Assign an owner or deprecation plan for zombie code; inactivity does not prove it is unused.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "Nobody called it today" | Cover real consumer cadence and telemetry gaps. |
| "Consumers will handle it" | Supply tooling, compatibility, support; honor notice contracts. |
| "The down migration ran" | Execution does not prove data or old-version behavior was restored. |
| "Backfill is a simple UPDATE" | Concurrency, locks, interruption, and drift need tested controls. |
| "The deadline passed, delete it" | Removal also needs measured migration and recovery readiness. |

## Red Flags

- Replacement parity assumed from happy-path tests
- Unreachable consumers or unfulfilled notice/data obligations
- In-place live renames/drops, stale backfills, or unbounded transactions
- App rollback promised beyond schema/data compatibility
- Destructive down path called recovery without restored data
- Historical decisions erased during cleanup

## Verification

- [ ] Consumer scope, behavior criteria, contracts, notice obligations, and ownership are evidenced
- [ ] Compatibility/acceptance tests and representative runtime journeys pass for migrated cohorts
- [ ] Schema phases support relevant old/new readers/writers; backfill resumes safely and parity is measured
- [ ] Recovery or roll-forward is rehearsed; irreversible boundaries/production authorization are explicit
- [ ] Removal evidence covers consumer cadence, telemetry gaps, queues/jobs, and rollback versions
- [ ] Obsolete live assets removed within scope; history/useful migration guidance preserved
- [ ] Coordinator receives measured progress, exact outcomes, recovery evidence, and remaining gates
