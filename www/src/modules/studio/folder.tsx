"use client"

/* A folder of rows, DialKit's: a titled section that opens in place onto
   the rows under it, hairlines between folders. */

import {
  Button as RacButton,
  Disclosure as RacDisclosure,
  DisclosurePanel as RacDisclosurePanel,
} from "react-aria-components"

import { ChevronDownIcon } from "@/registry/icons"

export function DialFolder({
  label,
  value,
  children,
}: {
  label: string
  /** What the rows inside set, read while it is closed. */
  value: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <RacDisclosure className="group/folder flex flex-col border-t border-fg/8">
      <RacButton
        slot="trigger"
        className="flex h-10 cursor-interactive items-center justify-between gap-3 rounded-md px-1 text-left outline-none focus-visible:focus-ring"
      >
        <span className="truncate text-[13px] font-semibold text-fg/85">
          {label}
        </span>
        <span className="flex min-w-0 items-center gap-2 text-[13px] font-medium text-fg/50">
          <span className="truncate">{value}</span>
          <ChevronDownIcon className="size-4 shrink-0 text-fg/40 transition-transform group-expanded/folder:rotate-180" />
        </span>
      </RacButton>
      {/* Its own box: a display class would override the closed panel's `hidden`. */}
      <RacDisclosurePanel>
        <div className="flex flex-col gap-1.5 pb-3">{children}</div>
      </RacDisclosurePanel>
    </RacDisclosure>
  )
}
