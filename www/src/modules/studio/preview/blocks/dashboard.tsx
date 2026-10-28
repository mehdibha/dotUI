import { useState } from "react"
import type { ReactNode } from "react"
import type { ChartValue } from "@tanstack/charts"

import {
  ArrowUpRightIcon,
  BellIcon,
  BoxesIcon,
  Building2Icon,
  ChevronDownIcon,
  ChevronsUpDownIcon,
  CodeIcon,
  CreditCardIcon,
  FileTextIcon,
  HelpCircleIcon,
  HomeIcon,
  LayersIcon,
  ListIcon,
  PlusIcon,
  SettingsIcon,
  ShoppingBagIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  Users2Icon,
  WalletIcon,
} from "@/registry/icons"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Card } from "@/registry/ui/card"
import { LineChart } from "@/registry/ui/chart-line"
import { Link } from "@/registry/ui/link"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSection,
  MenuSectionHeader,
} from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"
import { SearchField } from "@/registry/ui/search-field"
import { Separator } from "@/registry/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/registry/ui/sidebar"
import { Switch, SwitchControl, SwitchIndicator } from "@/registry/ui/switch"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"
import { BrandMark, BrandName } from "@/modules/studio/assets/brand"

import { formatMoney } from "./shared"

// A Stripe-style dashboard home: today's volume against yesterday with the
// balance beside it, then an overview of metric cards, each with its value,
// the previous period, a change badge and a small chart of both periods.

const HOURS = [
  "12 AM",
  "1 AM",
  "2 AM",
  "3 AM",
  "4 AM",
  "5 AM",
  "6 AM",
  "7 AM",
  "8 AM",
  "9 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "1 PM",
  "2 PM",
  "3 PM",
  "4 PM",
  "5 PM",
  "6 PM",
  "7 PM",
  "8 PM",
  "9 PM",
  "10 PM",
  "11 PM",
]

// Cumulative gross volume by hour. Today stops at the current hour.
const YESTERDAY = [
  120, 180, 210, 240, 260, 300, 420, 690, 1180, 1820, 2540, 3310, 4020, 4790,
  5480, 6210, 6950, 7610, 8240, 8870, 9420, 9880, 10240, 10530,
]
const TODAY = [
  140, 230, 260, 310, 340, 390, 560, 910, 1490, 2310, 3220, 4130, 5060, 5940,
  6880, 7720,
]

const TODAY_SERIES = HOURS.map((hour, index) => ({
  hour,
  today: TODAY[index] ?? null,
  yesterday: YESTERDAY[index],
}))

const DAYS = [
  "Oct 22",
  "Oct 23",
  "Oct 24",
  "Oct 25",
  "Oct 26",
  "Oct 27",
  "Oct 28",
]

interface Metric {
  id: string
  label: string
  current: number[]
  previous: number[]
  format: (value: number) => string
  // Whether a rise is good news: failed payments falling is a win.
  higherIsBetter: boolean
}

const money = (value: number) => formatMoney(value, { digits: 0 })
const count = (value: number) => value.toLocaleString("en-US")

const METRICS: Metric[] = [
  {
    id: "gross",
    label: "Gross volume",
    current: [9820, 10440, 11280, 8960, 7410, 10930, 12650],
    previous: [8710, 9120, 9800, 8350, 7030, 9480, 10210],
    format: money,
    higherIsBetter: true,
  },
  {
    id: "net",
    label: "Net volume from sales",
    current: [9310, 9880, 10690, 8470, 7020, 10360, 11990],
    previous: [8240, 8650, 9310, 7910, 6650, 8990, 9700],
    format: money,
    higherIsBetter: true,
  },
  {
    id: "customers",
    label: "New customers",
    current: [41, 47, 52, 38, 29, 49, 58],
    previous: [37, 39, 44, 36, 31, 42, 45],
    format: count,
    higherIsBetter: true,
  },
  {
    id: "payments",
    label: "Successful payments",
    current: [212, 228, 247, 196, 161, 239, 276],
    previous: [190, 201, 216, 183, 155, 207, 223],
    format: count,
    higherIsBetter: true,
  },
  {
    id: "spend",
    label: "Spend per customer",
    current: [45, 46, 47, 46, 45, 47, 48],
    previous: [44, 45, 45, 46, 45, 46, 46],
    format: money,
    higherIsBetter: true,
  },
  {
    id: "failed",
    label: "Failed payments",
    current: [9, 7, 8, 6, 4, 6, 5],
    previous: [11, 10, 12, 9, 7, 10, 9],
    format: count,
    higherIsBetter: false,
  },
]

const RANGES = [
  { id: "7d", label: "Last 7 days" },
  { id: "4w", label: "Last 4 weeks" },
  { id: "3m", label: "Last 3 months" },
  { id: "12m", label: "Last 12 months" },
]

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0)
// Only the day's quarters get a label; every hour would crowd the axis.
const formatHour = (value: ChartValue) =>
  ["12 AM", "6 AM", "12 PM", "6 PM", "11 PM"].includes(String(value))
    ? String(value)
    : ""
