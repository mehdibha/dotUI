import * as React from "react"

import {
  BellIcon,
  BoxIcon,
  CircleCheckIcon,
  ClockIcon,
  CreditCardIcon,
  FileTextIcon,
  HomeIcon,
  ImageIcon,
  LogOutIcon,
  MapIcon,
  MessageSquareIcon,
  MoreHorizontalIcon,
  PinIcon,
  RotateCwIcon,
  SettingsIcon,
  ShoppingBagIcon,
  UserIcon,
  XCircleIcon,
} from "@/registry/icons"
import { Responsive } from "@/registry/lib/responsive"
import { cn } from "@/registry/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/registry/ui/alert"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@/registry/ui/breadcrumbs"
import { Button } from "@/registry/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
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
import { Drawer } from "@/registry/ui/drawer"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/ui/empty"
import { FieldGroup, Label } from "@/registry/ui/field"
import { TextArea } from "@/registry/ui/input"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Modal } from "@/registry/ui/modal"
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/ui/pagination"
import { Popover } from "@/registry/ui/popover"
import { ProgressBar, ProgressBarControl } from "@/registry/ui/progress-bar"
import { Radio, RadioControl, RadioGroup } from "@/registry/ui/radio-group"
import { SearchField } from "@/registry/ui/search-field"
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
  TableFooter,
  TableHeader,
  TableRow,
} from "@/registry/ui/table"
import { Tab, TabList, TabPanel, Tabs } from "@/registry/ui/tabs"
import { TextField } from "@/registry/ui/text-field"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

/* -------------------------------- Content --------------------------------- */

type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled"

interface OrderItem {
  name: string
  variant: string
  qty: number
  price: number
}

interface Order {
  id: string
  placedAt: string
  status: OrderStatus
  items: OrderItem[]
  shipping: number
  payment: string
  carrier: string
  tracking: string
  eta: string
  address: string[]
  /** How many tracking stages are complete — drives the timeline states. */
  completed: number
  stageDates: string[]
}

const STAGES = [
  {
    id: "placed",
    label: "Order placed",
    detail: "Payment authorised and your receipt is on its way.",
    icon: CircleCheckIcon,
  },
  {
    id: "packed",
    label: "Packed",
    detail: "Picked and boxed at the Rotterdam fulfilment centre.",
    icon: BoxIcon,
  },
  {
    id: "transit",
    label: "In transit",
    detail: "Scanned at the Antwerp sorting hub.",
    icon: MapIcon,
  },
  {
    id: "out",
    label: "Out for delivery",
    detail: "On the van for the last leg of the route.",
    icon: PinIcon,
  },
  {
    id: "delivered",
    label: "Delivered",
    detail: "Left in the parcel box by the front door.",
    icon: HomeIcon,
  },
]

