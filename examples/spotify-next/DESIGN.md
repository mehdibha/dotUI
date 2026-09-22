---
version: alpha
name: "Design system"
description: "Design system — a dotUI design system: brand-colored primary actions, hairline surfaces, default density, 16px base radius, Figtree type."
colors:
  primary: "oklch(0.7697 0.209 148.67)"
  on-primary: "oklch(0.25 0.04 148.67)"
  background: "oklch(0.9926 0 148.67)"
  foreground: "oklch(0.2414 0 148.67)"
  foreground-muted: "oklch(0.5015 0 148.67)"
  surface: "oklch(0.9836 0 148.67)"
  popover: "oklch(0.9836 0 148.67)"
  muted: "oklch(0.9566 0 148.67)"
  border: "oklch(0.9204 0 0)"
  border-control: "oklch(0.8838 0 148.67)"
  focus: "oklch(0.7697 0.209 148.67)"
  accent: "oklch(0.7697 0.209 148.67)"
  success: "oklch(0.6546 0.1176 154.91)"
  warning: "oklch(0.7952 0.1591 86.05)"
  danger: "oklch(0.6368 0.2046 25.33)"
  info: "oklch(0.574 0.2295 270)"
typography:
  body:
    fontFamily: "Figtree"
    fontSize: 14px
  heading:
    fontFamily: "Figtree"
    fontWeight: 600
  mono:
    fontFamily: "Geist Mono"
rounded:
  control: 12px
  item: 12px
  surface: 16px
  panel: 24px
spacing:
  unit: 4px
  control-height: 32px
---

# Design system

## Overview

Design system is built on **dotUI**: React Aria Components styled with Tailwind CSS v4 and tailwind-variants. Its character: brand-colored primary actions, hairline surfaces, default density, 16px base radius, Figtree type.

- The components live in `components/ui/` and you own their source. **Compose them — never rebuild a button, field, menu or dialog from `div`s.** Missing one? `npx shadcn@latest add @dotui/<name>`.
- Read a component's file before using it: its props, variants and parts are there.
- This is not shadcn/ui on Radix or Base UI. There is no `asChild`; events are React Aria's (`onPress`, `onChange`, `onAction`, `onSelectionChange`); state is `isDisabled` / `isInvalid` / `isSelected`, styled through data attributes. If a shadcn skill or rule is active, follow its general advice but take every component API from `components/ui/`.
- Deeper guidance — choosing between components, page patterns with code — is in the `design-system` skill (`.agents/skills/design-system/SKILL.md`).

## Colors

Colors are semantic tokens defined in the global stylesheet, light and dark. Use the utilities; never hardcode a color or reach for a Tailwind palette class (`bg-blue-500`, `text-gray-600`).

| Utility | Use for |
| --- | --- |
| `bg-bg` · `text-fg` | Page background and body text. |
| `text-fg-muted` | Secondary text: descriptions, metadata, placeholders. |
| `bg-muted` | Subtle fills: wells, code, inline highlights. |
| `bg-card` · `bg-popover` | Surfaces — reach for `Card` / `Popover`, not the classes. |
| `border-border` | Structural edges: dividers, cards, sections. |
| `border-border-control` | Edges of custom controls only. |
| `bg-primary` · `text-fg-on-primary` | The primary action. `Button variant="primary"` already applies it. |
| `bg-accent` · `bg-accent-muted` · `text-fg-accent` | Brand highlight. |
| `bg-{status}-muted` · `text-fg-{status}` | Soft status callouts (`success`, `warning`, `danger`, `info`). |
| `bg-{status}` · `text-fg-on-{status}` | Solid status fills — badges, destructive buttons. |

- Keep screens neutral: color marks the primary action, focus, selection and status — nothing else.
- Don't tint backgrounds, headings or icons for decoration.

## Typography

- Body: Figtree (`font-sans`), 14px (`text-sm`) in product UI. Headings: the body family — `h1`–`h6` pick up the heading font and weight automatically. Code and numbers that must align: Geist Mono (`font-mono`, `tabular-nums`).
- Page title `text-2xl`, section title `text-lg`, card title via `CardTitle`. At most three sizes on one screen.
- Muted text is `text-fg-muted`, never a lighter gray or reduced opacity.

## Layout

- Density is default: controls are 32px tall and components already carry the system's padding. Don't override component heights or paddings.
- The spacing unit is 4px. Lay out with `flex`/`grid` and `gap-*`; stack form fields with `FieldGroup`, not margins.
- App shells use `Sidebar` for primary navigation; content sits in a readable column (`max-w-3xl` for forms and settings, full width for tables).
- Every layout works from 320px up. Use logical properties (`ms-*`, `pe-*`, `start-*`) so right-to-left works.

