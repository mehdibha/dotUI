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
   case — no trail at all, a single back arrow. The hero is a 3-crumb trail,
   current page last, with the middle crumb pinned hovered so the muted
   camp's sharpen-on-hover actually shows. */

import { MousePointer2Icon } from "lucide-react"

import {
  ControlGroup,
  SegmentedControlRow,
  SelectRow,
} from "@/modules/control-lab/rows"
import type { SelectRowOption } from "@/modules/control-lab/rows"

import { Hero } from "../hero"
import type { Lab, LabState } from "../state"

export const BREADCRUMB_DEFAULTS = {
  breadcrumbSeparator: "chevron",
  breadcrumbTone: "muted",
}

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

const SEPARATOR_OPTIONS: SelectRowOption[] = [
  {
    value: "slash",
    label: "Slash",
    illustration: <SeparatorGlyph kind="slash" />,
  },
  {
    value: "chevron",
    label: "Chevron",
    illustration: <SeparatorGlyph kind="chevron" />,
  },
]

/* ---------------------------------- Hero ----------------------------------- */

// Rest keeps a live hover: so real pointers behave like the pinned crumb.
const CRUMB_REST = {
  accent: "text-accent hover:underline hover:underline-offset-2",
  muted: "text-fg-muted hover:text-fg",
}
// Accent crumbs hover like links (underline); muted crumbs sharpen to fg.
const CRUMB_HOVERED = {
  accent: "text-accent underline underline-offset-2",
  muted: "text-fg",
}

function Separator({ state }: { state: LabState }) {
  if (state.breadcrumbSeparator === "slash")
    return <span className="text-fg-muted/60">/</span>
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="size-3.5 text-fg-muted/60"
    >
      <path
        d="m9 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BreadcrumbsHero({ state }: { state: LabState }) {
  const tone = state.breadcrumbTone as keyof typeof CRUMB_REST
  return (
    <Hero className="flex-row items-center justify-center gap-1.5 py-6 text-[0.8125rem]">
      <span className={CRUMB_REST[tone]}>Dashboard</span>
      <Separator state={state} />
      <span className="relative">
        <span className={CRUMB_HOVERED[tone]}>Projects</span>
        <MousePointer2Icon
          aria-hidden
          className="absolute -right-2 -bottom-2 size-3 fill-fg text-bg"
        />
      </span>
      <Separator state={state} />
      <span className="text-fg">Billing</span>
    </Hero>
  )
}

export function BreadcrumbsSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <BreadcrumbsHero state={state} />
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
        options={[
          { value: "accent", label: "Accent" },
          { value: "muted", label: "Muted" },
        ]}
      />
    </ControlGroup>
  )
}