const ORDERS: Order[] = [
  {
    id: "NW-48127",
    placedAt: "Aug 19, 2026",
    status: "shipped",
    items: [
      {
        name: "Aurora standing desk mat",
        variant: "Slate, 90 × 40 cm",
        qty: 1,
        price: 89,
      },
      {
        name: "Kestrel mechanical keyboard",
        variant: "Tactile brown",
        qty: 1,
        price: 164,
      },
      {
        name: "Braided USB-C cable",
        variant: "2 m, graphite",
        qty: 2,
        price: 18,
      },
      {
        name: "Magnetic cable clips",
        variant: "Set of 6, graphite",
        qty: 1,
        price: 12,
      },
    ],
    shipping: 0,
    payment: "Visa ending 4417",
    carrier: "Meridian Express",
    tracking: "MX 8841 2207 65",
    eta: "Thu, Aug 27",
    address: ["Sofia Ramirez", "Keizersgracht 218-3", "1016 DZ Amsterdam"],
    completed: 3,
    stageDates: [
      "Aug 19, 09:12",
      "Aug 20, 16:40",
      "Aug 22, 04:05",
      "Expected Aug 27",
      "",
    ],
  },
  {
    id: "NW-48096",
    placedAt: "Aug 18, 2026",
    status: "processing",
    items: [
      {
        name: "Halcyon monitor arm",
        variant: "Single, gas spring",
        qty: 1,
        price: 132,
      },
      {
        name: "Under-desk cable tray",
        variant: "60 cm, powder white",
        qty: 1,
        price: 34,
      },
    ],
    shipping: 6,
    payment: "Visa ending 4417",
    carrier: "Meridian Express",
    tracking: "Awaiting handover",
    eta: "Mon, Aug 31",
    address: ["Sofia Ramirez", "Keizersgracht 218-3", "1016 DZ Amsterdam"],
    completed: 1,
    stageDates: ["Aug 18, 20:44", "Expected Aug 24", "", "", ""],
  },
  {
    id: "NW-48041",
    placedAt: "Aug 17, 2026",
    status: "processing",
    items: [
      {
        name: "Solstice desk shelf",
        variant: "Oak, 70 cm",
        qty: 1,
        price: 118,
      },
      {
        name: "Felt drawer inserts",
        variant: "Set of 4, sand",
        qty: 1,
        price: 29,
      },
    ],
    shipping: 6,
    payment: "PayPal",
    carrier: "Meridian Express",
    tracking: "Awaiting handover",
    eta: "Fri, Aug 28",
    address: ["Sofia Ramirez", "Keizersgracht 218-3", "1016 DZ Amsterdam"],
    completed: 1,
    stageDates: ["Aug 17, 11:03", "Expected Aug 23", "", "", ""],
  },
  {
    id: "NW-47984",
    placedAt: "Aug 12, 2026",
    status: "shipped",
    items: [
      {
        name: "Cove acoustic panel set",
        variant: "Moss, 6 panels",
        qty: 1,
        price: 148,
      },
      {
        name: "Adhesive mounting kit",
        variant: "Wall-safe",
        qty: 1,
        price: 22,
      },
    ],
    shipping: 0,
    payment: "Visa ending 4417",
    carrier: "Northbound Freight",
    tracking: "NB 5520 9114 03",
    eta: "Tue, Aug 25",
    address: ["Sofia Ramirez", "Keizersgracht 218-3", "1016 DZ Amsterdam"],
    completed: 2,
    stageDates: ["Aug 12, 08:31", "Aug 14, 13:22", "Expected Aug 24", "", ""],
  },
  {
    id: "NW-47903",
    placedAt: "Aug 4, 2026",
    status: "delivered",
    items: [
      {
        name: "Fern & Ash desk lamp",
        variant: "Brass, warm dimmer",
        qty: 1,
        price: 78,
      },
      { name: "Warm-white bulbs", variant: "3-pack, E27", qty: 1, price: 16 },
    ],
    shipping: 6,
    payment: "Visa ending 4417",
    carrier: "Meridian Express",
    tracking: "MX 8792 5510 22",
    eta: "Delivered Aug 8",
    address: ["Sofia Ramirez", "Keizersgracht 218-3", "1016 DZ Amsterdam"],
    completed: 5,
    stageDates: [
      "Aug 4, 10:18",
      "Aug 5, 09:02",
      "Aug 6, 22:47",
      "Aug 8, 07:15",
      "Aug 8, 14:39",
    ],
  },
  {
    id: "NW-47822",
    placedAt: "Jul 29, 2026",
    status: "cancelled",
    items: [
      {
        name: "Meridian laptop stand",
        variant: "Anodised charcoal",
        qty: 1,
        price: 64,
      },
    ],
    shipping: 6,
    payment: "Refunded to Visa ending 4417",
    carrier: "—",
    tracking: "—",
    eta: "Refund settled Jul 31",
    address: ["Sofia Ramirez", "Keizersgracht 218-3", "1016 DZ Amsterdam"],
    completed: 0,
    stageDates: ["", "", "", "", ""],
  },
  {
    id: "NW-47755",
    placedAt: "Jul 24, 2026",
    status: "delivered",
    items: [
      {
        name: "Larkspur task chair",
        variant: "Charcoal weave",
        qty: 1,
        price: 429,
      },
    ],
    shipping: 0,
    payment: "Visa ending 4417",
    carrier: "Northbound Freight",
    tracking: "NB 5411 7788 90",
    eta: "Delivered Jul 30",
    address: ["Sofia Ramirez", "Keizersgracht 218-3", "1016 DZ Amsterdam"],
    completed: 5,
    stageDates: [
      "Jul 24, 15:52",
      "Jul 26, 08:40",
      "Jul 28, 19:11",
      "Jul 30, 06:58",
      "Jul 30, 11:24",
    ],
  },
  {
    id: "NW-47690",
    placedAt: "Jul 16, 2026",
    status: "delivered",
    items: [
      { name: "Pilot notebook trio", variant: "Dotted, A5", qty: 1, price: 42 },
      {
        name: "Refill ink cartridges",
        variant: "Black, 10-pack",
        qty: 2,
        price: 11,
      },
    ],
    shipping: 6,
    payment: "Apple Pay",
    carrier: "Meridian Express",
    tracking: "MX 8640 1123 47",
    eta: "Delivered Jul 19",
    address: ["Sofia Ramirez", "Keizersgracht 218-3", "1016 DZ Amsterdam"],
    completed: 5,
    stageDates: [
      "Jul 16, 12:07",
      "Jul 17, 07:55",
      "Jul 18, 20:30",
      "Jul 19, 08:12",
      "Jul 19, 13:46",
    ],
  },
  {
    id: "NW-47612",
    placedAt: "Jul 9, 2026",
    status: "cancelled",
    items: [
      {
        name: "Harbour rug",
        variant: "Ecru, 160 × 230 cm",
        qty: 1,
        price: 285,
      },
    ],
    shipping: 0,
    payment: "Refunded to Apple Pay",
    carrier: "—",
    tracking: "—",
    eta: "Refund settled Jul 12",
    address: ["Sofia Ramirez", "Keizersgracht 218-3", "1016 DZ Amsterdam"],
    completed: 0,
    stageDates: ["", "", "", "", ""],
  },
]

