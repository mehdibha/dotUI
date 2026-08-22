"use client"

import { useMemo, useState } from "react"

import {
  ActivityIcon,
  ArrowUpRightIcon,
  BellIcon,
  CircleDotIcon,
  CopyIcon,
  DownloadIcon,
  FolderSearchIcon,
  InfoIcon,
  MoreHorizontalIcon,
  OctagonXIcon,
  RefreshCwIcon,
  SearchIcon,
  ServerIcon,
  TerminalIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  TriangleAlertIcon,
  XIcon,
} from "@/registry/icons"
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import {
  Disclosure,
  DisclosurePanel,
  DisclosureTrigger,
} from "@/registry/ui/disclosure"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/ui/empty"
import { Label } from "@/registry/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { Kbd } from "@/registry/ui/kbd"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/ui/pagination"
import { Popover } from "@/registry/ui/popover"
import {
  ProgressBar,
  ProgressBarControl,
  ProgressBarOutput,
} from "@/registry/ui/progress-bar"
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
import { Switch, SwitchControl } from "@/registry/ui/switch"
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
import { Tag, TagGroup, TagList } from "@/registry/ui/tag-group"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

/* ---------------------------------------------------------------------------
 * Logs — the observability console of "Meridian", a commerce platform: filter
 * bar, dense monospace event stream with expandable payloads, volume chart and
 * ingest health. Rendered inside the /create preview under the live system.
 * ------------------------------------------------------------------------- */

type Level = "error" | "warn" | "info" | "debug"

interface LogEntry {
  id: string
  time: string
  level: Level
  service: string
  message: string
  duration: string
  trace: string
  tags: string[]
  payload: Record<string, string | number | boolean>
}

const LEVEL_META: Record<
  Level,
  {
    label: string
    badge: "danger" | "warning" | "info" | "neutral"
    icon: typeof OctagonXIcon
    accent: string
    text: string
  }
> = {
  error: {
    label: "Error",
    badge: "danger",
    icon: OctagonXIcon,
    accent: "border-l-danger",
    text: "text-fg-danger",
  },
  warn: {
    label: "Warn",
    badge: "warning",
    icon: TriangleAlertIcon,
    accent: "border-l-warning",
    text: "text-fg-warning",
  },
  info: {
    label: "Info",
    badge: "info",
    icon: InfoIcon,
    accent: "border-l-info",
    text: "text-fg-info",
  },
  debug: {
    label: "Debug",
    badge: "neutral",
    icon: CircleDotIcon,
    accent: "border-l-border",
    text: "text-fg-muted",
  },
}

const SERVICES = [
  "api-gateway",
  "checkout-svc",
  "payments-worker",
  "auth-svc",
  "search-indexer",
  "notify-svc",
  "cdn-edge",
  "ledger-db",
]

const TIME_RANGES = [
  { id: "15m", label: "Last 15 minutes" },
  { id: "1h", label: "Last hour" },
  { id: "6h", label: "Last 6 hours" },
  { id: "24h", label: "Last 24 hours" },
  { id: "7d", label: "Last 7 days" },
]

const QUICK_FILTERS = [
  { id: "timeouts", label: "Timeouts", query: "timeout" },
  { id: "retries", label: "Retries", query: "retry" },
  { id: "auth", label: "Auth", query: "token" },
  { id: "checkout", label: "Checkout", query: "checkout" },
  { id: "throttling", label: "Throttling", query: "429" },
]

