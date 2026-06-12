# Plan 007: Fix the broken Calendar composition snippet + Accordion page gaps

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `docs/plans/2026-06-12-docs-module-audit/README.md`.
>
> **Drift check (run first)**: `git diff --stat e0ca5b16..HEAD -- www/content/docs/components/calendar.mdx www/content/docs/components/accordion.mdx www/src/registry/ui/calendar`
> On any drift, compare excerpts below against live code; mismatch = STOP.

## Status

- **Priority**: P2 (small, but users copy actively-broken code today)
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: docs
- **Planned at**: commit `e0ca5b16`, 2026-06-12

## Why this matters

The Calendar docs page's "composition" snippet — the section teaching full control over the component — is syntactically invalid JSX: `CalendarGridBody` is opened twice and closed once, `CalendarGridHeader` is nested inside `CalendarGridBody` instead of beside it, `CalendarHeader` is nested inside `CalendarGrid` instead of above it, and the code uses `CalendarHeading`, `Button`, and chevron icons that the accompanying import block doesn't import. Anyone copying it gets a compile error. Separately, the Accordion page (one of only 13 non-WIP pages) introduces `Disclosure`/`DisclosureTrigger`/`DisclosurePanel` in its anatomy but gives readers no path to those components' API docs, and has no Examples section.

## Current state

- `www/content/docs/components/calendar.mdx` — the composition section (~lines 42–70). Import block (correct components, but incomplete for the JSX below it):

  ```tsx
  import {
    CalendarHeader,
    CalendarGrid,
    CalendarGridHeader,
    CalendarHeaderCell,
    CalendarGridBody,
    CalendarCell,
  } from '@/components/ui/calendar'
  ```

  Followed by the broken JSX:

  ```tsx
  <Calendar>
    <CalendarGrid>
      <CalendarHeader>
        <Button slot="previous"><ChevronLeftIcon /></Button>
        <CalendarHeading />
        <Button slot="next"><ChevronRightIcon /></Button>
      </CalendarHeader>
      <CalendarGridBody>
        <CalendarGridHeader>
        {day => <CalendarHeaderCell />}
      </CalendarGridHeader>
      <CalendarGridBody>
        {date => <CalendarCell date={date} />}
      </CalendarGridBody>
    </CalendarGrid>
  </Calendar>
  ```

- The **correct** structure, from the registry's own demo `www/src/registry/ui/calendar/demos/single.tsx` (this demo renders on the same docs page — it is the source of truth):

  ```tsx
  <Calendar aria-label="Date" defaultValue={today(getLocalTimeZone())}>
    <CalendarHeader>
      <Button slot="previous" variant="quiet" isIconOnly>
        <ChevronLeftIcon />
      </Button>
      <CalendarHeading />
      <Button slot="next" variant="quiet" isIconOnly>
        <ChevronRightIcon />
      </Button>
    </CalendarHeader>
    {/* CalendarGrid follows as a SIBLING of CalendarHeader — read the rest of
        single.tsx for the exact Grid/GridHeader/GridBody nesting */}
  ```

  Exports available from the calendar module (`www/src/registry/ui/calendar/base.tsx:261-269`): `Calendar`, `CalendarCell`, `CalendarGrid`, `CalendarGridBody`, `CalendarGridHeader`, `CalendarHeader`, `CalendarHeaderCell`, `CalendarHeading`.

- `www/content/docs/components/accordion.mdx` (53 lines, full page read at planning time): frontmatter (NOT wip), `<InteractiveDemo>`, Installation, Anatomy (imports `Disclosure`/`DisclosurePanel`/`DisclosureTrigger` from `@/components/ui/disclosure`), and an API Reference section containing only `<Reference name="accordion" />`. Note: `disclosure.mdx` exists as its own docs page, and `www/src/modules/references/generated/` contains disclosure JSONs (`ls www/src/modules/references/generated/ | grep disclosure` to confirm names).

- MDX conventions to match (read `www/content/docs/components/button.mdx` as the exemplar): section order is intro demo → `## Installation` → anatomy/usage → `## Examples` (uses `<Example name="…" title="…">` blocks referencing `www/src/registry/ui/<c>/demos/<demo>.tsx`) → `## API Reference` with `### <Component>` subsections each holding a `<Reference name="…" />`.

## Commands you will need

| Purpose | Command | Expected |
|---|---|---|
| Dev server | `pnpm dev:www` (after `pnpm build:registry` in a fresh worktree) | pages render |
| Lint/format | `pnpm check` | exit 0 (oxfmt does not format MDX code fences, but run it anyway) |
| Full MDX compile | `pnpm --filter www build` | exit 0 |
| Snippet syntax check | see Step 2 | `npx tsc` parse of the extracted snippet |

## Scope

**In scope**:
- `www/content/docs/components/calendar.mdx`
- `www/content/docs/components/accordion.mdx`

**Out of scope**:
- `www/src/registry/**` — if the calendar component itself seems wrong, that's a STOP, not a registry edit.
- All other MDX pages (48 are `wip: true` by design — their thinness is known and deliberate; do not "improve" them under this plan).
- Adding new demo files for Accordion examples — Step 4 works with existing demos only; creating new demos is a content-authoring decision for the operator.

## Git workflow

