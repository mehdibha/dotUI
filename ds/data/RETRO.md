# Schema retro

## v2 migration — 2026-07-03 (maintainer pivot, same day as the pilot)

The question-bank/facts model below was scrapped after the first fan-out system
(spectrum-2) shipped: reading 10 prose fact-blocks per system is a bad way to explore a
color system. v2 replaces it with structured color-system data per system —
`colors.json` (ramps, token groups, layers, focus spec, contrast pairs, overview
entries) rendered by shared exploration components (ramp grids, searchable token
tables, diagrams). `system.json` now carries three dates (`createdAt`, `updatedAt`,
`reviewedAt`) instead of `addedAt`, and per-evidence `retrievedAt` is gone — sources
survive as plain URL lists on each section. `question-bank.ts` and per-system
`facts.json`/`analysis.mdx` were removed; topic pages (views over the question bank)
were removed with them.

Everything below is the v1 record, kept for history.

---

# Schema retro — plan 002 pilot (Radix + Linear), 2026-07-03

What churned while researching two real systems through all 10 questions, and the freeze
decision. The pilot ran both methods end-to-end: Radix via docs + source
(`documented`/`source-read`), Linear via shipped-CSS extraction (`reverse-engineered`).

## Schema changes made during the pilot (the one allowed revision)

1. **Evidence kind `blog` added.** The Phase-0 sketch enumerated
   `docs|source|shipped-css|changelog|talk`. Linear's best corroboration is first-party
   blog posts ("How we redesigned the Linear UI"); calling that `docs` (it documents
   nothing normative) or `talk` (it isn't one) would blur the one distinction the site's
   truth standard cares about. Enum is now
   `docs|source|shipped-css|changelog|blog|talk`.
2. **Fact `status` discriminated union.** The sketch implied `answer` always present.
   The binding "mark `unknown`/`not-applicable` with a reason, never guess" rule needed a
   home in the data, not just in prose: `status: "answered"` carries `answer`;
   `status: "unknown" | "not-applicable"` carries a mandatory `reason` and no answer.
   Evidence stays mandatory in all cases — an unknown must show what was checked.
3. **In-answer `"unknown"` enum members vs `status: "unknown"`.** Linear's
   `contrast.strategy` forced the distinction: the _mechanism_ is documented (contrast is
   a theme-generation input; high-contrast themes are generated) but the _standard and
   targets_ are closed-box. Rule adopted: `status: "unknown"` only when the whole
   question is unanswerable; structured shapes include `"unknown"` members for fields
   that can be individually unknowable for closed systems. This is what let both pilot
   systems reach 10/10 answered without guessing.
4. **`palette.colorspace.workingSpaces` made nullable.** Radix ships hex + P3 values but
   never publishes its authoring space. `null` = "not published", distinct from an empty
   list.
5. **`component.color-usage` reshaped.** Draft had a single `colorVariantCount`; the
   pilot split it into `variantNames` (empty = not recoverable, e.g. from Linear's
   minified class-hash CSS) and `accentOptions` (nullable). Also marked
   `matrixable: false` — a one-component spot-check must not render as a system-wide
   matrix claim.

## Where the schema fought (and how it was settled without `anyOf`)

- **One `method` per fact, mixed evidence.** Nearly every Radix fact blends docs and
  source evidence. Settled: `method` records the dominant channel; the mix stays visible
  in each evidence item's `kind`. If this grates at fan-out scale, the v2 move is
  deriving method from evidence kinds — additive, not breaking.
- **Linear's two parallel semantic sets** (ordinal `bg-primary…quinary` vs surface
  `bg-level-0..3`/`fg-*`/`line-*`) looked like it might need a special case; the
  `layers[]` array absorbed it as two semantic entries. No shape change needed — a good
  sign the layer model is right.
- **`retrievedAt` vs `verifiedAt`.** For single-session research they're always equal, and
  the validator enforces equality for now. They stay separate fields because phase-2
  re-verification will split them (re-check an old excerpt without re-retrieving).

## Freeze decision

**Question bank v1 (10 questions, `color-tokens`) and the fact schema are frozen as of
2026-07-03.** IDs are permanent. Additive changes allowed (new questions, new enum
members, new optional fields); anything breaking requires a migration note in this file.
The frozen artifacts live in `ds/src/data/schema.ts` and `ds/src/data/question-bank.ts`.

## Flagged for maintainer (STOP-condition adaptations)

- `contrast.strategy` for Linear is answered at mechanism level with
  `enforcement`/`standard` = `"unknown"` — closed generator; CSS inspection cannot reveal
  internal targets. Decide whether that's acceptable long-term or whether closed systems
  should get a narrower contrast question.
- Linear facts describe the **marketing site's** shipped CSS (the product app is behind
  auth). Facts and analysis say so explicitly; fan-out sessions for closed systems should
  standardize this scoping language.

## Running the validation

`pnpm --filter=ds check:data` — validates every `data/systems/<slug>/` against the
schema and question bank (also runs inside ds's `build` and `typecheck`).