const ENTRIES: LogEntry[] = [
  {
    id: "evt_9f31c2",
    time: "14:32:07.918",
    level: "error",
    service: "checkout-svc",
    message:
      "POST /v2/carts/8f21b4/checkout — upstream timeout after 30000ms (stripe.charges.create)",
    duration: "30.0s",
    trace: "4b9c1ad7e2f04c81",
    tags: ["retryable", "upstream:stripe", "region:eu-west-1"],
    payload: {
      status: 504,
      cart_id: "cart_8f21b4",
      amount_cents: 24990,
      currency: "EUR",
      upstream: "api.stripe.com",
      attempt: 2,
      pod: "checkout-svc-7d94b8f6c-x2knq",
    },
  },
  {
    id: "evt_9f31be",
    time: "14:32:07.412",
    level: "warn",
    service: "payments-worker",
    message:
      "Retry 3/5 scheduled for charge ch_3PkX9Qb — provider responded 429 Too Many Requests",
    duration: "812ms",
    trace: "4b9c1ad7e2f04c81",
    tags: ["backoff", "queue:payments.high"],
    payload: {
      charge_id: "ch_3PkX9Qb",
      backoff_ms: 4000,
      attempt: 3,
      max_attempts: 5,
      queue_depth: 1842,
      pod: "payments-worker-5c6f8d9b4-rt7wz",
    },
  },
  {
    id: "evt_9f31b7",
    time: "14:32:06.980",
    level: "info",
    service: "api-gateway",
    message: "GET /v2/products?collection=winter-24&limit=48 200 in 84ms",
    duration: "84ms",
    trace: "1c72fe90a4b83d55",
    tags: ["cache:hit", "edge:fra1"],
    payload: {
      status: 200,
      bytes: 41822,
      cache: "HIT",
      client_ip: "82.14.220.7",
      user_agent: "Meridian-Web/4.18.2",
      pod: "api-gateway-6b7c5f4d9-mn41p",
    },
  },
  {
    id: "evt_9f31af",
    time: "14:32:06.744",
    level: "error",
    service: "auth-svc",
    message:
      "Refresh token rotation failed for session sess_2LmQ8v — signature mismatch, token revoked",
    duration: "31ms",
    trace: "8ae4062bb1c7490f",
    tags: ["security", "token:refresh"],
    payload: {
      status: 401,
      session_id: "sess_2LmQ8v",
      user_id: "usr_44182",
      issuer: "auth.meridian.io",
      key_id: "rk_2026_04",
      revoked: true,
    },
  },
  {
    id: "evt_9f31a3",
    time: "14:32:05.301",
    level: "debug",
    service: "search-indexer",
    message:
      "Flushed 1,204 documents to index products_v9 in 212ms (segment 41)",
    duration: "212ms",
    trace: "6d0f37c58e1a4b20",
    tags: ["index:products_v9"],
    payload: {
      documents: 1204,
      segment: 41,
      index_size_mb: 812.4,
      merge_pending: 2,
      pod: "search-indexer-0",
    },
  },
  {
    id: "evt_9f3198",
    time: "14:32:04.877",
    level: "error",
    service: "checkout-svc",
    message:
      "POST /v2/carts/1de907/checkout — inventory reservation conflict on SKU MRD-4471",
    duration: "146ms",
    trace: "b217c4d90e6f18aa",
    tags: ["conflict", "sku:MRD-4471"],
    payload: {
      status: 409,
      cart_id: "cart_1de907",
      sku: "MRD-4471",
      requested: 3,
      available: 1,
      warehouse: "wh-rotterdam",
    },
  },
  {
    id: "evt_9f3190",
    time: "14:32:04.115",
    level: "warn",
    service: "ledger-db",
    message:
      "Connection pool at 92% capacity (46/50) — queries queuing on replica eu-west-1b",
    duration: "—",
    trace: "0f5b8e2c74d93a16",
    tags: ["capacity", "replica:eu-west-1b"],
    payload: {
      pool_used: 46,
      pool_size: 50,
      wait_ms_p95: 118,
      replica: "eu-west-1b",
      lag_ms: 340,
    },
  },
  {
    id: "evt_9f3187",
    time: "14:32:03.602",
    level: "info",
    service: "notify-svc",
    message: "Dispatched 318 order-confirmation emails (batch btch_71ce)",
    duration: "1.4s",
    trace: "a94d2f18c0b76e33",
    tags: ["channel:email", "template:order-confirmation"],
    payload: {
      batch_id: "btch_71ce",
      delivered: 316,
      bounced: 2,
      provider: "postmark",
      template: "order-confirmation-v6",
    },
  },
  {
    id: "evt_9f317c",
    time: "14:32:02.948",
    level: "info",
    service: "cdn-edge",
    message:
      "Purged 4,912 cache keys for tag collection:winter-24 across 31 POPs",
    duration: "2.1s",
    trace: "3e7a10c9b45d8f22",
    tags: ["purge", "tag:collection:winter-24"],
    payload: {
      keys: 4912,
      pops: 31,
      origin_shield: "fra1",
      triggered_by: "deploy_4821",
    },
  },
  {
    id: "evt_9f3171",
    time: "14:32:02.310",
    level: "warn",
    service: "api-gateway",
    message:
      "Rate limit applied to key pk_live_9c22 — 429 returned for GET /v2/orders",
    duration: "6ms",
    trace: "5b8c0e7a2f9d1461",
    tags: ["ratelimit", "plan:growth"],
    payload: {
      status: 429,
      api_key: "pk_live_9c22",
      limit_per_min: 600,
      observed: 741,
      retry_after_s: 12,
    },
  },
  {
    id: "evt_9f3168",
    time: "14:32:01.774",
    level: "error",
    service: "payments-worker",
    message:
      "Charge ch_3PkW1Rd declined — issuer response do_not_honor, refund scheduled",
    duration: "1.9s",
    trace: "cd41a6b307e29f58",
    tags: ["decline", "issuer:revolut"],
    payload: {
      charge_id: "ch_3PkW1Rd",
      decline_code: "do_not_honor",
      amount_cents: 8990,
      currency: "GBP",
      order_id: "ord_58712",
    },
  },
  {
    id: "evt_9f3160",
    time: "14:32:01.203",
    level: "debug",
    service: "auth-svc",
    message:
      "JWKS cache refreshed — 4 signing keys loaded, next refresh in 15m",
    duration: "58ms",
    trace: "7f2a94c1d0e5b378",
    tags: ["cache:jwks"],
    payload: {
      keys: 4,
      ttl_s: 900,
      issuer: "auth.meridian.io",
      source: "vault://auth/jwks",
    },
  },
  {
    id: "evt_9f3159",
    time: "14:32:00.641",
    level: "info",
    service: "checkout-svc",
    message: "POST /v2/carts/77b210/checkout 201 in 412ms — order ord_58713",
    duration: "412ms",
    trace: "e13f8a0c6b924d77",
    tags: ["order:ord_58713"],
    payload: {
      status: 201,
      order_id: "ord_58713",
      amount_cents: 13450,
      currency: "EUR",
      payment_method: "card",
      items: 3,
    },
  },
  {
    id: "evt_9f3151",
    time: "14:31:59.982",
    level: "warn",
    service: "search-indexer",
    message:
      "Query latency p99 rose to 940ms on index products_v9 (target 400ms)",
    duration: "940ms",
    trace: "2b6d1f47a8c093e5",
    tags: ["slo:search-latency"],
    payload: {
      p50_ms: 88,
      p95_ms: 512,
      p99_ms: 940,
      target_ms: 400,
      shards: 12,
    },
  },
  {
    id: "evt_9f3148",
    time: "14:31:59.417",
    level: "error",
    service: "api-gateway",
    message:
      "Upstream checkout-svc returned 504 for POST /v2/carts/8f21b4/checkout",
    duration: "30.0s",
    trace: "4b9c1ad7e2f04c81",
    tags: ["upstream:checkout-svc", "5xx"],
    payload: {
      status: 504,
      upstream: "checkout-svc.prod.svc.cluster.local",
      timeout_ms: 30000,
      retries: 1,
      route: "/v2/carts/:id/checkout",
    },
  },
  {
    id: "evt_9f3140",
    time: "14:31:58.850",
    level: "info",
    service: "ledger-db",
    message: "Nightly compaction finished — 18.2 GB reclaimed across 6 tables",
    duration: "6m 12s",
    trace: "9c0e5b23f7a14d86",
    tags: ["maintenance"],
    payload: {
      reclaimed_gb: 18.2,
      tables: 6,
      duration_s: 372,
      next_run: "2026-08-23T02:00:00Z",
    },
  },
  {
    id: "evt_9f3138",
    time: "14:31:58.229",
    level: "debug",
    service: "cdn-edge",
    message: "Origin health probe fra1 → checkout-svc responded 200 in 41ms",
    duration: "41ms",
    trace: "1a4c7e93b6d20f58",
    tags: ["healthcheck", "pop:fra1"],
    payload: {
      status: 200,
      pop: "fra1",
      origin: "checkout-svc",
      consecutive_ok: 128,
    },
  },
  {
    id: "evt_9f3131",
    time: "14:31:57.604",
    level: "info",
    service: "notify-svc",
    message:
      "Webhook delivered to https://hooks.meridian.io/orders — 200 in 96ms",
    duration: "96ms",
    trace: "6e2b8d41c9f07a35",
    tags: ["webhook", "event:order.created"],
    payload: {
      status: 200,
      event: "order.created",
      subscription: "sub_1099",
      attempt: 1,
      signature_version: "v2",
    },
  },
]