const STATUS_META = {
  processing: { label: "Processing", variant: "warning", icon: ClockIcon },
  shipped: { label: "Shipped", variant: "info", icon: MapIcon },
  delivered: { label: "Delivered", variant: "success", icon: CircleCheckIcon },
  cancelled: { label: "Cancelled", variant: "danger", icon: XCircleIcon },
} as const

const TABS = [
  { id: "all", label: "All" },
  { id: "processing", label: "Processing" },
  { id: "shipped", label: "Shipped" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
] as const

type TabId = (typeof TABS)[number]["id"]

const SORTS = [
  { id: "recent", label: "Newest first" },
  { id: "oldest", label: "Oldest first" },
  { id: "highest", label: "Highest total" },
] as const

type SortId = (typeof SORTS)[number]["id"]

const RETURN_REASONS = [
  { id: "damaged", label: "Arrived damaged" },
  { id: "wrong", label: "Wrong item shipped" },
  { id: "fit", label: "Does not fit my desk" },
  { id: "changed", label: "Changed my mind" },
]

const PAGE_SIZE = 4

/* -------------------------------- Helpers --------------------------------- */

const currency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amount,
  )

const subtotalOf = (order: Order) =>
  order.items.reduce((sum, item) => sum + item.price * item.qty, 0)

const totalOf = (order: Order) => subtotalOf(order) + order.shipping

const unitsOf = (order: Order) =>
  order.items.reduce((sum, item) => sum + item.qty, 0)

/* ------------------------------- Primitives ------------------------------- */

function Thumbnails({ order }: { order: Order }) {
  const shown = order.items.slice(0, 3)
  const rest = order.items.length - shown.length

  return (
    <div className="flex shrink-0 items-center gap-2">
      {shown.map((item) => (
        <div
          key={item.name}
          className="flex size-12 items-center justify-center rounded-md border border-border-muted bg-muted"
          aria-hidden
        >
          <ImageIcon className="size-4 text-fg-muted" />
        </div>
      ))}
      {rest > 0 && (
        <div className="flex size-12 items-center justify-center rounded-md border border-dashed border-border-muted text-xs font-medium text-fg-muted tabular-nums">
          +{rest}
        </div>
      )}
    </div>
  )
}

