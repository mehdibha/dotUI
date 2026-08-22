"use client"

import { type ReactNode, useMemo, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label as PieLabel,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"

import {
  ArrowDownIcon,
  ArrowUpRightIcon,
  AudioLinesIcon,
  BellIcon,
  Building2Icon,
  CheckCircle2Icon,
  ChevronRightIcon,
  CircleDollarSignIcon,
  CreditCardIcon,
  GlobeIcon,
  HeartIcon,
  HomeIcon,
  LayersIcon,
  ListFilterIcon,
  MapIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SendIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  TagIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  UserIcon,
  WalletIcon,
  ZapIcon,
} from "@/registry/icons"
import { Responsive } from "@/registry/lib/responsive"
import { cn } from "@/registry/lib/utils"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/registry/ui/alert"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import type { ChartConfig } from "@/registry/ui/chart"
import {
  ChartContainer,
  ChartDataTable,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/ui/chart"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Drawer } from "@/registry/ui/drawer"
import { Description, Label } from "@/registry/ui/field"
import { Group } from "@/registry/ui/group"
import { Input } from "@/registry/ui/input"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Modal } from "@/registry/ui/modal"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldIncrement,
} from "@/registry/ui/number-field"
import { Popover } from "@/registry/ui/popover"
import { ProgressBar, ProgressBarControl } from "@/registry/ui/progress-bar"
import { SearchField } from "@/registry/ui/search-field"
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
import { Tab, TabList, TabPanel, Tabs } from "@/registry/ui/tabs"
import { Tag, TagGroup, TagList } from "@/registry/ui/tag-group"
import { TextField } from "@/registry/ui/text-field"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

/* --------------------------------- Data ---------------------------------- */

const ACCOUNTS = [
  {
    id: "checking",
    name: "Everyday Checking",
    mask: "•••• 4412",
    icon: WalletIcon,
    balance: 12480.65,
    delta: 2.4,
    caption: "Available now",
    color: "var(--chart-1)",
    series: [
      9.1, 9.6, 10.2, 9.8, 10.9, 11.2, 10.7, 11.6, 11.9, 12.1, 11.8, 12.5,
    ],
  },
  {
    id: "savings",
    name: "High-Yield Savings",
    mask: "•••• 8127",
    icon: Building2Icon,
    balance: 48290.12,
    delta: 0.9,
    caption: "4.35% APY · interest paid monthly",
    color: "var(--chart-2)",
    series: [
      41.2, 42.0, 42.9, 43.5, 44.1, 44.8, 45.4, 46.0, 46.6, 47.2, 47.8, 48.3,
    ],
  },
  {
    id: "credit",
    name: "Platinum Card",
    mask: "•••• 9043",
    icon: CreditCardIcon,
    balance: 1842.3,
    delta: -6.1,
    caption: "Statement closes Sep 2",
    color: "var(--chart-3)",
    limit: 12000,
    series: [2.6, 2.4, 2.9, 2.2, 2.5, 2.1, 2.3, 1.9, 2.2, 2.0, 1.9, 1.8],
  },
] as const

const CASHFLOW = [
  { month: "September", income: 8420, spending: 5310 },
  { month: "October", income: 8420, spending: 6120 },
  { month: "November", income: 9180, spending: 5890 },
  { month: "December", income: 8420, spending: 7340 },
  { month: "January", income: 8420, spending: 4980 },
  { month: "February", income: 8720, spending: 5240 },
  { month: "March", income: 8420, spending: 5610 },
  { month: "April", income: 9060, spending: 5120 },
  { month: "May", income: 8420, spending: 6040 },
  { month: "June", income: 8420, spending: 5480 },
  { month: "July", income: 9310, spending: 6210 },
  { month: "August", income: 8420, spending: 3492 },
]

const cashflowConfig = {
  income: { label: "Income", color: "var(--chart-2)" },
  spending: { label: "Spending", color: "var(--chart-1)" },
} satisfies ChartConfig

