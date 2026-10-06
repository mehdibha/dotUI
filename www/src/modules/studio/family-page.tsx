"use client"

/* A family page's parts (architecture §7.3), top to bottom: the hero, the
   leader's main axis and essentials, Uses links, a More folder, then one
   section per member with its own rows and More. */

import { useContext } from "react"
import { ArrowUpRightIcon, ChevronDownIcon } from "lucide-react"
import {
  Button as RacButton,
  Disclosure,
  DisclosurePanel,
} from "react-aria-components"

import { cn } from "@/registry/lib/utils"

import { DEFAULTS } from "./axes"
import { sameValue } from "./axes/schema"
import { DIAL_CHEVRON, DIAL_LABEL } from "./dial"
import { useCurrent } from "./selection"
import { RevealAxis, useAxis, valueLabel } from "./use-axis"
import type { AxisKey } from "./use-axis"

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

/** An upstream decision this family reads, as a link to its row. */
export function UsesRow({
  axis: key,
  label,
}: {
  axis: AxisKey
  label: string
}) {
  const reveal = useContext(RevealAxis)
  const axis = useAxis(key)
  return (
    <RacButton
      onPress={() => reveal(key)}
      className="flex h-8 w-full shrink-0 cursor-interactive items-center justify-between gap-3 rounded-lg px-3 text-left focus-reset transition-colors hover:tint-5 focus-visible:focus-ring pressed:tint-10"
    >
      <span className="shrink-0 text-[13px] font-medium text-fg/50">
        {label}
      </span>
      <span className="flex min-w-0 items-center gap-1.5 text-[13px] font-medium text-fg/60">
        <span className="truncate">{valueLabel(key, axis.effective)}</span>
        <ArrowUpRightIcon className="size-3.5 shrink-0 text-fg/40" />
      </span>
    </RacButton>
  )
}

/** The rest of a family or member, folded; the badge counts the keys edited
 *  away from Origin. Folds instantly: chrome, not content. */
export function More({
  keys,
  children,
}: {
  keys: readonly AxisKey[]
  children: React.ReactNode
}) {
  const { state } = useCurrent()
  const edited = keys.filter((key) => !sameValue(state[key], DEFAULTS[key]))
  return (
    <Disclosure data-folder="more" className="flex w-full shrink-0 flex-col">
      {({ isExpanded }) => (
        <>
          <RacButton
            slot="trigger"
            data-folder-trigger
            className="flex h-9 w-full cursor-interactive items-center justify-between gap-2 rounded-lg px-3 text-left focus-reset transition-colors hover:tint-5 focus-visible:focus-ring"
          >
            <span className="flex items-center gap-2">
              <span className={DIAL_LABEL}>More</span>
              {edited.length > 0 && (
                <span
                  aria-label={`${edited.length} edited`}
                  className="flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-fg-on-accent tabular-nums"
                >
                  {edited.length}
                </span>
              )}
            </span>
            <ChevronDownIcon
              className={cn(DIAL_CHEVRON, isExpanded && "rotate-180")}
            />
          </RacButton>
          <DisclosurePanel>
            <div className="flex flex-col gap-1.5 pt-1.5">{children}</div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
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
