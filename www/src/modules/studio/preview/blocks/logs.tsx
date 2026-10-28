import { useState } from "react"
import type { ChartValue } from "@tanstack/charts"

import {
  ChevronDownIcon,
  ClockIcon,
  CopyIcon,
  DownloadIcon,
  ExternalLinkIcon,
  ListFilterIcon,
  RadioIcon,
  XIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { BarChart } from "@/registry/ui/chart-bar"
import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox"
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/registry/ui/collapsible"
import { Label } from "@/registry/ui/field"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"
import { SearchField } from "@/registry/ui/search-field"
import { Separator } from "@/registry/ui/separator"
import { Tab, TabList, Tabs } from "@/registry/ui/tabs"
import { ToggleButton } from "@/registry/ui/toggle-button"
import { BrandMark, BrandName } from "@/modules/studio/assets/brand"

// A Vercel-style log explorer: facets with counts on the left, a stacked
// volume histogram, a dense request stream with status and level, and a
// request that opens in a side panel with its details and runtime logs.

type Level = "info" | "warning" | "error"
type Resource = "Function" | "Middleware" | "Static"

interface Request {
  id: string
  time: string
  minute: number
  method: "GET" | "POST" | "PUT" | "DELETE"
  status: number
  host: string
  path: string
  message: string
  level: Level
  duration: number
  region: string
  resource: Resource
}

const ROUTES = [
  {
    method: "GET",
    path: "/api/products",
    resource: "Function",
    message: "Served 48 products from cache",
  },
  {
    method: "POST",
    path: "/api/checkout",
    resource: "Function",
    message: "Created payment intent pi_3Q8x",
  },
  { method: "GET", path: "/", resource: "Static", message: "" },
  {
    method: "GET",
    path: "/api/cart",
    resource: "Function",
    message: "Cart hydrated with 3 items",
  },
  {
    method: "POST",
    path: "/api/webhooks/stripe",
    resource: "Function",
    message: "Processed checkout.session.completed",
  },
  {
    method: "GET",
    path: "/account",
    resource: "Middleware",
    message: "Redirected unauthenticated user to /login",
  },
  {
    method: "GET",
    path: "/api/search",
    resource: "Function",
    message: 'Query "linen throw" returned 12 hits',
  },
  {
    method: "PUT",
    path: "/api/cart/items",
    resource: "Function",
    message: "Updated quantity for sku_2210",
  },
] as const

const PROJECT_TABS = [
  "Overview",
  "Deployments",
  "Analytics",
  "Logs",
  "Observability",
  "Firewall",
  "Storage",
  "Settings",
]

const REGIONS = ["iad1", "fra1", "sfo1", "hnd1"]

// Deterministic: the same stream on every render and every load.
function seeded(seed: number) {
  let value = seed
  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

function buildRequests(): Request[] {
  const random = seeded(42)
  const requests: Request[] = []
  for (let i = 0; i < 48; i++) {
    const route = ROUTES[Math.floor(random() * ROUTES.length)] ?? ROUTES[0]
    const roll = random()
    let status = route.method === "POST" ? 201 : 200
    let level: Level = "info"
    let message: string = route.message
    if (route.path === "/account") status = 307
    if (roll > 0.93) {
      status = 500
      level = "error"
      message =
        route.path === "/api/checkout"
          ? "Error: Gift card balance not applied before intent creation"
          : "Error: Connection pool exhausted (max 20)"
    } else if (roll > 0.84) {
      status = route.method === "GET" ? 404 : 422
      level = "warning"
      message = `Warning: ${route.method === "GET" ? "Not found" : "Validation failed: quantity must be ≥ 1"}`
    } else if (roll > 0.78 && route.resource === "Function") {
      level = "warning"
      message = "Warning: Slow response from inventory service (1.8s)"
    }
    const second = 59 - i * 1.2
    const minute = Math.floor(i / 1.6)
    const s = Math.max(0, Math.floor(second % 60))
    requests.push({
      id: `r${i}`,
      time: `16:${String(29 - minute).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(Math.floor(random() * 99)).padStart(2, "0")}`,
      minute: 29 - minute,
      method: route.method,
      status,
      host: "shop.northwind.co",
      path: route.path,
      message,
      level,
      duration: Math.round(
        route.resource === "Static" ? 4 + random() * 10 : 40 + random() * 420,
      ),
      region: REGIONS[Math.floor(random() * REGIONS.length)] ?? "iad1",
      resource: route.resource,
    })
  }
  return requests
}

const REQUESTS = buildRequests()

const volumeRandom = seeded(7)
const VOLUME = Array.from({ length: 30 }, (_, i) => ({
  minute: `16:${String(i).padStart(2, "0")}`,
  requests: Math.round(
    160 + volumeRandom() * 140 + Math.sin(i / 3) * 40 + (i > 20 ? 90 : 0),
  ),
}))

const formatMinute = (value: ChartValue) =>
  String(value).endsWith("0") || String(value).endsWith("5")
    ? String(value)
    : ""

function statusClass(status: number) {
  if (status >= 500) return "text-fg-danger"
  if (status >= 400) return "text-fg-warning"
  if (status >= 300) return "text-fg-muted"
  return "text-fg"
}

function statusGroup(status: number) {
  return `${Math.floor(status / 100)}xx`
}

interface Facet {
  id: string
  label: string
  options: { id: string; label: string }[]
  read: (r: Request) => string
}

const FACETS: Facet[] = [
  {
    id: "level",
    label: "Console level",
    options: [
      { id: "error", label: "Error" },
      { id: "warning", label: "Warning" },
      { id: "info", label: "Info" },
    ],
    read: (r) => r.level,
  },
  {
    id: "status",
    label: "Status code",
    options: ["2xx", "3xx", "4xx", "5xx"].map((s) => ({ id: s, label: s })),
    read: (r) => statusGroup(r.status),
  },
  {
    id: "route",
    label: "Route",
    options: [...new Set(ROUTES.map((r) => r.path))].map((path) => ({
      id: path,
      label: path,
    })),
    read: (r) => r.path,
  },
  {
    id: "resource",
    label: "Resource",
    options: ["Function", "Middleware", "Static"].map((s) => ({
      id: s,
      label: s,
    })),
    read: (r) => r.resource,
  },
]

function FacetGroup({
  facet,
  counts,
  selected,
  onToggle,
}: {
  facet: Facet
  counts: Record<string, number>
  selected: Set<string>
  onToggle: (option: string) => void
}) {
  return (
    <Collapsible defaultExpanded className="border-b py-2">
      <CollapsibleTrigger className="group/facet flex w-full items-center justify-between px-4 py-1.5 text-sm font-medium compact:text-xs">
        {facet.label}
        <ChevronDownIcon className="size-4 text-fg-muted transition-transform group-aria-expanded/facet:rotate-180" />
      </CollapsibleTrigger>
      <CollapsiblePanel>
        <div className="flex flex-col gap-0.5 px-4 pt-1 pb-1">
          {facet.options.map((option) => (
            <div
              key={option.id}
              className="flex items-center justify-between gap-2"
            >
              <Checkbox
                isSelected={selected.has(option.id)}
                onChange={() => onToggle(option.id)}
                className="min-w-0"
              >
                <CheckboxControl />
                <Label
                  className={cn(
                    "truncate font-normal",
                    facet.id === "route" && "font-mono text-xs",
                  )}
                >
                  {option.label}
                </Label>
              </Checkbox>
              <span className="text-xs text-fg-muted tabular-nums">
                {counts[option.id] ?? 0}
              </span>
            </div>
          ))}
        </div>
      </CollapsiblePanel>
    </Collapsible>
  )
}

function DetailRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5 text-sm compact:text-xs">
      <span className="text-fg-muted">{label}</span>
      <span className="min-w-0 truncate text-right">{children}</span>
    </div>
  )
}

