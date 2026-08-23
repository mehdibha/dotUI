"use client"

import { useState } from "react"

import {
  BoxIcon,
  CheckIcon,
  ContainerIcon,
  HeartIcon,
  ImageIcon,
  RotateCwIcon,
  SearchIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  StarIcon,
  ZoomInIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Accordion } from "@/registry/ui/accordion"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/registry/ui/alert"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@/registry/ui/breadcrumbs"
import { Button, LinkButton } from "@/registry/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import {
  Disclosure,
  DisclosurePanel,
  DisclosureTrigger,
} from "@/registry/ui/disclosure"
import { Label } from "@/registry/ui/field"
import { Group } from "@/registry/ui/group"
import { Input } from "@/registry/ui/input"
import { Modal } from "@/registry/ui/modal"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldIncrement,
} from "@/registry/ui/number-field"
import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/ui/pagination"
import { ProgressBar, ProgressBarControl } from "@/registry/ui/progress-bar"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/ui/select"
import { Separator } from "@/registry/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
} from "@/registry/ui/table"
import { ToggleButton } from "@/registry/ui/toggle-button"
import { ToggleButtonGroup } from "@/registry/ui/toggle-button-group"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

/* --------------------------------- Data ----------------------------------- */

const VIEWS = [
  { id: "front", label: "Front" },
  { id: "side", label: "Side profile" },
  { id: "open", label: "Main compartment" },
  { id: "detail", label: "Hardware detail" },
] as const

const COLORWAYS = [
  { id: "slate", label: "Slate", stock: "In stock" },
  { id: "clay", label: "Clay", stock: "In stock" },
  { id: "fog", label: "Fog", stock: "Low stock" },
  { id: "moss", label: "Moss", stock: "In stock" },
] as const

const CAPACITIES = ["22L", "28L", "34L"]

const ASSURANCES = [
  {
    icon: ContainerIcon,
    title: "Free carbon-neutral shipping",
    detail: "Arrives Tue, 25 Aug",
  },
  {
    icon: RotateCwIcon,
    title: "60-day returns",
    detail: "Free label, no questions",
  },
  {
    icon: ShieldCheckIcon,
    title: "Lifetime repair",
    detail: "Covered by Halden Care",
  },
]

const SPECS = [
  { label: "Capacity", value: "28 litres" },
  { label: "Weight", value: "1.24 kg" },
  { label: "Dimensions", value: "52 × 31 × 21 cm" },
  { label: "Laptop sleeve", value: "Fits 16″" },
  { label: "Shell", value: "420D recycled ripstop" },
  { label: "Hardware", value: "Anodised aluminium" },
]

const SIZE_GUIDE = [
  { size: "22L", torso: "40–45 cm", carryOn: "Yes", laptop: "14″" },
  { size: "28L", torso: "44–50 cm", carryOn: "Yes", laptop: "16″" },
  { size: "34L", torso: "48–55 cm", carryOn: "Check airline", laptop: "16″" },
]

const RATING_BREAKDOWN = [
  { stars: 5, count: 214 },
  { stars: 4, count: 61 },
  { stars: 3, count: 22 },
  { stars: 2, count: 9 },
  { stars: 1, count: 6 },
]

const TOTAL_REVIEWS = RATING_BREAKDOWN.reduce((sum, r) => sum + r.count, 0)
const PAGE_COUNT = Math.ceil(TOTAL_REVIEWS / 3)

const REVIEWS = [
  {
    id: "priya",
    name: "Priya Raghunathan",
    initials: "PR",
    rating: 5,
    date: "6 August 2026",
    variant: "28L · Slate",
    title: "Three weeks in Patagonia, not a single complaint",
    body: "I carried this every day on a trekking trip and it never once dug into my shoulders. The hip belt tucks away when you're moving through airports, which is the detail that sold me. Rain got through the front pocket zip once, but the main compartment stayed bone dry.",
    helpful: 47,
  },
  {
    id: "marcus",
    name: "Marcus Feld",
    initials: "MF",
    rating: 4,
    date: "29 July 2026",
    variant: "34L · Moss",
    title: "Great daily carry, slightly overbuilt for commuting",
    body: "The build quality is genuinely excellent and the laptop sleeve is suspended properly rather than sitting on the base. My only note is that the 34L is more bag than most people need for a train commute — I'd size down to the 28L if that's your use case.",
    helpful: 31,
  },
  {
    id: "ines",
    name: "Inès Delacroix",
    initials: "ID",
    rating: 5,
    date: "14 July 2026",
    variant: "28L · Clay",
    title: "Finally a bag that opens flat",
    body: "The clamshell zip means I stopped unpacking at security. Packing cubes drop straight in and the interior mesh actually lets you see what you have. Clay is a warmer tone in person than the photos suggest, which I prefer.",
    helpful: 24,
  },
]

