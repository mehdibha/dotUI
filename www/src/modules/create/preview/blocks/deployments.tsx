"use client"

import * as React from "react"

import {
  ActivityIcon,
  ArrowUpRightIcon,
  CheckIcon,
  CircleCheckIcon,
  CircleDashedIcon,
  CircleIcon,
  CodeIcon,
  CopyIcon,
  ExternalLinkIcon,
  GitBranchIcon,
  GlobeIcon,
  ImageIcon,
  InfoIcon,
  MoreHorizontalIcon,
  RefreshCwIcon,
  RotateCwIcon,
  SearchIcon,
  ServerIcon,
  ShieldCheckIcon,
  TerminalIcon,
  TimerIcon,
  XCircleIcon,
  XIcon,
  ZapIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/registry/ui/alert"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/registry/ui/avatar"
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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/ui/empty"
import { Label } from "@/registry/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { Kbd } from "@/registry/ui/kbd"
import { Loader } from "@/registry/ui/loader"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Modal } from "@/registry/ui/modal"
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

type DeployStatus = "ready" | "building" | "error" | "canceled"
type EnvKind = "production" | "preview"

interface Deployment {
  id: string
  hash: string
  message: string
  branch: string
  env: EnvKind
  status: DeployStatus
  age: string
  author: string
  initials: string
  /** Build step the deployment is running, failed or was canceled on. */
  step: number
  /** Per-deployment multiplier applied to each step's base duration. */
  pace: number
}

const LIVE_PREVIEW: Deployment = {
  id: "dpl_9Kc2Ra",
  hash: "9kc2ra1",
  message: "fix(billing): guard against a null subscription in the webhook",
  branch: "fix/billing-webhook",
  env: "preview",
  status: "building",
  age: "2m ago",
  author: "Mara Fontaine",
  initials: "MF",
  step: 3,
  pace: 1,
}

const LIVE_PRODUCTION: Deployment = {
  id: "dpl_7Hq4Vd",
  hash: "7hq4vd8",
  message: "feat(checkout): remember saved payment methods",
  branch: "main",
  env: "production",
  status: "ready",
  age: "26m ago",
  author: "Dev Okafor",
  initials: "DO",
  step: 6,
  pace: 0.92,
}

const DEPLOYMENTS: Deployment[] = [
  LIVE_PREVIEW,
  LIVE_PRODUCTION,
  {
    id: "dpl_5Bn8Tz",
    hash: "5bn8tz3",
    message: "chore(deps): bump react-aria-components to 1.20",
    branch: "main",
    env: "production",
    status: "ready",
    age: "3h ago",
    author: "Priya Raghavan",
    initials: "PR",
    step: 6,
    pace: 1.08,
  },
  {
    id: "dpl_4Xu1Ls",
    hash: "4xu1ls6",
    message: "refactor(api): move usage metering into a background worker",
    branch: "feat/metering-worker",
    env: "preview",
    status: "error",
    age: "5h ago",
    author: "Tomas Brandt",
    initials: "TB",
    step: 4,
    pace: 0.85,
  },
  {
    id: "dpl_3Ge6Wp",
    hash: "3ge6wp0",
    message: "feat(dashboard): daily active teams sparkline",
    branch: "feat/dau-sparkline",
    env: "preview",
    status: "ready",
    age: "8h ago",
    author: "Mara Fontaine",
    initials: "MF",
    step: 6,
    pace: 1.24,
  },
  {
    id: "dpl_2Ld0Qm",
    hash: "2ld0qm4",
    message: "fix(auth): refresh the SAML session before redirecting",
    branch: "main",
    env: "production",
    status: "ready",
    age: "Yesterday",
    author: "Dev Okafor",
    initials: "DO",
    step: 6,
    pace: 0.88,
  },
  {
    id: "dpl_1Za5Cy",
    hash: "1za5cy9",
    message: "test(e2e): cover the invite acceptance flow",
    branch: "chore/e2e-invites",
    env: "preview",
    status: "canceled",
    age: "Yesterday",
    author: "Priya Raghavan",
    initials: "PR",
    step: 2,
    pace: 0.7,
  },
  {
    id: "dpl_0Rt3Nh",
    hash: "0rt3nh5",
    message: "feat(billing): usage-based invoicing for team plans",
    branch: "main",
    env: "production",
    status: "ready",
    age: "2d ago",
    author: "Tomas Brandt",
    initials: "TB",
    step: 6,
    pace: 1.32,
  },
]

