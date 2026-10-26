"use client"

/* A folder of rows: a row that opens in place onto the rows under it, for a
   page that holds many small groups. */

import {
  Button as RacButton,
  Disclosure as RacDisclosure,
  DisclosurePanel as RacDisclosurePanel,
} from "react-aria-components"

import { ChevronRightIcon } from "@/registry/icons"
import { cn } from "@/registry/lib/utils"

import { DIAL_LABEL, DIAL_PRESS, DIAL_ROW } from "./dial"

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
    <RacDisclosure className="group/folder flex flex-col">
      <RacButton slot="trigger" className={cn(DIAL_ROW, DIAL_PRESS, "pr-2")}>
        <span className={DIAL_LABEL}>{label}</span>
        <span className="flex min-w-0 items-center gap-2 text-[13px] font-medium text-fg/60">
          <span className="truncate">{value}</span>
          <ChevronRightIcon className="size-4 shrink-0 text-fg/40 transition-transform group-expanded/folder:rotate-90" />
        </span>
      </RacButton>
      {/* The rows sit under the folder's name, a step in. */}
      <RacDisclosurePanel className="flex flex-col gap-1.5 pt-1.5 pl-3">
        {children}
      </RacDisclosurePanel>
    </RacDisclosure>
  )
}