const formatCompactMoney = (value: ChartValue) =>
  `$${Intl.NumberFormat("en-US", { notation: "compact" }).format(Number(value))}`

function metricTotal(metric: Metric, values: number[]) {
  return metric.id === "spend" ? (values.at(-1) ?? 0) : sum(values)
}

function MetricCard({ metric }: { metric: Metric }) {
  const current = metricTotal(metric, metric.current)
  const previous = metricTotal(metric, metric.previous)
  const change = previous ? ((current - previous) / previous) * 100 : 0
  const isUp = change >= 0
  const isGood = isUp === metric.higherIsBetter
  const data = DAYS.map((day, index) => ({
    day,
    value: metric.current[index],
  }))

  return (
    <Card className="gap-0 py-0">
      <div className="flex flex-col gap-1 px-5 pt-5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium compact:text-xs">
            {metric.label}
          </span>
          {Math.abs(change) >= 0.5 && (
            <Badge size="sm" variant={isGood ? "success" : "danger"}>
              {isUp ? <TrendingUpIcon /> : <TrendingDownIcon />}
              {Math.abs(change).toFixed(1)}%
            </Badge>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="figure text-xl">{metric.format(current)}</span>
          <span className="text-sm text-fg-muted tabular-nums compact:text-xs">
            {metric.format(previous)}
          </span>
        </div>
      </div>
      <div className="px-3 pt-2">
        <LineChart
          data={data}
          x="day"
          y="value"
          labels={{ value: metric.label }}
          axes={false}
          grid={false}
          curve="linear"
          strokeWidth={1.5}
          height={88}
          ariaLabel={`${metric.label}, last 7 days`}
        />
      </div>
      <div className="flex items-center justify-between px-5 pt-1 pb-4 text-xs text-fg-muted">
        <span>
          {DAYS[0]} – {DAYS.at(-1)}
        </span>
        <Link href="#" className="text-xs">
          More details
        </Link>
      </div>
    </Card>
  )
}

function TodaySection() {
  const today = TODAY.at(-1) ?? 0
  const yesterday = YESTERDAY[TODAY.length - 1] ?? 0

  return (
    <section className="flex flex-col gap-6 lg:flex-row">
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <h2 className="font-heading text-xl font-medium">Today</h2>
        <div className="flex flex-wrap gap-x-10 gap-y-3">
          <div className="flex flex-col gap-0.5">
            <Menu>
              <Button
                variant="quiet"
                size="sm"
                className="-ml-2 w-fit text-fg-muted"
              >
                Gross volume
                <ChevronDownIcon />
              </Button>
              <Popover placement="bottom start">
                <MenuContent
                  selectionMode="single"
                  defaultSelectedKeys={["gross"]}
                  className="min-w-52"
                >
                  <MenuItem id="gross">Gross volume</MenuItem>
                  <MenuItem id="net">Net volume</MenuItem>
                  <MenuItem id="payments">Successful payments</MenuItem>
                </MenuContent>
              </Popover>
            </Menu>
            <span className="figure text-2xl">{money(today)}</span>
            <span className="text-xs text-fg-muted">4:12 PM</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="flex h-8 items-center text-sm text-fg-muted compact:text-xs">
              Yesterday
            </span>
            <span className="figure text-2xl text-fg-muted">
              {money(yesterday)}
            </span>
          </div>
        </div>
        <LineChart
          data={TODAY_SERIES}
          x="hour"
          y={["today", "yesterday"]}
          labels={{ today: "Today", yesterday: "Yesterday" }}
          axes="x"
          grid={false}
          height={180}
          formatX={formatHour}
          formatY={formatCompactMoney}
          ariaLabel="Gross volume by hour, today against yesterday"
        />
      </div>

      <div className="flex w-full shrink-0 flex-col gap-5 lg:w-64 lg:border-l lg:pl-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-sm text-fg-muted compact:text-xs">
            USD balance
            <Link href="#" className="text-sm compact:text-xs">
              View
            </Link>
          </div>
          <span className="figure text-xl">{formatMoney(48210.37)}</span>
          <span className="text-xs text-fg-muted">
            {formatMoney(6140.12)} incoming
          </span>
        </div>
        <Separator />
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-sm text-fg-muted compact:text-xs">
            Payouts
            <Link href="#" className="text-sm compact:text-xs">
              View
            </Link>
          </div>
          <span className="figure text-xl">{formatMoney(12480)}</span>
          <span className="text-xs text-fg-muted">Expected Oct 30</span>
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <span className="text-sm text-fg-muted compact:text-xs">
            Recommendations
          </span>
          <Link
            href="#"
            className="flex items-start gap-2 text-sm text-pretty compact:text-xs"
          >
            Turn on card retries to recover failed renewals
            <ArrowUpRightIcon className="mt-0.5 size-3.5 shrink-0" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function OverviewSection() {
  const [range, setRange] = useState("7d")
  const rangeLabel = RANGES.find((r) => r.id === range)?.label

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="mr-auto font-heading text-xl font-medium">
          Your overview
        </h2>
        <Button variant="secondary" size="sm">
          <PlusIcon />
          Add
        </Button>
        <Button variant="secondary" size="sm">
          Edit
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm compact:text-xs">
        <Menu>
          <Button variant="secondary" size="sm">
            <span className="text-fg-muted">Date range</span>
            {rangeLabel}
            <ChevronDownIcon />
          </Button>
          <Popover placement="bottom start">
            <MenuContent
              selectionMode="single"
              selectedKeys={[range]}
              onAction={(key) => setRange(String(key))}
              className="min-w-48"
            >
              {RANGES.map((r) => (
                <MenuItem key={r.id} id={r.id}>
                  {r.label}
                </MenuItem>
              ))}
            </MenuContent>
          </Popover>
        </Menu>
        <Button variant="secondary" size="sm">
          Daily
          <ChevronDownIcon />
        </Button>
        <span className="text-fg-muted">compared to</span>
        <Button variant="secondary" size="sm">
          Previous period
          <ChevronDownIcon />
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {METRICS.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>
    </section>
  )
}

function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Menu>
              <SidebarMenuButton size="lg" tooltip="Northwind">
                <BrandMark className="size-7">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-(--studio-radius-item) bg-primary text-xs font-semibold text-fg-on-primary">
                    N
                  </span>
                </BrandMark>
                <span className="truncate font-medium text-fg">
                  <BrandName>Northwind</BrandName>
                </span>
                <ChevronsUpDownIcon className="ml-auto" />
              </SidebarMenuButton>
              <Popover placement="bottom start" className="w-(--trigger-width)">
                <MenuContent>
                  <MenuSection>
                    <MenuSectionHeader>Accounts</MenuSectionHeader>
                    <MenuItem>
                      <Building2Icon />
                      Northwind
                    </MenuItem>
                    <MenuItem>
                      <Building2Icon />
                      Northwind Europe
                    </MenuItem>
                  </MenuSection>
                  <Separator />
                  <MenuItem>
                    <PlusIcon />
                    New account
                  </MenuItem>
                </MenuContent>
              </Popover>
            </Menu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {[
              { icon: HomeIcon, label: "Home", active: true },
              { icon: WalletIcon, label: "Balances" },
              { icon: ListIcon, label: "Transactions" },
              { icon: Users2Icon, label: "Customers" },
              { icon: ShoppingBagIcon, label: "Product catalog" },
            ].map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton tooltip={item.label} isActive={item.active}>
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Shortcuts</SidebarGroupLabel>
          <SidebarMenu>
            {[
              { icon: FileTextIcon, label: "Invoices" },
              { icon: CreditCardIcon, label: "Payment links" },
            ].map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton tooltip={item.label}>
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Products</SidebarGroupLabel>
          <SidebarMenu>
            {[
              { icon: CreditCardIcon, label: "Payments" },
              { icon: LayersIcon, label: "Billing" },
              { icon: BoxesIcon, label: "Connect" },
              { icon: FileTextIcon, label: "Reporting" },
            ].map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton tooltip={item.label}>
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Developers">
              <CodeIcon />
              <span>Developers</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
            <Switch className="w-full justify-between px-2 py-1.5 text-sm compact:text-xs">
              Test mode
              <SwitchControl>
                <SwitchIndicator />
              </SwitchControl>
            </Switch>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

function TopbarIcon({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <Tooltip>
      <Button variant="quiet" size="sm" isIconOnly aria-label={label}>
        {children}
      </Button>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

export default function DashboardBlock() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <SidebarProvider className="h-svh min-h-svh">
        <AppSidebar />
        <SidebarInset className="flex h-svh min-h-0 flex-col overflow-hidden">
          <header className="flex h-14 shrink-0 items-center gap-2 px-4 sm:px-8">
            <SidebarTrigger className="-ml-2" />
            <SearchField
              aria-label="Search"
              placeholder="Search"
              className="w-full max-w-80"
            />
            <div className="ml-auto flex items-center gap-1">
              <TopbarIcon label="Help">
                <HelpCircleIcon />
              </TopbarIcon>
              <TopbarIcon label="Notifications">
                <BellIcon />
              </TopbarIcon>
              <TopbarIcon label="Settings">
                <SettingsIcon />
              </TopbarIcon>
              <Menu>
                <Button
                  variant="primary"
                  size="sm"
                  isIconOnly
                  aria-label="Create"
                >
                  <PlusIcon />
                </Button>
                <Popover placement="bottom end">
                  <MenuContent className="min-w-48">
                    <MenuSection>
                      <MenuSectionHeader>Create</MenuSectionHeader>
                      <MenuItem>Payment</MenuItem>
                      <MenuItem>Invoice</MenuItem>
                      <MenuItem>Customer</MenuItem>
                      <MenuItem>Product</MenuItem>
                    </MenuSection>
                  </MenuContent>
                </Popover>
              </Menu>
            </div>
          </header>
          <main className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pt-6 pb-12 sm:px-8">
              <TodaySection />
              <OverviewSection />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