const CATEGORY_SPEND = [
  { category: "housing", amount: 1850, fill: "var(--color-housing)" },
  { category: "groceries", amount: 642, fill: "var(--color-groceries)" },
  { category: "dining", amount: 388, fill: "var(--color-dining)" },
  { category: "transport", amount: 214, fill: "var(--color-transport)" },
  { category: "subscriptions", amount: 96, fill: "var(--color-subscriptions)" },
  { category: "travel", amount: 302, fill: "var(--color-travel)" },
]

const categoryConfig = {
  amount: { label: "Spent" },
  housing: { label: "Housing", color: "var(--chart-1)" },
  groceries: { label: "Groceries", color: "var(--chart-2)" },
  dining: { label: "Dining", color: "var(--chart-3)" },
  transport: { label: "Transport", color: "var(--chart-4)" },
  subscriptions: { label: "Subscriptions", color: "var(--chart-5)" },
  travel: { label: "Travel", color: "var(--chart-1)" },
} satisfies ChartConfig

const RANGES = [
  { id: "3m", label: "3M", months: 3 },
  { id: "6m", label: "6M", months: 6 },
  { id: "12m", label: "12M", months: 12 },
] as const

type Transaction = {
  id: string
  merchant: string
  detail: string
  category: string
  categoryId: string
  icon: typeof WalletIcon
  amount: number
  date: string
  status: "Posted" | "Pending" | "Declined"
}

const TRANSACTIONS: Transaction[] = [
  {
    id: "t1",
    merchant: "Northwind Studio",
    detail: "Payroll · direct deposit",
    category: "Income",
    categoryId: "income",
    icon: CircleDollarSignIcon,
    amount: 4210,
    date: "Aug 21",
    status: "Posted",
  },
  {
    id: "t2",
    merchant: "Harborview Apartments",
    detail: "August rent",
    category: "Housing",
    categoryId: "housing",
    icon: HomeIcon,
    amount: -1850,
    date: "Aug 20",
    status: "Posted",
  },
  {
    id: "t3",
    merchant: "Whole Foods Market",
    detail: "Bedford Ave",
    category: "Groceries",
    categoryId: "groceries",
    icon: ShoppingCartIcon,
    amount: -128.44,
    date: "Aug 20",
    status: "Posted",
  },
  {
    id: "t4",
    merchant: "Delta Air Lines",
    detail: "JFK → LIS · seat upgrade",
    category: "Travel",
    categoryId: "travel",
    icon: GlobeIcon,
    amount: -302,
    date: "Aug 19",
    status: "Pending",
  },
  {
    id: "t5",
    merchant: "Blue Bottle Coffee",
    detail: "Williamsburg",
    category: "Dining",
    categoryId: "dining",
    icon: ShoppingBagIcon,
    amount: -18.6,
    date: "Aug 19",
    status: "Posted",
  },
  {
    id: "t6",
    merchant: "Con Edison",
    detail: "Electricity · autopay",
    category: "Utilities",
    categoryId: "utilities",
    icon: ZapIcon,
    amount: -96.18,
    date: "Aug 18",
    status: "Posted",
  },
  {
    id: "t7",
    merchant: "Ada Whitmore",
    detail: "Split · dinner at Lilia",
    category: "Transfer",
    categoryId: "transfer",
    icon: UserIcon,
    amount: 64,
    date: "Aug 18",
    status: "Posted",
  },
  {
    id: "t8",
    merchant: "Figma",
    detail: "Organization seat",
    category: "Software",
    categoryId: "software",
    icon: LayersIcon,
    amount: -45,
    date: "Aug 17",
    status: "Posted",
  },
  {
    id: "t9",
    merchant: "Lyft",
    detail: "Ride · Greenpoint",
    category: "Transport",
    categoryId: "transport",
    icon: MapIcon,
    amount: -23.8,
    date: "Aug 17",
    status: "Posted",
  },
  {
    id: "t10",
    merchant: "Uniqlo",
    detail: "SoHo · card not present",
    category: "Shopping",
    categoryId: "shopping",
    icon: TagIcon,
    amount: -164.5,
    date: "Aug 16",
    status: "Declined",
  },
  {
    id: "t11",
    merchant: "Spotify",
    detail: "Family plan",
    category: "Subscriptions",
    categoryId: "subscriptions",
    icon: AudioLinesIcon,
    amount: -19.99,
    date: "Aug 15",
    status: "Posted",
  },
  {
    id: "t12",
    merchant: "CityMD Urgent Care",
    detail: "Visit copay",
    category: "Health",
    categoryId: "health",
    icon: HeartIcon,
    amount: -75,
    date: "Aug 14",
    status: "Posted",
  },
]

