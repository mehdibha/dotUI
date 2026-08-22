"use client"

import * as React from "react"

import {
  Building2Icon,
  CircleCheckIcon,
  CircleDashedIcon,
  ClockIcon,
  CopyIcon,
  DownloadIcon,
  ListFilterIcon,
  MailIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  Settings2Icon,
  TagIcon,
  Trash2Icon,
  TrendingDownIcon,
  TrendingUpIcon,
  TriangleAlertIcon,
  UploadIcon,
  UserIcon,
  XIcon,
} from "@/registry/icons"
import { Responsive } from "@/registry/lib/responsive"
import { cn } from "@/registry/lib/utils"
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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Drawer } from "@/registry/ui/drawer"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Modal } from "@/registry/ui/modal"
import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/ui/pagination"
import { Popover } from "@/registry/ui/popover"
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
  TableHeader,
  TableRow,
} from "@/registry/ui/table"
import { Tag, TagGroup, TagList } from "@/registry/ui/tag-group"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

/* --------------------------------- Data ---------------------------------- */

type Status = "active" | "trial" | "past-due" | "churned"
type Plan = "Starter" | "Growth" | "Scale" | "Enterprise"

interface Customer {
  id: string
  name: string
  email: string
  company: string
  plan: Plan
  status: Status
  mrr: number
  seats: number
  region: string
  owner: string
  lastActiveMinutes: number
}

