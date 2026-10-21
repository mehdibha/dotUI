import { SearchIcon } from "@/registry/icons"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Card, CardContent } from "@/registry/ui/card"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { SearchField } from "@/registry/ui/search-field"
import { Switch } from "@/registry/ui/switch"

/** A small app screen in the direction's own components: compares at a
 *  glance, so it is inert — the tile around it is what takes the click. */
export function Specimen({ product }: { product: string }) {
  return (
    <div
      inert
      className="flex flex-col gap-3 rounded-lg bg-bg p-3 text-fg select-none"
    >
      <div className="flex items-center gap-2">
        <span className="size-3.5 shrink-0 rounded-full bg-primary" />
        <span className="truncate font-heading text-sm font-semibold">
          {product}
        </span>
      </div>
      <Card>
        <CardContent className="flex flex-col gap-1">
          <span className="text-xs text-fg-muted">This month</span>
          <div className="flex items-center justify-between gap-2">
            <span className="font-heading text-xl font-semibold">$4,280</span>
            <Badge variant="accent">+12%</Badge>
          </div>
        </CardContent>
      </Card>
      <SearchField aria-label="Search">
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <Input placeholder="Search" />
        </InputGroup>
      </SearchField>
      <div className="flex gap-2">
        <Button variant="primary" className="min-w-0 flex-1">
          Create
        </Button>
        <Button className="min-w-0 flex-1">Export</Button>
      </div>
      <div className="flex items-center justify-between gap-2 text-sm">
        <span>Reminders</span>
        <Switch aria-label="Reminders" defaultSelected />
      </div>
    </div>
  )
}
