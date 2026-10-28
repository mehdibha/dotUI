import { useState } from "react"
import type { ReactNode } from "react"
import type { ChartValue } from "@tanstack/charts"

import {
  ArrowDownIcon,
  ArrowUpIcon,
  BellIcon,
  Building2Icon,
  CalculatorIcon,
  CameraIcon,
  ChevronsUpDownIcon,
  CircleCheckIcon,
  CreditCardIcon,
  DownloadIcon,
  HelpCircleIcon,
  HomeIcon,
  ListIcon,
  PaperclipIcon,
  PlusIcon,
  RefreshCwIcon,
  SendIcon,
  SettingsIcon,
  TrendingUpIcon,
  UploadIcon,
  WalletIcon,
  XIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Card } from "@/registry/ui/card"
import { LineChart } from "@/registry/ui/chart-line"
import { Label } from "@/registry/ui/field"
import { TextArea } from "@/registry/ui/input"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSection,
  MenuSectionHeader,
} from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"
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
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
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
import { TextField } from "@/registry/ui/text-field"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"
import { BrandMark, BrandName } from "@/modules/studio/assets/brand"

import { formatMoney, initials } from "./shared"

// A Mercury-style banking home: the total balance over time, the accounts
// that make it up, and recent transactions that filter by account and
// direction and open into a detail panel with status, category and receipt.

type AccountId = "checking" | "savings" | "treasury"

const ACCOUNTS: {
  id: AccountId
  name: string
  mask?: string
  balance: number
  icon: typeof WalletIcon
  yield?: string
}[] = [
  {
    id: "checking",
    name: "Checking",
    mask: "4821",
    balance: 412_908.34,
    icon: WalletIcon,
  },
  {
    id: "savings",
    name: "Savings",
    mask: "0921",
    balance: 250_000,
    icon: Building2Icon,
  },
  {
    id: "treasury",
    name: "Treasury",
    balance: 1_180_442.9,
    icon: TrendingUpIcon,
    yield: "4.12% yield",
  },
]

const TOTAL = ACCOUNTS.reduce((sum, a) => sum + a.balance, 0)

type Method = "ACH" | "Wire" | "Card" | "Transfer"
type Category =
  | "Software"
  | "Payroll"
  | "Revenue"
  | "Office"
  | "Travel"
  | "Advertising"
  | "Interest"
  | "Transfer"

interface Transaction {
  id: string
  date: string
  counterparty: string
  amount: number
  account: AccountId
  method: Method
  card?: string
  category: Category
  pending?: boolean
  receipt?: string
}

const TRANSACTIONS: Transaction[] = [
  {
    id: "t1",
    date: "Oct 28",
    counterparty: "Figma",
    amount: -1_440,
    account: "checking",
    method: "Card",
    card: "0432",
    category: "Software",
    pending: true,
  },
  {
    id: "t2",
    date: "Oct 28",
    counterparty: "Acme Logistics",
    amount: 48_200,
    account: "checking",
    method: "Wire",
    category: "Revenue",
  },
  {
    id: "t3",
    date: "Oct 27",
    counterparty: "Gusto",
    amount: -86_412.55,
    account: "checking",
    method: "ACH",
    category: "Payroll",
    receipt: "gusto-payroll-oct.pdf",
  },
  {
    id: "t4",
    date: "Oct 27",
    counterparty: "Amazon Web Services",
    amount: -7_918.22,
    account: "checking",
    method: "Card",
    card: "0432",
    category: "Software",
    receipt: "aws-invoice-2210.pdf",
  },
  {
    id: "t5",
    date: "Oct 26",
    counterparty: "Treasury",
    amount: 4_018.77,
    account: "treasury",
    method: "Transfer",
    category: "Interest",
  },
  {
    id: "t6",
    date: "Oct 25",
    counterparty: "Brightline Studio",
    amount: 12_500,
    account: "checking",
    method: "ACH",
    category: "Revenue",
  },
  {
    id: "t7",
    date: "Oct 24",
    counterparty: "WeWork",
    amount: -6_300,
    account: "checking",
    method: "ACH",
    category: "Office",
    receipt: "wework-nov.pdf",
  },
  {
    id: "t8",
    date: "Oct 24",
    counterparty: "Savings",
    amount: -50_000,
    account: "checking",
    method: "Transfer",
    category: "Transfer",
  },
  {
    id: "t9",
    date: "Oct 24",
    counterparty: "Checking",
    amount: 50_000,
    account: "savings",
    method: "Transfer",
    category: "Transfer",
  },
  {
    id: "t10",
    date: "Oct 23",
    counterparty: "Delta Air Lines",
    amount: -1_286.4,
    account: "checking",
    method: "Card",
    card: "7719",
    category: "Travel",
  },
  {
    id: "t11",
    date: "Oct 22",
    counterparty: "LinkedIn Ads",
    amount: -3_750,
    account: "checking",
    method: "Card",
    card: "0432",
    category: "Advertising",
  },
  {
    id: "t12",
    date: "Oct 21",
    counterparty: "Northstar Health",
    amount: 26_000,
    account: "checking",
    method: "Wire",
    category: "Revenue",
  },
  {
    id: "t13",
    date: "Oct 20",
    counterparty: "Linear",
    amount: -640,
    account: "checking",
    method: "Card",
    card: "0432",
    category: "Software",
    receipt: "linear-oct.pdf",
  },
]

