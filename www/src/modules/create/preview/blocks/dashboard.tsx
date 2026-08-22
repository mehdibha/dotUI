import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  BellIcon,
  BoxesIcon,
  Building2Icon,
  ChartLineIcon,
  ChevronsUpDownIcon,
  CircleDollarSignIcon,
  CreditCardIcon,
  DownloadIcon,
  HomeIcon,
  ImageIcon,
  LogOutIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  SparklesIcon,
  TagIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  UserIcon,
  Users2Icon,
  WalletIcon,
} from "@/registry/icons"
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
import type { ChartConfig } from "@/registry/ui/chart"
import {
  ChartContainer,
  ChartDataTable,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/ui/chart"
import { Input } from "@/registry/ui/input"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSection,
  MenuSectionHeader,
} from "@/registry/ui/menu"
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
import { SearchField } from "@/registry/ui/search-field"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import { Separator } from "@/registry/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/registry/ui/sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
} from "@/registry/ui/table"
import { Tab, TabList, TabPanel, Tabs } from "@/registry/ui/tabs"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

/* ---------------------------------- Data ---------------------------------- */

const MONTHLY = [
  { month: "September", revenue: 148_200, target: 140_000 },
  { month: "October", revenue: 162_400, target: 150_000 },
  { month: "November", revenue: 209_800, target: 180_000 },
  { month: "December", revenue: 264_100, target: 220_000 },
  { month: "January", revenue: 171_300, target: 165_000 },
  { month: "February", revenue: 183_900, target: 175_000 },
  { month: "March", revenue: 196_500, target: 185_000 },
  { month: "April", revenue: 188_700, target: 190_000 },
  { month: "May", revenue: 214_600, target: 200_000 },
  { month: "June", revenue: 231_200, target: 210_000 },
  { month: "July", revenue: 258_400, target: 225_000 },
  { month: "August", revenue: 284_920, target: 240_000 },
]

const RANGES = [
  { id: "3m", label: "3M", months: 3 },
  { id: "6m", label: "6M", months: 6 },
  { id: "12m", label: "12M", months: 12 },
] as const

type RangeId = (typeof RANGES)[number]["id"]

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  target: { label: "Target", color: "var(--chart-2)" },
} satisfies ChartConfig

// `trend` drives the arrow, `intent` the colour — a falling refund rate is a
// down arrow but good news.
const KPIS = [
  {
    label: "Gross revenue",
    value: "$284,920",
    delta: "+10.3%",
    trend: "up",
    intent: "positive",
    caption: "vs. $258,400 in July",
    icon: CircleDollarSignIcon,
  },
  {
    label: "Orders",
    value: "3,482",
    delta: "+8.1%",
    trend: "up",
    intent: "positive",
    caption: "412 awaiting fulfilment",
    icon: ShoppingCartIcon,
  },
  {
    label: "New customers",
    value: "1,204",
    delta: "+4.6%",
    trend: "up",
    intent: "positive",
    caption: "38% returning within 30 days",
    icon: Users2Icon,
  },
  {
    label: "Refund rate",
    value: "1.8%",
    delta: "-0.4pt",
    trend: "down",
    intent: "positive",
    caption: "62 refunds on 3,482 orders",
    icon: TagIcon,
  },
] as const

const TOP_PRODUCTS = [
  {
    name: "Aperture Desk Lamp",
    units: "1,284 units",
    revenue: "$68,420",
    share: 82,
  },
  {
    name: "Halden Linen Throw",
    units: "962 units",
    revenue: "$41,150",
    share: 61,
  },
  {
    name: "Kestrel Ceramic Mug",
    units: "2,410 units",
    revenue: "$28,900",
    share: 44,
  },
  {
    name: "Marlow Walnut Tray",
    units: "618 units",
    revenue: "$19,740",
    share: 29,
  },
]

type OrderStatus =
  | "Fulfilled"
  | "Processing"
  | "Pending"
  | "Refunded"
  | "Failed"

interface Order {
  id: string
  customer: string
  channel: string
  date: string
  status: OrderStatus
  total: string
}

