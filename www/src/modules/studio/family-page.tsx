"use client"

/* A family page's parts. */

import { createContext, useContext } from "react"
import { ArrowUpRightIcon } from "lucide-react"
import { Button as RacButton } from "react-aria-components"

import { DEFAULTS, effective } from "./axes"
import { DialFolder } from "./dial"
import { useCurrent } from "./selection"
import { RevealAxis, useAxis, valueLabel } from "./use-axis"
import type { AxisKey } from "./use-axis"

/** Each key's one row, exported by the section that owns it. */
export type RowMap = Partial<Record<AxisKey, React.ComponentType>>

/** Every section's rows (`ALL_ROWS`), provided by the panel so sections
 *  never import each other. */
export const RowsContext = createContext<RowMap>({})

/** Where a key's row lives, as a host names it (the page's label). */
export const PlaceLabel = createContext<(key: AxisKey) => string | undefined>(
  () => undefined,
)

/** A host's name for the row it renders; popovers reset it. */
export const RowLabel = createContext<string | undefined>(undefined)

/** The row's label, as its host names it. */
export const useRowLabel = (label: string) => useContext(RowLabel) ?? label

/** A key's row, hosted anywhere: it edits that key everywhere. */
export function Row({ axis, label }: { axis: AxisKey; label?: string }) {
  const Component = useContext(RowsContext)[axis]
  if (!Component) return null
  return (
    <RowLabel.Provider value={label}>
      <Component />
    </RowLabel.Provider>
  )
}

/** Every member's specimen in the current system, fill-only. */
export function FamilyHero({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-hero
      className="flex min-h-16 shrink-0 flex-wrap items-center justify-center gap-x-6 gap-y-3 rounded-lg bg-bg px-4 py-4 text-fg/70 **:data-[slot=glyph]:size-6"
    >
      {children}
    </div>
  )
}

/** One member in the hero, named for assistive tech and on hover. */
export function HeroMember({
  name,
  children,
}: {
  name: string
  children: React.ReactNode
}) {
  return (
    <span
      role="img"
      aria-label={name}
      title={name}
      className="flex items-center gap-1.5"
    >
      {children}
    </span>
  )
}

/** An upstream decision this family reads, as a link to its row. `value`
 *  stands in when the option label alone says too little. */
export function UsesRow({
  axis: key,
  label,
  value,
}: {
  axis: AxisKey
  label: string
  value?: string
}) {
  const reveal = useContext(RevealAxis)
  const axis = useAxis(key)
  const hex =
    typeof axis.effective === "string" && axis.effective.startsWith("#")
      ? axis.effective
      : undefined
  return (
    <RacButton
      onPress={() => reveal(key)}
      className="flex h-8 w-full shrink-0 cursor-interactive items-center justify-between gap-3 rounded-lg px-3 text-left focus-reset transition-colors hover:tint-5 focus-visible:focus-ring pressed:tint-10"
    >
      <span className="shrink-0 text-[13px] font-medium text-fg/50">
        {label}
      </span>
      <span className="flex min-w-0 items-center gap-1.5 text-[13px] font-medium text-fg/60">
        {hex && (
          <span
            className="size-3.5 shrink-0 rounded-full border border-fg/15"
            style={{ background: hex }}
          />
        )}
        <span className={hex ? "truncate uppercase" : "truncate"}>
          {value ?? valueLabel(key, axis.effective)}
        </span>
        <ArrowUpRightIcon className="size-3.5 shrink-0 text-fg/40" />
      </span>
    </RacButton>
  )
}

/** The rest of a family or member, folded; the badge counts the keys edited
 *  away from Origin. */
export function More({
  keys,
  children,
}: {
  keys: readonly AxisKey[]
  children: React.ReactNode
}) {
  const { state } = useCurrent()
  const { explain } = effective(state)
  if (keys.every((key) => explain[key]?.lock?.kind === "hide")) return null
  const edited = keys.filter(
    (key) =>
      explain[key]?.lock?.kind !== "hide" && state[key] !== DEFAULTS[key],
  )
  return (
    <DialFolder title="More" defaultOpen={false} badge={edited.length}>
      {children}
    </DialFolder>
  )
}

/** A member's rows under its name; `/studio#<family>/<id>` lands here. */
export function MemberSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section
      data-member={id}
      aria-label={title}
      className="mt-2.5 flex scroll-mt-2 flex-col gap-1.5"
    >
      <span className="px-1 text-xs font-medium text-fg-muted">{title}</span>
      {children}
    </section>
  )
}