function TrackingTimeline({ order }: { order: Order }) {
  return (
    <ol className="flex flex-col">
      {STAGES.map((stage, index) => {
        const done = index < order.completed
        const current = index === order.completed
        const last = index === STAGES.length - 1
        const Icon = stage.icon
        return (
          <li key={stage.id} className="relative flex gap-3 pb-5 last:pb-0">
            {!last && (
              <span
                aria-hidden
                className={cn(
                  "absolute top-9 bottom-0 left-4 -ml-px w-px",
                  done ? "bg-success" : "bg-border",
                )}
              />
            )}
            <span
              aria-hidden
              className={cn(
                "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border",
                done && "border-transparent bg-success text-fg-on-success",
                current && "border-transparent bg-accent text-fg-on-accent",
                !done && !current && "bg-muted text-fg-muted",
              )}
            >
              <Icon className="size-4" />
            </span>
            <div className="min-w-0 flex-1 pt-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p
                  className={cn(
                    "text-sm font-medium text-fg",
                    !done && !current && "text-fg-muted",
                  )}
                >
                  {stage.label}
                </p>
                <p className="text-xs text-fg-muted tabular-nums">
                  {order.stageDates[index] || "Pending"}
                </p>
              </div>
              <p className="text-xs text-fg-muted">{stage.detail}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function ReturnDialog({ order }: { order: Order }) {
  const content = (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Return items from {order.id}</DialogTitle>
        <DialogDescription>
          Returns are free within 30 days of delivery. We email a prepaid label
          as soon as the request is approved.
        </DialogDescription>
      </DialogHeader>
      <DialogBody className="gap-5">
        <RadioGroup defaultValue="damaged">
          <Label>Reason for return</Label>
          <FieldGroup>
            {RETURN_REASONS.map((reason) => (
              <Radio key={reason.id} value={reason.id}>
                <RadioControl />
                <Label>{reason.label}</Label>
              </Radio>
            ))}
          </FieldGroup>
        </RadioGroup>
        <TextField>
          <Label>Anything else we should know?</Label>
          <TextArea
            placeholder="The corner of the panel arrived creased."
            className="w-full"
          />
        </TextField>
      </DialogBody>
      <DialogFooter>
        <Button slot="close">Cancel</Button>
        <Button slot="close" variant="primary">
          Request return
        </Button>
      </DialogFooter>
    </DialogContent>
  )

  return (
    <Dialog>
      <Button size="sm" variant="quiet">
        <RotateCwIcon />
        Start a return
      </Button>
      <Responsive
        render={(isMobile) =>
          isMobile ? <Drawer>{content}</Drawer> : <Modal>{content}</Modal>
        }
      />
    </Dialog>
  )
}

function OrderDetails({ order }: { order: Order }) {
  const subtotal = subtotalOf(order)
  const total = totalOf(order)
  const progress = Math.round((order.completed / STAGES.length) * 100)

  return (
    <div className="flex flex-col gap-5 pt-1">
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <div className="min-w-0 flex-1">
          {order.status === "cancelled" ? (
            <Alert variant="danger">
              <XCircleIcon />
              <AlertTitle>Order cancelled</AlertTitle>
              <AlertDescription>
                Cancelled before it left the warehouse. {order.payment} — allow
                up to five working days for the funds to appear.
              </AlertDescription>
            </Alert>
          ) : (
            <TrackingTimeline order={order} />
          )}
        </div>

        <div className="flex w-full shrink-0 flex-col gap-4 lg:w-64">
          {order.status !== "cancelled" && (
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs font-medium tracking-wide text-fg-muted uppercase">
                  Delivery
                </span>
                <span className="text-xs text-fg-muted tabular-nums">
                  {order.eta}
                </span>
              </div>
              <ProgressBar value={progress} aria-label="Delivery progress">
                <ProgressBarControl />
              </ProgressBar>
            </div>
          )}
          <dl className="flex flex-col gap-2 text-xs">
            <div className="flex justify-between gap-3">
              <dt className="text-fg-muted">Carrier</dt>
              <dd className="text-right">{order.carrier}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-fg-muted">Tracking</dt>
              <dd className="text-right font-mono">{order.tracking}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-fg-muted">Payment</dt>
              <dd className="text-right">{order.payment}</dd>
            </div>
          </dl>
          <Separator />
          <div className="text-xs">
            <p className="mb-1 font-medium tracking-wide text-fg-muted uppercase">
              Shipping to
            </p>
            {order.address.map((line) => (
              <p key={line} className="text-fg">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>

      <TableContainer>
        <Table aria-label={`Items in order ${order.id}`}>
          <TableHeader>
            <TableColumn isRowHeader>Item</TableColumn>
            <TableColumn className="text-right">Qty</TableColumn>
            <TableColumn className="text-right">Price</TableColumn>
          </TableHeader>
          <TableBody>
            {order.items.map((item) => (
              <TableRow key={item.name}>
                <TableCell>
                  <span className="font-medium text-fg">{item.name}</span>
                  <span className="block text-xs text-fg-muted">
                    {item.variant}
                  </span>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {item.qty}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {currency(item.price * item.qty)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>
                Subtotal {currency(subtotal)} · Shipping{" "}
                {order.shipping === 0 ? "Free" : currency(order.shipping)}
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums">
                {currency(total)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="secondary">
          <FileTextIcon />
          Download invoice
        </Button>
        {order.status !== "cancelled" && <ReturnDialog order={order} />}
        <Button size="sm" variant="quiet">
          <MessageSquareIcon />
          Contact support
        </Button>
      </div>
    </div>
  )
}

function OrderCard({
  order,
  isExpanded,
  onExpandedChange,
}: {
  order: Order
  isExpanded: boolean
  onExpandedChange: (isExpanded: boolean) => void
}) {
  const status = STATUS_META[order.status]
  const StatusIcon = status.icon
  const summary = order.items.map((item) => item.name).join(", ")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm">{order.id}</span>
          <Badge variant={status.variant} appearance="subtle">
            <StatusIcon />
            {status.label}
          </Badge>
        </CardTitle>
        <CardDescription className="text-xs">
          Placed {order.placedAt} · {unitsOf(order)} item
          {unitsOf(order) === 1 ? "" : "s"} · {order.payment}
        </CardDescription>
        <CardAction className="flex items-center gap-2">
          <span className="text-sm font-semibold tabular-nums">
            {currency(totalOf(order))}
          </span>
          <Menu>
            <Button size="sm" variant="quiet" isIconOnly aria-label="Actions">
              <MoreHorizontalIcon />
            </Button>
            <Popover placement="bottom end">
              <MenuContent>
                {order.status !== "cancelled" && (
                  <MenuItem onAction={() => onExpandedChange(true)}>
                    <MapIcon />
                    Track shipment
                  </MenuItem>
                )}
                <MenuItem>
                  <FileTextIcon />
                  Download invoice
                </MenuItem>
                {order.status !== "cancelled" && (
                  <MenuItem>
                    <RotateCwIcon />
                    Request a return
                  </MenuItem>
                )}
                <Separator />
                <MenuItem>
                  <MessageSquareIcon />
                  Contact support
                </MenuItem>
                {order.status === "processing" && (
                  <MenuItem variant="danger">
                    <XCircleIcon />
                    Cancel order
                  </MenuItem>
                )}
              </MenuContent>
            </Popover>
          </Menu>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Thumbnails order={order} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm">{summary}</p>
            <p className="truncate text-xs text-fg-muted">
              {order.status === "cancelled"
                ? order.eta
                : `${order.carrier} · ${order.eta}`}
            </p>
          </div>
        </div>
        <Separator />
        <Disclosure
          isExpanded={isExpanded}
          onExpandedChange={onExpandedChange}
          className="-mt-1"
        >
          <DisclosureTrigger>
            {isExpanded ? "Hide details" : "Tracking & items"}
          </DisclosureTrigger>
          <DisclosurePanel>
            <OrderDetails order={order} />
          </DisclosurePanel>
        </Disclosure>
      </CardContent>
    </Card>
  )
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint: string
}) {
  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-1">
        <span className="text-xs text-fg-muted">{label}</span>
        <span className="font-heading text-xl font-semibold tabular-nums">
          {value}
        </span>
        <span className="text-xs text-fg-muted">{hint}</span>
      </CardContent>
    </Card>
  )
}

/* ---------------------------------- Page ---------------------------------- */

export default function OrdersBlock() {
  const [tab, setTab] = React.useState<TabId>("all")
  const [query, setQuery] = React.useState("")
  const [sort, setSort] = React.useState<SortId>("recent")
  const [page, setPage] = React.useState(1)
  const [expanded, setExpanded] = React.useState<string[]>(["NW-48127"])

  const stats = React.useMemo(() => {
    const active = ORDERS.filter((order) => order.status !== "cancelled")
    return {
      spent: active.reduce((sum, order) => sum + totalOf(order), 0),
      placed: ORDERS.length,
      inTransit: ORDERS.filter((order) => order.status === "shipped").length,
      delivered: ORDERS.filter((order) => order.status === "delivered").length,
    }
  }, [])

  const counts = React.useMemo(
    () =>
      TABS.reduce<Record<TabId, number>>(
        (acc, item) => {
          acc[item.id] =
            item.id === "all"
              ? ORDERS.length
              : ORDERS.filter((order) => order.status === item.id).length
          return acc
        },
        { all: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 },
      ),
    [],
  )

  const visible = React.useMemo(() => {
    const needle = query.trim().toLowerCase()
    const filtered = ORDERS.filter((order) => {
      if (tab !== "all" && order.status !== tab) return false
      if (!needle) return true
      return (
        order.id.toLowerCase().includes(needle) ||
        order.items.some((item) =>
          `${item.name} ${item.variant}`.toLowerCase().includes(needle),
        )
      )
    })
    if (sort === "highest") {
      return [...filtered].sort((a, b) => totalOf(b) - totalOf(a))
    }
    return sort === "oldest" ? [...filtered].reverse() : filtered
  }, [tab, query, sort])

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageItems = visible.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )
  const rangeStart =
    visible.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const rangeEnd = (currentPage - 1) * PAGE_SIZE + pageItems.length

  const toggleExpanded = (id: string, isExpanded: boolean) =>
    setExpanded((prev) =>
      isExpanded ? [...prev, id] : prev.filter((item) => item !== id),
    )

  const renderList = () => {
    if (pageItems.length === 0) {
      return (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ShoppingBagIcon />
            </EmptyMedia>
            <EmptyTitle>No orders match that search</EmptyTitle>
            <EmptyDescription>
              Try an order number like NW-48127, or a product name such as “desk
              mat”.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              variant="secondary"
              onPress={() => {
                setQuery("")
                setTab("all")
                setPage(1)
              }}
            >
              Clear filters
            </Button>
          </EmptyContent>
        </Empty>
      )
    }

    return (
      <div className="flex flex-col gap-3">
        {pageItems.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            isExpanded={expanded.includes(order.id)}
            onExpandedChange={(isExpanded) =>
              toggleExpanded(order.id, isExpanded)
            }
          />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-30 border-b bg-bg/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-fg-on-primary">
              <ShoppingBagIcon className="size-4" />
            </span>
            <span className="text-sm font-medium">Northwind Supply</span>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <Tooltip>
              <Button size="sm" variant="quiet" isIconOnly aria-label="Alerts">
                <BellIcon />
              </Button>
              <TooltipContent>2 delivery alerts</TooltipContent>
            </Tooltip>
            <Menu>
              <Button
                variant="quiet"
                isIconOnly
                aria-label="Account"
                className="rounded-full"
              >
                <Avatar size="sm">
                  <AvatarFallback>SR</AvatarFallback>
                </Avatar>
              </Button>
              <Popover placement="bottom end">
                <MenuContent>
                  <MenuItem>
                    <UserIcon />
                    Profile
                  </MenuItem>
                  <MenuItem>
                    <CreditCardIcon />
                    Payment methods
                  </MenuItem>
                  <MenuItem>
                    <SettingsIcon />
                    Preferences
                  </MenuItem>
                  <Separator />
                  <MenuItem>
                    <LogOutIcon />
                    Sign out
                  </MenuItem>
                </MenuContent>
              </Popover>
            </Menu>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4">
          <Breadcrumbs>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Home</BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Account</BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink>Orders</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumbs>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                Orders
              </h1>
              <p className="text-sm text-fg-muted">
                Track shipments, download invoices and start a return.
              </p>
            </div>
            <Button variant="secondary" size="sm">
              <FileTextIcon />
              Export history
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat
            label="Spent"
            value={currency(stats.spent)}
            hint="Last 3 months"
          />
          <Stat
            label="Orders placed"
            value={String(stats.placed)}
            hint="Across 3 payment methods"
          />
          <Stat
            label="In transit"
            value={String(stats.inTransit)}
            hint="Both on schedule"
          />
          <Stat
            label="Delivered"
            value={String(stats.delivered)}
            hint="No open issues"
          />
        </div>

        <Tabs
          selectedKey={tab}
          onSelectionChange={(key) => {
            setTab(key as TabId)
            setPage(1)
          }}
          className="gap-5"
        >
          <div className="flex flex-col gap-4">
            <div className="-mx-4 no-scrollbar overflow-x-auto px-4 sm:mx-0 sm:px-0">
              <div className="w-max min-w-full border-b">
                <TabList variant="line" aria-label="Order status">
                  {TABS.map((item) => (
                    <Tab key={item.id} id={item.id}>
                      {item.label}
                      <span className="text-fg-muted tabular-nums">
                        {counts[item.id]}
                      </span>
                    </Tab>
                  ))}
                </TabList>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <SearchField
                aria-label="Search orders"
                placeholder="Search orders or products…"
                value={query}
                onChange={(value) => {
                  setQuery(value)
                  setPage(1)
                }}
                className="sm:max-w-xs"
              />
              <Select
                aria-label="Sort orders"
                value={sort}
                onChange={(key) => setSort(key as SortId)}
                className="sm:ml-auto sm:w-48"
              >
                <SelectTrigger />
                <SelectContent>
                  {SORTS.map((option) => (
                    <SelectItem key={option.id} id={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {TABS.map((item) => (
            <TabPanel key={item.id} id={item.id}>
              {renderList()}
            </TabPanel>
          ))}
        </Tabs>

        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-fg-muted">
            Showing{" "}
            <span className="text-fg tabular-nums">
              {rangeStart}–{rangeEnd}
            </span>{" "}
            of <span className="text-fg tabular-nums">{visible.length}</span>{" "}
            orders
          </p>
          <Pagination>
            <PaginationList>
              <PaginationItem>
                <PaginationPrevious
                  isDisabled={currentPage === 1}
                  onPress={() => setPage(Math.max(1, currentPage - 1))}
                />
              </PaginationItem>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map(
                (number) => (
                  <PaginationItem key={number}>
                    <PaginationLink
                      isActive={number === currentPage}
                      aria-label={`Page ${number}`}
                      onPress={() => setPage(number)}
                    >
                      {number}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}
              <PaginationItem>
                <PaginationNext
                  isDisabled={currentPage === pageCount}
                  onPress={() => setPage(Math.min(pageCount, currentPage + 1))}
                />
              </PaginationItem>
            </PaginationList>
          </Pagination>
        </div>
      </main>
    </div>
  )
}