const CUSTOMERS: Customer[] = [
  {
    id: "cus_9421",
    name: "Amara Okafor",
    email: "amara@northwind.io",
    company: "Northwind Logistics",
    plan: "Enterprise",
    status: "active",
    mrr: 8940,
    seats: 145,
    region: "North America",
    owner: "Priya Raman",
    lastActiveMinutes: 12,
  },
  {
    id: "cus_8830",
    name: "Tobias Lindqvist",
    email: "tobias@fjordbank.se",
    company: "Fjord Bank",
    plan: "Enterprise",
    status: "active",
    mrr: 12400,
    seats: 320,
    region: "EMEA",
    owner: "Daniel Ortiz",
    lastActiveMinutes: 60,
  },
  {
    id: "cus_8617",
    name: "Mei Chen",
    email: "mei.chen@lumenlabs.cn",
    company: "Lumen Labs",
    plan: "Scale",
    status: "trial",
    mrr: 0,
    seats: 24,
    region: "APAC",
    owner: "Priya Raman",
    lastActiveMinutes: 180,
  },
  {
    id: "cus_8504",
    name: "Rafael Duarte",
    email: "rafael@verdemarket.br",
    company: "Verde Market",
    plan: "Growth",
    status: "active",
    mrr: 1490,
    seats: 38,
    region: "LATAM",
    owner: "Hannah Weiss",
    lastActiveMinutes: 300,
  },
  {
    id: "cus_8388",
    name: "Nadia Petrova",
    email: "nadia@atlascore.eu",
    company: "Atlas Core",
    plan: "Scale",
    status: "past-due",
    mrr: 3200,
    seats: 76,
    region: "EMEA",
    owner: "Daniel Ortiz",
    lastActiveMinutes: 2880,
  },
  {
    id: "cus_8241",
    name: "Julian Marsh",
    email: "julian@harborhealth.com",
    company: "Harbor Health",
    plan: "Growth",
    status: "active",
    mrr: 1180,
    seats: 29,
    region: "North America",
    owner: "Hannah Weiss",
    lastActiveMinutes: 26,
  },
  {
    id: "cus_8106",
    name: "Sofia Rinaldi",
    email: "sofia@brellastudio.it",
    company: "Brella Studio",
    plan: "Starter",
    status: "trial",
    mrr: 0,
    seats: 6,
    region: "EMEA",
    owner: "Priya Raman",
    lastActiveMinutes: 45,
  },
  {
    id: "cus_7994",
    name: "Kwame Mensah",
    email: "kwame@sablefreight.gh",
    company: "Sable Freight",
    plan: "Growth",
    status: "active",
    mrr: 1620,
    seats: 41,
    region: "EMEA",
    owner: "Daniel Ortiz",
    lastActiveMinutes: 90,
  },
  {
    id: "cus_7852",
    name: "Hana Sato",
    email: "hana@kirinworks.jp",
    company: "Kirin Works",
    plan: "Scale",
    status: "active",
    mrr: 4100,
    seats: 88,
    region: "APAC",
    owner: "Daniel Ortiz",
    lastActiveMinutes: 240,
  },
  {
    id: "cus_7741",
    name: "Owen Whitfield",
    email: "owen@ridgeline.co",
    company: "Ridgeline Outfitters",
    plan: "Starter",
    status: "churned",
    mrr: 0,
    seats: 4,
    region: "North America",
    owner: "Hannah Weiss",
    lastActiveMinutes: 59040,
  },
  {
    id: "cus_7620",
    name: "Isabel Navarro",
    email: "isabel@costera.mx",
    company: "Costera Foods",
    plan: "Growth",
    status: "active",
    mrr: 1340,
    seats: 33,
    region: "LATAM",
    owner: "Priya Raman",
    lastActiveMinutes: 540,
  },
  {
    id: "cus_7513",
    name: "Dmitri Volkov",
    email: "dmitri@severn.dev",
    company: "Severn Systems",
    plan: "Scale",
    status: "active",
    mrr: 3850,
    seats: 71,
    region: "EMEA",
    owner: "Daniel Ortiz",
    lastActiveMinutes: 18,
  },
  {
    id: "cus_7408",
    name: "Grace Adeyemi",
    email: "grace@palmcity.ng",
    company: "Palm City Media",
    plan: "Starter",
    status: "active",
    mrr: 290,
    seats: 9,
    region: "EMEA",
    owner: "Hannah Weiss",
    lastActiveMinutes: 120,
  },
  {
    id: "cus_7299",
    name: "Lucas Meyer",
    email: "lucas@heliostrade.de",
    company: "Helios Trade",
    plan: "Enterprise",
    status: "active",
    mrr: 9750,
    seats: 210,
    region: "EMEA",
    owner: "Priya Raman",
    lastActiveMinutes: 33,
  },
  {
    id: "cus_7185",
    name: "Priya Nair",
    email: "priya@tanvicloud.in",
    company: "Tanvi Cloud",
    plan: "Growth",
    status: "trial",
    mrr: 0,
    seats: 18,
    region: "APAC",
    owner: "Daniel Ortiz",
    lastActiveMinutes: 360,
  },
  {
    id: "cus_7077",
    name: "Marta Kowalski",
    email: "marta@bialyanalytics.pl",
    company: "Bialy Analytics",
    plan: "Scale",
    status: "active",
    mrr: 2980,
    seats: 64,
    region: "EMEA",
    owner: "Hannah Weiss",
    lastActiveMinutes: 1440,
  },
  {
    id: "cus_6964",
    name: "Ethan Brooks",
    email: "ethan@ninthstreet.com",
    company: "Ninth Street Coffee",
    plan: "Starter",
    status: "past-due",
    mrr: 340,
    seats: 11,
    region: "North America",
    owner: "Priya Raman",
    lastActiveMinutes: 10080,
  },
  {
    id: "cus_6851",
    name: "Yara Haddad",
    email: "yara@cedarpoint.ae",
    company: "Cedar Point Group",
    plan: "Enterprise",
    status: "active",
    mrr: 11200,
    seats: 265,
    region: "EMEA",
    owner: "Daniel Ortiz",
    lastActiveMinutes: 130,
  },
  {
    id: "cus_6742",
    name: "Noah Feldman",
    email: "noah@quarrysoft.com",
    company: "Quarry Software",
    plan: "Growth",
    status: "active",
    mrr: 1710,
    seats: 44,
    region: "North America",
    owner: "Hannah Weiss",
    lastActiveMinutes: 51,
  },
  {
    id: "cus_6630",
    name: "Camila Reyes",
    email: "camila@andesair.cl",
    company: "Andes Air",
    plan: "Scale",
    status: "active",
    mrr: 3420,
    seats: 79,
    region: "LATAM",
    owner: "Priya Raman",
    lastActiveMinutes: 720,
  },
  {
    id: "cus_6518",
    name: "Felix Nordmann",
    email: "felix@bergbaunordic.no",
    company: "Bergbau Nordic",
    plan: "Growth",
    status: "churned",
    mrr: 0,
    seats: 22,
    region: "EMEA",
    owner: "Daniel Ortiz",
    lastActiveMinutes: 90720,
  },
  {
    id: "cus_6407",
    name: "Aisha Rahman",
    email: "aisha@sunwaymed.my",
    company: "Sunway Medical",
    plan: "Scale",
    status: "active",
    mrr: 4680,
    seats: 96,
    region: "APAC",
    owner: "Hannah Weiss",
    lastActiveMinutes: 200,
  },
  {
    id: "cus_6295",
    name: "Victor Osei",
    email: "victor@goldcoastcocoa.gh",
    company: "Gold Coast Cocoa",
    plan: "Starter",
    status: "trial",
    mrr: 0,
    seats: 7,
    region: "EMEA",
    owner: "Priya Raman",
    lastActiveMinutes: 1500,
  },
  {
    id: "cus_6188",
    name: "Lena Fischer",
    email: "lena@altmarkretail.de",
    company: "Altmark Retail",
    plan: "Enterprise",
    status: "past-due",
    mrr: 8100,
    seats: 175,
    region: "EMEA",
    owner: "Daniel Ortiz",
    lastActiveMinutes: 5760,
  },
  {
    id: "cus_6071",
    name: "Jonas Berg",
    email: "jonas@vikingpay.se",
    company: "VikingPay",
    plan: "Growth",
    status: "active",
    mrr: 2140,
    seats: 52,
    region: "EMEA",
    owner: "Hannah Weiss",
    lastActiveMinutes: 22,
  },
  {
    id: "cus_5963",
    name: "Ruby Tanaka",
    email: "ruby@shorelinepr.au",
    company: "Shoreline PR",
    plan: "Starter",
    status: "active",
    mrr: 420,
    seats: 12,
    region: "APAC",
    owner: "Priya Raman",
    lastActiveMinutes: 480,
  },
]

