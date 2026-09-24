---
name: design-system
description: Build UI with Design system, this project's design system (dotUI on React Aria Components). Use when creating or changing any page, form, dialog, table, navigation or other interface in this app.
---

# Building with Design system

## Workflow

1. Read `DESIGN.md` at the project root — the tokens, the voice and the rules. It is the source of truth; this skill applies it.
2. Pick components with `references/components.md`. Check `components/ui/` for what is installed; add a missing one with `npx shadcn@latest add @dotui/<name>`.
3. Read the component file before using it — props, variants and parts are defined there.
4. Start from the closest pattern in `references/patterns.md` and adapt it.
5. Review against the checklist below before you finish.

## Rules that are easy to get wrong

- React Aria, not Radix: `onPress` (not `onClick`) on `Button`; `isDisabled`, `isInvalid`, `isRequired`; `selectedKey` / `onSelectionChange` on `Select`; no `asChild` — links that look like buttons are `LinkButton`.
- Overlays are composed: a trigger and its overlay (`Modal`, `Drawer`, `Popover`) are siblings inside `Dialog`, `Menu` or `Tooltip`.
- Buttons that close a dialog take `slot="close"`.
- Icons inside buttons need no sizing classes; mark position with `data-icon-start` / `data-icon-end`.
- Style with semantic tokens only; use `className` for layout (width, grid placement), not to restyle a component.

## Review checklist

- [ ] Every interactive element is a `components/ui` component.
- [ ] No hardcoded colors, radii, shadows or font sizes.
- [ ] One primary action per view (or as `DESIGN.md` allows).
- [ ] Labels, casing and tone follow **Voice & copy** in `DESIGN.md`.
- [ ] Empty, loading and error states exist for every collection and async action.
- [ ] Icon-only buttons have `aria-label` + `Tooltip`; the page works at 320px.