- Branch: `advisor/007-docs-content-fixes`.
- Conventional commit, e.g. `docs(www): fix calendar composition snippet, link disclosure APIs from accordion`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Rewrite the Calendar composition section

Read `www/src/registry/ui/calendar/demos/single.tsx` fully. Rewrite the two code blocks in `calendar.mdx`'s composition section so that:

- The import block imports **everything the JSX uses**: from `@/components/ui/calendar`: `Calendar`, `CalendarCell`, `CalendarGrid`, `CalendarGridBody`, `CalendarGridHeader`, `CalendarHeader`, `CalendarHeaderCell`, `CalendarHeading`; from `@/components/ui/button`: `Button`; icons from `lucide-react` (match how other non-generated MDX snippets in `www/content/docs` import icons — check `grep -rn "ChevronLeftIcon" www/content/docs/` and mirror; if no MDX precedent exists, use `lucide-react` since `@/registry/__generated__/icons` is a www-internal path users don't have).
- The JSX mirrors `single.tsx`'s structure exactly (header as sibling of grid; `CalendarGridHeader` with `{(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}` and `CalendarGridBody` with `{(date) => <CalendarCell date={date} />}` as siblings inside `CalendarGrid` — match what single.tsx actually renders, including whether `CalendarHeaderCell` takes children).
- Every opened tag is closed exactly once.

**Verify**: visual — `pnpm dev:www`, load `/docs/components/calendar`, the composition code block renders with sane highlighting and the structure matches `single.tsx`.

### Step 2: Machine-check the snippet compiles

Extract the rewritten JSX into a scratch file (OUTSIDE the repo, e.g. `/tmp/calendar-snippet.tsx`), wrapped as:

```tsx
// /tmp/calendar-snippet.tsx — imports rewritten to the registry paths
import { /* same names */ } from '<repo>/www/src/registry/ui/calendar'
…
export default function Snippet() { return ( <the JSX> ) }
```

Run `npx tsc --noEmit --jsx preserve --module esnext --moduleResolution bundler --target esnext /tmp/calendar-snippet.tsx` — import-resolution errors are acceptable (scratch file has no tsconfig paths); **syntax errors are not**. Simpler alternative: `node -e "require('typescript').transpileModule(require('fs').readFileSync('/tmp/calendar-snippet.tsx','utf8'),{compilerOptions:{jsx:'preserve'}})"` exits 0 only if the JSX parses.

**Verify**: the snippet parses with zero syntax errors. Delete the scratch file.

### Step 3: Accordion → Disclosure API cross-links

In `accordion.mdx`'s API Reference section, after the `### Accordion` reference, add the disclosure sub-component references **if** their JSONs exist (`ls www/src/modules/references/generated/ | grep -i disclosure`): `### Disclosure` / `### DisclosureTrigger` / `### DisclosurePanel`, each with `<Reference name="<json-name-without-extension>" />`. If the JSONs don't exist, instead add one prose line under Anatomy linking to the Disclosure page: `Accordion composes [Disclosure](/docs/components/disclosure) — see that page for the disclosure components' full API.` (Do whichever the generated data supports; do not run `build:references`.)

**Verify**: `pnpm dev:www`, `/docs/components/accordion` renders the new reference tables (or the link), no console errors.

### Step 4: Accordion Examples section (existing demos only)

`ls www/src/registry/ui/accordion/demos/` — if demos besides the playground exist, add an `## Examples` section before API Reference using `<Example name="accordion/demos/<demo>" title="…">` blocks, matching `button.mdx`'s pattern. If `playground.tsx` is the only demo, **skip this step** and record in your report: "Accordion has no additional demos; Examples section needs new demo authoring — deferred to operator."

**Verify**: page renders each added example; `pnpm --filter www build` exits 0.

### Step 5: Gates

```sh
pnpm check && pnpm --filter www build
```

**Verify**: both exit 0.

## Test plan

If plan 002's `docs-content.spec.ts` exists, `pnpm test` must stay green (it validates `<Example name>` resolution — your Step 4 names must resolve). No other automated tests; correctness gates are the snippet parse check (Step 2) and the rendered pages.

## Done criteria

- [ ] Calendar composition block: balanced tags, complete imports, structure mirrors `single.tsx` (Step 2 parse check passed)
- [ ] Accordion page links or embeds the Disclosure component APIs
- [ ] `pnpm check` and `pnpm --filter www build` exit 0 (`pnpm test` too, if plan 002 landed)
- [ ] Only the two MDX files modified (`git status`)
- [ ] Status row updated in this audit's `README.md`

## STOP conditions

- `single.tsx`'s composition differs materially from what the calendar base exports support (component drift) — report rather than invent a structure.
- No icon-import precedent exists in MDX and `lucide-react` icons used by `single.tsx` (`ChevronLeftIcon`/`ChevronRightIcon`) don't exist under those names in `lucide-react` — report the right import per the icons setup instead of guessing.
- Disclosure reference JSON names don't match any obvious pattern.

## Maintenance notes

- Root cause class: hand-written MDX snippets aren't compiled (only fenced strings). Plan 002's spec validates names/links but not snippet syntax; a future "typecheck MDX fences" check (e.g. twoslash or a fence-extraction lint) would prevent this category — deferred, noted in the audit README.
- 48 of 61 component pages are `wip: true` — content completeness is a known, deliberate state; this plan intentionally fixes only what is *wrong*, not what is *thin*.