const STATUS_META: Record<
  Status,
  {
    label: string
    icon: typeof CircleCheckIcon
    variant: "success" | "info" | "warning" | "neutral"
  }
> = {
  active: { label: "Active", icon: CircleCheckIcon, variant: "success" },
  trial: { label: "Trial", icon: ClockIcon, variant: "info" },
  "past-due": {
    label: "Past due",
    icon: TriangleAlertIcon,
    variant: "warning",
  },
  churned: { label: "Churned", icon: CircleDashedIcon, variant: "neutral" },
}

const STATUS_ORDER: Status[] = ["active", "trial", "past-due", "churned"]
const PLAN_ORDER: Plan[] = ["Starter", "Growth", "Scale", "Enterprise"]
const REGIONS = ["North America", "EMEA", "APAC", "LATAM"]
const PAGE_SIZES = [8, 16, 32]

interface ColumnDef {
  id: string
  name: string
  sortable?: boolean
  hideable?: boolean
  className?: string
  cellClassName?: string
}

const COLUMNS: ColumnDef[] = [
  {
    id: "customer",
    name: "Customer",
    sortable: true,
    cellClassName: "min-w-56",
  },
  { id: "company", name: "Company", sortable: true, hideable: true },
  { id: "plan", name: "Plan", sortable: true, hideable: true },
  { id: "status", name: "Status", sortable: true, hideable: true },
  {
    id: "mrr",
    name: "MRR",
    sortable: true,
    hideable: true,
    className: "text-right",
    cellClassName: "text-right font-medium tabular-nums",
  },
  {
    id: "seats",
    name: "Seats",
    sortable: true,
    hideable: true,
    className: "text-right",
    cellClassName: "text-right tabular-nums text-fg-muted",
  },
  { id: "region", name: "Region", sortable: true, hideable: true },
  { id: "owner", name: "Account owner", hideable: true },
  {
    id: "lastActive",
    name: "Last active",
    sortable: true,
    hideable: true,
    cellClassName: "text-fg-muted tabular-nums",
  },
  { id: "actions", name: "Actions", className: "w-12" },
]

