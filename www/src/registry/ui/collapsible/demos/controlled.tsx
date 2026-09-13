"use client"

import React from "react"

import { ChevronDownIcon } from "@/registry/__generated__/icons"
import { Button } from "@/registry/ui/button"
import { Collapsible, CollapsiblePanel } from "@/registry/ui/collapsible"

export default function Demo() {
  const [isExpanded, setExpanded] = React.useState(false)

  return (
    <div className="w-full max-w-sm space-y-3">
      <Collapsible isExpanded={isExpanded} onExpandedChange={setExpanded}>
        <Button slot="trigger" variant="quiet" size="sm">
          System requirements
          <ChevronDownIcon className="transition-transform duration-200 group-expanded/collapsible:rotate-180" />
        </Button>
        <CollapsiblePanel className="px-3 text-sm text-fg-muted">
          Details about system requirements go here. Describes the minimum and
          recommended hardware and software needed.
        </CollapsiblePanel>
      </Collapsible>
      <Button size="sm" onPress={() => setExpanded(!isExpanded)}>
        {isExpanded ? "Collapse" : "Expand"}
      </Button>
      <p className="text-sm text-fg-muted">
        Expanded: {isExpanded ? "true" : "false"}
      </p>
    </div>
  )
}