const SCHEDULED = [
  { name: "Payroll · Gusto", when: "Nov 1 · from Checking", amount: 86_412.55 },
  { name: "Rent · WeWork", when: "Nov 3 · from Checking", amount: 6_300 },
]

const CATEGORIES: Category[] = [
  "Software",
  "Payroll",
  "Revenue",
  "Office",
  "Travel",
  "Advertising",
  "Interest",
  "Transfer",
]

// Deterministic: the same curve on every render and every load.
function seeded(seed: number) {
  let value = seed
  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

const RANGES = {
  "1m": { label: "Last 30 days", days: 30, step: 1 },
  "3m": { label: "Last 3 months", days: 90, step: 3 },
  "1y": { label: "Last 12 months", days: 360, step: 12 },
} as const
type Range = keyof typeof RANGES

function balanceSeries(range: Range) {
  const { days, step } = RANGES[range]
  const random = seeded(days)
  const points = days / step
  const start = TOTAL * (range === "1y" ? 0.62 : range === "3m" ? 0.84 : 0.93)
  const today = new Date(2026, 9, 28)
  return Array.from({ length: points + 1 }, (_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (points - i) * step)
    const trend = start + ((TOTAL - start) * i) / points
    // Payroll lands twice a month and dents the curve.
    const dip =
      i > 0 && i % Math.max(1, Math.round(15 / step)) === 0 ? -60_000 : 0
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      balance: i === points ? TOTAL : trend + (random() - 0.5) * 40_000 + dip,
    }
  })
}

const compact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
})
const formatCompact = (value: ChartValue) => compact.format(Number(value))

function signed(amount: number) {
  return amount > 0 ? `+${formatMoney(amount)}` : formatMoney(Math.abs(amount))
}

function accountLabel(id: AccountId) {
  const account = ACCOUNTS.find((a) => a.id === id)
  return account?.mask ? `${account.name} ••${account.mask}` : account?.name
}

function methodLabel(t: Transaction) {
  return t.method === "Card" ? `Card ••${t.card}` : t.method
}

