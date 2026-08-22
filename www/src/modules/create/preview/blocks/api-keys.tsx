"use client"

import * as React from "react"

import {
  ActivityIcon,
  BookOpenIcon,
  CheckIcon,
  ClockIcon,
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  MoreHorizontalIcon,
  PlugIcon,
  PlusIcon,
  RefreshCwIcon,
  ShieldIcon,
  Trash2Icon,
  TriangleAlertIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/registry/ui/alert"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import {
  Checkbox,
  CheckboxControl,
  CheckboxIndicator,
} from "@/registry/ui/checkbox"
import { CheckboxGroup } from "@/registry/ui/checkbox-group"
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
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/ui/empty"
import {
  Description,
  FieldContent,
  FieldGroup,
  Label,
} from "@/registry/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
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
import { Switch, SwitchControl, SwitchIndicator } from "@/registry/ui/switch"
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
import { ToggleButton } from "@/registry/ui/toggle-button"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

type Environment = "live" | "test"

interface ApiKey {
  id: string
  name: string
  environment: Environment
  token: string
  scopes: string[]
  created: string
  lastUsed: string
  revoked?: boolean
}

interface Endpoint {
  id: string
  url: string
  description: string
  events: string[]
  enabled: boolean
  delivery: string
  successRate: number
}

const SCOPES = [
  {
    id: "payments:write",
    label: "payments:write",
    description: "Create, capture and refund charges.",
  },
  {
    id: "payments:read",
    label: "payments:read",
    description: "Read charges, balances and payouts.",
  },
  {
    id: "customers:write",
    label: "customers:write",
    description: "Create and update customer records.",
  },
  {
    id: "customers:read",
    label: "customers:read",
    description: "Read customer records and payment methods.",
  },
  {
    id: "reports:read",
    label: "reports:read",
    description: "Export ledger reports and reconciliation files.",
  },
  {
    id: "webhooks:write",
    label: "webhooks:write",
    description: "Register and replay webhook endpoints.",
  },
]

const INITIAL_KEYS: ApiKey[] = [
  {
    id: "key_pd7k",
    name: "Production server",
    environment: "live",
    token: "sk_live_51QpXhR9mKcTvB2wLd4f2a",
    scopes: ["payments:write", "payments:read", "customers:read"],
    created: "Mar 4, 2026",
    lastUsed: "2 minutes ago",
  },
  {
    id: "key_ios9",
    name: "Meridian iOS app",
    environment: "live",
    token: "sk_live_88TfQm4vNbYr7pKxa91c",
    scopes: ["payments:read", "customers:read"],
    created: "Jan 22, 2026",
    lastUsed: "18 minutes ago",
  },
  {
    id: "key_whse",
    name: "Analytics warehouse",
    environment: "live",
    token: "sk_live_02JhVn6cRwZq5tMe73bd",
    scopes: ["reports:read"],
    created: "Nov 9, 2025",
    lastUsed: "6 hours ago",
  },
  {
    id: "key_snbx",
    name: "Staging sandbox",
    environment: "test",
    token: "sk_test_14BgWx3jLpDs8nQu62fe",
    scopes: ["payments:write", "payments:read", "webhooks:write"],
    created: "Feb 14, 2026",
    lastUsed: "3 days ago",
  },
  {
    id: "key_cron",
    name: "Legacy billing cron",
    environment: "live",
    token: "sk_live_76CkYt5rHfMj3aBz10gp",
    scopes: ["payments:write"],
    created: "Aug 30, 2024",
    lastUsed: "Jul 2, 2026",
    revoked: true,
  },
]

const INITIAL_ENDPOINTS: Endpoint[] = [
  {
    id: "we_ledger",
    url: "https://api.northgate.dev/hooks/meridian",
    description: "Primary ledger sync — retries for 24 hours.",
    events: ["payment.succeeded", "payment.failed", "refund.created"],
    enabled: true,
    delivery: "40 seconds ago",
    successRate: 99.8,
  },
  {
    id: "we_alerts",
    url: "https://hooks.northgate.dev/slack/risk-alerts",
    description: "Pages the on-call team in #risk-alerts.",
    events: ["dispute.opened", "payout.failed"],
    enabled: true,
    delivery: "12 minutes ago",
    successRate: 100,
  },
  {
    id: "we_stage",
    url: "https://staging.northgate.dev/webhooks/meridian",
    description: "Sandbox mirror, disabled outside release weeks.",
    events: ["payment.succeeded", "customer.created"],
    enabled: false,
    delivery: "6 days ago",
    successRate: 92.4,
  },
]

