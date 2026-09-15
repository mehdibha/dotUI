"use client"

/* Breadcrumbs — the trail is Links' language (see links.tsx) with two forks of
   its own. Separator: slash (Carbon — verified, GitHub/Primer, Ant, MUI,
   Vercel) vs chevron (Spectrum, shadcn, Fluent, GOV.UK). Tone: accent-link
   crumbs (Carbon, Primer — ancestors are real links and dress like them) vs
   muted labels that sharpen on hover (shadcn, Spectrum, Vercel) — related to
   Links' color axis but not derivable from it: Vercel links wear foreground
   while its crumbs go muted. Current-page emphasis is folded into tone, not
   its own axis: both camps land the current crumb on plain foreground, and
   the occasional bold tracks the tone camp rather than forking free.
   Rejected: collapse/ellipsis — an overflow mechanic whose popup wears Menus'
   language, not a breadcrumb decision; Polaris is worth citing as the null
   case — no trail at all, a single back arrow. */

import {
  SEPARATOR_OPTIONS as SEPARATOR_VALUES,
  TONE_OPTIONS,
} from "../axes/breadcrumbs"
import { ControlGroup, SegmentedControlRow, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Studio } from "../state"

/* ------------------------------ Option glyphs ------------------------------ */

function SeparatorGlyph({ kind }: { kind: "slash" | "chevron" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2.5 12h4M17.5 12h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity=".35"
      />
      {kind === "slash" ? (
        <path
          d="M13.75 6.5 10.25 17.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="m10.5 7.5 4.5 4.5-4.5 4.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}

const SEPARATOR_OPTIONS: SelectRowOption[] = SEPARATOR_VALUES.map((option) => ({
  ...option,
  illustration: <SeparatorGlyph kind={option.value as "slash" | "chevron"} />,
}))

export function BreadcrumbsSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <SelectRow
        label="Separator"
        value={state.breadcrumbSeparator}
        onChange={set("breadcrumbSeparator")}
        options={SEPARATOR_OPTIONS}
        layout="grid"
      />
      <SegmentedControlRow
        label="Crumbs"
        value={state.breadcrumbTone}
        onChange={set("breadcrumbTone")}
        options={TONE_OPTIONS}
      />
    </ControlGroup>
  )
}