/** Volume series behind the chart, one entry per selectable granularity. */
const VOLUME = {
  "1h": {
    labels: ["13:35", "13:45", "13:55", "14:05", "14:15", "14:25", "14:32"],
    errors: [6, 5, 9, 14, 22, 41, 37],
    warnings: [17, 15, 21, 28, 44, 73, 66],
    timeouts: [1, 2, 3, 6, 11, 19, 15],
  },
  "6h": {
    labels: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "14:30"],
    errors: [12, 15, 21, 44, 96, 142, 118],
    warnings: [38, 44, 57, 92, 168, 214, 190],
    timeouts: [3, 4, 7, 15, 40, 78, 63],
  },
  "24h": {
    labels: [
      "16:00",
      "18:00",
      "20:00",
      "22:00",
      "00:00",
      "02:00",
      "04:00",
      "06:00",
      "08:00",
      "10:00",
      "12:00",
      "14:00",
    ],
    errors: [18, 14, 11, 9, 12, 21, 34, 58, 96, 142, 118, 87],
    warnings: [46, 41, 38, 33, 44, 62, 88, 121, 168, 214, 190, 152],
    timeouts: [4, 3, 2, 2, 5, 9, 14, 27, 51, 78, 63, 41],
  },
} as const

type VolumeRange = keyof typeof VOLUME