const EXPIRIES = [
  { id: "never", label: "No expiry" },
  { id: "30", label: "30 days" },
  { id: "90", label: "90 days" },
  { id: "365", label: "1 year" },
]

function maskToken(token: string) {
  const prefix = token.slice(0, token.indexOf("_", 3) + 1)
  return `${prefix}${"•".repeat(12)}${token.slice(-4)}`
}

function CopyButton({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(timer)
  }, [copied])

  return (
    <Tooltip>
      <Button
        variant="quiet"
        size="sm"
        isIconOnly
        aria-label={copied ? `${label} copied` : label}
        onPress={() => setCopied(true)}
      >
        {copied ? <CheckIcon className="text-fg-success" /> : <CopyIcon />}
      </Button>
      <TooltipContent>
        {copied ? "Copied" : label}
        <span className="ml-1 font-mono text-fg-muted">
          {value.slice(0, 7)}…
        </span>
      </TooltipContent>
    </Tooltip>
  )
}

function KeyTokenCell({ apiKey }: { apiKey: ApiKey }) {
  const [revealed, setRevealed] = React.useState(false)

  return (
    <div className="flex items-center gap-1">
      <span
        className={cn(
          "font-mono text-xs whitespace-nowrap",
          apiKey.revoked ? "text-fg-muted line-through" : "text-fg",
        )}
      >
        {revealed && !apiKey.revoked ? apiKey.token : maskToken(apiKey.token)}
      </span>
      <Tooltip>
        <ToggleButton
          variant="quiet"
          size="sm"
          isIconOnly
          isSelected={revealed}
          onChange={setRevealed}
          isDisabled={apiKey.revoked}
          aria-label={revealed ? "Hide key" : "Reveal key"}
        >
          {revealed ? <EyeOffIcon /> : <EyeIcon />}
        </ToggleButton>
        <TooltipContent>{revealed ? "Hide key" : "Reveal key"}</TooltipContent>
      </Tooltip>
      <CopyButton label="Copy key" value={apiKey.token} />
    </div>
  )
}