function RequestPanel({
  request,
  onClose,
}: {
  request: Request
  onClose: () => void
}) {
  const lines = [
    {
      level: "info" as Level,
      text: `${request.method} ${request.path} started`,
    },
    ...(request.message
      ? [{ level: request.level, text: request.message }]
      : []),
    {
      level: "info" as Level,
      text: `Completed in ${request.duration}ms with ${request.status}`,
    },
  ]

  return (
    <aside
      aria-label="Request details"
      className="flex min-h-0 w-full shrink-0 flex-col border-l bg-bg max-xl:absolute max-xl:inset-y-0 max-xl:right-0 max-xl:z-10 max-xl:max-w-md xl:w-96"
    >
      <div className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <span className="font-mono text-xs text-fg-muted">
          {request.method}
        </span>
        <span className="min-w-0 truncate font-mono text-sm compact:text-xs">
          {request.path}
        </span>
        <div className="ml-auto flex items-center gap-0.5">
          <Button
            variant="quiet"
            size="sm"
            isIconOnly
            aria-label="Copy request ID"
          >
            <CopyIcon />
          </Button>
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
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        <DetailRow label="Status">
          <span className={cn("font-mono", statusClass(request.status))}>
            {request.status}
          </span>
        </DetailRow>
        <DetailRow label="Time">
          <span className="font-mono">Oct 28 {request.time}</span>
        </DetailRow>
        <DetailRow label="Duration">{request.duration}ms</DetailRow>
        <DetailRow label="Region">{request.region}</DetailRow>
        <DetailRow label="Host">{request.host}</DetailRow>
        <DetailRow label="Resource">{request.resource}</DetailRow>
        <DetailRow label="Request ID">
          <span className="font-mono text-xs">
            {request.region}::{request.id}-1730131
          </span>
        </DetailRow>
        <Separator className="my-3" />
        <div className="flex items-center justify-between pb-2">
          <span className="text-sm font-medium compact:text-xs">
            Runtime logs
          </span>
          <Badge size="sm" variant="neutral">
            {lines.length}
          </Badge>
        </div>
        <ol className="flex flex-col overflow-hidden rounded-(--studio-radius-card) border font-mono text-xs">
          {lines.map((line, index) => (
            <li
              key={index}
              className={cn(
                "flex gap-3 border-b px-3 py-2 last:border-b-0",
                line.level === "error" && "bg-danger-muted text-fg-danger",
                line.level === "warning" && "bg-warning-muted text-fg-warning",
              )}
            >
              <span className="shrink-0 text-fg-muted">
                {request.time.slice(3, 8)}
              </span>
              <span className="text-pretty">{line.text}</span>
            </li>
          ))}
        </ol>
        <Button variant="secondary" size="sm" className="mt-4 w-full">
          <ExternalLinkIcon />
          View in traces
        </Button>
      </div>
    </aside>
  )
}