const SUMMARY = [
  {
    id: "events",
    label: "Events ingested",
    value: "4.21M",
    caption: "last 24 hours",
    delta: "+8.4%",
    up: true,
    tone: "neutral" as const,
    color: "text-primary",
    series: [180, 164, 172, 190, 214, 236, 258, 291, 274, 302, 331, 356],
  },
  {
    id: "errors",
    label: "Errors",
    value: "1,842",
    caption: "618 in the last hour",
    delta: "+214%",
    up: true,
    tone: "danger" as const,
    color: "text-danger",
    series: [18, 14, 11, 9, 12, 21, 34, 58, 96, 142, 118, 87],
  },
  {
    id: "latency",
    label: "p95 latency",
    value: "214 ms",
    caption: "gateway, all routes",
    delta: "-6.2%",
    up: false,
    tone: "success" as const,
    color: "text-warning",
    series: [268, 254, 249, 238, 241, 233, 228, 246, 231, 224, 219, 214],
  },
  {
    id: "volume",
    label: "Ingest volume",
    value: "46.2 GB",
    caption: "62% of daily quota",
    delta: "+3.1%",
    up: true,
    tone: "neutral" as const,
    color: "text-info",
    series: [28, 30, 29, 33, 35, 34, 38, 40, 39, 42, 44, 46],
  },
]

const TOP_SOURCES = [
  {
    service: "checkout-svc",
    route: "POST /v2/carts/:id/checkout",
    events: 1284,
    rate: "3.4%",
    delta: "+214%",
    up: true,
  },
  {
    service: "payments-worker",
    route: "charge.retry",
    events: 612,
    rate: "1.9%",
    delta: "+88%",
    up: true,
  },
  {
    service: "auth-svc",
    route: "POST /oauth/token",
    events: 348,
    rate: "0.8%",
    delta: "+31%",
    up: true,
  },
  {
    service: "api-gateway",
    route: "GET /v2/products",
    events: 216,
    rate: "0.2%",
    delta: "-12%",
    up: false,
  },
  {
    service: "search-indexer",
    route: "index.flush",
    events: 94,
    rate: "0.1%",
    delta: "-4%",
    up: false,
  },
]

const PAGE_SIZE = 6

/* ------------------------------- Primitives ------------------------------- */

