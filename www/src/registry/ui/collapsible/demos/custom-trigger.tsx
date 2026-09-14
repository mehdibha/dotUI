import { ChevronDownIcon } from "@/registry/__generated__/icons"
import { Badge } from "@/registry/ui/badge"
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/registry/ui/collapsible"

export default function Demo() {
  return (
    <Collapsible className="w-full max-w-sm rounded-lg border">
      <CollapsibleTrigger className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-muted/50">
        <span className="font-mono text-xs text-fg-muted tabular-nums">
          12:04:31
        </span>
        <Badge variant="danger">error</Badge>
        <span className="min-w-0 flex-1 truncate font-mono text-xs">
          Connection refused: payments-db:5432
        </span>
        <ChevronDownIcon className="size-4 shrink-0 text-fg-muted transition-transform duration-200 group-expanded/collapsible:rotate-180" />
      </CollapsibleTrigger>
      <CollapsiblePanel>
        <pre className="overflow-x-auto border-t px-3 py-2 font-mono text-xs text-fg-muted">
          {`at Pool.connect (pg/lib/pool.js:45)\nat PaymentsRepo.find (src/payments/repo.ts:18)`}
        </pre>
      </CollapsiblePanel>
    </Collapsible>
  )
}
