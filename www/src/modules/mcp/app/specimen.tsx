import { SearchIcon } from "@/registry/icons"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Card, CardContent } from "@/registry/ui/card"
import { Label } from "@/registry/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { SearchField } from "@/registry/ui/search-field"
import { Switch } from "@/registry/ui/switch"
import { TextField } from "@/registry/ui/text-field"

/** A small app screen in the design's own components: compares at a glance,
 *  so it is inert — the tile around it is what takes the click. Marked
 *  elements are what contrast is measured on. */
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
          <span className="text-xs text-fg-muted" data-contrast="Muted">
            This week
          </span>
          <div className="flex items-center justify-between gap-2">
            <span className="font-heading text-xl font-semibold">1,284</span>
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
      {/* Roomy designs stack the buttons rather than cut their labels. */}
      <div className="flex flex-wrap gap-2">
        <Button variant="primary" className="grow" data-contrast="Button">
          Create
        </Button>
        <Button className="grow">Export</Button>
      </div>
      <div className="flex items-center justify-between gap-2 text-sm">
        <span data-contrast="Text">Notifications</span>
        <Switch aria-label="Notifications" defaultSelected />
      </div>
    </div>
  )
}

// Product-neutral, so a card never reads as one domain.
const DEFAULT_SAMPLE = "Everything your team needs, in one calm place."

/** Type set in the product's own words: a heading, body, figures and
 *  controls. `large` is the live detail under the tiles. */
export function TypeSpecimen({
  product,
  sample = DEFAULT_SAMPLE,
  large = false,
}: {
  product: string
  sample?: string
  large?: boolean
}) {
  if (!large)
    return (
      <div
        inert
        className="flex flex-col gap-2 rounded-lg bg-bg p-3 text-fg select-none"
      >
        <span className="truncate font-heading text-2xl leading-tight font-semibold">
          {product}
        </span>
        <p className="line-clamp-3 text-sm text-fg-muted">{sample}</p>
        <span className="font-mono text-xs tabular-nums">
          1,284 · +12% this week
        </span>
        <Button variant="primary" className="w-full">
          Get started
        </Button>
      </div>
    )
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-bg p-5 text-fg">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl leading-tight">{product}</h1>
        <p className="text-base text-fg-muted">{sample}</p>
      </div>
      <h2 className="text-lg">This week</h2>
      <div className="grid grid-cols-3 gap-3 font-mono text-sm tabular-nums">
        <span>
          <span className="block text-xs text-fg-muted">Active</span>1,284
        </span>
        <span>
          <span className="block text-xs text-fg-muted">New</span>312
        </span>
        <span>
          <span className="block text-xs text-fg-muted">Returning</span>972
        </span>
      </div>
      <Card>
        <CardContent className="flex items-end gap-2">
          <TextField className="min-w-0 flex-1">
            <Label>Email</Label>
            <Input placeholder="ana@example.com" />
          </TextField>
          <Button variant="primary">Invite</Button>
        </CardContent>
      </Card>
    </div>
  )
}