function ScopeBadges({ scopes }: { scopes: string[] }) {
  const visible = scopes.slice(0, 2)
  const rest = scopes.length - visible.length

  return (
    <div className="flex items-center gap-1">
      {visible.map((scope) => (
        <Badge key={scope} appearance="subtle" variant="neutral" size="sm">
          {scope}
        </Badge>
      ))}
      {rest > 0 && (
        <Tooltip>
          <Button variant="quiet" size="xs" aria-label={`${rest} more scopes`}>
            +{rest}
          </Button>
          <TooltipContent>{scopes.slice(2).join(", ")}</TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof ShieldIcon
  label: string
  value: string
  hint: string
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          <Icon className="size-4" />
          {label}
        </CardDescription>
        <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-fg-muted">{hint}</CardContent>
    </Card>
  )
}

function CreateKeyDialog({
  isOpen,
  onOpenChange,
  onCreate,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (key: ApiKey) => void
}) {
  const [name, setName] = React.useState("")
  const [scopes, setScopes] = React.useState<string[]>([
    "payments:read",
    "customers:read",
  ])
  const [expiry, setExpiry] = React.useState("90")
  const [environment, setEnvironment] = React.useState<Environment>("live")

  const create = () => {
    onCreate({
      id: `key_${Math.random().toString(36).slice(2, 6)}`,
      name: name.trim() || "Untitled key",
      environment,
      token: `sk_${environment}_${Math.random().toString(36).slice(2, 10).padEnd(8, "0")}9xQm4vTr`,
      scopes: scopes.length > 0 ? scopes : ["payments:read"],
      created: "Just now",
      lastUsed: "Never",
    })
    setName("")
    onOpenChange(false)
  }

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Button variant="primary">
        <PlusIcon />
        Create secret key
      </Button>
      <Modal className="max-w-lg">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create secret key</DialogTitle>
            <DialogDescription>
              Scope the key to only what the integration needs. You can rotate
              or revoke it at any time.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="gap-5">
            <TextField value={name} onChange={setName} isRequired autoFocus>
              <Label>Key name</Label>
              <Input placeholder="Checkout service" />
              <Description>
                Shown in the dashboard and in request logs.
              </Description>
            </TextField>

            <div className="flex flex-col gap-2">
              <Label>Environment</Label>
              <SegmentedControl
                aria-label="Environment"
                selectedKeys={[environment]}
                onSelectionChange={(keys) => {
                  const next = [...keys][0]
                  if (next) setEnvironment(next as Environment)
                }}
              >
                <SegmentedControlItem id="live">Live</SegmentedControlItem>
                <SegmentedControlItem id="test">Test</SegmentedControlItem>
              </SegmentedControl>
            </div>

            <CheckboxGroup value={scopes} onChange={setScopes}>
              <Label>Scopes</Label>
              <Description>
                {scopes.length} of {SCOPES.length} permissions granted.
              </Description>
              <FieldGroup className="max-h-56 overflow-y-auto pr-1">
                {SCOPES.map((scope) => (
                  <Checkbox key={scope.id} value={scope.id}>
                    <CheckboxControl>
                      <CheckboxIndicator />
                      <FieldContent>
                        <Label className="font-mono text-xs">
                          {scope.label}
                        </Label>
                        <Description>{scope.description}</Description>
                      </FieldContent>
                    </CheckboxControl>
                  </Checkbox>
                ))}
              </FieldGroup>
            </CheckboxGroup>

            <Select
              selectedKey={expiry}
              onSelectionChange={(key) => key && setExpiry(String(key))}
            >
              <Label>Expires</Label>
              <SelectTrigger />
              <SelectContent>
                {EXPIRIES.map((option) => (
                  <SelectItem key={option.id} id={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Alert variant="warning">
              <TriangleAlertIcon />
              <AlertTitle>The key is shown once</AlertTitle>
              <AlertDescription>
                Copy it as soon as it is created — we only store a hashed
                fingerprint and cannot show it again.
              </AlertDescription>
            </Alert>
          </DialogBody>
          <DialogFooter>
            <Button slot="close" type="button">
              Cancel
            </Button>
            <Button variant="primary" onPress={create}>
              Create key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Modal>
    </Dialog>
  )
}

function KeysPanel({
  keys,
  onRevoke,
  onCreate,
  isCreateOpen,
  setCreateOpen,
}: {
  keys: ApiKey[]
  onRevoke: (id: string) => void
  onCreate: (key: ApiKey) => void
  isCreateOpen: boolean
  setCreateOpen: (open: boolean) => void
}) {
  const [query, setQuery] = React.useState("")
  const [environment, setEnvironment] = React.useState("all")

  const visible = keys.filter((key) => {
    const matchesEnvironment =
      environment === "all" || key.environment === environment
    const matchesQuery = key.name.toLowerCase().includes(query.toLowerCase())
    return matchesEnvironment && matchesQuery
  })

  return (
    <div className="flex flex-col gap-4">
      <Alert variant="warning">
        <ClockIcon />
        <AlertTitle>Production server key is 17 months old</AlertTitle>
        <AlertDescription>
          Rotating long-lived keys quarterly keeps a leaked secret from staying
          useful.
        </AlertDescription>
        <AlertAction>
          <Button size="sm">
            <RefreshCwIcon />
            Rotate
          </Button>
        </AlertAction>
      </Alert>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchField
          aria-label="Filter keys"
          value={query}
          onChange={setQuery}
          className="w-full sm:w-64"
        >
          <Input placeholder="Filter by name…" size="sm" />
        </SearchField>
        <div className="flex items-center gap-2">
          <SegmentedControl
            aria-label="Environment filter"
            selectedKeys={[environment]}
            onSelectionChange={(keys_) => {
              const next = [...keys_][0]
              if (next) setEnvironment(String(next))
            }}
          >
            <SegmentedControlItem id="all">All</SegmentedControlItem>
            <SegmentedControlItem id="live">Live</SegmentedControlItem>
            <SegmentedControlItem id="test">Test</SegmentedControlItem>
          </SegmentedControl>
          <CreateKeyDialog
            isOpen={isCreateOpen}
            onOpenChange={setCreateOpen}
            onCreate={onCreate}
          />
        </div>
      </div>

      <TableContainer>
        <Table aria-label="API keys">
          <TableHeader>
            <TableColumn isRowHeader>Name</TableColumn>
            <TableColumn>Secret</TableColumn>
            <TableColumn>Scopes</TableColumn>
            <TableColumn>Created</TableColumn>
            <TableColumn>Last used</TableColumn>
            <TableColumn className="w-14">
              <span className="sr-only">Actions</span>
            </TableColumn>
          </TableHeader>
          <TableBody
            renderEmptyState={() => (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <ShieldIcon />
                  </EmptyMedia>
                  <EmptyTitle>No keys match that filter</EmptyTitle>
                  <EmptyDescription>
                    Try a different name or switch environment.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          >
            {visible.map((apiKey) => (
              <TableRow key={apiKey.id} textValue={apiKey.name}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "font-medium whitespace-nowrap",
                        apiKey.revoked && "text-fg-muted",
                      )}
                    >
                      {apiKey.name}
                    </span>
                    {apiKey.revoked ? (
                      <Badge appearance="subtle" variant="danger" size="sm">
                        Revoked
                      </Badge>
                    ) : (
                      <Badge
                        appearance="subtle"
                        variant={
                          apiKey.environment === "live" ? "success" : "info"
                        }
                        size="sm"
                      >
                        {apiKey.environment}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <KeyTokenCell apiKey={apiKey} />
                </TableCell>
                <TableCell>
                  <ScopeBadges scopes={apiKey.scopes} />
                </TableCell>
                <TableCell className="whitespace-nowrap text-fg-muted">
                  {apiKey.created}
                </TableCell>
                <TableCell className="whitespace-nowrap text-fg-muted">
                  {apiKey.lastUsed}
                </TableCell>
                <TableCell className="text-right">
                  <Menu>
                    <Button
                      variant="quiet"
                      size="sm"
                      isIconOnly
                      aria-label={`Actions for ${apiKey.name}`}
                    >
                      <MoreHorizontalIcon />
                    </Button>
                    <Popover placement="bottom end">
                      <MenuContent className="min-w-44">
                        <MenuItem>Rename key</MenuItem>
                        <MenuItem>Edit scopes</MenuItem>
                        <MenuItem>View request logs</MenuItem>
                        <Separator />
                        <MenuItem>
                          <RefreshCwIcon />
                          Rotate secret
                        </MenuItem>
                        <MenuItem
                          variant="danger"
                          isDisabled={apiKey.revoked}
                          onAction={() => onRevoke(apiKey.id)}
                        >
                          <Trash2Icon />
                          Revoke key
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
        Showing {visible.length} of {keys.length} keys · rotate secrets from the
        row menu, revoked keys stop working immediately.
      </p>
    </div>
  )
}

function EndpointCard({
  endpoint,
  onToggle,
}: {
  endpoint: Endpoint
  onToggle: (id: string, enabled: boolean) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex min-w-0 items-center gap-2">
          <PlugIcon className="size-4 shrink-0 text-fg-muted" />
          <span className="truncate">
            {endpoint.url.replace(/^https:\/\//, "")}
          </span>
        </CardTitle>
        <CardDescription>{endpoint.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Switch
          isSelected={endpoint.enabled}
          onChange={(enabled) => onToggle(endpoint.id, enabled)}
          className="w-full"
        >
          <SwitchControl>
            <FieldContent>
              <Label>{endpoint.enabled ? "Receiving events" : "Paused"}</Label>
              <Description>
                {endpoint.enabled
                  ? `Last delivery ${endpoint.delivery} · ${endpoint.successRate}% success`
                  : `No deliveries since ${endpoint.delivery}`}
              </Description>
            </FieldContent>
            <SwitchIndicator />
          </SwitchControl>
        </Switch>

        <TextField
          value={endpoint.url}
          isReadOnly
          aria-label={`Endpoint URL for ${endpoint.url}`}
        >
          <InputGroup>
            <Input className="font-mono text-xs" />
            <InputGroupAddon>
              <CopyButton label="Copy URL" value={endpoint.url} />
            </InputGroupAddon>
          </InputGroup>
        </TextField>

        <TagGroup>
          <Label>Subscribed events</Label>
          <TagList>
            {endpoint.events.map((event) => (
              <Tag key={event} id={event}>
                {event}
              </Tag>
            ))}
          </TagList>
        </TagGroup>

        <ProgressBar value={endpoint.successRate} className="w-full">
          <div className="flex items-center justify-between gap-2">
            <Label>Delivery success (30d)</Label>
            <ProgressBarOutput />
          </div>
          <ProgressBarControl />
        </ProgressBar>
      </CardContent>
    </Card>
  )
}

function WebhooksPanel({
  endpoints,
  onToggle,
}: {
  endpoints: Endpoint[]
  onToggle: (id: string, enabled: boolean) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="font-medium">Endpoints</h2>
          <p className="text-sm text-fg-muted">
            Events are signed with a per-endpoint secret and retried for 24
            hours.
          </p>
        </div>
        <Button>
          <PlusIcon />
          Add endpoint
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {endpoints.map((endpoint) => (
          <EndpointCard
            key={endpoint.id}
            endpoint={endpoint}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  )
}

export default function ApiKeysBlock() {
  const [keys, setKeys] = React.useState(INITIAL_KEYS)
  const [endpoints, setEndpoints] = React.useState(INITIAL_ENDPOINTS)
  const [isCreateOpen, setCreateOpen] = React.useState(false)

  const activeKeys = keys.filter((key) => !key.revoked).length

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 sm:py-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-fg-muted">
            <span>Northgate Labs</span>
            <span aria-hidden>/</span>
            <span className="text-fg">Meridian Payments</span>
            <Badge appearance="subtle" variant="success" size="sm">
              Live mode
            </Badge>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                API keys &amp; webhooks
              </h1>
              <p className="max-w-xl text-pretty text-fg-muted">
                Secrets authenticate every request to the Meridian API. Give
                each integration its own key so you can revoke one without
                taking the others down.
              </p>
            </div>
            <Button variant="quiet">
              <BookOpenIcon />
              API reference
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={ActivityIcon}
            label="Requests today"
            value="128,402"
            hint="12% above your weekday average."
          />
          <StatCard
            icon={ShieldIcon}
            label="Active keys"
            value={String(activeKeys)}
            hint="One key per integration, as recommended."
          />
          <StatCard
            icon={TriangleAlertIcon}
            label="Error rate"
            value="0.12%"
            hint="154 failed requests in the last 24 hours."
          />
        </div>

        <Tabs>
          <TabList>
            <Tab id="keys">
              Secret keys
              <Badge appearance="subtle" size="sm" className="ml-2">
                {keys.length}
              </Badge>
            </Tab>
            <Tab id="webhooks">
              Webhooks
              <Badge appearance="subtle" size="sm" className="ml-2">
                {endpoints.length}
              </Badge>
            </Tab>
          </TabList>
          <TabPanel id="keys" className="pt-4">
            <KeysPanel
              keys={keys}
              isCreateOpen={isCreateOpen}
              setCreateOpen={setCreateOpen}
              onCreate={(key) => setKeys((current) => [key, ...current])}
              onRevoke={(id) =>
                setKeys((current) =>
                  current.map((key) =>
                    key.id === id ? { ...key, revoked: true } : key,
                  ),
                )
              }
            />
          </TabPanel>
          <TabPanel id="webhooks" className="pt-4">
            <WebhooksPanel
              endpoints={endpoints}
              onToggle={(id, enabled) =>
                setEndpoints((current) =>
                  current.map((endpoint) =>
                    endpoint.id === id ? { ...endpoint, enabled } : endpoint,
                  ),
                )
              }
            />
          </TabPanel>
        </Tabs>
      </main>
    </div>
  )
}