## Elevation & Depth

- Separate with 1px hairlines (`border-border`), not shadows. Cards are bordered and flat; only floating layers (menus, popovers, dialogs) cast a shadow.
- Never nest a card inside a card. Group content inside one card with `Separator` or spacing instead.

## Shapes

Radii come in four roles. Custom elements take the role of what they resemble:

| Role | Examples | Class |
| --- | --- | --- |
| Panel | card, dialog, sheet | `rounded-xl` |
| Surface | popover, menu, toast | `rounded-lg` |
| Control | button, input, select | `rounded-md` |
| Item | menu item, list row | `rounded-md` |

## Components

- Icons: Lucide (`lucide-react`) only — never mix icon sets, never use emoji or unicode glyphs as icons.
- Forms: `TextField`/`Select`/`Combobox`/`RadioGroup` with `Label`, `Description`, `FieldError` from `field`; stack with `FieldGroup`, group with `Fieldset` + `Legend`.
- Overlays: `Dialog` + `Modal` for decisions, `Drawer` on mobile sheets, `Popover` for light non-blocking content, `Tooltip` for labels only.
- Feedback: `toastManager.add()` for results of an action, `Alert` for persistent page-level messages, `Empty` for empty states, `Skeleton` while loading.
- The full catalog and decision trees: `.agents/skills/design-system/references/components.md`.

## Motion

- Overlays already animate in (200ms) and out (150ms). For a custom entrance use `duration-enter ease-enter`; don't invent curves or durations.
- Animate `opacity` and `transform` only, and respect `prefers-reduced-motion` (`motion-safe:`).

## Voice & copy

- Use sentence case for every heading, label, button, tab and menu item: “Create project”, not “Create Project”.
- Stay neutral in the flow. A little warmth is allowed in empty states and success messages only.
- Never be playful in errors, warnings or destructive confirmations.
- Explain as you go: give each page a one-line description and give a field a `Description` whenever its format or consequence isn't obvious.
- Never use emoji in UI copy.
- Buttons say what they do, verb first: “Save changes”, “Delete project” — never “Submit”, “OK” or “Yes”. The same action keeps the same name through the flow.
- Errors say what went wrong and how to fix it, next to the field: “Enter an email address like name@example.com”. No blame, no apology, no “Oops”.
- Empty states say what will appear here and offer the action that creates it.
- Use numerals (“3 files”), and “…” for actions that open a follow-up step.

## Hierarchy & patterns

- At most one `variant="primary"` button per view (page, dialog, card). Every other action is `secondary` or `quiet`.
- No eyebrow labels (small text above a heading) and no all-caps text.
- Keep related fields on one page: group them with `Fieldset` + `Legend`, stack them in `FieldGroup`, and end with one primary submit.
- Show options when there are few: 2–5 exclusive options → `RadioGroup` (`SegmentedControl` for switching views); 6+ → `Select`; long or searchable lists → `Combobox`.
- Show collections as a `Table` by default — comparing rows is the job. Cards only for visual content (images, previews).
- Icons accompany text, they don't replace it. Icon-only buttons belong in toolbars and dense rows only.
- Destructive actions use `variant="danger"` and a confirming `Dialog` that names what will be lost.

## Accessibility

- Every control has a visible `Label` or an `aria-label`; every icon-only button has an `aria-label` and a `Tooltip`.
- Never signal state with color alone — pair it with text or an icon.
- Keep the focus ring: don't remove outlines. Custom interactive elements use `focus-visible:focus-ring`.
- Use semantic headings in order, one `h1` per page. Dialogs always have a `DialogTitle`.

## Do's and Don'ts

| Do | Don't |
| --- | --- |
| Import from `components/ui/*` | Rebuild controls from `div` and `onClick` |
| Semantic tokens (`bg-muted`, `text-fg-muted`) | Hex, `rgb()`, or palette classes (`bg-zinc-100`) |
| `gap-*` inside flex/grid | Margins between siblings, `space-y-*` |
| One `Card` with sections | Cards inside cards |
| Flat surfaces with meaning | Gradients, gradient text, glows, decorative blur |
| Plain, specific labels | Arrows appended to CTAs (“Get started →”), “A · B · C” meta strings |
| The system's radii and shadows | Arbitrary values (`rounded-[14px]`, `shadow-[…]`) |