/** The production build traffic falls back to when the live one is rolled back. */
const PREVIOUS_PRODUCTION = DEPLOYMENTS.find(
  (deployment) =>
    deployment.env === "production" && deployment.id !== LIVE_PRODUCTION.id,
)

/** Only a finished production build that is not already live can take traffic. */
function canRollBackTo(deployment: Deployment) {
  return (
    deployment.env === "production" &&
    deployment.status === "ready" &&
    deployment.id !== LIVE_PRODUCTION.id
  )
}

function deploymentHost(deployment: Deployment) {
  return `halcyon-web-${deployment.hash}.halcyon.app`
}

const BUILD_STEPS = [
  {
    id: "queue",
    name: "Queued",
    base: 4,
    logs: [
      "Deployment created from a push to the repository",
      "Waiting for a builder in sfo1 · 4 vCPU, 8 GB",
    ],
  },
  {
    id: "clone",
    name: "Cloning repository",
    base: 8,
    logs: [
      "Cloning github.com/halcyon-labs/halcyon-web",
      "Fetching 1 commit, depth 1",
      "Checked out working tree in 1.4s",
    ],
  },
  {
    id: "install",
    name: "Installing dependencies",
    base: 36,
    logs: [
      "Detected pnpm 9.12.0 from packageManager",
      "Lockfile up to date, resolution step skipped",
      "Packages: +1284 · reused 1281, downloaded 3",
      "Done in 33.8s",
    ],
  },
  {
    id: "build",
    name: "Building application",
    base: 64,
    logs: [
      "> halcyon-web@2.14.0 build",
      "Compiled 412 modules in 51.2s",
      "Route /              92.4 kB first load",
      "Route /billing      108.1 kB first load",
    ],
  },
  {
    id: "checks",
    name: "Running checks",
    base: 22,
    logs: [
      "Lint      0 errors, 3 warnings",
      "Types     0 errors",
      "Unit      284 passed, 0 failed",
    ],
  },
  {
    id: "upload",
    name: "Uploading build outputs",
    base: 12,
    logs: [
      "Uploaded 1,204 static assets · 18.6 MB",
      "Build cache written in 2.1s",
    ],
  },
  {
    id: "assign",
    name: "Assigning domains",
    base: 5,
    logs: [
      "Assigned halcyon.app",
      "Assigned www.halcyon.app",
      "Propagated to 21 edge regions",
    ],
  },
]

type StepState = "done" | "running" | "failed" | "canceled" | "pending"

function stepState(deployment: Deployment, index: number): StepState {
  if (index < deployment.step) return "done"
  if (index > deployment.step) return "pending"
  if (deployment.status === "building") return "running"
  if (deployment.status === "error") return "failed"
  if (deployment.status === "canceled") return "canceled"
  return "done"
}

function stepSeconds(deployment: Deployment, index: number) {
  return Math.round((BUILD_STEPS[index]?.base ?? 0) * deployment.pace)
}

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  return `${minutes}m ${String(seconds % 60).padStart(2, "0")}s`
}

function totalSeconds(deployment: Deployment) {
  return BUILD_STEPS.reduce((sum, _, index) => {
    const state = stepState(deployment, index)
    return state === "pending" ? sum : sum + stepSeconds(deployment, index)
  }, 0)
}