function AppSidebar({ pendingTasks }: { pendingTasks: number }) {
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
                  <MenuItem>
                    <Building2Icon />
                    Northwind Inc.
                  </MenuItem>
                  <MenuItem>
                    <Building2Icon />
                    Northwind Labs LLC
                  </MenuItem>
                  <Separator />
                  <MenuItem>
                    <PlusIcon />
                    Add a company
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
              { icon: CircleCheckIcon, label: "Tasks", badge: pendingTasks },
              { icon: ListIcon, label: "Transactions" },
              { icon: SendIcon, label: "Payments" },
              { icon: CreditCardIcon, label: "Cards" },
              { icon: CalculatorIcon, label: "Accounting" },
            ].map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton tooltip={item.label} isActive={item.active}>
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
                {item.badge ? (
                  <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Accounts</SidebarGroupLabel>
          <SidebarMenu>
            {ACCOUNTS.map((account) => (
              <SidebarMenuItem key={account.id}>
                <SidebarMenuButton tooltip={account.name}>
                  <account.icon />
                  <span>{account.name}</span>
                  <span className="ml-auto text-xs text-fg-muted tabular-nums">
                    {compact.format(account.balance)}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <SettingsIcon />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Help">
              <HelpCircleIcon />
              <span>Help</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

function BalanceCard() {
  const [range, setRange] = useState<Range>("1m")
  const data = balanceSeries(range)
  const moneyIn = TRANSACTIONS.filter(
    (t) => t.amount > 0 && t.method !== "Transfer",
  ).reduce((sum, t) => sum + t.amount, 0)
  const moneyOut = TRANSACTIONS.filter(
    (t) => t.amount < 0 && t.method !== "Transfer",
  ).reduce((sum, t) => sum - t.amount, 0)

  return (
    <Card className="gap-0 p-0">
      <div className="flex flex-wrap items-start justify-between gap-4 px-5 pt-5">
        <div>
          <p className="text-sm text-fg-muted compact:text-xs">
            <BrandName>Northwind</BrandName> balance
          </p>
          <p className="mt-1 figure text-4xl font-medium tracking-tight">
            {formatMoney(TOTAL)}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm compact:text-xs">
            <span className="flex items-center gap-1">
              <ArrowDownIcon className="size-3.5 text-fg-success" />
              <span className="tabular-nums">{formatMoney(moneyIn)}</span>
              <span className="text-fg-muted">money in</span>
            </span>
            <span className="flex items-center gap-1">
              <ArrowUpIcon className="size-3.5 text-fg-muted" />
              <span className="tabular-nums">{formatMoney(moneyOut)}</span>
              <span className="text-fg-muted">money out</span>
            </span>
          </div>
        </div>
        <SegmentedControl
          aria-label="Balance range"
          selectedKeys={[range]}
          onSelectionChange={(keys) => {
            const [key] = [...keys]
            if (key) setRange(key as Range)
          }}
        >
          <SegmentedControlItem id="1m">1M</SegmentedControlItem>
          <SegmentedControlItem id="3m">3M</SegmentedControlItem>
          <SegmentedControlItem id="1y">1Y</SegmentedControlItem>
        </SegmentedControl>
      </div>
      <div className="px-2 pt-4 pb-2">
        <LineChart
          data={data}
          x="date"
          y="balance"
          labels={{ balance: "Balance" }}
          curve="monotone"
          strokeWidth={2}
          axes="x"
          grid={false}
          height={180}
          formatX={(value) => {
            const index = data.findIndex((d) => d.date === value)
            const every = Math.ceil(data.length / 5)
            return index % every === 0 ? String(value) : ""
          }}
          formatY={formatCompact}
          ariaLabel={`Total balance, ${RANGES[range].label.toLowerCase()}`}
        />
      </div>
    </Card>
  )
}

function AccountsCard({
  selected,
  onSelect,
}: {
  selected: AccountId | null
  onSelect: (id: AccountId | null) => void
}) {
  return (
    <Card className="gap-0 p-0">
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <h2 className="text-sm font-medium compact:text-xs">Accounts</h2>
        <Button variant="quiet" size="xs">
          <PlusIcon />
          Open account
        </Button>
      </div>
      <ul className="px-2 pb-2">
        {ACCOUNTS.map((account) => (
          <li key={account.id}>
            <button
              type="button"
              aria-pressed={selected === account.id}
              onClick={() =>
                onSelect(selected === account.id ? null : account.id)
              }
              className={cn(
                "flex w-full cursor-interactive items-center gap-3 rounded-(--studio-radius-item) px-3 py-2.5 text-left",
                selected === account.id ? "bg-muted" : "hover:bg-muted",
              )}
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full border text-fg-muted">
                <account.icon className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium compact:text-xs">
                  {account.name}
                  {account.mask && (
                    <span className="font-normal text-fg-muted">
                      {" "}
                      ••{account.mask}
                    </span>
                  )}
                </span>
                {account.yield ? (
                  <span className="text-xs text-fg-success">
                    {account.yield}
                  </span>
                ) : (
                  <span className="text-xs text-fg-muted">Available</span>
                )}
              </span>
              <span className="text-sm font-medium tabular-nums compact:text-xs">
                {formatMoney(account.balance)}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Separator />
      <div className="px-5 pt-3 pb-4">
        <h3 className="text-xs font-medium text-fg-muted">Scheduled</h3>
        <ul className="mt-2 flex flex-col gap-2.5">
          {SCHEDULED.map((payment) => (
            <li
              key={payment.name}
              className="flex items-center justify-between gap-3 text-sm compact:text-xs"
            >
              <span className="min-w-0">
                <span className="block truncate">{payment.name}</span>
                <span className="text-xs text-fg-muted">{payment.when}</span>
              </span>
              <span className="tabular-nums">
                {formatMoney(payment.amount)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}

function DetailRow({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 text-sm compact:text-xs">
      <span className="text-fg-muted">{label}</span>
      <span className="min-w-0 truncate text-right">{children}</span>
    </div>
  )
}

function TransactionPanel({
  transaction,
  category,
  onCategory,
  receipt,
  onAttach,
  onClose,
}: {
  transaction: Transaction
  category: Category
  onCategory: (category: Category) => void
  receipt?: string
  onAttach: () => void
  onClose: () => void
}) {
  const incoming = transaction.amount > 0
  const steps = [
    {
      label: incoming ? "Payment initiated by sender" : "You sent payment",
      at: `${transaction.date}, 9:14 AM`,
    },
    { label: "Processing", at: `${transaction.date}, 9:15 AM` },
    {
      label: transaction.pending ? "Expected to settle" : "Completed",
      at: transaction.pending ? "Oct 29" : `${transaction.date}, 2:40 PM`,
    },
  ]

  return (
    <aside
      aria-label="Transaction details"
      className="flex min-h-0 w-full shrink-0 flex-col border-l bg-bg max-xl:absolute max-xl:inset-y-0 max-xl:right-0 max-xl:z-10 max-xl:max-w-sm xl:w-96"
    >
      <div className="flex h-14 shrink-0 items-center justify-between border-b px-5">
        <span className="text-sm font-medium compact:text-xs">Transaction</span>
        <Button
          variant="quiet"
          size="sm"
          isIconOnly
          aria-label="Close"
          onPress={onClose}
        >
          <XIcon />
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>
              {initials(transaction.counterparty)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium compact:text-xs">
              {transaction.counterparty}
            </p>
            <p className="text-xs text-fg-muted">
              {incoming ? "From" : "To"} · {methodLabel(transaction)}
            </p>
          </div>
        </div>
        <p
          className={cn(
            "mt-5 figure text-3xl font-medium tracking-tight",
            incoming && "text-fg-success",
          )}
        >
          {signed(transaction.amount)}
        </p>
        {transaction.pending && (
          <Badge size="sm" variant="warning" className="mt-2">
            Pending
          </Badge>
        )}

        <ol className="mt-6 flex flex-col">
          {steps.map((step, index) => {
            const done = !transaction.pending || index < steps.length - 1
            return (
              <li
                key={step.label}
                className="relative flex gap-3 pb-4 last:pb-0"
              >
                {index < steps.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute top-4 bottom-0 left-[5px] w-px bg-border"
                  />
                )}
                <span
                  aria-hidden
                  className={cn(
                    "relative mt-1 size-[11px] shrink-0 rounded-full border-2",
                    done ? "border-success bg-success" : "border-border bg-bg",
                  )}
                />
                <div className="text-sm compact:text-xs">
                  <p>{step.label}</p>
                  <p className="text-xs text-fg-muted">{step.at}</p>
                </div>
              </li>
            )
          })}
        </ol>

        <Separator className="my-5" />

        <DetailRow label="Account">
          {accountLabel(transaction.account)}
        </DetailRow>
        <DetailRow label="Method">{methodLabel(transaction)}</DetailRow>
        <DetailRow label="Date">{transaction.date}, 2026</DetailRow>
        <Select
          value={category}
          onChange={(key) => onCategory(key as Category)}
          className="mt-2 w-full"
        >
          <Label>Category</Label>
          <SelectTrigger className="w-full" />
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} id={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="mt-4 flex flex-col gap-1.5">
          <span className="text-sm font-medium compact:text-xs">Receipt</span>
          {receipt ? (
            <div className="flex items-center gap-2 rounded-(--studio-radius-item) border px-3 py-2 text-sm compact:text-xs">
              <PaperclipIcon className="size-4 text-fg-muted" />
              <span className="min-w-0 flex-1 truncate">{receipt}</span>
              <Button
                variant="quiet"
                size="xs"
                isIconOnly
                aria-label="Download receipt"
              >
                <DownloadIcon />
              </Button>
            </div>
          ) : (
            <Button variant="secondary" size="sm" onPress={onAttach}>
              <UploadIcon />
              Attach receipt
            </Button>
          )}
        </div>

        <TextField className="mt-4">
          <Label>Note</Label>
          <TextArea
            placeholder="Add a note for your accountant"
            className="min-h-20"
          />
        </TextField>
      </div>
    </aside>
  )
}

function MoveMoneyMenu() {
  return (
    <Menu>
      <Button variant="primary" size="sm">
        <SendIcon />
        <span className="max-sm:sr-only">Move money</span>
      </Button>
      <Popover placement="bottom end">
        <MenuContent className="min-w-56">
          <MenuSection>
            <MenuSectionHeader>Move money</MenuSectionHeader>
            <MenuItem>
              <SendIcon />
              Send money
            </MenuItem>
            <MenuItem>
              <ArrowDownIcon />
              Request payment
            </MenuItem>
            <MenuItem>
              <RefreshCwIcon />
              Transfer between accounts
            </MenuItem>
            <MenuItem>
              <CameraIcon />
              Deposit a check
            </MenuItem>
          </MenuSection>
        </MenuContent>
      </Popover>
    </Menu>
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

export default function BankingBlock() {
  const [account, setAccount] = useState<AccountId | null>(null)
  const [direction, setDirection] = useState<"all" | "in" | "out">("all")
  const [openId, setOpenId] = useState<string | null>(null)
  const [categories, setCategories] = useState<Record<string, Category>>({})
  const [receipts, setReceipts] = useState<Record<string, string>>({})

  const receiptOf = (t: Transaction) => receipts[t.id] ?? t.receipt
  const missingReceipts = TRANSACTIONS.filter(
    (t) => t.amount < 0 && t.method === "Card" && !receiptOf(t),
  ).length

  const rows = TRANSACTIONS.filter(
    (t) =>
      (!account || t.account === account) &&
      (direction === "all" ||
        (direction === "in" ? t.amount > 0 : t.amount < 0)),
  )
  const open = TRANSACTIONS.find((t) => t.id === openId)

  return (
    <div className="min-h-screen bg-bg text-fg">
      <SidebarProvider className="h-svh min-h-svh">
        <AppSidebar pendingTasks={missingReceipts} />
        <SidebarInset className="flex h-svh min-h-0 flex-col overflow-hidden">
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 sm:px-6">
            <SidebarTrigger className="-ml-2" />
            <SearchField
              aria-label="Search"
              placeholder="Search or jump to…"
              className="w-full max-w-80"
            />
            <div className="ml-auto flex items-center gap-1">
              <TopbarIcon label="Notifications">
                <BellIcon />
              </TopbarIcon>
              <MoveMoneyMenu />
            </div>
          </header>
          <div className="relative flex min-h-0 flex-1">
            <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
              <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-6 pb-12 sm:px-6">
                <h1 className="font-heading text-2xl font-medium">
                  Welcome, Erin
                </h1>
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
                  <BalanceCard />
                  <AccountsCard selected={account} onSelect={setAccount} />
                </div>

                <section className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-base font-medium">
                      {account
                        ? `${accountLabel(account)} transactions`
                        : "Recent transactions"}
                    </h2>
                    {account && (
                      <Button
                        variant="quiet"
                        size="xs"
                        onPress={() => setAccount(null)}
                      >
                        <XIcon />
                        All accounts
                      </Button>
                    )}
                    <SegmentedControl
                      aria-label="Direction"
                      className="ml-auto"
                      selectedKeys={[direction]}
                      onSelectionChange={(keys) => {
                        const [key] = [...keys]
                        if (key) setDirection(key as typeof direction)
                      }}
                    >
                      <SegmentedControlItem id="all">All</SegmentedControlItem>
                      <SegmentedControlItem id="in">
                        Money in
                      </SegmentedControlItem>
                      <SegmentedControlItem id="out">
                        Money out
                      </SegmentedControlItem>
                    </SegmentedControl>
                  </div>
                  <TableContainer>
                    <Table
                      aria-label="Transactions"
                      selectionMode="single"
                      selectionBehavior="replace"
                      selectedKeys={openId ? [openId] : []}
                      onRowAction={(key) => setOpenId(String(key))}
                      onSelectionChange={(keys) => {
                        const [key] = [...keys]
                        setOpenId(key ? String(key) : null)
                      }}
                    >
                      <TableHeader>
                        <TableColumn className="w-20">Date</TableColumn>
                        <TableColumn isRowHeader>To / From</TableColumn>
                        <TableColumn className="w-36 text-right">
                          Amount
                        </TableColumn>
                        <TableColumn className="w-40 max-md:hidden">
                          Account
                        </TableColumn>
                        <TableColumn className="w-32 max-lg:hidden">
                          Method
                        </TableColumn>
                        <TableColumn className="w-32 max-lg:hidden">
                          Category
                        </TableColumn>
                        <TableColumn className="w-10">
                          <span className="sr-only">Receipt</span>
                        </TableColumn>
                      </TableHeader>
                      <TableBody
                        items={rows}
                        renderEmptyState={() => (
                          <p className="py-8 text-center text-sm text-fg-muted">
                            No transactions here yet.
                          </p>
                        )}
                      >
                        {(t) => (
                          <TableRow id={t.id}>
                            <TableCell className="text-fg-muted">
                              {t.date}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar size="sm">
                                  <AvatarFallback>
                                    {initials(t.counterparty)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="truncate">
                                  {t.counterparty}
                                </span>
                                {t.pending && (
                                  <Badge size="sm" variant="neutral">
                                    Pending
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell
                              className={cn(
                                "text-right tabular-nums",
                                t.amount > 0 && "text-fg-success",
                              )}
                            >
                              {signed(t.amount)}
                            </TableCell>
                            <TableCell className="text-fg-muted max-md:hidden">
                              {accountLabel(t.account)}
                            </TableCell>
                            <TableCell className="text-fg-muted max-lg:hidden">
                              {methodLabel(t)}
                            </TableCell>
                            <TableCell className="text-fg-muted max-lg:hidden">
                              {categories[t.id] ?? t.category}
                            </TableCell>
                            <TableCell>
                              {receiptOf(t) ? (
                                <PaperclipIcon
                                  aria-label="Receipt attached"
                                  className="size-4 text-fg-muted"
                                />
                              ) : null}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </section>
              </div>
            </main>
            {open && (
              <TransactionPanel
                key={open.id}
                transaction={open}
                category={categories[open.id] ?? open.category}
                onCategory={(category) =>
                  setCategories((current) => ({
                    ...current,
                    [open.id]: category,
                  }))
                }
                receipt={receiptOf(open)}
                onAttach={() =>
                  setReceipts((current) => ({
                    ...current,
                    [open.id]: `${open.counterparty.toLowerCase().replace(/\W+/g, "-")}-receipt.pdf`,
                  }))
                }
                onClose={() => setOpenId(null)}
              />
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