const ORDERS: Order[] = [
  {
    id: "NW-4821",
    customer: "Amara Reyes",
    channel: "Online store",
    date: "Aug 22",
    status: "Fulfilled",
    total: "$412.00",
  },
  {
    id: "NW-4820",
    customer: "Jonas Whitfield",
    channel: "Retail EU",
    date: "Aug 22",
    status: "Processing",
    total: "$1,284.50",
  },
  {
    id: "NW-4819",
    customer: "Priya Raghunathan",
    channel: "Online store",
    date: "Aug 21",
    status: "Pending",
    total: "$96.25",
  },
  {
    id: "NW-4818",
    customer: "Tomas Lindqvist",
    channel: "Wholesale",
    date: "Aug 21",
    status: "Fulfilled",
    total: "$3,940.00",
  },
  {
    id: "NW-4817",
    customer: "Grace Oyelaran",
    channel: "Retail US",
    date: "Aug 20",
    status: "Refunded",
    total: "$218.90",
  },
  {
    id: "NW-4816",
    customer: "Daniel Kovač",
    channel: "Online store",
    date: "Aug 20",
    status: "Fulfilled",
    total: "$742.10",
  },
  {
    id: "NW-4815",
    customer: "Yuki Tanabe",
    channel: "Wholesale",
    date: "Aug 19",
    status: "Processing",
    total: "$2,105.00",
  },
  {
    id: "NW-4814",
    customer: "Sofia Marchetti",
    channel: "Retail EU",
    date: "Aug 19",
    status: "Failed",
    total: "$164.75",
  },
  {
    id: "NW-4813",
    customer: "Lucas Ferreira",
    channel: "Online store",
    date: "Aug 18",
    status: "Fulfilled",
    total: "$589.30",
  },
  {
    id: "NW-4812",
    customer: "Nadia Belkacem",
    channel: "Retail US",
    date: "Aug 18",
    status: "Pending",
    total: "$1,012.60",
  },
  {
    id: "NW-4811",
    customer: "Henry Osgood",
    channel: "Wholesale",
    date: "Aug 17",
    status: "Fulfilled",
    total: "$4,320.00",
  },
  {
    id: "NW-4810",
    customer: "Mei-Ling Chow",
    channel: "Online store",
    date: "Aug 17",
    status: "Refunded",
    total: "$77.40",
  },
  {
    id: "NW-4809",
    customer: "Oskar Brandt",
    channel: "Retail EU",
    date: "Aug 16",
    status: "Processing",
    total: "$860.15",
  },
  {
    id: "NW-4808",
    customer: "Isabel Duarte",
    channel: "Online store",
    date: "Aug 16",
    status: "Fulfilled",
    total: "$233.05",
  },
]

const STATUS_VARIANT = {
  Fulfilled: "success",
  Processing: "info",
  Pending: "warning",
  Refunded: "neutral",
  Failed: "danger",
} as const

const ORDER_TABS = [
  { id: "all", label: "All" },
  { id: "processing", label: "Processing" },
  { id: "fulfilled", label: "Fulfilled" },
  { id: "issues", label: "Issues" },
] as const

type OrderTabId = (typeof ORDER_TABS)[number]["id"]

const TAB_FILTER: Record<OrderTabId, (order: Order) => boolean> = {
  all: () => true,
  processing: (o) => o.status === "Processing" || o.status === "Pending",
  fulfilled: (o) => o.status === "Fulfilled",
  issues: (o) => o.status === "Refunded" || o.status === "Failed",
}

const PAGE_SIZE = 5

const NAV_MAIN = [
  { label: "Dashboard", icon: HomeIcon, isActive: true },
  { label: "Orders", icon: ShoppingBagIcon, badge: "12" },
  { label: "Products", icon: BoxesIcon },
  { label: "Customers", icon: Users2Icon },
  { label: "Analytics", icon: ChartLineIcon },
]

const NAV_WORKSPACE = [
  { label: "Payouts", icon: WalletIcon },
  { label: "Discounts", icon: TagIcon },
  { label: "Settings", icon: SettingsIcon },
]

