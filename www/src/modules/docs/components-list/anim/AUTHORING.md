# Authoring animated previews

Each component on the components page gets a **self-demoing** preview: a fake cursor
loops through a short demo of the component, and **hovering the card pauses the loop,
hides the cursor, and hands the real component to the user** to play with.

## The contract

Create `anim/demos/<slug>.tsx` (filename === the component slug). It is auto-registered.

```tsx
"use client";

import { useState } from "react";

import { Checkbox } from "@/registry/ui/checkbox";

import { AnimatedPreview } from "../animated-preview";

export default function Demo() {
	const [selected, setSelected] = useState(false);
	return (
		<AnimatedPreview
			reset={() => setSelected(false)} // restore the initial state (loop start + tab-away)
			script={async (s) => {
				// one iteration of the loop; it runs forever, restarting after each pass
				await s.wait(500);
				await s.click("box", () => setSelected(true));
				await s.wait(1300);
				await s.click("box", () => setSelected(false));
				await s.wait(900);
				await s.moveOff();
				await s.wait(500);
			}}
		>
			{(ref) => (
				<span ref={ref("box")}>
					<Checkbox isSelected={selected} onChange={setSelected}>
						Subscribe
					</Checkbox>
				</span>
			)}
		</AnimatedPreview>
	);
}
```

## Hard rules

- **Render the REAL component, controlled** (`value`/`isSelected`/`isOpen`/… + `onChange`).
  Read `registry/ui/<slug>/base.tsx` and `registry/ui/<slug>/demos/*.tsx` for the exact API.
- **Drive everything via React state**, never via dispatched events or `el.focus()` — React
  Aria ignores synthetic events, and real focus across many cards steals focus from the page.
  The cursor is purely visual.
- **`reset` must fully restore the initial state.** It is called before every loop and when
  the user tabs away. The same state is what the user manipulates on hover (via `onChange`).
- **Default export, `"use client"`, no unused vars** (`noUnusedLocals` is on).
- Keep it **compact** — cards are ~128–180px tall. Keep labels short, lists to 3–4 items.
- Keep one loop **snappy: ~3–5s**. End by moving the cursor off and a short pause.

## Driver API (`s`)

- `s.moveTo(target, { anchor?: "center"|"top"|"bottom" })` — move the cursor to a target.
- `s.click(target, onDown?)` — moveTo + a press; `onDown` fires at the bottom of the press
  (put the state change here).
- `s.press(onDown?)` — press at the current spot.
- `s.hover(target, { dwell?, onEnter?, onLeave? })` — move + dwell (for tooltips / hover states).
- `s.type(target, text, onText, { perChar?, start? })` — move to a field, then call `onText`
  with the accumulated string for each character (set the controlled value with it).
- `s.drag(from, to, onProgress, { steps? })` — press + drag, calling `onProgress(t)` 0→1.
  For a slider/color thumb, pass the thumb as BOTH `from` and `to` and set the value from `t`;
  the cursor re-resolves the target each step so it follows the thumb.
- `s.wait(ms)`, `s.do(fn)`, `s.moveOff()`.

**target** = a ref name (string, registered via `ref("name")`), `{ selector: "input" }`
(queried within the card), `{ el }`, or `{ x, y }` (coords relative to the card).

## Targeting

`ref(name)` (from the render prop) returns a ref callback. Put it on a **wrapper element**
around the thing the cursor should point at — `<span ref={ref("box")}>` for inline components,
`<div ref={ref("field")} className="w-56">` for block ones. Or target by `{ selector }`
(e.g. `{ selector: "input" }` for a slider thumb / text input). Point at the actual control,
not a big label, when you can.

## Patterns

- **Toggle (checkbox, switch, toggle-button):** click on → wait → click off → wait. See `checkbox`/`switch`.
- **Press (button, file-trigger, link):** click once, optionally a tiny scale-down via a `pressed`
  state for feedback. See `button`.
- **Single-select (radio-group, tabs, tag-group, list-box, segmented):** click option A → wait →
  click option B → wait. Drive `value`/`selectedKeys`.
- **Type (input, text-field, search-field, number-field, otp, color-field, command):** `s.type`.
  Read `registry/ui/<slug>` for whether the value prop is on the field or the input.
- **Drag (slider, color-area, color-slider):** `s.drag` with the thumb as from+to. For 2D
  (color-area) you can pass `to` coords and set x/y from progress.
- **Expand (accordion, disclosure):** click the trigger to open a panel, wait, collapse.
- **Static / display-only (badge, avatar, kbd, separator, empty, skeleton, loader, card,
  scroll-fade, table, alert):** these have no interaction. Either render the demo with NO cursor
  (just return the component inside `AnimatedPreview` with an empty-ish script that only
  `moveOff`s, or better, a subtle entrance), or pick the single most representative state.
  Don't force a cursor where it makes no sense. `progress-bar` and `toast` animate nicely on a
  timer (no cursor needed) — drive their value/visibility on a loop.

## Don't

- Don't import from other `demos/` files. Each is standalone.
- Don't use `el.focus()`, `dispatchEvent`, refs into react-aria internals, or `setTimeout` loops
  outside the script (the script + `reset` are the only choreography).
- Don't leave the component in a non-initial state at the end of the loop without a `reset`
  that returns to it.