function Sparkline({
  values,
  className,
}: {
  values: number[]
  className?: string
}) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const span = max - min || 1
  const step = 100 / Math.max(1, values.length - 1)
  const points = values
    .map(
      (v, i) =>
        `${(i * step).toFixed(2)},${(30 - ((v - min) / span) * 26).toFixed(2)}`,
    )
    .join(" ")

  return (
    <svg
      viewBox="0 0 100 32"
      preserveAspectRatio="none"
      aria-hidden
      className={cn("h-8 w-full", className)}
    >
      <polyline
        points={points}
        className="fill-none stroke-current"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

function polyline(values: readonly number[], max: number) {
  const step = 100 / Math.max(1, values.length - 1)
  return values
    .map(
      (v, i) => `${(i * step).toFixed(2)},${(100 - (v / max) * 92).toFixed(2)}`,
    )
    .join(" ")
}

function VolumeChart({ range }: { range: VolumeRange }) {
  const data = VOLUME[range]
  const max = Math.max(...data.warnings)
  const series = [
    { key: "warnings", label: "Warnings", stroke: "stroke-warning" },
    { key: "errors", label: "Errors", stroke: "stroke-danger" },
    { key: "timeouts", label: "Timeouts", stroke: "stroke-info" },
  ] as const

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {series.map((s) => (
          <span
            key={s.key}
            className="flex items-center gap-1.5 text-xs text-fg-muted"
          >
            <span
              aria-hidden
              className={cn(
                "h-0.5 w-4 rounded-full",
                s.key === "warnings" && "bg-warning",
                s.key === "errors" && "bg-danger",
                s.key === "timeouts" && "bg-info",
              )}
            />
            {s.label}
          </span>
        ))}
        <span className="ml-auto font-mono text-xs text-fg-muted tabular-nums">
          peak {max}/interval
        </span>
      </div>
      <div className="relative h-44 w-full rounded-md border border-border-muted bg-muted/30">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          role="img"
          aria-label="Event volume by severity"
          className="h-full w-full"
        >
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              x2="100"
              y1={y}
              y2={y}
              className="stroke-border-muted"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {series.map((s) => (
            <polyline
              key={s.key}
              points={polyline(data[s.key], max)}
              className={cn("fill-none", s.stroke)}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      </div>
      <div className="flex justify-between gap-1 overflow-hidden font-mono text-[10px] text-fg-muted tabular-nums">
        {data.labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  )
}

function LevelBadge({ level }: { level: Level }) {
  const meta = LEVEL_META[level]
  const Icon = meta.icon
  return (
    <Badge
      variant={meta.badge}
      appearance="subtle"
      size="sm"
      className="font-mono uppercase"
    >
      <Icon aria-hidden />
      {meta.label}
    </Badge>
  )
}

function LogRow({ entry }: { entry: LogEntry }) {
  const meta = LEVEL_META[entry.level]
  const raw = {
    timestamp: `2026-08-22T${entry.time}Z`,
    level: entry.level,
    service: entry.service,
    message: entry.message,
    trace_id: entry.trace,
    duration: entry.duration,
    ...entry.payload,
  }

  return (
    <Disclosure
      className={cn(
        "border-b border-l-2 border-b-border-muted last:border-b-0",
        meta.accent,
        entry.level === "error" && "bg-danger-muted/25",
      )}
    >
      <DisclosureTrigger className="rounded-none px-3 py-2 font-normal hover:bg-muted/50">
        <div className="grid w-full grid-cols-[5.5rem_1fr] items-center gap-x-3 gap-y-1 text-left md:grid-cols-[6.5rem_6rem_9rem_1fr]">
          <span className="font-mono text-xs text-fg-muted tabular-nums">
            {entry.time}
          </span>
          <span className="justify-self-start">
            <LevelBadge level={entry.level} />
          </span>
          <span className="col-span-2 min-w-0 truncate font-mono text-xs text-fg-muted md:col-span-1">
            {entry.service}
          </span>
          <span
            className={cn(
              "col-span-2 min-w-0 truncate font-mono text-xs md:col-span-1",
              entry.level === "error" ? meta.text : "text-fg",
            )}
          >
            {entry.message}
          </span>
        </div>
      </DisclosureTrigger>
      <DisclosurePanel>
        <div className="grid gap-4 px-3 pb-1 lg:grid-cols-2">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {entry.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="neutral"
                  appearance="subtle"
                  size="sm"
                  className="font-mono"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <dl className="grid grid-cols-[8rem_1fr] gap-x-3 gap-y-1.5 font-mono text-xs">
              <dt className="text-fg-muted">event_id</dt>
              <dd className="min-w-0 truncate text-fg">{entry.id}</dd>
              <dt className="text-fg-muted">trace_id</dt>
              <dd className="min-w-0 truncate text-fg">{entry.trace}</dd>
              <dt className="text-fg-muted">duration</dt>
              <dd className="text-fg tabular-nums">{entry.duration}</dd>
              {Object.entries(entry.payload).map(([key, value]) => (
                <div key={key} className="col-span-2 grid grid-cols-subgrid">
                  <dt className="text-fg-muted">{key}</dt>
                  <dd className="min-w-0 truncate text-fg">{String(value)}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary">
                <CopyIcon />
                Copy JSON
              </Button>
              <Button size="sm" variant="quiet">
                <ArrowUpRightIcon />
                Open trace
              </Button>
              <Button size="sm" variant="quiet">
                <BellIcon />
                Alert on pattern
              </Button>
            </div>
          </div>
          <div className="min-w-0">
            <p className="mb-1.5 text-[10px] font-medium tracking-widest text-fg-muted uppercase">
              Raw event
            </p>
            <pre className="max-h-56 overflow-auto rounded-md border border-border-muted bg-muted/50 p-3 font-mono text-xs leading-relaxed text-fg">
              {JSON.stringify(raw, null, 2)}
            </pre>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}

/* ---------------------------------- Page ---------------------------------- */

export default function LogsBlock() {
  const [query, setQuery] = useState("")
  const [level, setLevel] = useState<Level | "all">("all")
  const [service, setService] = useState("all")
  const [range, setRange] = useState("1h")
  const [quick, setQuick] = useState<string | null>(null)
  const [live, setLive] = useState(true)
  const [chartRange, setChartRange] = useState<VolumeRange>("6h")
  const [incidentOpen, setIncidentOpen] = useState(true)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return ENTRIES.filter((entry) => {
      if (level !== "all" && entry.level !== level) return false
      if (service !== "all" && entry.service !== service) return false
      if (!needle) return true
      return (
        entry.message.toLowerCase().includes(needle) ||
        entry.service.toLowerCase().includes(needle) ||
        entry.trace.includes(needle) ||
        entry.tags.some((tag) => tag.toLowerCase().includes(needle))
      )
    })
  }, [query, level, service])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const visible = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )
  const from = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const to = Math.min(safePage * PAGE_SIZE, filtered.length)
  const rangeLabel =
    TIME_RANGES.find((r) => r.id === range)?.label ?? "Last hour"

  const resetFilters = () => {
    setQuery("")
    setLevel("all")
    setService("all")
    setQuick(null)
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-20 border-b border-border-muted bg-bg/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-fg-on-primary">
            <ActivityIcon className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              Meridian Observability
            </p>
            <Breadcrumbs className="hidden sm:flex">
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Platform</BreadcrumbLink>
                <BreadcrumbSeparator />
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">production</BreadcrumbLink>
                <BreadcrumbSeparator />
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink>Logs</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumbs>
          </div>
          <Tooltip>
            <Button size="sm" variant="quiet" isIconOnly aria-label="Refresh">
              <RefreshCwIcon />
            </Button>
            <TooltipContent>Refresh · updated 4s ago</TooltipContent>
          </Tooltip>
          <Button
            size="sm"
            variant="secondary"
            className="hidden sm:inline-flex"
          >
            <DownloadIcon />
            Export
          </Button>
          <Menu>
            <Button
              size="sm"
              variant="quiet"
              isIconOnly
              aria-label="More actions"
            >
              <MoreHorizontalIcon />
            </Button>
            <Popover>
              <MenuContent>
                <MenuItem>Save current view</MenuItem>
                <MenuItem>Create alert from query</MenuItem>
                <MenuItem>Manage pipelines</MenuItem>
                <MenuItem>Retention settings</MenuItem>
              </MenuContent>
            </Popover>
          </Menu>
          <Avatar size="sm">
            <AvatarFallback>AR</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1">
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              Logs
            </h1>
            <p className="text-sm text-fg-muted">
              {rangeLabel} · 8 services · retention 30 days
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={live ? "success" : "neutral"} appearance="subtle">
              {live ? (
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-success" />
                </span>
              ) : null}
              {live ? "Streaming" : "Paused"}
            </Badge>
            <Button size="sm" variant="primary">
              <BellIcon />
              Create alert
            </Button>
          </div>
        </div>

        {incidentOpen && (
          <Alert variant="warning" className="relative pr-10">
            <AlertTitle>Elevated 5xx rate on checkout-svc</AlertTitle>
            <AlertDescription>
              3.4% of requests failed in the last 15 minutes, up from 0.1%.
              Upstream timeouts to the payment provider are the leading cause.
            </AlertDescription>
            <Button
              size="sm"
              variant="quiet"
              isIconOnly
              aria-label="Dismiss incident banner"
              className="absolute top-2 right-2"
              onPress={() => setIncidentOpen(false)}
            >
              <XIcon />
            </Button>
          </Alert>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {SUMMARY.map((stat) => (
            <Card key={stat.id} size="sm">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-fg-muted">
                  {stat.label}
                </CardTitle>
                <CardAction>
                  <Badge variant={stat.tone} appearance="subtle" size="sm">
                    {stat.up ? (
                      <TrendingUpIcon aria-hidden />
                    ) : (
                      <TrendingDownIcon aria-hidden />
                    )}
                    {stat.delta}
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-2xl font-semibold tabular-nums">
                  {stat.value}
                </p>
                <Sparkline values={stat.series} className={stat.color} />
                <p className="text-xs text-fg-muted">{stat.caption}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Event volume</CardTitle>
            <CardDescription>
              Errors, warnings and upstream timeouts per interval
            </CardDescription>
            <CardAction>
              <SegmentedControl
                aria-label="Chart range"
                selectedKeys={[chartRange]}
                onSelectionChange={(keys) => {
                  const next = [...keys][0]
                  if (typeof next === "string")
                    setChartRange(next as VolumeRange)
                }}
              >
                <SegmentedControlItem id="1h">1H</SegmentedControlItem>
                <SegmentedControlItem id="6h">6H</SegmentedControlItem>
                <SegmentedControlItem id="24h">24H</SegmentedControlItem>
              </SegmentedControl>
            </CardAction>
          </CardHeader>
          <CardContent>
            <VolumeChart range={chartRange} />
          </CardContent>
          <CardFooter className="justify-between gap-3 text-sm text-fg-muted">
            <span>Error rate 0.42% · SLO budget 61% remaining</span>
            <Button size="sm" variant="quiet">
              Open dashboard
              <ArrowUpRightIcon />
            </Button>
          </CardFooter>
        </Card>

        <section className="flex flex-col gap-3 rounded-lg border border-border-muted bg-card p-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
            <SearchField
              aria-label="Search logs"
              value={query}
              onChange={(value) => {
                setQuery(value)
                setPage(1)
              }}
              className="min-w-0 flex-1"
            >
              <InputGroup>
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
                <Input placeholder="Search messages, services, trace IDs…" />
                <InputGroupAddon>
                  <Kbd>/</Kbd>
                </InputGroupAddon>
              </InputGroup>
            </SearchField>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex lg:items-end">
              <Select
                className="lg:w-36"
                selectedKey={level}
                onSelectionChange={(key) => {
                  setLevel(key as Level | "all")
                  setPage(1)
                }}
              >
                <Label>Severity</Label>
                <SelectTrigger />
                <SelectContent>
                  <SelectItem id="all">All levels</SelectItem>
                  <SelectItem id="error">Error</SelectItem>
                  <SelectItem id="warn">Warn</SelectItem>
                  <SelectItem id="info">Info</SelectItem>
                  <SelectItem id="debug">Debug</SelectItem>
                </SelectContent>
              </Select>
              <Select
                className="lg:w-44"
                selectedKey={service}
                onSelectionChange={(key) => {
                  setService(String(key))
                  setPage(1)
                }}
              >
                <Label>Service</Label>
                <SelectTrigger />
                <SelectContent>
                  <SelectItem id="all">All services</SelectItem>
                  {SERVICES.map((name) => (
                    <SelectItem key={name} id={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                className="lg:w-48"
                selectedKey={range}
                onSelectionChange={(key) => setRange(String(key))}
              >
                <Label>Time range</Label>
                <SelectTrigger />
                <SelectContent>
                  {TIME_RANGES.map((item) => (
                    <SelectItem key={item.id} id={item.id}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Switch
                isSelected={live}
                onChange={setLive}
                className="col-span-2 sm:col-span-1 lg:pb-2"
              >
                <SwitchControl />
                <Label>Live tail</Label>
              </Switch>
            </div>
          </div>
          <Separator />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <TagGroup
              selectionMode="single"
              selectedKeys={quick ? [quick] : []}
              onSelectionChange={(keys) => {
                const next = [...keys][0]
                const id = typeof next === "string" ? next : null
                setQuick(id)
                setQuery(
                  QUICK_FILTERS.find((item) => item.id === id)?.query ?? "",
                )
                setPage(1)
              }}
            >
              <Label className="sr-only">Quick filters</Label>
              <TagList>
                {QUICK_FILTERS.map((item) => (
                  <Tag key={item.id} id={item.id}>
                    {item.label}
                  </Tag>
                ))}
              </TagList>
            </TagGroup>
            <span className="font-mono text-xs text-fg-muted tabular-nums">
              {filtered.length} of {ENTRIES.length} events match
            </span>
          </div>
        </section>

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <TerminalIcon className="size-4 text-fg-muted" />
              Event stream
            </CardTitle>
            <CardDescription>
              {rangeLabel} · sorted newest first
            </CardDescription>
            <CardAction>
              <Menu>
                <Button
                  size="sm"
                  variant="quiet"
                  isIconOnly
                  aria-label="Stream options"
                >
                  <MoreHorizontalIcon />
                </Button>
                <Popover>
                  <MenuContent>
                    <MenuItem>Download as NDJSON</MenuItem>
                    <MenuItem>Copy query link</MenuItem>
                    <MenuItem>Show timestamps in UTC</MenuItem>
                    <MenuItem variant="danger">Clear stream buffer</MenuItem>
                  </MenuContent>
                </Popover>
              </Menu>
            </CardAction>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <div className="md:min-w-[36rem]">
                <div className="hidden grid-cols-[6.5rem_6rem_9rem_1fr] gap-x-3 border-b border-border-muted px-3 py-2 pl-[calc(0.75rem+2px)] text-[10px] font-medium tracking-widest text-fg-muted uppercase md:grid">
                  <span>Time</span>
                  <span>Level</span>
                  <span>Service</span>
                  <span>Message</span>
                </div>
                {visible.length > 0 ? (
                  visible.map((entry) => (
                    <LogRow key={entry.id} entry={entry} />
                  ))
                ) : (
                  <Empty className="py-10">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <FolderSearchIcon />
                      </EmptyMedia>
                      <EmptyTitle>No events match this query</EmptyTitle>
                      <EmptyDescription>
                        Widen the time range or clear the active filters to see
                        the full stream again.
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <Button variant="secondary" onPress={resetFilters}>
                        Clear filters
                      </Button>
                    </EmptyContent>
                  </Empty>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-center justify-between gap-3 border-t sm:flex-row">
            <span className="text-sm text-fg-muted tabular-nums">
              Showing {from}–{to} of {filtered.length} events
            </span>
            <Pagination>
              <PaginationList>
                <PaginationItem>
                  <PaginationPrevious
                    isDisabled={safePage === 1}
                    onPress={() => setPage((p) => Math.max(1, p - 1))}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        isActive={p === safePage}
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
                    isDisabled={safePage === totalPages}
                    onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                  />
                </PaginationItem>
              </PaginationList>
            </Pagination>
          </CardFooter>
        </Card>

        <section className="grid gap-4 lg:grid-cols-3">
          <Card className="min-w-0 lg:col-span-2">
            <CardHeader>
              <CardTitle>Top error sources</CardTitle>
              <CardDescription>
                Failing routes and jobs in the last 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TableContainer>
                <Table aria-label="Top error sources">
                  <TableHeader>
                    <TableColumn isRowHeader>Service</TableColumn>
                    <TableColumn>Route</TableColumn>
                    <TableColumn className="text-right">Events</TableColumn>
                    <TableColumn className="text-right">Error rate</TableColumn>
                    <TableColumn className="text-right">Trend</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {TOP_SOURCES.map((source) => (
                      <TableRow key={source.service}>
                        <TableCell className="font-mono text-xs">
                          {source.service}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-fg-muted">
                          {source.route}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {source.events.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {source.rate}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={source.up ? "danger" : "success"}
                            appearance="subtle"
                            size="sm"
                          >
                            {source.up ? (
                              <TrendingUpIcon aria-hidden />
                            ) : (
                              <TrendingDownIcon aria-hidden />
                            )}
                            {source.delta}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={2}>Total</TableCell>
                      <TableCell className="text-right tabular-nums">
                        2,554
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        0.42%
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ServerIcon className="size-4 text-fg-muted" />
                Ingest health
              </CardTitle>
              <CardDescription>Cluster meridian-eu-1</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProgressBar value={62} className="w-full">
                <div className="flex items-center justify-between gap-2">
                  <Label>Daily ingest quota</Label>
                  <ProgressBarOutput />
                </div>
                <ProgressBarControl />
              </ProgressBar>
              <ProgressBar value={68} className="w-full">
                <div className="flex items-center justify-between gap-2">
                  <Label>Hot storage</Label>
                  <ProgressBarOutput />
                </div>
                <ProgressBarControl />
              </ProgressBar>
              <ProgressBar value={41} className="w-full">
                <div className="flex items-center justify-between gap-2">
                  <Label>Index shards</Label>
                  <ProgressBarOutput />
                </div>
                <ProgressBarControl />
              </ProgressBar>
              <Separator />
              <dl className="grid grid-cols-2 gap-y-2 text-sm">
                <dt className="text-fg-muted">Pipelines</dt>
                <dd className="text-right tabular-nums">12 active</dd>
                <dt className="text-fg-muted">Dropped events</dt>
                <dd className="text-right tabular-nums">0</dd>
                <dt className="text-fg-muted">Ingest lag</dt>
                <dd className="text-right tabular-nums">1.2s</dd>
              </dl>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" className="w-full">
                Manage retention
              </Button>
            </CardFooter>
          </Card>
        </section>

        <p className="pb-2 text-center text-xs text-fg-muted">
          Meridian Observability · region eu-west-1 · all times UTC
        </p>
      </main>
    </div>
  )
}