const CATEGORY_FILTERS = [
  { id: "housing", label: "Housing" },
  { id: "groceries", label: "Groceries" },
  { id: "dining", label: "Dining" },
  { id: "travel", label: "Travel" },
  { id: "transport", label: "Transport" },
  { id: "subscriptions", label: "Subscriptions" },
]

const UPCOMING = [
  {
    id: "u1",
    name: "Harborview Apartments",
    detail: "Rent · Sep 1",
    amount: 1850,
    initials: "HA",
  },
  {
    id: "u2",
    name: "Meridian Platinum",
    detail: "Statement due · Sep 12",
    amount: 1842.3,
    initials: "MP",
  },
  {
    id: "u3",
    name: "Empire Health",
    detail: "Premium · Sep 5",
    amount: 312.4,
    initials: "EH",
  },
]

const TABS = [
  { id: "all", label: "All" },
  { id: "income", label: "Income" },
  { id: "expenses", label: "Expenses" },
  { id: "pending", label: "Pending" },
] as const

const currency = (value: number, fractionDigits = 2) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value)

const statusVariant = {
  Posted: "neutral",
  Pending: "warning",
  Declined: "danger",
} as const

/* -------------------------------- Sections -------------------------------- */

function Header() {
  return (
    <header className="sticky top-0 z-20 border-b bg-bg/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-fg-on-primary">
            <WalletIcon className="size-4" />
          </span>
          <span className="font-heading text-base font-semibold tracking-tight">
            Meridian
          </span>
        </div>

        <nav
          aria-label="Main"
          className="ml-4 hidden items-center gap-1 md:flex"
        >
          {["Overview", "Accounts", "Payments", "Cards"].map((item, index) => (
            <Button
              key={item}
              variant="quiet"
              size="sm"
              className={cn(index !== 0 && "text-fg-muted")}
            >
              {item}
            </Button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <SearchField
            aria-label="Search transactions"
            className="hidden w-56 lg:block"
          >
            <Input placeholder="Search transactions" />
          </SearchField>

          <Tooltip>
            <Button variant="quiet" isIconOnly aria-label="Notifications">
              <BellIcon />
            </Button>
            <TooltipContent>3 unread alerts</TooltipContent>
          </Tooltip>

          <Menu>
            <Button variant="quiet" isIconOnly aria-label="Account menu">
              <Avatar className="size-7">
                <AvatarFallback>AH</AvatarFallback>
              </Avatar>
            </Button>
            <Popover>
              <MenuContent>
                <MenuItem>Profile</MenuItem>
                <MenuItem>Security & devices</MenuItem>
                <MenuItem>Statements</MenuItem>
                <MenuItem>Sign out</MenuItem>
              </MenuContent>
            </Popover>
          </Menu>
        </div>
      </div>
    </header>
  )
}

function Sparkline({
  id,
  color,
  series,
}: {
  id: string
  color: string
  series: readonly number[]
}) {
  const config = {
    value: { label: "Balance", color },
  } satisfies ChartConfig
  const data = series.map((value, index) => ({ point: `M${index + 1}`, value }))

  return (
    <ChartContainer
      id={id}
      config={config}
      className="aspect-auto h-12 w-full"
      initialDimension={{ width: 260, height: 48 }}
    >
      <LineChart data={data} margin={{ top: 4, bottom: 4, left: 2, right: 2 }}>
        <YAxis hide domain={["dataMin", "dataMax"]} />
        <Line
          dataKey="value"
          type="natural"
          stroke="var(--color-value)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ChartContainer>
  )
}

function AccountCard({ account }: { account: (typeof ACCOUNTS)[number] }) {
  const Icon = account.icon
  const isUp = account.delta >= 0
  const limit = "limit" in account ? account.limit : null
  const utilization = limit === null ? null : (account.balance / limit) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-fg-muted">
          <span className="flex size-7 items-center justify-center rounded-md bg-muted text-fg">
            <Icon className="size-3.5" />
          </span>
          {account.name}
        </CardTitle>
        <CardAction>
          <Badge
            appearance="subtle"
            variant={isUp ? "success" : "danger"}
            size="sm"
          >
            {isUp ? (
              <TrendingUpIcon aria-hidden />
            ) : (
              <TrendingDownIcon aria-hidden />
            )}
            {isUp ? "+" : ""}
            {account.delta.toFixed(1)}%
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-2xl font-semibold tracking-tight tabular-nums">
            {currency(account.balance)}
          </p>
          <p className="text-xs text-fg-muted">{account.mask}</p>
        </div>
        <Sparkline
          id={`spark-${account.id}`}
          color={account.color}
          series={account.series}
        />
        {utilization !== null && limit !== null ? (
          <ProgressBar
            value={utilization}
            aria-label={`${account.name} credit used`}
            className="gap-1.5"
          >
            <ProgressBarControl />
            <p className="text-xs text-fg-muted">
              {utilization.toFixed(0)}% of {currency(limit, 0)} limit used
            </p>
          </ProgressBar>
        ) : (
          <p className="text-xs text-fg-muted">{account.caption}</p>
        )}
      </CardContent>
    </Card>
  )
}

function QuickActions({
  onTransfer,
}: {
  onTransfer: (summary: string) => void
}) {
  return (
    <Card>
      <CardContent className="flex flex-wrap items-center gap-2">
        <TransferDialog
          onDone={onTransfer}
          trigger={
            <Button variant="primary" className="flex-1 sm:flex-none">
              <SendIcon />
              Send
            </Button>
          }
        />
        <Button className="flex-1 sm:flex-none">
          <ArrowDownIcon />
          Request
        </Button>
        <Button className="flex-1 sm:flex-none">
          <PlusIcon />
          Top up
        </Button>
        <Separator orientation="vertical" className="hidden h-6 sm:block" />
        <Menu>
          <Button variant="quiet" isIconOnly aria-label="More actions">
            <MoreHorizontalIcon />
          </Button>
          <Popover>
            <MenuContent>
              <MenuItem>Pay a bill</MenuItem>
              <MenuItem>Deposit a check</MenuItem>
              <MenuItem>Wire transfer</MenuItem>
              <MenuItem>Freeze card</MenuItem>
            </MenuContent>
          </Popover>
        </Menu>
      </CardContent>
    </Card>
  )
}

function CashflowCard() {
  const [range, setRange] = useState<string>("6m")

  const months = RANGES.find((r) => r.id === range)?.months ?? 6
  const data = CASHFLOW.slice(CASHFLOW.length - months)
  const spent = data.reduce((sum, row) => sum + row.spending, 0)
  const earned = data.reduce((sum, row) => sum + row.income, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash flow</CardTitle>
        <CardDescription>Income against spending, per month</CardDescription>
        <CardAction>
          <SegmentedControl
            aria-label="Date range"
            selectedKeys={[range]}
            onSelectionChange={(keys) => {
              const next = [...keys][0]
              if (typeof next === "string") setRange(next)
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
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="text-xs tracking-wide text-fg-muted uppercase">In</p>
            <p className="text-xl font-semibold tabular-nums">
              {currency(earned, 0)}
            </p>
          </div>
          <div>
            <p className="text-xs tracking-wide text-fg-muted uppercase">Out</p>
            <p className="text-xl font-semibold tabular-nums">
              {currency(spent, 0)}
            </p>
          </div>
          <div>
            <p className="text-xs tracking-wide text-fg-muted uppercase">Net</p>
            <p className="text-xl font-semibold text-fg-success tabular-nums">
              +{currency(earned - spent, 0)}
            </p>
          </div>
        </div>
        <ChartContainer
          config={cashflowConfig}
          className="aspect-auto h-56 w-full"
        >
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
            <Bar dataKey="spending" fill="var(--color-spending)" radius={4} />
          </BarChart>
        </ChartContainer>
        <ChartDataTable
          data={data}
          config={cashflowConfig}
          labelKey="month"
          caption="Monthly income and spending"
        />
      </CardContent>
    </Card>
  )
}

function CategoriesCard() {
  const total = useMemo(
    () => CATEGORY_SPEND.reduce((sum, row) => sum + row.amount, 0),
    [],
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending breakdown</CardTitle>
        <CardDescription>August, across all accounts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ChartContainer
          config={categoryConfig}
          className="mx-auto aspect-square h-52"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={CATEGORY_SPEND}
              dataKey="amount"
              nameKey="category"
              innerRadius={58}
              strokeWidth={4}
            >
              <PieLabel
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-fg text-xl font-semibold"
                        >
                          {currency(total, 0)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 20}
                          className="fill-fg-muted text-xs"
                        >
                          spent
                        </tspan>
                      </text>
                    )
                  }
                  return <text />
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <ul className="space-y-2">
          {CATEGORY_SPEND.map((row) => (
            <li key={row.category} className="flex items-center gap-2 text-sm">
              <span
                aria-hidden
                className="size-2.5 shrink-0 rounded-full"
                style={{ background: row.fill }}
              />
              <span className="truncate">
                {
                  categoryConfig[row.category as keyof typeof categoryConfig]
                    .label
                }
              </span>
              <span className="ml-auto shrink-0 text-fg-muted tabular-nums">
                {currency(row.amount, 0)}
              </span>
            </li>
          ))}
        </ul>
        <ChartDataTable
          data={CATEGORY_SPEND}
          config={categoryConfig}
          labelKey="category"
          caption="Spending by category in August"
        />
      </CardContent>
      <CardFooter>
        <Button variant="quiet" size="sm" className="text-fg-muted">
          Set category budgets
          <ChevronRightIcon />
        </Button>
      </CardFooter>
    </Card>
  )
}

function TransactionsTable({ rows }: { rows: Transaction[] }) {
  return (
    <TableContainer className="max-h-112">
      <Table aria-label="Recent transactions">
        <TableHeader>
          <TableColumn id="merchant" isRowHeader>
            Merchant
          </TableColumn>
          <TableColumn id="category">Category</TableColumn>
          <TableColumn id="date">Date</TableColumn>
          <TableColumn id="amount" className="text-right">
            Amount
          </TableColumn>
        </TableHeader>
        <TableBody
          renderEmptyState={() => (
            <span className="text-fg-muted">
              No transactions match these filters.
            </span>
          )}
        >
          {rows.map((row) => {
            const Icon = row.icon
            const isCredit = row.amount > 0
            return (
              <TableRow key={row.id} id={row.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-fg-muted">
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{row.merchant}</p>
                      <p className="truncate text-xs text-fg-muted">
                        {row.detail}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Badge appearance="subtle" variant="neutral" size="sm">
                      {row.category}
                    </Badge>
                    {row.status !== "Posted" && (
                      <Badge
                        appearance="subtle"
                        variant={statusVariant[row.status]}
                        size="sm"
                      >
                        {row.status}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap text-fg-muted">
                  {row.date}
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right font-medium tabular-nums",
                    isCredit && "text-fg-success",
                    row.status === "Declined" && "text-fg-danger line-through",
                  )}
                >
                  {isCredit ? "+" : ""}
                  {currency(row.amount)}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

function TransactionsCard() {
  const [query, setQuery] = useState("")
  const [categories, setCategories] = useState<string[]>([])

  const filterFor = (tab: string) =>
    TRANSACTIONS.filter((row) => {
      if (tab === "income" && row.amount <= 0) return false
      if (tab === "expenses" && row.amount > 0) return false
      if (tab === "pending" && row.status === "Posted") return false
      if (categories.length > 0 && !categories.includes(row.categoryId)) {
        return false
      }
      const q = query.trim().toLowerCase()
      if (!q) return true
      return (
        row.merchant.toLowerCase().includes(q) ||
        row.category.toLowerCase().includes(q)
      )
    })

  return (
    // min-w-0 keeps the wide table scrolling inside the card instead of
    // stretching the grid column past the viewport.
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle className="truncate">Transactions</CardTitle>
        <CardDescription>Last 30 days across every account</CardDescription>
        <CardAction>
          <Menu>
            <Button variant="quiet" isIconOnly aria-label="Transaction options">
              <ListFilterIcon />
            </Button>
            <Popover>
              <MenuContent>
                <MenuItem>Export as CSV</MenuItem>
                <MenuItem>Download statement</MenuItem>
                <MenuItem>Manage categories</MenuItem>
              </MenuContent>
            </Popover>
          </Menu>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <TabList aria-label="Transaction filter">
              {TABS.map((tab) => (
                <Tab key={tab.id} id={tab.id}>
                  {tab.label}
                </Tab>
              ))}
            </TabList>
            <SearchField
              aria-label="Search transactions"
              value={query}
              onChange={setQuery}
              className="sm:w-56"
            >
              <Input placeholder="Search merchant" />
            </SearchField>
          </div>

          {/* The filter tags live inside the panel: Tabs renders its direct
              children in a hidden collection pass, which breaks nested collections. */}
          {TABS.map((tab) => (
            <TabPanel key={tab.id} id={tab.id} className="space-y-3 pt-4">
              <TagGroup
                selectionMode="multiple"
                selectedKeys={new Set(categories)}
                onSelectionChange={(keys) =>
                  setCategories(
                    keys === "all"
                      ? CATEGORY_FILTERS.map((c) => c.id)
                      : [...keys].map(String),
                  )
                }
              >
                <Label className="sr-only">Filter by category</Label>
                <TagList>
                  {CATEGORY_FILTERS.map((category) => (
                    <Tag key={category.id} id={category.id}>
                      {category.label}
                    </Tag>
                  ))}
                </TagList>
              </TagGroup>
              <TransactionsTable rows={filterFor(tab.id)} />
            </TabPanel>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

function UpcomingCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scheduled payments</CardTitle>
        <CardDescription>Next 30 days</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {UPCOMING.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{item.initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{item.name}</p>
              <p className="truncate text-xs text-fg-muted">{item.detail}</p>
            </div>
            <span className="shrink-0 text-sm font-medium tabular-nums">
              {currency(item.amount)}
            </span>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-3">
        <Separator />
        <ProgressBar value={64}>
          <div className="flex items-center justify-between gap-2 text-sm">
            <Label>Vacation fund</Label>
            <span className="text-fg-muted tabular-nums">$3,200 / $5,000</span>
          </div>
          <ProgressBarControl />
        </ProgressBar>
      </CardFooter>
    </Card>
  )
}

/* ----------------------------- Transfer dialog ---------------------------- */

const TRANSFER_ACCOUNTS = [
  { id: "checking", label: "Everyday Checking •••• 4412" },
  { id: "savings", label: "High-Yield Savings •••• 8127" },
  { id: "credit", label: "Platinum Card •••• 9043" },
  { id: "brokerage", label: "Meridian Invest •••• 2205" },
]

function TransferDialog({
  trigger,
  onDone,
}: {
  trigger: ReactNode
  onDone: (summary: string) => void
}) {
  const [isOpen, setOpen] = useState(false)
  const [from, setFrom] = useState("checking")
  const [to, setTo] = useState("savings")
  const [amount, setAmount] = useState(750)
  const [frequency, setFrequency] = useState("once")

  const submit = () => {
    const target =
      TRANSFER_ACCOUNTS.find((a) => a.id === to)?.label ?? "account"
    onDone(`${currency(amount)} to ${target}`)
    setOpen(false)
  }

  return (
    <Dialog isOpen={isOpen} onOpenChange={setOpen}>
      {trigger}
      <Responsive
        render={(isMobile) => {
          const content = (
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Move money</DialogTitle>
                <DialogDescription>
                  Internal transfers settle instantly, any day of the week.
                </DialogDescription>
              </DialogHeader>
              <DialogBody className="space-y-4">
                <Select
                  value={from}
                  onChange={(key) => setFrom(String(key))}
                  className="w-full"
                >
                  <Label>From</Label>
                  <SelectTrigger className="w-full" />
                  <SelectContent>
                    {TRANSFER_ACCOUNTS.map((account) => (
                      <SelectItem key={account.id} id={account.id}>
                        {account.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={to}
                  onChange={(key) => setTo(String(key))}
                  className="w-full"
                >
                  <Label>To</Label>
                  <SelectTrigger className="w-full" />
                  <SelectContent>
                    {TRANSFER_ACCOUNTS.map((account) => (
                      <SelectItem key={account.id} id={account.id}>
                        {account.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <NumberField
                  value={amount}
                  onChange={setAmount}
                  minValue={0}
                  step={50}
                  formatOptions={{ style: "currency", currency: "USD" }}
                >
                  <Label>Amount</Label>
                  <Group>
                    <NumberFieldDecrement />
                    <Input />
                    <NumberFieldIncrement />
                  </Group>
                  <Description>
                    Everyday Checking has {currency(12480.65)} available.
                  </Description>
                </NumberField>

                <div className="space-y-1.5">
                  <Label className="block">Frequency</Label>
                  <SegmentedControl
                    aria-label="Transfer frequency"
                    selectedKeys={[frequency]}
                    onSelectionChange={(keys) => {
                      const next = [...keys][0]
                      if (typeof next === "string") setFrequency(next)
                    }}
                  >
                    <SegmentedControlItem id="once">Once</SegmentedControlItem>
                    <SegmentedControlItem id="weekly">
                      Weekly
                    </SegmentedControlItem>
                    <SegmentedControlItem id="monthly">
                      Monthly
                    </SegmentedControlItem>
                  </SegmentedControl>
                </div>

                <TextField className="w-full">
                  <Label>Note</Label>
                  <Input placeholder="Rainy day fund" className="w-full" />
                </TextField>
              </DialogBody>
              <DialogFooter>
                <Button slot="close">Cancel</Button>
                <Button variant="primary" onPress={submit}>
                  <SendIcon />
                  Transfer {currency(amount, 0)}
                </Button>
              </DialogFooter>
            </DialogContent>
          )
          return isMobile ? (
            <Drawer>{content}</Drawer>
          ) : (
            <Modal>{content}</Modal>
          )
        }}
      />
    </Dialog>
  )
}

/* ---------------------------------- Page ---------------------------------- */

export default function BankingBlock() {
  const [receipt, setReceipt] = useState<string | null>(null)

  const total = ACCOUNTS.reduce(
    (sum, account) =>
      account.id === "credit" ? sum - account.balance : sum + account.balance,
    0,
  )

  return (
    <div className="min-h-screen bg-bg text-fg">
      <Header />

      <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {receipt && (
          <Alert variant="success">
            <CheckCircle2Icon />
            <AlertTitle>Transfer scheduled</AlertTitle>
            <AlertDescription>
              {receipt} — funds land in a few seconds.
            </AlertDescription>
            <AlertAction>
              <Button size="sm" onPress={() => setReceipt(null)}>
                Dismiss
              </Button>
            </AlertAction>
          </Alert>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-fg-muted">Good morning, Amelia</p>
            <h1 className="font-heading text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
              {currency(total)}
            </h1>
            <p className="pt-1 text-sm text-fg-muted">
              Net worth across 3 accounts · updated 2 minutes ago
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button>
              <ArrowUpRightIcon />
              Pay someone
            </Button>
            <TransferDialog
              onDone={setReceipt}
              trigger={
                <Button variant="primary">
                  <SendIcon />
                  Transfer
                </Button>
              }
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ACCOUNTS.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>

        <QuickActions onTransfer={setReceipt} />

        <div className="grid items-start gap-4 lg:grid-cols-[1.6fr_1fr]">
          <CashflowCard />
          <CategoriesCard />
        </div>

        <div className="grid items-start gap-4 lg:grid-cols-[1.6fr_1fr]">
          <TransactionsCard />
          <UpcomingCard />
        </div>

        <footer className="flex flex-col gap-2 border-t pt-6 pb-2 text-xs text-fg-muted sm:flex-row sm:items-center sm:justify-between">
          <span>
            Meridian Bank · Member FDIC · Deposits insured to $250,000
          </span>
          <span>Statements · Disclosures · Help center</span>
        </footer>
      </main>
    </div>
  )
}