const SORT_VALUE: Record<string, (c: Customer) => string | number> = {
  customer: (c) => c.name,
  company: (c) => c.company,
  plan: (c) => PLAN_ORDER.indexOf(c.plan),
  status: (c) => STATUS_ORDER.indexOf(c.status),
  mrr: (c) => c.mrr,
  seats: (c) => c.seats,
  region: (c) => c.region,
  lastActive: (c) => c.lastActiveMinutes,
}

/* -------------------------------- Helpers -------------------------------- */

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
}

function formatMoney(value: number) {
  return `$${value.toLocaleString("en-US")}`
}

function formatLastActive(minutes: number) {
  if (minutes < 60) return `${minutes}m ago`
  if (minutes < 1440) return `${Math.round(minutes / 60)}h ago`
  return `${Math.round(minutes / 1440)}d ago`
}

function pageWindow(page: number, total: number): (number | "gap")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  const items: (number | "gap")[] = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(total - 1, page + 1)
  if (start > 2) items.push("gap")
  for (let i = start; i <= end; i++) items.push(i)
  if (end < total - 1) items.push("gap")
  items.push(total)
  return items
}

/* ------------------------------- Fragments -------------------------------- */

function Stat({
  label,
  value,
  delta,
  isUp,
}: {
  label: string
  value: string
  delta: string
  isUp: boolean
}) {
  const DeltaIcon = isUp ? TrendingUpIcon : TrendingDownIcon
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-xl tabular-nums">{value}</CardTitle>
        <span
          className={cn(
            "flex items-center gap-1 text-xs",
            isUp ? "text-fg-success" : "text-fg-danger",
          )}
        >
          <DeltaIcon className="size-3.5" />
          {delta}
        </span>
      </CardHeader>
    </Card>
  )
}

function FacetMenu({
  label,
  options,
  counts,
  selected,
  onChange,
}: {
  label: string
  options: { id: string; label: string }[]
  counts: Record<string, number>
  selected: Set<string>
  onChange: (next: Set<string>) => void
}) {
  return (
    <Menu>
      <Button variant="secondary" size="sm" className="border-dashed">
        <ListFilterIcon />
        {label}
        {selected.size > 0 && (
          <Badge appearance="subtle" variant="accent" size="sm">
            {selected.size}
          </Badge>
        )}
      </Button>
      <Popover placement="bottom start">
        <MenuContent
          className="min-w-52"
          selectionMode="multiple"
          selectedKeys={selected}
          onSelectionChange={(keys) => {
            onChange(
              keys === "all"
                ? new Set(options.map((o) => o.id))
                : new Set(Array.from(keys, String)),
            )
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.id} id={option.id} textValue={option.label}>
              <span className="flex-1">{option.label}</span>
              <span className="font-mono text-xs text-fg-muted">
                {counts[option.id] ?? 0}
              </span>
            </MenuItem>
          ))}
        </MenuContent>
      </Popover>
    </Menu>
  )
}

