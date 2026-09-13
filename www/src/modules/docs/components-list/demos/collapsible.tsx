import { ChevronDownIcon } from "@/registry/__generated__/icons"
import { Button } from "@/registry/ui/button"
import { Collapsible, CollapsiblePanel } from "@/registry/ui/collapsible"

export function CollapsibleDemo() {
  return (
    <Collapsible className="w-56" defaultExpanded>
      <Button slot="trigger" variant="quiet" size="sm">
        Show details
        <ChevronDownIcon className="transition-transform duration-200 group-expanded/collapsible:rotate-180" />
      </Button>
      <CollapsiblePanel className="px-3 text-sm text-fg-muted">
        React is a JavaScript library for building user interfaces.
      </CollapsiblePanel>
    </Collapsible>
  )
}
