# Menu playground

Read `design-system.md` and `Button.tsx` before adding the dropdown. Keep existing
button behavior. Add the new component to `main.tsx` with at least two enabled
actions and one disabled action. Show action results as visible status text.

Install the declared project dependencies with `npm install` when needed.
Use `npm test` (focused: `npm test -- Dropdown.test.tsx`), `npm run build`, and
`npm run dev`. The playground runs at `http://127.0.0.1:4173`.

Write behavioral tests for keyboard opening/navigation, disabled actions,
activation, Escape and focus returning to the trigger. Then exercise the
playground in an available browser or existing browser automation. If runtime
capability is absent, report exactly what was not verified. Do not claim a
screen reader was tested based only on DOM assertions.