const STATUS_LABEL: Record<DeployStatus, string> = {
  ready: "Ready",
  building: "Building",
  error: "Error",
  canceled: "Canceled",
}

function StatusMark({ status }: { status: DeployStatus }) {
  if (status === "building") {
    return (
      <span className="inline-flex items-center gap-2 whitespace-nowrap">
        <Loader aria-label="Building" className="[&_svg]:size-3.5" />
        Building
      </span>
    )
  }
  const Icon =
    status === "ready"
      ? CircleCheckIcon
      : status === "error"
        ? XCircleIcon
        : CircleDashedIcon
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 whitespace-nowrap",
        status === "ready" && "text-success",
        status === "error" && "text-danger",
        status === "canceled" && "text-fg-muted",
      )}
    >
      <Icon aria-hidden className="size-3.5 shrink-0" />
      {STATUS_LABEL[status]}
    </span>
  )
}

function EnvBadge({ env }: { env: EnvKind }) {
  return (
    <Badge
      appearance="subtle"
      variant={env === "production" ? "accent" : "neutral"}
      size="sm"
    >
      {env === "production" ? "Production" : "Preview"}
    </Badge>
  )
}

function BranchBadge({ branch }: { branch: string }) {
  return (
    <span className="inline-flex max-w-40 items-center gap-1.5 text-fg-muted">
      <GitBranchIcon aria-hidden className="size-3.5 shrink-0" />
      <span className="truncate font-mono text-xs">{branch}</span>
    </span>
  )
}

function CopyUrlButton({
  url,
  copied,
  onCopy,
}: {
  url: string
  copied: boolean
  onCopy: (url: string) => void
}) {
  return (
    <Tooltip>
      <Button
        variant="quiet"
        size="sm"
        isIconOnly
        aria-label={`Copy ${url}`}
        onPress={() => onCopy(url)}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </Button>
      <TooltipContent>{copied ? "Copied" : "Copy URL"}</TooltipContent>
    </Tooltip>
  )
}

function MetaRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="shrink-0 text-fg-muted">{label}</span>
      <span className="min-w-0 truncate text-right">{children}</span>
    </div>
  )
}

function EnvironmentCard({
  name,
  description,
  url,
  deployment,
  copied,
  onCopy,
  onRedeploy,
  secondaryAction,
}: {
  name: string
  description: string
  url: string
  deployment: Deployment
  copied: boolean
  onCopy: (url: string) => void
  onRedeploy: (deployment: Deployment) => void
  secondaryAction: { label: string; onPress: () => void }
}) {
  const running = deployment.status === "building"
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {name}
          <Badge
            appearance="subtle"
            size="sm"
            variant={
              deployment.status === "ready"
                ? "success"
                : deployment.status === "error"
                  ? "danger"
                  : running
                    ? "warning"
                    : "neutral"
            }
          >
            {STATUS_LABEL[deployment.status]}
          </Badge>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <Tooltip>
            <Button
              variant="quiet"
              size="sm"
              isIconOnly
              aria-label={`Visit ${url}`}
            >
              <ArrowUpRightIcon />
            </Button>
            <TooltipContent>Open deployment</TooltipContent>
          </Tooltip>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-2 rounded-md border bg-muted/40 py-1 pr-1 pl-2.5">
          <GlobeIcon aria-hidden className="size-3.5 shrink-0 text-fg-muted" />
          <span className="min-w-0 flex-1 truncate font-mono text-xs">
            {url}
          </span>
          <CopyUrlButton url={url} copied={copied} onCopy={onCopy} />
        </div>
        <div className="divide-y text-sm">
          <MetaRow label="Commit">
            <span className="font-mono text-xs">{deployment.hash}</span>
          </MetaRow>
          <MetaRow label="Branch">
            <span className="font-mono text-xs">{deployment.branch}</span>
          </MetaRow>
          <MetaRow label="Deployed">
            {deployment.age} by {deployment.author}
          </MetaRow>
          <MetaRow label="Build time">
            <span className="tabular-nums">
              {formatDuration(totalSeconds(deployment))}
            </span>
          </MetaRow>
        </div>
      </CardContent>
      <CardFooter className="gap-2 border-t">
        <Button
          size="sm"
          variant="secondary"
          onPress={() => onRedeploy(deployment)}
        >
          <RotateCwIcon />
          Redeploy
        </Button>
        <Button size="sm" variant="quiet" onPress={secondaryAction.onPress}>
          {secondaryAction.label}
        </Button>
      </CardFooter>
    </Card>
  )
}

function ActivityCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ActivityIcon aria-hidden className="size-4 text-fg-muted" />
          Last 7 days
        </CardTitle>
        <CardDescription>halcyon-web · all environments</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Deploys", value: "48" },
            { label: "Success", value: "96%" },
            { label: "Median", value: "1m 58s" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col gap-0.5 rounded-md border bg-muted/40 px-3 py-2"
            >
              <span className="text-lg font-semibold tabular-nums">
                {stat.value}
              </span>
              <span className="text-xs text-fg-muted">{stat.label}</span>
            </div>
          ))}
        </div>
        <ProgressBar
          value={412}
          maxValue={1000}
          valueLabel="412 of 1,000"
          className="w-full"
        >
          <div className="flex items-center justify-between gap-2 text-sm">
            <Label className="text-fg-muted">Build minutes</Label>
            <ProgressBarOutput className="tabular-nums" />
          </div>
          <ProgressBarControl />
        </ProgressBar>
        <div className="flex items-center gap-2 text-sm text-fg-muted">
          <ShieldCheckIcon aria-hidden className="size-4 shrink-0" />
          Protection is on for every preview URL.
        </div>
      </CardContent>
    </Card>
  )
}

const STEP_ICON: Record<StepState, typeof CircleIcon> = {
  done: CircleCheckIcon,
  running: CircleIcon,
  failed: XCircleIcon,
  canceled: CircleDashedIcon,
  pending: CircleIcon,
}

const STEP_TONE: Record<StepState, string> = {
  done: "text-success",
  running: "text-warning",
  failed: "text-danger",
  canceled: "text-fg-muted",
  pending: "text-fg-muted",
}

function BuildTimeline({ deployment }: { deployment: Deployment }) {
  return (
    <div className="flex flex-col">
      {BUILD_STEPS.map((step, index) => {
        const state = stepState(deployment, index)
        const Icon = STEP_ICON[state]
        const isLast = index === BUILD_STEPS.length - 1
        const seconds = stepSeconds(deployment, index)
        return (
          <div key={step.id} className="relative pl-8">
            {!isLast && (
              <span
                aria-hidden
                className="absolute top-8 bottom-0 left-[11px] w-px bg-border"
              />
            )}
            <span
              aria-hidden
              className={cn(
                "absolute top-2.5 left-0 flex size-6 items-center justify-center rounded-full border bg-bg",
                STEP_TONE[state],
              )}
            >
              {state === "running" ? (
                <Loader className="[&_svg]:size-3" />
              ) : (
                <Icon className="size-3.5" />
              )}
            </span>
            <Disclosure
              defaultExpanded={state === "running" || state === "failed"}
            >
              <DisclosureTrigger>
                <span className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="min-w-0 flex-1 truncate">{step.name}</span>
                  <span className="shrink-0 font-mono text-xs text-fg-muted tabular-nums">
                    {state === "pending" ? "—" : formatDuration(seconds)}
                  </span>
                </span>
              </DisclosureTrigger>
              <DisclosurePanel>
                <div className="flex flex-col gap-1 rounded-md border bg-muted/40 p-3 font-mono text-xs">
                  {step.logs.map((line) => (
                    <span key={line} className="truncate text-fg-muted">
                      {line}
                    </span>
                  ))}
                  {state === "failed" && (
                    <span className="truncate text-danger">
                      Error: usage-worker.ts(84,7) — Type &apos;string&apos; is
                      not assignable to type &apos;MeterEvent&apos;.
                    </span>
                  )}
                  {state === "running" && (
                    <span className="truncate text-warning">
                      Compiling routes… 318 of 412 modules
                    </span>
                  )}
                </div>
              </DisclosurePanel>
            </Disclosure>
          </div>
        )
      })}
    </div>
  )
}

