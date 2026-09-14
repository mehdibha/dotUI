"use client"

import { ChevronDownIcon } from "@/registry/__generated__/icons"
import { Button } from "@/registry/ui/button"
import {
  Collapsible,
  CollapsiblePanel,
  type CollapsibleProps,
} from "@/registry/ui/collapsible"

export default function Demo({ isDisabled = false }: CollapsibleProps = {}) {
  return (
    <Collapsible className="w-full max-w-sm" isDisabled={isDisabled}>
      <Button slot="trigger" variant="quiet" size="sm">
        System requirements
        <ChevronDownIcon className="transition-transform duration-200 group-expanded/collapsible:rotate-180" />
      </Button>
      <CollapsiblePanel className="px-3 text-sm text-fg-muted">
        Details about system requirements go here. Describes the minimum and
        recommended hardware and software needed.
      </CollapsiblePanel>
    </Collapsible>
  )
}