const RELATED = [
  {
    id: "cubes",
    name: "Meridian Packing Cubes",
    meta: "Set of three",
    price: "$46",
    rating: 4.8,
    reviews: 210,
  },
  {
    id: "sling",
    name: "Transit Sling 4L",
    meta: "Everyday crossbody",
    price: "$98",
    rating: 4.6,
    reviews: 512,
  },
  {
    id: "pouch",
    name: "Halden Tech Pouch",
    meta: "Cables and chargers",
    price: "$64",
    rating: 4.7,
    reviews: 388,
  },
  {
    id: "cover",
    name: "Rainshell Cover 30L",
    meta: "Storm-rated",
    price: "$38",
    rating: 4.4,
    reviews: 96,
  },
]

/* ------------------------------- Primitives -------------------------------- */

function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("flex items-center gap-0.5 text-warning", className)}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <StarIcon
          key={i}
          className={cn(
            "size-4",
            i < Math.round(value) ? "fill-current" : "text-fg-muted/35",
          )}
        />
      ))}
    </span>
  )
}

// Imagery is a token-only placeholder panel — the preview never loads externals.
function ImagePanel({
  label,
  className,
  iconClassName,
}: {
  label?: string
  className?: string
  iconClassName?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 bg-muted text-fg-muted",
        className,
      )}
    >
      <ImageIcon className={cn("size-8", iconClassName)} />
      {label ? <span className="text-xs">{label}</span> : null}
    </div>
  )
}

function SectionTitle({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
        {title}
      </h2>
      {description ? (
        <p className="text-pretty text-fg-muted">{description}</p>
      ) : null}
    </div>
  )
}

/* --------------------------------- Header ---------------------------------- */

