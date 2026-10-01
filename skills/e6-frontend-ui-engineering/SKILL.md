---
name: e6-frontend-ui-engineering
description: Use when building or modifying user-facing interfaces, responsive pages, components or layouts; managing UI state; meeting WCAG accessibility requirements; or investigating focus, keyboard, loading, error, or visual behavior.
---

# Frontend UI Engineering

## Overview

Build accessible, responsive UIs from product requirements and existing design
patterns. Verify rendered behavior, interaction and finish in the running app.

## When to Use

- Components/pages, layout, responsiveness, state and interaction changes.
- Visual/UX fixes or accessibility work.
- Exclude backend-only work; use the relevant engineering skill.

## Workflow handoff

Use `e6-caveman` for prose and delegation. If a standalone engineering request
has no active workflow, load `using-e6-agent-skills` once. Otherwise update phase
evidence and return to its coordinator. Consult
`../../references/workflow-contract.md` as needed; do not reload recursively.
A requested design review stays a review; implementation continues through
runtime verification and review within the authorized scope.

## Process

### 1. Load product and code context

Read applicable rules, accepted task/IDs, design system, related screens and
components, public props/ref conventions, tokens, state/data contracts, existing
tests and app startup commands. Reuse the framework and dependencies already
present. Do not introduce a styling/state library merely to follow an example.

For a distinct new direction, inspect two or three trusted/product-supplied
references. Record hierarchy, density, navigation, controls, responsive rules
and required states as a short design contract. Adapt structure to the product's
own components/content; do not copy branding or proprietary assets. If no
references exist, use product context and state material assumptions.

### 2. Define acceptance and tests

Map each criterion to a visible outcome and interaction. Include applicable
loading, empty, error, success, disabled and permission states, realistic content,
responsive widths and keyboard/focus behavior. Read existing conventions before
choosing test placement or props.

Use `e6-test-driven-development` for behavioral RED before implementation. Test
observable results with accessible role/label queries. Validate critical data
and navigation flows across boundaries, not only mocked component callbacks.
Static visual changes need rendered comparison and accessibility evidence;
do not add a tautological test of CSS implementation details.

### 3. Implement a coherent slice

Use `e6-incremental-implementation`. Keep components focused; prefer composition,
colocation and the simplest appropriate state:

- Local state for component UI; lifted state for nearby siblings.
- URL state for shareable filters/pagination; established server-state tooling
  for remote cache; context for read-heavy theme/auth/locale.
- Global state only when shared behavior demands it.

Handle errors and loading deliberately. Optimistic updates need scoped rollback,
concurrent-mutation safety and server reconciliation; never reset an entire old
list over later successful edits. Preserve public `className`, DOM refs and
existing consumer behavior. See `e6-api-and-interface-design` for changed props
or shared contracts.

### 4. Verify in the running app

Use `e6-browser-testing-with-devtools` with the available browser/computer or
existing automation. Start the app with repository commands; inspect screenshots
and actual DOM/console/network state. Exercise accepted actions and relevant
states, not only initial render.

- Tab/Shift+Tab through controls; test arrows/Enter/Space/Escape as the widget
  requires. Disabled items do not execute or receive forbidden focus.
- Test menu/dialog initial focus, containment when modal and return to trigger.
  Native `dialog` needs `showModal()`; `open` alone does not trap focus.
- Check accessible names, semantic roles, headings and dynamic announcements.
  Inspect the accessibility tree and automated audit. Claim screen-reader
  verification only when a real screen reader was used.
- Check responsive content at project breakpoints; absent a project matrix,
  cover 320px, 768px, 1024px and 1440px plus the affected transition width.
- Confirm real submission, persistence, errors/retry and authorization states
  where relevant. Scope any mutations to authorized local test data.

If runtime capability is absent, record the exact blocker and unverified checks.
Compilation, unit tests or a generated screenshot alone cannot prove the UI.

### 5. Apply the finish gate and return evidence

Inspect the rendered result against the design contract: hierarchy, alignment,
spacing/type/color tokens, content wrapping/overflow, focus visibility, contrasts,
loading/error/empty states and mobile behavior. Use real or realistic text.
Avoid generic layouts, gradients or arbitrary values that conflict with the
product. Fix task regressions; record unrelated baseline warnings briefly.

Run applicable test/build/type/lint gates. Return acceptance results, inspected
screenshots/runtime evidence and unresolved blockers for review. Use
`references/ui-patterns.md` for detailed architecture/design/state techniques
and `../../references/accessibility-checklist.md` for relevant audit checks.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "It renders, so done" | Exercise the accepted states and actions. |
| "Accessibility later" | Semantics, focus and keyboard behavior are part of correctness. |
| "Tests prove the layout" | Inspect the actual browser at relevant widths. |
| "The dialog has open, so focus is trapped" | Use modal behavior and test it. |
| "Rollback the snapshot" | An old whole-list snapshot can erase a later success. |

## Red Flags

- Existing tokens/component conventions ignored.
- Mouse-only interaction, icon controls without names, color-only status.
- Missing states or untested mobile/content overflow.
- Screen-reader claims based only on an accessibility tree or axe score.
- UI complete claim without actual runtime checks and finish review.

## Verification

- [ ] Accepted behaviors map to tests; valid RED/GREEN for changed behavior.
- [ ] Existing component contracts and design system preserved.
- [ ] Actual app interactions/states and relevant widths exercised.
- [ ] Keyboard/focus and applicable accessibility checks have evidence.
- [ ] Rendered finish inspected; relevant gates pass; omissions explicit.
- [ ] Evidence returned to coordinator for review and next authorized phase.