/** Only the live production build holds the apex domain; the rest keep their own host. */
function domainsFor(deployment: Deployment) {
  const own = {
    host: deploymentHost(deployment),
    note: deployment.env === "production" ? "Deployment" : "Preview",
    variant: "neutral" as const,
  }
  if (deployment.id === LIVE_PRODUCTION.id) {
    return [
      { host: "halcyon.app", note: "Production", variant: "accent" as const },
      {
        host: "www.halcyon.app",
        note: "Redirect",
        variant: "neutral" as const,
      },
      own,
    ]
  }
  if (deployment.env === "preview") {
    return [
      { ...own, variant: "accent" as const },
      {
        host: `halcyon-web-git-${deployment.branch.replace(/[^a-z0-9]+/gi, "-")}.halcyon.app`,
        note: "Branch",
        variant: "neutral" as const,
      },
    ]
  }
  return [{ ...own, variant: "accent" as const }]
}

function DeploymentDetail({ deployment }: { deployment: Deployment }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2">
          <span className="font-mono">{deployment.id}</span>
          <EnvBadge env={deployment.env} />
        </CardTitle>
        <CardDescription className="truncate">
          {deployment.message}
        </CardDescription>
        <CardAction>
          <StatusMark status={deployment.status} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <Tabs key={deployment.id}>
          <TabList variant="line" aria-label="Deployment detail">
            <Tab id="steps">
              <TerminalIcon />
              Build steps
            </Tab>
            <Tab id="summary">Summary</Tab>
            <Tab id="domains">Domains</Tab>
          </TabList>
          <TabPanel id="steps" className="pt-2">
            <BuildTimeline deployment={deployment} />
          </TabPanel>
          <TabPanel id="summary" className="pt-4">
            <div className="grid gap-4 lg:grid-cols-[1fr_minmax(0,18rem)]">
              <div className="divide-y text-sm">
                <MetaRow label="Status">
                  <StatusMark status={deployment.status} />
                </MetaRow>
                <MetaRow label="Commit">
                  <span className="font-mono text-xs">{deployment.hash}</span>
                </MetaRow>
                <MetaRow label="Branch">
                  <span className="font-mono text-xs">{deployment.branch}</span>
                </MetaRow>
                <MetaRow label="Created">
                  {deployment.age} by {deployment.author}
                </MetaRow>
                <MetaRow label="Duration">
                  <span className="tabular-nums">
                    {formatDuration(totalSeconds(deployment))}
                  </span>
                </MetaRow>
                <MetaRow label="Builder">sfo1 · 4 vCPU, 8 GB</MetaRow>
                <MetaRow label="Output">1,204 assets · 18.6 MB</MetaRow>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex aspect-video items-center justify-center rounded-lg border bg-muted">
                  <ImageIcon aria-hidden className="size-6 text-fg-muted" />
                </div>
                <span className="text-xs text-fg-muted">
                  Screenshot captured after the deployment went live.
                </span>
              </div>
            </div>
          </TabPanel>
          <TabPanel id="domains" className="pt-4">
            <div className="flex flex-col divide-y">
              {domainsFor(deployment).map((domain) => (
                <div
                  key={domain.host}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <GlobeIcon
                      aria-hidden
                      className="size-3.5 shrink-0 text-fg-muted"
                    />
                    <span className="truncate font-mono text-xs">
                      {domain.host}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <Badge
                      appearance="subtle"
                      variant={domain.variant}
                      size="sm"
                    >
                      {domain.note}
                    </Badge>
                    <Button
                      variant="quiet"
                      size="sm"
                      isIconOnly
                      aria-label={`Open ${domain.host}`}
                    >
                      <ExternalLinkIcon />
                    </Button>
                  </span>
                </div>
              ))}
            </div>
          </TabPanel>
        </Tabs>
      </CardContent>
    </Card>
  )
}