const ACCOUNT_ITEMS = (
  <>
    <MenuSection>
      <MenuSectionHeader>Amara Reyes</MenuSectionHeader>
      <MenuItem>
        <UserIcon />
        Account
      </MenuItem>
      <MenuItem>
        <CreditCardIcon />
        Billing
      </MenuItem>
      <MenuItem>
        <SettingsIcon />
        Preferences
      </MenuItem>
    </MenuSection>
    <Separator />
    <MenuItem>
      <LogOutIcon />
      Sign out
    </MenuItem>
  </>
)

const currency = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
  maximumFractionDigits: 0,
})

/* -------------------------------- Sections -------------------------------- */

function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Menu>
              <SidebarMenuButton size="lg" tooltip="Northwind Supply">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-fg-on-primary">
                  <SparklesIcon className="size-4" />
                </div>
                <div className="flex min-w-0 flex-col gap-0.5 leading-none">
                  <span className="truncate font-medium text-fg">
                    Northwind Supply
                  </span>
                  <span className="truncate text-xs">Growth plan</span>
                </div>
                <ChevronsUpDownIcon className="ml-auto" />
              </SidebarMenuButton>
              <Popover placement="bottom start" className="w-(--trigger-width)">
                <MenuContent>
                  <MenuSection>
                    <MenuSectionHeader>Workspaces</MenuSectionHeader>
                    <MenuItem>
                      <SparklesIcon />
                      Northwind Supply
                    </MenuItem>
                    <MenuItem>
                      <Building2Icon />
                      Northwind Labs
                    </MenuItem>
                  </MenuSection>
                  <Separator />
                  <MenuItem>
                    <PlusIcon />
                    New workspace
                  </MenuItem>
                </MenuContent>
              </Popover>
            </Menu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_MAIN.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    isActive={item.isActive}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                  {item.badge && (
                    <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Storefronts">
                  <Building2Icon />
                  <span>Storefronts</span>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton>Retail EU</SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton>Retail US</SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton>Wholesale</SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
              {NAV_WORKSPACE.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton tooltip={item.label}>
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Menu>
              <SidebarMenuButton size="lg" tooltip="Amara Reyes">
                <Avatar className="size-8">
                  <AvatarFallback>AR</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col gap-0.5 leading-none">
                  <span className="truncate font-medium text-fg">
                    Amara Reyes
                  </span>
                  <span className="truncate text-xs">amara@northwind.co</span>
                </div>
                <ChevronsUpDownIcon className="ml-auto" />
              </SidebarMenuButton>
              <Popover placement="top start" className="w-(--trigger-width)">
                <MenuContent>{ACCOUNT_ITEMS}</MenuContent>
              </Popover>
            </Menu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

function Topbar() {
  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-bg px-3 sm:px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-1 h-4" />
      <Breadcrumbs className="min-w-0">
        <BreadcrumbItem className="hidden sm:flex">
          <BreadcrumbLink href="#">Northwind</BreadcrumbLink>
          <BreadcrumbSeparator />
        </BreadcrumbItem>
        <BreadcrumbItem className="hidden sm:flex">
          <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
          <BreadcrumbSeparator />
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>Overview</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>

      <div className="ml-auto flex items-center gap-1.5">
        <SearchField aria-label="Search orders" className="hidden md:flex">
          <Input placeholder="Search orders…" size="sm" className="w-56" />
        </SearchField>
        <Tooltip>
          <Button
            variant="quiet"
            isIconOnly
            aria-label="Search"
            className="md:hidden"
          >
            <SearchIcon />
          </Button>
          <TooltipContent>Search</TooltipContent>
        </Tooltip>
        <Tooltip>
          <Button variant="quiet" isIconOnly aria-label="Notifications">
            <BellIcon />
          </Button>
          <TooltipContent>3 unread alerts</TooltipContent>
        </Tooltip>
        <Menu>
          <Button
            variant="quiet"
            isIconOnly
            className="rounded-full"
            aria-label="Account"
          >
            <Avatar size="sm">
              <AvatarFallback>AR</AvatarFallback>
            </Avatar>
          </Button>
          <Popover placement="bottom end" className="min-w-56">
            <MenuContent>{ACCOUNT_ITEMS}</MenuContent>
          </Popover>
        </Menu>
      </div>
    </header>
  )
}

function KpiCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {KPIS.map((kpi) => (
        <Card key={kpi.label}>
          <CardHeader>
            <CardDescription>{kpi.label}</CardDescription>
            <CardTitle className="text-2xl tracking-tight tabular-nums">
              {kpi.value}
            </CardTitle>
            <CardAction>
              <div className="flex size-8 items-center justify-center rounded-md bg-muted text-fg-muted">
                <kpi.icon className="size-4" />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Badge
              variant={kpi.intent === "positive" ? "success" : "danger"}
              appearance="subtle"
            >
              {kpi.trend === "up" ? <TrendingUpIcon /> : <TrendingDownIcon />}
              {kpi.delta}
            </Badge>
            <span className="text-xs text-pretty text-fg-muted">
              {kpi.caption}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function RevenueChart() {
  const [range, setRange] = React.useState<RangeId>("12m")

  const months = RANGES.find((r) => r.id === range)?.months ?? MONTHLY.length
  const data = MONTHLY.slice(MONTHLY.length - months)
  const total = data.reduce((sum, d) => sum + d.revenue, 0)
  const targetTotal = data.reduce((sum, d) => sum + d.target, 0)
  const overTarget = ((total - targetTotal) / targetTotal) * 100

  // min-w-0: the chart's measured width would otherwise become the grid
  // column's min-content width and widen the page.
  return (
    <Card className="min-w-0 lg:col-span-2">
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <CardDescription>Net of refunds, compared against plan</CardDescription>
        <CardAction>
          <SegmentedControl
            aria-label="Time range"
            selectedKeys={[range]}
            onSelectionChange={(keys) => {
              const next = [...keys][0]
              if (typeof next === "string") setRange(next as RangeId)
            }}
          >
            {RANGES.map((r) => (
              <SegmentedControlItem key={r.id} id={r.id}>
                {r.label}
              </SegmentedControlItem>
            ))}
          </SegmentedControl>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
          <span className="text-3xl font-semibold tracking-tight tabular-nums">
            {currency.format(total)}
          </span>
          <Badge
            variant={overTarget >= 0 ? "success" : "warning"}
            appearance="subtle"
          >
            {overTarget >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
            {overTarget >= 0 ? "+" : ""}
            {overTarget.toFixed(1)}% vs. plan
          </Badge>
        </div>
        <ChartContainer config={chartConfig} className="h-56 w-full">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={8}
              axisLine={false}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.7}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="target"
              type="natural"
              fill="transparent"
              stroke="var(--color-target)"
              strokeDasharray="4 4"
            />
            <Area
              dataKey="revenue"
              type="natural"
              fill="url(#fillRevenue)"
              stroke="var(--color-revenue)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
        <ChartDataTable data={data} config={chartConfig} labelKey="month" />
      </CardContent>
    </Card>
  )
}

function TopProducts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top products</CardTitle>
        <CardDescription>By revenue, last 30 days</CardDescription>
        <CardAction>
          <Menu>
            <Button
              variant="quiet"
              size="sm"
              isIconOnly
              aria-label="Product options"
            >
              <MoreHorizontalIcon />
            </Button>
            <Popover placement="bottom end">
              <MenuContent>
                <MenuItem>
                  <DownloadIcon />
                  Export CSV
                </MenuItem>
                <MenuItem>
                  <BoxesIcon />
                  Manage inventory
                </MenuItem>
              </MenuContent>
            </Popover>
          </Menu>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {TOP_PRODUCTS.map((product) => (
          <div key={product.name} className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-fg-muted">
              <ImageIcon className="size-4" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-sm font-medium">
                  {product.name}
                </span>
                <span className="shrink-0 text-sm tabular-nums">
                  {product.revenue}
                </span>
              </div>
              <ProgressBar
                value={product.share}
                aria-label={`${product.name} share of revenue`}
              >
                <ProgressBarControl />
              </ProgressBar>
              <span className="text-xs text-fg-muted">{product.units}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function OrdersTable({ rows }: { rows: Order[] }) {
  return (
    <TableContainer>
      <Table aria-label="Recent orders">
        <TableHeader>
          <TableColumn isRowHeader>Order</TableColumn>
          <TableColumn>Customer</TableColumn>
          <TableColumn>Channel</TableColumn>
          <TableColumn>Date</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn className="text-right">Total</TableColumn>
        </TableHeader>
        <TableBody
          items={rows}
          renderEmptyState={() => "No orders in this view."}
        >
          {(order) => (
            <TableRow id={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell className="whitespace-nowrap">
                {order.customer}
              </TableCell>
              <TableCell className="text-fg-muted">{order.channel}</TableCell>
              <TableCell className="whitespace-nowrap text-fg-muted">
                {order.date}
              </TableCell>
              <TableCell>
                <Badge
                  appearance="subtle"
                  variant={STATUS_VARIANT[order.status]}
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {order.total}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

function RecentOrders() {
  const [tab, setTab] = React.useState<OrderTabId>("all")
  const [page, setPage] = React.useState(1)

  const filtered = ORDERS.filter(TAB_FILTER[tab])
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, totalPages)
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent orders</CardTitle>
        <CardDescription>
          {ORDERS.length} orders in the last 7 days — {filtered.length} in this
          view
        </CardDescription>
        <CardAction>
          <Button variant="secondary" size="sm" aria-label="Export orders">
            <DownloadIcon />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Tabs
          selectedKey={tab}
          onSelectionChange={(key) => {
            setTab(key as OrderTabId)
            setPage(1)
          }}
        >
          {/* Scrolls instead of widening the card; the padding keeps focus rings
              and the line indicator inside the scroll box. */}
          <div className="-m-1.5 overflow-x-auto p-1.5">
            <TabList
              aria-label="Filter orders"
              variant="line"
              className="w-max"
            >
              {ORDER_TABS.map((t) => (
                <Tab key={t.id} id={t.id}>
                  {t.label}
                </Tab>
              ))}
            </TabList>
          </div>
          {ORDER_TABS.map((t) => (
            <TabPanel key={t.id} id={t.id} className="flex flex-col gap-3 pt-4">
              <OrdersTable rows={rows} />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-fg-muted tabular-nums">
                  Page {current} of {totalPages}
                </p>
                <Pagination>
                  <PaginationList>
                    <PaginationItem>
                      <PaginationPrevious
                        isIconOnly
                        isDisabled={current === 1}
                        onPress={() => setPage(Math.max(1, current - 1))}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <PaginationItem key={p}>
                          <PaginationLink
                            isActive={p === current}
                            aria-label={`Page ${p}`}
                            onPress={() => setPage(p)}
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      ),
                    )}
                    <PaginationItem>
                      <PaginationNext
                        isIconOnly
                        isDisabled={current === totalPages}
                        onPress={() =>
                          setPage(Math.min(totalPages, current + 1))
                        }
                      />
                    </PaginationItem>
                  </PaginationList>
                </Pagination>
              </div>
            </TabPanel>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

/* ---------------------------------- Page ---------------------------------- */

export default function DashboardBlock() {
  return (
    <SidebarProvider className="min-h-screen bg-bg text-fg">
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <main className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="font-heading text-2xl font-semibold tracking-tight">
                Overview
              </h1>
              <p className="text-sm text-fg-muted">
                Store performance for August — updated 6 minutes ago.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" aria-label="Export report">
                <DownloadIcon />
                <span className="hidden sm:inline">Export report</span>
              </Button>
              <Button variant="primary">
                <PlusIcon />
                New order
              </Button>
            </div>
          </div>

          <KpiCards />

          <div className="grid gap-4 lg:grid-cols-3">
            <RevenueChart />
            <TopProducts />
          </div>

          <RecentOrders />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