export default function LogsBlock() {
  const [query, setQuery] = useState("")
  const [isLive, setLive] = useState(true)
  const [range, setRange] = useState("30m")
  const [filters, setFilters] = useState<Record<string, Set<string>>>({})
  const [openId, setOpenId] = useState<string | null>(null)

  const matchesFilters = (request: Request, skip?: string) =>
    FACETS.every((facet) => {
      if (facet.id === skip) return true
      const selected = filters[facet.id]
      return !selected?.size || selected.has(facet.read(request))
    })

  const matchesQuery = (request: Request) => {
    const q = query.trim().toLowerCase()
    return (
      !q ||
      `${request.path} ${request.message} ${request.status}`
        .toLowerCase()
        .includes(q)
    )
  }

  const visible = REQUESTS.filter((r) => matchesQuery(r) && matchesFilters(r))

  // Each facet counts against the other facets' filters, so its own
  // options stay comparable while you pick them.
  const counts: Record<string, Record<string, number>> = {}
  for (const facet of FACETS) {
    const facetCounts: Record<string, number> = {}
    for (const request of REQUESTS) {
      if (!matchesQuery(request) || !matchesFilters(request, facet.id)) continue
      const key = facet.read(request)
      facetCounts[key] = (facetCounts[key] ?? 0) + 1
    }
    counts[facet.id] = facetCounts
  }

  const toggle = (facet: string, option: string) =>
    setFilters((current) => {
      const next = new Set(current[facet])
      if (next.has(option)) next.delete(option)
      else next.add(option)
      return { ...current, [facet]: next }
    })

  const activeCount = Object.values(filters).reduce((n, s) => n + s.size, 0)
  const open = REQUESTS.find((r) => r.id === openId)

  return (
    <div className="flex h-svh min-h-svh flex-col bg-bg text-fg">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
        <BrandMark className="size-6">
          <span className="flex size-6 items-center justify-center rounded-(--studio-radius-item) bg-fg text-xs font-semibold text-bg">
            N
          </span>
        </BrandMark>
        <span className="text-sm font-medium compact:text-xs">
          <BrandName>Northwind</BrandName>
        </span>
        <span className="text-fg-muted">/</span>
        <span className="text-sm compact:text-xs">storefront</span>
        <Badge size="sm" variant="neutral">
          Production
        </Badge>
      </header>
      <Tabs selectedKey="logs" className="shrink-0 border-b px-2">
        <TabList
          variant="line"
          aria-label="Project"
          className="overflow-x-auto border-b-0"
        >
          {PROJECT_TABS.map((tab) => (
            <Tab key={tab} id={tab.toLowerCase()}>
              {tab}
            </Tab>
          ))}
        </TabList>
      </Tabs>

      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b px-4 py-2.5">
        <SearchField
          aria-label="Search logs"
          placeholder="Search logs…"
          value={query}
          onChange={setQuery}
          className="w-full max-w-md"
        />
        <Menu>
          <Button variant="secondary" size="sm">
            <ClockIcon />
            {
              {
                "30m": "Last 30 minutes",
                "1h": "Last hour",
                "12h": "Last 12 hours",
                "3d": "Last 3 days",
              }[range]
            }
            <ChevronDownIcon />
          </Button>
          <Popover placement="bottom start">
            <MenuContent
              className="min-w-44"
              selectionMode="single"
              selectedKeys={[range]}
              onAction={(key) => setRange(String(key))}
            >
              <MenuItem id="30m">Last 30 minutes</MenuItem>
              <MenuItem id="1h">Last hour</MenuItem>
              <MenuItem id="12h">Last 12 hours</MenuItem>
              <MenuItem id="3d">Last 3 days</MenuItem>
            </MenuContent>
          </Popover>
        </Menu>
        <ToggleButton
          variant="secondary"
          size="sm"
          isSelected={isLive}
          onChange={setLive}
        >
          <RadioIcon className={cn(isLive && "text-fg-success")} />
          Live
        </ToggleButton>
        {activeCount > 0 && (
          <Button variant="quiet" size="sm" onPress={() => setFilters({})}>
            <ListFilterIcon />
            Clear {activeCount} {activeCount === 1 ? "filter" : "filters"}
          </Button>
        )}
        <Button variant="quiet" size="sm" className="ml-auto">
          <DownloadIcon />
          Export
        </Button>
      </div>

      <div className="relative flex min-h-0 flex-1">
        <aside
          aria-label="Filters"
          className="hidden w-64 shrink-0 overflow-y-auto border-r md:block"
        >
          {FACETS.map((facet) => (
            <FacetGroup
              key={facet.id}
              facet={facet}
              counts={counts[facet.id] ?? {}}
              selected={filters[facet.id] ?? new Set()}
              onToggle={(option) => toggle(facet.id, option)}
            />
          ))}
        </aside>

        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="shrink-0 border-b px-4 pt-3 pb-2">
            <BarChart
              data={VOLUME}
              x="minute"
              y="requests"
              axes="x"
              grid={false}
              height={96}
              formatX={formatMinute}
              ariaLabel="Requests per minute, last 30 minutes"
            />
          </div>

          <div
            role="row"
            className="grid shrink-0 grid-cols-[7.5rem_3.5rem_minmax(0,14rem)_minmax(0,1fr)] gap-4 border-b px-4 py-2 text-xs font-medium text-fg-muted max-lg:grid-cols-[7.5rem_3.5rem_minmax(0,1fr)]"
          >
            <span>Time</span>
            <span>Status</span>
            <span>Request</span>
            <span className="max-lg:hidden">Messages</span>
          </div>
          <ul className="min-h-0 flex-1 overflow-y-auto font-mono text-xs">
            {visible.map((request) => (
              <li key={request.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(request.id)}
                  className={cn(
                    "relative grid w-full grid-cols-[7.5rem_3.5rem_minmax(0,14rem)_minmax(0,1fr)] gap-4 border-b border-border/60 px-4 py-1.5 text-left max-lg:grid-cols-[7.5rem_3.5rem_minmax(0,1fr)]",
                    request.level === "error" && "bg-danger-muted/50",
                    request.level === "warning" && "bg-warning-muted/40",
                    request.id === openId ? "bg-muted" : "hover:bg-muted",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-y-0 left-0 w-0.5",
                      request.level === "error" && "bg-danger",
                      request.level === "warning" && "bg-warning",
                    )}
                  />
                  <span className="text-fg-muted">{request.time}</span>
                  <span className={statusClass(request.status)}>
                    {request.status}
                  </span>
                  <span className="truncate">
                    <span className="text-fg-muted">{request.method}</span>{" "}
                    {request.path}
                  </span>
                  <span
                    className={cn(
                      "truncate max-lg:hidden",
                      request.level === "error"
                        ? "text-fg-danger"
                        : request.level === "warning"
                          ? "text-fg-warning"
                          : "text-fg-muted",
                    )}
                  >
                    {request.message || "—"}
                  </span>
                </button>
              </li>
            ))}
            {visible.length === 0 && (
              <li className="px-4 py-10 text-center font-sans text-sm text-fg-muted">
                No logs match these filters.
              </li>
            )}
          </ul>
          <div className="flex h-9 shrink-0 items-center gap-2 border-t px-4 text-xs text-fg-muted">
            {isLive && (
              <span className="size-1.5 animate-pulse rounded-full bg-success" />
            )}
            {isLive ? "Streaming new logs" : "Paused"}
            <span className="ml-auto tabular-nums">
              {visible.length} of {REQUESTS.length} requests
            </span>
          </div>
        </main>

        {open && (
          <RequestPanel
            key={open.id}
            request={open}
            onClose={() => setOpenId(null)}
          />
        )}
      </div>
    </div>
  )
}
