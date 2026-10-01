---
name: e6-ci-cd-and-automation
description: Use when setting up or modifying CI/CD build and deployment pipelines, configuring test runners in CI, automating quality gates that block merge on failure, adding a deploy stage with manual approval, debugging CI failures, or establishing preview deployments, staged rollouts, and rollback automation.
---

# CI/CD and Automation

## Overview

Automate repeatable checks and prove failures block the right action. Fast feedback matters, but critical acceptance checks stay on the path to merge and release.

## When to Use

- Creating or modifying automated build, test, audit, or deployment workflows
- Diagnosing failed/slow CI, required checks, fork behavior, or rollout automation
- Release readiness itself belongs to `e6-shipping-and-launch`

## Workflow Handoff

For a standalone engineering change with no active workflow, load `using-e6-agent-skills` and `../../references/workflow-contract.md`. With an active coordinator, perform this pipeline step, record evidence, and return to that coordinator. Do not restart the lifecycle. Use `e6-caveman` for concise prose and bounded delegation; preserve exact commands, identifiers, and uncertainty.

## Process

### 1. Discover the Pipeline Contract

Read project instructions, existing workflows/reusable actions, provider configuration, branch rules, and relevant acceptance criteria. Identify installation/workspace boundary, package manager/lockfile, pinned runtime/tools, scripts, runners, services, and artifacts. Check PR, fork, merge-queue, default-branch, release-tag, and manual-dispatch triggers as applicable.

Find which named checks block merge and which environments protect deployments. Record credential availability and session authorization without exposing values. For dependency/install changes, read installation and supply-chain policy in `../../references/security-checklist.md`; do not execute unreviewed dependency scripts to discover them.

### 2. Map Acceptance to Gates

Select applicable formatting/lint, type, focused/unit, integration, build, critical user-flow E2E, security audit, and performance/bundle checks. Record reasons for N/A gates; do not add TypeScript or a build script to plain JavaScript merely to match a template.

Map critical acceptance criteria to required stages, including edge/error paths and flag states. UI journeys need relevant browser tests; desktop journeys need actual runtime capability. E2E is required when it proves behavior earlier stages cannot cover. Use actual scripts and frozen/immutable install supported by the pinned manager.

Run cheap feedback early; independent jobs may run in parallel. Deployment depends on every applicable required gate. Do not hide failures with `continue-on-error`, skipped tests, or broad fallbacks. Missing evidence is not success.

### 3. Configure Trust and Deployment

Run untrusted PR checks without deployment/production secrets. Use non-sensitive disposable credentials for isolated test databases; fork checks must not depend on repository secrets. Wait for service readiness, apply test migrations, and separate test resources from production.

Use least-privilege workflow permissions. Keep privileged deployment jobs on trusted refs/protected environments, with project-required approvals and scoped credentials or workload identity. Never execute PR-controlled code with secrets through `pull_request_target`. Preview deployments need an explicit trust policy; report unsupported privileged previews instead of weakening it.

Put workflow inputs/expressions into environment variables before shell use. Validate deployment IDs/versions against the provider's format or known artifact set and quote arguments. Direct interpolation of `inputs.version` into shell can become command execution. Do not place secret values directly in shell command text or logs.

Serialize production changes with deployment concurrency policy. Build once and promote the same immutable artifact where supported; record revision, artifact ID, version, and target. A rollback job redeploys a known compatible artifact with verified provider tooling. Schema/data recovery follows `e6-deprecation-and-migration`; Git reverts/flags cannot restore data.

### 4. Verify Actual Pipeline Behavior

Validate workflow syntax/expressions using project tools. Run equivalent install/check/build commands locally in the matching environment. Start the app and exercise affected acceptance flows when changing packaging, deploy configuration, or runtime setup; compilation does not prove deployment works.

Observe a fresh candidate CI run when available. Verify expected triggers, successful artifacts, a deliberately failing gate in a safe test branch/local runner, and dependencies preventing failed builds from deploying. Check actual branch rules require the correct status names. Remote settings need API/provider evidence; without access, leave exact settings and mark the gate unverified.

Inspect current run/job logs directly with scoped redacted excerpts. Reproduce failures locally using `e6-debugging-and-error-recovery`; review autofix diffs before committing. Rerun failed and affected gates, then observe the fresh result under existing push authorization. Do not require the user to paste logs when tools can retrieve them.

### 5. Optimize and Hand Off

Measure the slow stage first. Cache dependency downloads with authoritative lockfile keys; `setup-node` caches package-manager downloads, not `node_modules`. Parallelize independent jobs and shard tests. Path filters need dependency-aware coverage and an always-reported required aggregate check; skipped workflows must not leave merges waiting forever.

Keep critical acceptance tests required even when slow. Scheduled suites supplement required checks for nonblocking coverage under a stated policy. Fix flakiness instead of rerunning until green. Ten minutes is a useful target, not permission to remove correctness gates.

Use Dependabot/Renovate within project policy and assign ownership for restoring broken main builds. Hand artifact/run IDs, outcomes, staging evidence, remaining gates, and recovery readiness to `e6-shipping-and-launch`. That skill owns launch thresholds/windows; CI cannot declare release complete after an arbitrary quiet interval.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "Copy the Node template" | Discover manager, scripts, and services first. |
| "Fork checks need secrets" | Disposable test services can use non-sensitive credentials. |
| "Workflow exists, merge is blocked" | Verify branch rules require the actual check names. |
| "Move slow checkout tests to nightly" | Speed cannot remove the only critical acceptance proof. |
| "Just rerun the flaky job" | Investigate and prove the fix with a fresh run. |

## Red Flags

- Gates absent, silently skipped, or unrelated to acceptance criteria
- PR-controlled code using deployment credentials
- Shell interpolation of inputs or printed secrets
- Green YAML without local execution/current run/required-check evidence
- Rebuilt artifacts promoted as identical or untested recovery automation

## Verification

- [ ] Project tooling/triggers and acceptance-to-gate mapping are recorded
- [ ] Workflow validation and equivalent local commands ran; changed runtime setup works
- [ ] Current run shows checks pass and failures block downstream actions
- [ ] Required check names match verified branch rules, or exact unverified setup is reported
- [ ] Fork checks are secretless; deploy trust/permissions/approvals/concurrency follow policy
- [ ] Artifact identity and compatible rollback/recovery are verified before deployment
- [ ] Coordinator receives exact outcomes, run/artifact IDs, and remaining gates