function RowMenu({ customer }: { customer: Customer }) {
  return (
    <Menu>
      <Button
        variant="quiet"
        size="sm"
        isIconOnly
        aria-label={`Actions for ${customer.name}`}
      >
        <MoreHorizontalIcon />
      </Button>
      <Popover placement="bottom end">
        <MenuContent className="min-w-48">
          <MenuItem textValue="View customer">
            <UserIcon />
            View customer
          </MenuItem>
          <MenuItem textValue="Edit details">
            <PencilIcon />
            Edit details
          </MenuItem>
          <MenuItem textValue="Copy email">
            <CopyIcon />
            Copy email
          </MenuItem>
          <MenuItem textValue="Send invoice">
            <MailIcon />
            Send invoice
          </MenuItem>
          <MenuItem variant="danger" textValue="Delete customer">
            <Trash2Icon />
            Delete customer
          </MenuItem>
        </MenuContent>
      </Popover>
    </Menu>
  )
}

/* --------------------------------- Page ----------------------------------- */

export default function DataTableBlock() {
  const [rows, setRows] = React.useState(CUSTOMERS)
  const [query, setQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<Set<string>>(new Set())
  const [planFilter, setPlanFilter] = React.useState<Set<string>>(new Set())
  const [region, setRegion] = React.useState("all")
  const [hiddenColumns, setHiddenColumns] = React.useState<Set<string>>(
    new Set(["region"]),
  )
  const [sort, setSort] = React.useState<{
    column: string
    direction: "ascending" | "descending"
  }>({ column: "mrr", direction: "descending" })
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(8)

  const statusCounts = React.useMemo(() => {
    const counts: Record<string, number> = {}
    for (const row of rows) counts[row.status] = (counts[row.status] ?? 0) + 1
    return counts
  }, [rows])

  const planCounts = React.useMemo(() => {
    const counts: Record<string, number> = {}
    for (const row of rows) counts[row.plan] = (counts[row.plan] ?? 0) + 1
    return counts
  }, [rows])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (
        q &&
        !`${row.name} ${row.email} ${row.company}`.toLowerCase().includes(q)
      )
        return false
      if (statusFilter.size > 0 && !statusFilter.has(row.status)) return false
      if (planFilter.size > 0 && !planFilter.has(row.plan)) return false
      if (region !== "all" && row.region !== region) return false
      return true
    })
  }, [rows, query, statusFilter, planFilter, region])

  const sorted = React.useMemo(() => {
    const read = SORT_VALUE[sort.column]
    if (!read) return filtered
    const factor = sort.direction === "descending" ? -1 : 1
    return [...filtered].sort((a, b) => {
      const first = read(a)
      const second = read(b)
      const cmp =
        typeof first === "number" && typeof second === "number"
          ? first - second
          : String(first).localeCompare(String(second))
      return cmp * factor
    })
  }, [filtered, sort])

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pageRows = sorted.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  const visibleColumns = React.useMemo(
    () => COLUMNS.filter((column) => !hiddenColumns.has(column.id)),
    [hiddenColumns],
  )
  const columnKey = visibleColumns.map((column) => column.id).join(":")
  const columnDeps = React.useMemo(() => [columnKey], [columnKey])

  const activeFilters = React.useMemo(() => {
    const tags: { id: string; label: string }[] = []
    if (query.trim()) tags.push({ id: "query", label: `“${query.trim()}”` })
    for (const status of statusFilter)
      tags.push({
        id: `status:${status}`,
        label: `Status: ${STATUS_META[status as Status].label}`,
      })
    for (const plan of planFilter)
      tags.push({ id: `plan:${plan}`, label: `Plan: ${plan}` })
    if (region !== "all")
      tags.push({ id: "region", label: `Region: ${region}` })
    return tags
  }, [query, statusFilter, planFilter, region])

  const removeFilters = (keys: Set<string | number>) => {
    const ids = new Set(Array.from(keys, String))
    if (ids.has("query")) setQuery("")
    if (ids.has("region")) setRegion("all")
    const droppedStatuses = new Set(
      Array.from(ids)
        .filter((id) => id.startsWith("status:"))
        .map((id) => id.slice(7)),
    )
    if (droppedStatuses.size > 0)
      setStatusFilter(
        new Set(
          Array.from(statusFilter).filter((s) => !droppedStatuses.has(s)),
        ),
      )
    const droppedPlans = new Set(
      Array.from(ids)
        .filter((id) => id.startsWith("plan:"))
        .map((id) => id.slice(5)),
    )
    if (droppedPlans.size > 0)
      setPlanFilter(
        new Set(Array.from(planFilter).filter((p) => !droppedPlans.has(p))),
      )
    setPage(1)
  }

  const clearFilters = () => {
    setQuery("")
    setStatusFilter(new Set())
    setPlanFilter(new Set())
    setRegion("all")
    setPage(1)
  }

  const deleteSelected = () => {
    setRows(rows.filter((row) => !selectedIds.has(row.id)))
    setSelectedIds(new Set())
  }

  const selectedCount = selectedIds.size
  const activeMrr = rows
    .filter((row) => row.status === "active")
    .reduce((total, row) => total + row.mrr, 0)

  const renderCell = (customer: Customer, columnId: string) => {
    switch (columnId) {
      case "customer":
        return (
          <div className="flex items-center gap-2.5">
            <Avatar size="sm">
              <AvatarFallback>{initials(customer.name)}</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="truncate font-medium">{customer.name}</span>
              <span className="truncate text-xs text-fg-muted">
                {customer.email}
              </span>
            </div>
          </div>
        )
      case "company":
        return (
          <div className="flex items-center gap-2">
            <Building2Icon className="size-3.5 text-fg-muted" />
            {customer.company}
          </div>
        )
      case "plan":
        return (
          <Badge
            appearance="subtle"
            variant={customer.plan === "Enterprise" ? "accent" : "neutral"}
            size="sm"
          >
            {customer.plan}
          </Badge>
        )
      case "status": {
        const meta = STATUS_META[customer.status]
        const StatusIcon = meta.icon
        return (
          <Badge appearance="subtle" variant={meta.variant} size="sm">
            <StatusIcon />
            {meta.label}
          </Badge>
        )
      }
      case "mrr":
        return customer.mrr === 0 ? (
          <span className="text-fg-muted">—</span>
        ) : (
          formatMoney(customer.mrr)
        )
      case "seats":
        return customer.seats
      case "region":
        return customer.region
      case "owner":
        return (
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <AvatarFallback className="text-[0.625rem]">
                {initials(customer.owner)}
              </AvatarFallback>
            </Avatar>
            <span>{customer.owner}</span>
          </div>
        )
      case "lastActive":
        return formatLastActive(customer.lastActiveMinutes)
      case "actions":
        return <RowMenu customer={customer} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-20 border-b border-border-muted bg-bg/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6">
          <Breadcrumbs>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Revenue</BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink>Customers</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumbs>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="space-y-1">
              <h1 className="font-heading text-2xl font-semibold tracking-tight">
                Customers
              </h1>
              <p className="text-sm text-fg-muted">
                {rows.length} accounts across 4 regions — synced 6 minutes ago.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip>
                <Button
                  variant="quiet"
                  size="sm"
                  isIconOnly
                  aria-label="Import"
                >
                  <UploadIcon />
                </Button>
                <TooltipContent>Import from CSV</TooltipContent>
              </Tooltip>
              <Button variant="secondary" size="sm">
                <DownloadIcon />
                Export
              </Button>
              <Button variant="primary" size="sm">
                <PlusIcon />
                Add customer
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 pb-28 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Active MRR"
            value={formatMoney(activeMrr)}
            delta="8.4% vs last month"
            isUp
          />
          <Stat
            label="Paying accounts"
            value={String(rows.filter((row) => row.status === "active").length)}
            delta="3 added this week"
            isUp
          />
          <Stat
            label="Open trials"
            value={String(statusCounts.trial ?? 0)}
            delta="2 ending in 5 days"
            isUp={false}
          />
          <Stat
            label="Past due"
            value={String(statusCounts["past-due"] ?? 0)}
            delta={formatMoney(
              rows
                .filter((row) => row.status === "past-due")
                .reduce((total, row) => total + row.mrr, 0),
            )}
            isUp={false}
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <SearchField
                aria-label="Search customers"
                value={query}
                onChange={(value) => {
                  setQuery(value)
                  setPage(1)
                }}
                className="w-full sm:w-72"
              >
                <InputGroup size="sm">
                  <InputGroupAddon>
                    <SearchIcon />
                  </InputGroupAddon>
                  <Input placeholder="Search name, email, company…" size="sm" />
                </InputGroup>
              </SearchField>
              <FacetMenu
                label="Status"
                options={STATUS_ORDER.map((status) => ({
                  id: status,
                  label: STATUS_META[status].label,
                }))}
                counts={statusCounts}
                selected={statusFilter}
                onChange={(next) => {
                  setStatusFilter(next)
                  setPage(1)
                }}
              />
              <FacetMenu
                label="Plan"
                options={PLAN_ORDER.map((plan) => ({ id: plan, label: plan }))}
                counts={planCounts}
                selected={planFilter}
                onChange={(next) => {
                  setPlanFilter(next)
                  setPage(1)
                }}
              />
              <Select
                aria-label="Region"
                className="w-40"
                selectedKey={region}
                onSelectionChange={(key) => {
                  setRegion(String(key ?? "all"))
                  setPage(1)
                }}
              >
                <SelectTrigger size="sm" className="w-full" />
                <SelectContent>
                  <SelectItem id="all">All regions</SelectItem>
                  {REGIONS.map((item) => (
                    <SelectItem key={item} id={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Menu>
              <Button variant="secondary" size="sm">
                <Settings2Icon />
                Columns
              </Button>
              <Popover placement="bottom end">
                <MenuContent
                  className="min-w-44"
                  selectionMode="multiple"
                  selectedKeys={
                    new Set(
                      COLUMNS.filter(
                        (column) =>
                          column.hideable && !hiddenColumns.has(column.id),
                      ).map((column) => column.id),
                    )
                  }
                  onSelectionChange={(keys) => {
                    const shown =
                      keys === "all"
                        ? new Set(COLUMNS.map((column) => column.id))
                        : new Set(Array.from(keys, String))
                    setHiddenColumns(
                      new Set(
                        COLUMNS.filter(
                          (column) => column.hideable && !shown.has(column.id),
                        ).map((column) => column.id),
                      ),
                    )
                  }}
                >
                  {COLUMNS.filter((column) => column.hideable).map((column) => (
                    <MenuItem key={column.id} id={column.id}>
                      {column.name}
                    </MenuItem>
                  ))}
                </MenuContent>
              </Popover>
            </Menu>
          </div>

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <TagGroup
                aria-label="Active filters"
                size="sm"
                onRemove={removeFilters}
              >
                <TagList items={activeFilters}>
                  {(filter) => <Tag>{filter.label}</Tag>}
                </TagList>
              </TagGroup>
              <Button variant="quiet" size="sm" onPress={clearFilters}>
                Clear all
                <XIcon />
              </Button>
            </div>
          )}
        </div>

        <TableContainer>
          <Table
            aria-label="Customers"
            selectionMode="multiple"
            selectedKeys={selectedIds}
            onSelectionChange={(keys) => {
              setSelectedIds(
                keys === "all"
                  ? new Set(pageRows.map((row) => row.id))
                  : new Set(Array.from(keys, String)),
              )
            }}
            sortDescriptor={sort}
            onSortChange={(descriptor) => {
              setSort({
                column: String(descriptor.column),
                direction: descriptor.direction,
              })
              setPage(1)
            }}
          >
            <TableHeader columns={visibleColumns} dependencies={columnDeps}>
              {(column) => (
                <TableColumn
                  id={column.id}
                  isRowHeader={column.id === "customer"}
                  allowsSorting={column.sortable}
                  className={column.className}
                >
                  {column.id === "actions" ? (
                    <span className="sr-only">{column.name}</span>
                  ) : (
                    column.name
                  )}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={pageRows}
              dependencies={columnDeps}
              renderEmptyState={() => (
                <div className="flex flex-col items-center gap-1 py-8">
                  <span className="font-medium">No customers match</span>
                  <span className="text-sm text-fg-muted">
                    Try a broader search or clear your filters.
                  </span>
                </div>
              )}
            >
              {(customer) => (
                <TableRow
                  columns={visibleColumns}
                  dependencies={columnDeps}
                  textValue={customer.name}
                >
                  {(column) => (
                    <TableCell className={column.cellClassName}>
                      {renderCell(customer, column.id)}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <div className="flex flex-col gap-3 text-sm lg:flex-row lg:items-center lg:justify-between">
          <p className="text-fg-muted tabular-nums">
            {selectedCount} of {sorted.length} row(s) selected
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap text-fg-muted">
                Rows per page
              </span>
              <Select
                aria-label="Rows per page"
                className="w-18"
                selectedKey={String(pageSize)}
                onSelectionChange={(key) => {
                  setPageSize(Number(key ?? 8))
                  setPage(1)
                }}
              >
                <SelectTrigger size="sm" className="w-full" />
                <SelectContent placement="top">
                  {PAGE_SIZES.map((size) => (
                    <SelectItem key={size} id={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <span className="whitespace-nowrap text-fg-muted tabular-nums">
              Page {currentPage} of {pageCount}
            </span>
            <Pagination>
              <PaginationList>
                <PaginationItem>
                  <PaginationPrevious
                    isIconOnly
                    isDisabled={currentPage === 1}
                    onPress={() => setPage(Math.max(1, currentPage - 1))}
                  />
                </PaginationItem>
                {pageWindow(currentPage, pageCount).map((item, index) =>
                  item === "gap" ? (
                    <PaginationItem key={`gap-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={item}>
                      <PaginationLink
                        aria-label={`Page ${item}`}
                        isActive={item === currentPage}
                        onPress={() => setPage(item)}
                      >
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}
                <PaginationItem>
                  <PaginationNext
                    isIconOnly
                    isDisabled={currentPage === pageCount}
                    onPress={() =>
                      setPage(Math.min(pageCount, currentPage + 1))
                    }
                  />
                </PaginationItem>
              </PaginationList>
            </Pagination>
          </div>
        </div>
      </main>

      {selectedCount > 0 && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center p-4">
          <div className="pointer-events-auto flex max-w-full items-center gap-2 overflow-x-auto rounded-lg border border-border-muted bg-card p-1.5 pl-3 shadow-lg">
            <span className="text-sm font-medium whitespace-nowrap tabular-nums">
              {selectedCount} selected
            </span>
            <Separator orientation="vertical" className="h-5" />
            <Button variant="quiet" size="sm">
              <MailIcon />
              Email
            </Button>
            <Button variant="quiet" size="sm">
              <TagIcon />
              Tag
            </Button>
            <Button variant="quiet" size="sm">
              <DownloadIcon />
              Export
            </Button>
            <Dialog>
              <Button variant="danger" size="sm">
                <Trash2Icon />
                Delete
              </Button>
              <Responsive
                render={(isMobile) => {
                  const content = (
                    <DialogContent role="alertdialog">
                      <DialogHeader>
                        <DialogTitle>
                          Delete {selectedCount} customer
                          {selectedCount > 1 ? "s" : ""}?
                        </DialogTitle>
                        <DialogDescription>
                          Their accounts, billing history and open invoices are
                          removed from this workspace. This cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button slot="close" variant="secondary">
                          Cancel
                        </Button>
                        <Button
                          slot="close"
                          variant="danger"
                          onPress={deleteSelected}
                        >
                          Delete
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
            <Separator orientation="vertical" className="h-5" />
            <Button
              variant="quiet"
              size="sm"
              isIconOnly
              aria-label="Clear selection"
              onPress={() => setSelectedIds(new Set())}
            >
              <XIcon />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