const ENV_FILTERS = [
  { id: "all", label: "All" },
  { id: "production", label: "Production" },
  { id: "preview", label: "Preview" },
]

export default function DeploymentsBlock() {
  const [envFilter, setEnvFilter] = React.useState("all")
  const [statusFilter, setStatusFilter] = React.useState("any")
  const [query, setQuery] = React.useState("")
  const [activeId, setActiveId] = React.useState(LIVE_PREVIEW.id)
  const [copied, setCopied] = React.useState<string | null>(null)
  const [rollbackTarget, setRollbackTarget] = React.useState<Deployment | null>(
    null,
  )
  const [notice, setNotice] = React.useState<{
    variant: "success" | "info"
    title: string
    body: string
  } | null>(null)

  const copyTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  React.useEffect(
    () => () => {
      if (copyTimeout.current) clearTimeout(copyTimeout.current)
    },
    [],
  )

  const copyUrl = React.useCallback((url: string) => {
    navigator.clipboard?.writeText(url).catch(() => {})
    setCopied(url)
    if (copyTimeout.current) clearTimeout(copyTimeout.current)
    copyTimeout.current = setTimeout(() => setCopied(null), 2000)
  }, [])

  const redeploy = React.useCallback((deployment: Deployment) => {
    setNotice({
      variant: "info",
      title: `Redeploying ${deployment.hash}`,
      body: `Queued a new build of ${deployment.branch} on the ${deployment.env} environment.`,
    })
  }, [])

  const promotePreview = React.useCallback(() => {
    setNotice({
      variant: "info",
      title: `Promoting ${LIVE_PREVIEW.hash} to production`,
      body: `${LIVE_PREVIEW.branch} has to finish building before halcyon.app can serve it.`,
    })
  }, [])

  const confirmRollback = React.useCallback(() => {
    if (!rollbackTarget) return
    setNotice({
      variant: "success",
      title: `Production rolled back to ${rollbackTarget.hash}`,
      body: `halcyon.app now serves ${rollbackTarget.id}. Traffic moved in 21 regions in under 4 seconds.`,
    })
    setRollbackTarget(null)
  }, [rollbackTarget])

  const rows = DEPLOYMENTS.filter((deployment) => {
    if (envFilter !== "all" && deployment.env !== envFilter) return false
    if (statusFilter !== "any" && deployment.status !== statusFilter)
      return false
    const needle = query.trim().toLowerCase()
    if (!needle) return true
    return (
      deployment.message.toLowerCase().includes(needle) ||
      deployment.branch.toLowerCase().includes(needle) ||
      deployment.hash.includes(needle) ||
      deployment.author.toLowerCase().includes(needle)
    )
  })

  const active =
    DEPLOYMENTS.find((deployment) => deployment.id === activeId) ?? LIVE_PREVIEW

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-20 border-b bg-bg/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:gap-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-fg-on-primary">
              <ZapIcon aria-hidden className="size-4" />
            </span>
            <div className="flex min-w-0 flex-col">
              <Breadcrumbs>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Halcyon Labs</BreadcrumbLink>
                  <BreadcrumbSeparator />
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">halcyon-web</BreadcrumbLink>
                  <BreadcrumbSeparator />
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbLink>Deployments</BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumbs>
              <span className="truncate text-sm text-fg-muted">
                Every build, preview and production release.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 lg:ml-auto">
            <AvatarGroup className="hidden sm:flex">
              <Avatar>
                <AvatarFallback>M</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>D</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>P</AvatarFallback>
              </Avatar>
              <AvatarGroupCount>+4</AvatarGroupCount>
            </AvatarGroup>
            <Separator orientation="vertical" className="hidden h-6 sm:block" />
            <Button variant="secondary" size="sm">
              <CodeIcon />
              Git
            </Button>
            <Button variant="primary" size="sm">
              <RefreshCwIcon />
              Deploy
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {notice && (
          <Alert variant={notice.variant}>
            {notice.variant === "success" ? <CircleCheckIcon /> : <InfoIcon />}
            <AlertTitle>{notice.title}</AlertTitle>
            <AlertDescription>{notice.body}</AlertDescription>
            <AlertAction>
              <Button
                variant="quiet"
                size="sm"
                isIconOnly
                aria-label="Dismiss"
                onPress={() => setNotice(null)}
              >
                <XIcon />
              </Button>
            </AlertAction>
          </Alert>
        )}

        <section className="grid gap-4 lg:grid-cols-3">
          <EnvironmentCard
            name="Production"
            description="halcyon.app · main"
            url="halcyon.app"
            deployment={LIVE_PRODUCTION}
            copied={copied === "halcyon.app"}
            onCopy={copyUrl}
            onRedeploy={redeploy}
            secondaryAction={{
              label: "Instant rollback",
              onPress: () => {
                if (PREVIOUS_PRODUCTION) setRollbackTarget(PREVIOUS_PRODUCTION)
              },
            }}
          />
          <EnvironmentCard
            name="Preview"
            description="Latest build from an open pull request"
            url={deploymentHost(LIVE_PREVIEW)}
            deployment={LIVE_PREVIEW}
            copied={copied === deploymentHost(LIVE_PREVIEW)}
            onCopy={copyUrl}
            onRedeploy={redeploy}
            secondaryAction={{
              label: "Promote to production",
              onPress: promotePreview,
            }}
          />
          <ActivityCard />
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <SegmentedControl
              aria-label="Environment"
              selectedKeys={[envFilter]}
              onSelectionChange={(keys) => {
                const next = [...keys][0]
                if (typeof next === "string") setEnvFilter(next)
              }}
            >
              {ENV_FILTERS.map((filter) => (
                <SegmentedControlItem key={filter.id} id={filter.id}>
                  {filter.label}
                </SegmentedControlItem>
              ))}
            </SegmentedControl>
            <Select
              aria-label="Status"
              className="w-40"
              selectedKey={statusFilter}
              onSelectionChange={(key) => setStatusFilter(String(key ?? "any"))}
            >
              <SelectTrigger />
              <SelectContent>
                <SelectItem id="any">Any status</SelectItem>
                <SelectItem id="ready">Ready</SelectItem>
                <SelectItem id="building">Building</SelectItem>
                <SelectItem id="error">Error</SelectItem>
                <SelectItem id="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
            <SearchField
              aria-label="Search deployments"
              value={query}
              onChange={setQuery}
              className="w-full sm:ml-auto sm:w-72"
            >
              <InputGroup>
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
                <Input placeholder="Commit, branch or author…" />
                <InputGroupAddon>
                  <Kbd>⌘K</Kbd>
                </InputGroupAddon>
              </InputGroup>
            </SearchField>
          </div>

          <TableContainer>
            <Table
              aria-label="Deployments"
              selectionMode="single"
              selectionBehavior="replace"
              selectedKeys={[activeId]}
              onSelectionChange={(keys) => {
                if (keys === "all") return
                const next = [...keys][0]
                if (typeof next === "string") setActiveId(next)
              }}
            >
              <TableHeader>
                <TableColumn id="deployment" isRowHeader className="min-w-80">
                  Deployment
                </TableColumn>
                <TableColumn id="status" className="w-32">
                  Status
                </TableColumn>
                <TableColumn id="env" className="w-32">
                  Environment
                </TableColumn>
                <TableColumn id="branch" className="w-52">
                  Branch
                </TableColumn>
                <TableColumn id="author" className="w-48">
                  Author
                </TableColumn>
                <TableColumn id="duration" className="w-28">
                  Duration
                </TableColumn>
                <TableColumn id="age" className="w-28">
                  Created
                </TableColumn>
                <TableColumn id="actions" className="w-12">
                  <span className="sr-only">Actions</span>
                </TableColumn>
              </TableHeader>
              <TableBody
                renderEmptyState={() => (
                  <Empty className="py-10">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <ServerIcon />
                      </EmptyMedia>
                      <EmptyTitle>No deployments match</EmptyTitle>
                      <EmptyDescription>
                        Try another environment, status or search term.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}
              >
                {rows.map((deployment) => (
                  <TableRow key={deployment.id} id={deployment.id}>
                    <TableCell>
                      <span className="flex min-w-0 items-center gap-2.5">
                        <span className="truncate font-medium">
                          {deployment.message}
                        </span>
                        <span className="shrink-0 font-mono text-xs text-fg-muted">
                          {deployment.hash}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusMark status={deployment.status} />
                    </TableCell>
                    <TableCell>
                      <EnvBadge env={deployment.env} />
                    </TableCell>
                    <TableCell>
                      <BranchBadge branch={deployment.branch} />
                    </TableCell>
                    <TableCell>
                      <span className="flex min-w-0 items-center gap-2">
                        <Avatar size="sm">
                          <AvatarFallback>{deployment.initials}</AvatarFallback>
                        </Avatar>
                        <span className="truncate">{deployment.author}</span>
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs tabular-nums">
                      {formatDuration(totalSeconds(deployment))}
                    </TableCell>
                    <TableCell className="text-fg-muted">
                      {deployment.age}
                    </TableCell>
                    <TableCell className="text-right">
                      <Menu>
                        <Button
                          variant="quiet"
                          size="sm"
                          isIconOnly
                          aria-label={`Actions for ${deployment.hash}`}
                        >
                          <MoreHorizontalIcon />
                        </Button>
                        <Popover placement="bottom end" className="w-52">
                          <MenuContent>
                            <MenuItem
                              onAction={() => setActiveId(deployment.id)}
                            >
                              <TerminalIcon />
                              View build logs
                            </MenuItem>
                            <MenuItem onAction={() => redeploy(deployment)}>
                              <RotateCwIcon />
                              Redeploy
                            </MenuItem>
                            <MenuItem
                              onAction={() =>
                                copyUrl(deploymentHost(deployment))
                              }
                            >
                              <CopyIcon />
                              Copy URL
                            </MenuItem>
                            <Separator />
                            <MenuItem
                              variant="danger"
                              isDisabled={!canRollBackTo(deployment)}
                              onAction={() => setRollbackTarget(deployment)}
                            >
                              <TimerIcon />
                              Rollback to this
                            </MenuItem>
                          </MenuContent>
                        </Popover>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <p className="text-sm text-fg-muted">
            Showing {rows.length} of {DEPLOYMENTS.length} deployments. Select a
            row to inspect its build.
          </p>
        </section>

        <DeploymentDetail deployment={active} />
      </main>

      <Modal
        isOpen={rollbackTarget !== null}
        onOpenChange={(open) => {
          if (!open) setRollbackTarget(null)
        }}
        className="max-w-md"
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Roll back production?</DialogTitle>
            <DialogDescription>
              halcyon.app will immediately serve{" "}
              <span className="font-mono">{rollbackTarget?.hash}</span> —{" "}
              {rollbackTarget?.message}. No rebuild is needed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button slot="close">Cancel</Button>
            <Button variant="danger" onPress={confirmRollback}>
              Roll back
            </Button>
          </DialogFooter>
        </DialogContent>
      </Modal>
    </div>
  )
}