function SiteHeader({ cartCount }: { cartCount: number }) {
  return (
    <header className="sticky top-0 z-20 border-b bg-bg/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-fg-on-primary">
            <BoxIcon className="size-4" />
          </span>
          <span className="font-heading text-base font-semibold tracking-tight">
            Halden Supply
          </span>
        </div>
        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {["Packs", "Travel", "Accessories", "Journal"].map((item) => (
            <LinkButton key={item} href="#" variant="quiet" size="sm">
              {item}
            </LinkButton>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1.5">
          <Tooltip>
            <Button variant="quiet" size="sm" isIconOnly aria-label="Search">
              <SearchIcon />
            </Button>
            <TooltipContent>Search the store</TooltipContent>
          </Tooltip>
          <Button variant="secondary" size="sm">
            <ShoppingCartIcon data-icon-start="" />
            <span className="max-sm:sr-only">Cart</span>
            <Badge size="sm" variant="accent">
              {cartCount}
            </Badge>
          </Button>
        </div>
      </div>
    </header>
  )
}

/* --------------------------------- Gallery --------------------------------- */

function Gallery({
  view,
  onViewChange,
  colorway,
}: {
  view: string
  onViewChange: (view: string) => void
  colorway: string
}) {
  const active = VIEWS.find((v) => v.id === view) ?? VIEWS[0]
  return (
    <div className="flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-xl border">
        <ImagePanel
          label={`${colorway} — ${active.label}`}
          className="aspect-square w-full"
          iconClassName="size-12"
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <Badge variant="accent">New season</Badge>
          <Badge>Limited run</Badge>
        </div>
        <div className="absolute right-3 bottom-3">
          <Tooltip>
            <Button
              variant="secondary"
              size="sm"
              isIconOnly
              aria-label="Zoom image"
            >
              <ZoomInIcon />
            </Button>
            <TooltipContent>Zoom</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <ToggleButtonGroup
        aria-label="Product views"
        selectedKeys={[view]}
        onSelectionChange={(keys) => {
          const next = [...keys][0]
          if (next != null) onViewChange(String(next))
        }}
        selectionMode="single"
        disallowEmptySelection
      >
        {VIEWS.map((v) => (
          <ToggleButton
            key={v.id}
            id={v.id}
            aria-label={v.label}
            className="size-16 bg-muted p-0 sm:size-20"
          >
            <ImageIcon className="size-5 text-fg-muted" />
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  )
}

/* ------------------------------- Size guide -------------------------------- */

function SizeGuideDialog() {
  return (
    <Dialog>
      <Button variant="link" size="sm" className="h-auto p-0">
        Size guide
      </Button>
      <Modal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choosing a capacity</DialogTitle>
            <DialogDescription>
              Measure from the base of your neck to the top of your hip bone.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <TableContainer>
              <Table aria-label="Capacity guide">
                <TableHeader>
                  <TableColumn isRowHeader>Capacity</TableColumn>
                  <TableColumn>Torso length</TableColumn>
                  <TableColumn>Carry-on</TableColumn>
                  <TableColumn>Laptop</TableColumn>
                </TableHeader>
                <TableBody>
                  {SIZE_GUIDE.map((row) => (
                    <TableRow key={row.size}>
                      <TableCell>{row.size}</TableCell>
                      <TableCell>{row.torso}</TableCell>
                      <TableCell>{row.carryOn}</TableCell>
                      <TableCell>{row.laptop}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogBody>
          <DialogFooter>
            <Button slot="close" variant="primary">
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Modal>
    </Dialog>
  )
}

/* -------------------------------- Buy panel -------------------------------- */

function BuyPanel({
  colorway,
  onColorwayChange,
  onAddToCart,
}: {
  colorway: string
  onColorwayChange: (colorway: string) => void
  onAddToCart: (qty: number) => void
}) {
  const [capacity, setCapacity] = useState("28L")
  const [quantity, setQuantity] = useState(1)
  const [wishlisted, setWishlisted] = useState(false)
  const [added, setAdded] = useState(false)

  const activeColor = COLORWAYS.find((c) => c.id === colorway) ?? COLORWAYS[0]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-fg-muted">
          Halden Supply · Travel
        </span>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Meridian Travel Pack
        </h1>
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-2xl font-semibold tabular-nums">$248.00</span>
          <span className="text-fg-muted tabular-nums line-through">
            $310.00
          </span>
          <Badge variant="success" appearance="subtle">
            Save 20%
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Stars value={4.7} />
          <span className="font-medium tabular-nums">4.7</span>
          <span className="text-fg-muted">
            · {TOTAL_REVIEWS} reviews · 94% would recommend
          </span>
        </div>
        <p className="max-w-prose text-pretty text-fg-muted">
          A clamshell travel pack built for a week away without a checked bag.
          Suspended laptop sleeve, hide-away hip belt, and a weatherproof
          recycled shell that softens with use rather than wearing out.
        </p>
      </div>

      <Separator />

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <Label>Colour</Label>
            <span className="text-sm text-fg-muted">
              {activeColor.label} · {activeColor.stock}
            </span>
          </div>
          <ToggleButtonGroup
            aria-label="Colour"
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={[colorway]}
            onSelectionChange={(keys) => {
              const next = [...keys][0]
              if (next != null) onColorwayChange(String(next))
            }}
          >
            {COLORWAYS.map((c) => (
              <ToggleButton key={c.id} id={c.id}>
                {c.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <Label>Capacity</Label>
            <SizeGuideDialog />
          </div>
          <SegmentedControl
            aria-label="Capacity"
            selectedKeys={[capacity]}
            onSelectionChange={(keys) => {
              const next = [...keys][0]
              if (next != null) setCapacity(String(next))
            }}
          >
            {CAPACITIES.map((c) => (
              <SegmentedControlItem key={c} id={c}>
                {c}
              </SegmentedControlItem>
            ))}
          </SegmentedControl>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <NumberField
            value={quantity}
            onChange={setQuantity}
            minValue={1}
            maxValue={8}
            className="w-36"
          >
            <Label>Quantity</Label>
            <Group>
              <NumberFieldDecrement />
              <Input />
              <NumberFieldIncrement />
            </Group>
          </NumberField>
          <span className="pb-2 text-sm text-fg-muted">
            Ships within 24 hours
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="primary"
          size="lg"
          className="min-w-48 flex-1"
          onPress={() => {
            onAddToCart(quantity)
            setAdded(true)
          }}
        >
          <ShoppingCartIcon data-icon-start="" />
          Add to cart · ${(248 * quantity).toFixed(2)}
        </Button>
        <Tooltip>
          <ToggleButton
            size="lg"
            isIconOnly
            isSelected={wishlisted}
            onChange={setWishlisted}
            aria-label="Save to wishlist"
          >
            <HeartIcon className={wishlisted ? "fill-current" : undefined} />
          </ToggleButton>
          <TooltipContent>
            {wishlisted ? "Saved to wishlist" : "Save to wishlist"}
          </TooltipContent>
        </Tooltip>
      </div>

      {added && (
        <Alert variant="success">
          <CheckIcon />
          <AlertTitle>Added to your cart</AlertTitle>
          <AlertDescription>
            {quantity} × Meridian Travel Pack · {capacity} · {activeColor.label}
          </AlertDescription>
          <AlertAction>
            <Button size="sm" variant="primary">
              Checkout
            </Button>
          </AlertAction>
        </Alert>
      )}

      <ul className="grid gap-3 sm:grid-cols-3">
        {ASSURANCES.map((a) => (
          <li
            key={a.title}
            className="flex items-start gap-2.5 rounded-lg border bg-card p-3"
          >
            <a.icon className="mt-0.5 size-4 shrink-0 text-fg-muted" />
            <div className="flex min-w-0 flex-col">
              <span className="text-sm font-medium">{a.title}</span>
              <span className="text-xs text-fg-muted">{a.detail}</span>
            </div>
          </li>
        ))}
      </ul>

      <Accordion defaultExpandedKeys={["details"]}>
        <Disclosure id="details">
          <DisclosureTrigger>Details & materials</DisclosureTrigger>
          <DisclosurePanel>
            <div className="flex flex-col gap-3 text-sm text-fg-muted">
              <p>
                Cut from a 420-denier recycled ripstop with a PFC-free durable
                water repellent finish. The clamshell opens flat to 180° and the
                laptop sleeve is suspended 4 cm above the base so a dropped bag
                never lands on your machine.
              </p>
              <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {SPECS.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex justify-between gap-3 border-b border-border/60 pb-1.5"
                  >
                    <dt>{spec.label}</dt>
                    <dd className="text-fg">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </DisclosurePanel>
        </Disclosure>
        <Disclosure id="shipping">
          <DisclosureTrigger>Shipping & returns</DisclosureTrigger>
          <DisclosurePanel>
            <div className="flex flex-col gap-2 text-sm text-fg-muted">
              <p>
                Free carbon-neutral shipping on every order over $75. Standard
                delivery lands in two to four working days; express orders
                placed before 2pm ship the same afternoon.
              </p>
              <p>
                Returns are free for 60 days — print the prepaid label from your
                order page and drop the pack at any partner location. Refunds
                clear within five working days of arrival.
              </p>
            </div>
          </DisclosurePanel>
        </Disclosure>
        <Disclosure id="care">
          <DisclosureTrigger>Care & repair</DisclosureTrigger>
          <DisclosurePanel>
            <p className="text-sm text-fg-muted">
              Spot clean with cold water and a soft brush; never machine wash.
              Zips stay smooth with a wax pencil twice a year. Halden Care
              repairs seams, buckles and zip pulls for the life of the pack —
              send it in and we will return it inside three weeks.
            </p>
          </DisclosurePanel>
        </Disclosure>
      </Accordion>
    </div>
  )
}

/* --------------------------------- Reviews --------------------------------- */

function Reviews() {
  const [sort, setSort] = useState("recent")
  const [page, setPage] = useState(1)

  const firstShown = (page - 1) * REVIEWS.length + 1
  // A three-page window that stays inside the range, so the active page is
  // always one of the numbered links.
  const windowStart = Math.min(Math.max(1, page - 1), PAGE_COUNT - 2)
  const pages = [windowStart, windowStart + 1, windowStart + 2]

  return (
    <section className="flex flex-col gap-6">
      <SectionTitle
        title="What owners say"
        description={`${TOTAL_REVIEWS} verified reviews from people who bought the Meridian.`}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-10">
        <div className="flex flex-col gap-5 rounded-xl border bg-card p-5">
          <div className="flex items-center gap-4">
            <span className="font-heading text-4xl font-semibold tabular-nums">
              4.7
            </span>
            <div className="flex flex-col gap-1">
              <Stars value={4.7} />
              <span className="text-sm text-fg-muted">
                {TOTAL_REVIEWS} reviews
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            {RATING_BREAKDOWN.map((row) => (
              <ProgressBar
                key={row.stars}
                value={row.count}
                maxValue={TOTAL_REVIEWS}
                aria-label={`${row.stars} star reviews`}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-3"
              >
                <span className="flex items-center gap-1 text-sm tabular-nums">
                  {row.stars}
                  <StarIcon className="size-3 fill-current text-warning" />
                </span>
                <ProgressBarControl />
                <span className="w-8 text-right text-sm text-fg-muted tabular-nums">
                  {row.count}
                </span>
              </ProgressBar>
            ))}
          </div>
          <Separator />
          <Button variant="secondary" className="w-full">
            Write a review
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-fg-muted tabular-nums">
              Showing {firstShown}–{firstShown + REVIEWS.length - 1} of{" "}
              {TOTAL_REVIEWS}
            </span>
            <Select
              value={sort}
              onChange={(value) => setSort(value as string)}
              aria-label="Sort reviews"
              className="w-48"
            >
              <SelectTrigger />
              <SelectContent>
                <SelectItem id="recent">Most recent</SelectItem>
                <SelectItem id="helpful">Most helpful</SelectItem>
                <SelectItem id="highest">Highest rated</SelectItem>
                <SelectItem id="lowest">Lowest rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-3">
            {REVIEWS.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{review.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-col">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium">
                          {review.name}
                        </span>
                        <Badge size="sm" variant="success" appearance="subtle">
                          Verified buyer
                        </Badge>
                      </div>
                      <span className="text-xs text-fg-muted">
                        {review.date} · {review.variant}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Stars value={review.rating} className="[&>svg]:size-3.5" />
                    <span className="text-sm font-medium">{review.title}</span>
                  </div>
                  <p className="text-pretty text-fg-muted">{review.body}</p>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button size="sm" variant="quiet">
                    Helpful ({review.helpful})
                  </Button>
                  <Button size="sm" variant="quiet">
                    Report
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Pagination className="justify-center sm:justify-start">
            <PaginationList>
              <PaginationItem>
                <PaginationPrevious
                  isDisabled={page === 1}
                  onPress={() => setPage((p) => Math.max(1, p - 1))}
                />
              </PaginationItem>
              {pages.map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={p === page}
                    aria-label={`Page ${p}`}
                    onPress={() => setPage(p)}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  isActive={page === PAGE_COUNT}
                  aria-label={`Page ${PAGE_COUNT}`}
                  onPress={() => setPage(PAGE_COUNT)}
                >
                  {PAGE_COUNT}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  isDisabled={page === PAGE_COUNT}
                  onPress={() => setPage((p) => Math.min(PAGE_COUNT, p + 1))}
                />
              </PaginationItem>
            </PaginationList>
          </Pagination>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ Related row -------------------------------- */

function RelatedProducts() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <SectionTitle
          title="Pairs well with"
          description="Everything else people add to a Meridian order."
        />
        <Button variant="secondary" size="sm">
          View all travel gear
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {RELATED.map((item) => (
          <Card key={item.id} className="overflow-hidden pt-0">
            <ImagePanel className="aspect-4/3 w-full" />
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>{item.meta}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-1.5">
              <Stars value={item.rating} className="[&>svg]:size-3.5" />
              <span className="text-xs text-fg-muted tabular-nums">
                {item.rating} ({item.reviews})
              </span>
            </CardContent>
            <CardFooter className="justify-between gap-2">
              <span className="font-medium tabular-nums">{item.price}</span>
              <Button size="sm">Add</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}

/* ---------------------------------- Page ----------------------------------- */

export default function ProductPage() {
  const [view, setView] = useState("front")
  const [colorway, setColorway] = useState("slate")
  const [cartCount, setCartCount] = useState(2)

  const activeColor = COLORWAYS.find((c) => c.id === colorway) ?? COLORWAYS[0]

  return (
    <div className="min-h-screen bg-bg text-fg">
      <SiteHeader cartCount={cartCount} />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-6 sm:px-6 sm:py-10">
        <Breadcrumbs>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
            <BreadcrumbSeparator />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Travel</BreadcrumbLink>
            <BreadcrumbSeparator />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Packs</BreadcrumbLink>
            <BreadcrumbSeparator />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink>Meridian Travel Pack</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumbs>

        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <Gallery
            view={view}
            onViewChange={setView}
            colorway={activeColor.label}
          />
          <BuyPanel
            colorway={colorway}
            onColorwayChange={setColorway}
            onAddToCart={(qty) => setCartCount((c) => c + qty)}
          />
        </div>

        <Reviews />
        <RelatedProducts />
      </main>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-2 text-fg-muted">
            <BoxIcon className="size-4" />
            <span className="text-sm">
              Halden Supply — built to be repaired, not replaced.
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {["Shipping", "Returns", "Warranty", "Contact"].map((link) => (
              <LinkButton key={link} href="#" variant="quiet" size="sm">
                {link}
              </LinkButton>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
