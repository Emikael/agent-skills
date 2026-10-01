---
name: e6-git-workflow-and-versioning
description: Use when committing, branching, resolving a merge conflict, splitting a messy working tree into clean atomic commits, opening or reviewing a pull request (PR), pushing to a remote, or organizing parallel work with git worktrees. Use when cutting a release, choosing a semantic version bump, tagging, or writing a changelog.
---

# Git Workflow and Versioning

## Overview

Keep changes reviewable and recoverable. Each commit captures one working increment, including tests that prove its behavior. Preserve work already in the repository.

## When to Use

- Committing, branching, splitting changes, resolving conflicts, or preparing a PR
- Working in parallel worktrees or cutting a versioned release
- As supporting discipline during implementation; the implementation skill still owns behavior

## Workflow Handoff

For a standalone engineering change with no active workflow, load `using-e6-agent-skills` and `../../references/workflow-contract.md`. With an active coordinator, perform this Git step, record evidence, and return to that coordinator. Do not restart the lifecycle. Use `e6-caveman` for concise prose and bounded delegation; preserve exact commands, identifiers, and uncertainty.

## Process

### 1. Inspect Before Changing History

Read project instructions and existing commit/branch/release conventions. Inspect the current branch, default branch, remotes, worktrees, and recent relevant history. Inventory staged, unstaged, and untracked changes with `git status --short`, scoped diffs, and relevant file reads. Record pre-existing work and which hunks belong to this task.

Discover the actual package manager, scripts, and focused verification commands. Carry forward accepted criteria and runtime evidence. Repository instructions and session authorization govern commit, push, PR, merge, tag, and deploy actions. Complete authorized local work first; a reviewable local result is completion when publication was not authorized.

### 2. Isolate and Split Logical Changes

Prefer the team's existing branch model. Otherwise use short-lived branches from the verified default branch; feature flags avoid weeks of divergence. Release branches can stabilize releases. Use separate worktrees for independent work, confirming branch/path ownership before creation and preserving uncommitted work before removal. Worktrees isolate files, not shared databases or external state.

Classify a messy tree into fixes, features, refactors, and formatting. Stage explicit paths or hunks; inspect the staged diff. Keep unrelated formatting/refactors separate. Keep each behavior change with its acceptance and regression tests. A test-only commit suits independent test maintenance, not postponing required feature coverage.

Aim for small changes, often around 100–300 lines. Split at logical boundaries rather than breaking a working increment to hit a line count. Follow `e6-code-review-and-quality` for review splitting strategies.

### 3. Prove Each Commit

Run project checks and applicable acceptance tests. For a split dirty tree, verify each proposed commit's contents in an isolated checkout/worktree; unstaged changes must not make an incomplete commit appear green. Test new behavior against the baseline where feasible: fail without the change, pass with it. Preserve runtime/browser/computer evidence or rerun affected flows if splitting changes behavior.

Inspect staged files for secrets and generated output. Use the project's secret scanner with redacted output plus diff review; keyword searches alone cannot prove absence of secrets. Never print credential values. Match generated-file policy: lockfiles and migrations may belong in history; local environment files and build output usually do not. Confirm `.gitignore` covers applicable exclusions.

Commit a verified increment only within authorization. Use existing message conventions; otherwise use `feat`, `fix`, `refactor`, `test`, `docs`, or `chore`, with a short imperative description and a body explaining non-obvious intent.

### 4. Handle Failures and Conflicts Safely

Investigate failed tests with `e6-debugging-and-error-recovery`. Undo only task-owned changes when needed. Do not use `git reset --hard`, `git clean`, forced worktree removal, or history rewrites to discard a dirty tree. Such operations require specific authorization and a preserved recovery point; fixing tests does not authorize losing unrelated work.

For conflicts, inspect the base and both sides, recover each intended behavior, remove markers, and rerun relevant acceptance checks. Do not choose all of ours/theirs without understanding lost changes. Complete or abort merge/rebase deliberately, preserving starting work. Prefer a new revert commit over rewriting shared history. For authorized rewritten-history pushes, verify remote state and use a lease.

For regression localization, use scoped history/diffs and `git bisect` with a reproducible test. Record the culprit and finish with `git bisect reset`.

### 5. Prepare the PR or Release

Inspect final diff, commit list, base branch, and working tree. Follow the PR template. Summarize changed behavior, acceptance/runtime evidence, and remaining risks. Push/open the PR only when authorized; do not imply remote checks passed before observing current results.

For consumers, semantic versions communicate compatibility: breaking → major, backward-compatible functionality → minor, backward-compatible fix → patch. Check observable behavior, including undocumented dependencies; use `e6-api-and-interface-design` when compatibility is uncertain. Respect established pre-1.0 and release policies.

Use the project's release tooling rather than a second scheme. Curate a changelog by consumer impact (`Added`, `Changed`, `Fixed`, `Deprecated`, `Removed`, `Security`) with the change. Breaking changes need migration guidance and applicable notice windows from `e6-deprecation-and-migration`.

Bind tag, manifest/artifact version, changelog, and verified commit together. Tags identify immutable releases; do not move published tags. Inspect existing tags and verify the release tree before authorized publication. Return readiness to `e6-shipping-and-launch`.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "Reset is the quickest way back" | A dirty tree can contain someone else's work. Preserve it first. |
| "Tests can be a later commit" | Each behavior commit needs proof; unstaged tests cannot validate its tree. |
| "The full working tree passed" | Splitting can expose incomplete commits. Verify each committed tree. |
| "It's a small fix, use patch" | Consumer compatibility determines the version, not diff size. |
| "Write release notes later" | Capture consumer impact while the change is understood. |

## Red Flags

- Bulk staging unexplained files or discarding pre-existing edits
- Feature commits relying on later tests or unstaged implementation
- Automatic ours/theirs resolution or force-pushing shared history
- Secret values printed during inspection
- Unverified PR checks, mutable tags, or mismatched artifact/version

## Verification

- [ ] Pre-existing staged, unstaged, and untracked work is preserved; final status reviewed
- [ ] Each commit does one logical thing, includes needed tests, and passes checks on its own tree
- [ ] Conflict resolutions preserve intended behavior with current verification evidence
- [ ] Staged diff contains no unintended files or secrets; message follows project conventions
- [ ] Authorized PR uses verified remote/base and reports actual checks
- [ ] Release compatibility, changelog, migration notes, tag, artifact version, and verified commit agree
- [ ] Coordinator receives changed behavior, exact check outcomes, identifiers, and blockers
