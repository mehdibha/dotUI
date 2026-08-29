import { useState } from "react"

import {
  ActivityIcon,
  BellIcon,
  CreditCardIcon,
  ExternalLinkIcon,
  FolderIcon,
  FrameIcon,
  GitBranchIcon,
  KeyboardIcon,
  LogOutIcon,
  MessageSquareIcon,
  PaletteIcon,
  PlugIcon,
  SearchIcon,
  ShieldIcon,
  TriangleAlertIcon,
  UploadIcon,
  UserIcon,
  XIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/registry/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox"
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
  Description,
  FieldContent,
  FieldGroup,
  Label,
} from "@/registry/ui/field"
import { FileTrigger } from "@/registry/ui/file-trigger"
import {
  Input,
  InputGroup,
  InputGroupAddon,
  TextArea,
} from "@/registry/ui/input"
import { Modal } from "@/registry/ui/modal"
import {
  Radio,
  RadioControl,
  RadioGroup,
  RadioIndicator,
} from "@/registry/ui/radio-group"
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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/registry/ui/sidebar"
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
import { TextField } from "@/registry/ui/text-field"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

const SECTIONS = [
  { id: "account", label: "Account", icon: UserIcon },
  { id: "notifications", label: "Notifications", icon: BellIcon },
  { id: "appearance", label: "Appearance", icon: PaletteIcon },
  { id: "connections", label: "Connections", icon: PlugIcon },
  { id: "security", label: "Security", icon: ShieldIcon },
]

const CHANNELS = [
  {
    id: "email",
    label: "Email",
    description: "Sent to mara@northwind.dev.",
    defaultSelected: true,
  },
  {
    id: "push",
    label: "Push",
    description: "Alerts on your phone and tablet.",
    defaultSelected: true,
  },
  {
    id: "desktop",
    label: "Desktop",
    description: "Banner notifications while the app is open.",
    defaultSelected: false,
  },
  {
    id: "sms",
    label: "SMS",
    description: "Critical incidents only, to +1 (415) 555-0186.",
    defaultSelected: false,
  },
]

const INTEGRATIONS = [
  {
    id: "github",
    name: "GitHub",
    icon: GitBranchIcon,
    detail: "northwind-labs · 24 repositories",
    account: "@mara-ellison",
    connected: true,
  },
  {
    id: "slack",
    name: "Slack",
    icon: MessageSquareIcon,
    detail: "Northwind HQ · #deploys, #incidents",
    account: "mara@northwind.dev",
    connected: true,
  },
  {
    id: "figma",
    name: "Figma",
    icon: FrameIcon,
    detail: "Design library sync every 15 minutes",
    account: "Northwind Design",
    connected: true,
  },
  {
    id: "linear",
    name: "Linear",
    icon: ActivityIcon,
    detail: "Link pull requests to issues automatically",
    account: null,
    connected: false,
  },
  {
    id: "drive",
    name: "Google Drive",
    icon: FolderIcon,
    detail: "Attach documents to project briefs",
    account: null,
    connected: false,
  },
  {
    id: "stripe",
    name: "Stripe",
    icon: CreditCardIcon,
    detail: "Revenue metrics on the workspace dashboard",
    account: null,
    connected: false,
  },
]

const SESSIONS = [
  {
    device: "MacBook Pro · Chrome 141",
    location: "Lisbon, Portugal",
    ip: "188.250.14.7",
    lastActive: "Active now",
    current: true,
  },
  {
    device: "iPhone 17 · Northwind iOS",
    location: "Lisbon, Portugal",
    ip: "188.250.14.7",
    lastActive: "2 hours ago",
    current: false,
  },
  {
    device: "iPad Air · Safari",
    location: "Porto, Portugal",
    ip: "94.61.203.44",
    lastActive: "Aug 18, 2026",
    current: false,
  },
  {
    device: "Linux workstation · Firefox",
    location: "Berlin, Germany",
    ip: "77.12.88.190",
    lastActive: "Aug 11, 2026",
    current: false,
  },
]

/* ------------------------------ Row primitives ---------------------------- */

// A titled group of hairline-separated rows — the flat, card-less shape
// desktop-app settings use. `action` sits on the title's right (e.g. a badge
// or a group-wide button).
function SettingsGroup({
  title,
  action,
  danger = false,
  children,
}: {
  title: string
  action?: React.ReactNode
  danger?: boolean
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2
          className={cn(
            "font-heading text-lg font-semibold tracking-tight",
            danger && "text-fg-danger",
          )}
        >
          {title}
        </h2>
        {action}
      </div>
      <div className="flex flex-col divide-y divide-border-muted">
        {children}
      </div>
    </section>
  )
}

// One setting: label (and optional description) on the left, its control on
// the right. `stacked` puts the control below instead — for wide controls
// like a textarea or a table.
function SettingsRow({
  label,
  description,
  stacked = false,
  children,
}: {
  label: string
  description?: string
  stacked?: boolean
  children?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "flex gap-x-8 gap-y-4 py-5",
        stacked ? "flex-col" : "flex-wrap items-center justify-between",
      )}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <span className="font-medium">{label}</span>
        {description && (
          <p className="max-w-prose text-sm text-pretty text-fg-muted">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className={cn(!stacked && "flex shrink-0 items-center gap-2")}>
          {children}
        </div>
      )}
    </div>
  )
}

// A bare switch on the row's right — a labeled SwitchControl would render the
// DS's bordered card style and break the flat hairline stack.
function SwitchRow({
  label,
  description,
  defaultSelected = false,
}: {
  label: string
  description?: string
  defaultSelected?: boolean
}) {
  return (
    <SettingsRow label={label} description={description}>
      <Switch aria-label={label} defaultSelected={defaultSelected}>
        <SwitchControl>
          <SwitchIndicator />
        </SwitchControl>
      </Switch>
    </SettingsRow>
  )
}

/* -------------------------------- Sections -------------------------------- */

function AccountSection() {
  const [photo, setPhoto] = useState<string | null>(null)
  const [bio, setBio] = useState(
    "Product engineer working on the Northwind platform team. Previously infrastructure at Halcyon.",
  )

  return (
    <>
      <SettingsGroup title="Profile">
        <SettingsRow
          label="Profile photo"
          description="Square PNG or JPG, at least 256×256 and under 2 MB."
        >
          <Avatar size="lg" className="shrink-0">
            {photo && <AvatarImage src={photo} alt="Mara Ellison" />}
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
          <FileTrigger
            acceptedFileTypes={["image/png", "image/jpeg"]}
            onSelect={(files) => {
              const file = files ? Array.from(files)[0] : null
              if (file) setPhoto(URL.createObjectURL(file))
            }}
          >
            <Button size="sm">
              <UploadIcon />
              Upload
            </Button>
          </FileTrigger>
          <Button
            size="sm"
            variant="quiet"
            isDisabled={!photo}
            onPress={() => setPhoto(null)}
          >
            Remove
          </Button>
        </SettingsRow>
        <SettingsRow label="Full name">
          <TextField
            defaultValue="Mara Ellison"
            aria-label="Full name"
            className="w-56"
          >
            <Input />
          </TextField>
        </SettingsRow>
        <SettingsRow label="Username">
          <TextField
            defaultValue="mara-ellison"
            aria-label="Username"
            className="w-64"
          >
            <InputGroup>
              <InputGroupAddon>northwind.dev/</InputGroupAddon>
              <Input />
            </InputGroup>
          </TextField>
        </SettingsRow>
        <SettingsRow label="Email" description="Used for sign-in and receipts.">
          <TextField
            defaultValue="mara@northwind.dev"
            aria-label="Email"
            className="w-64"
          >
            <Input type="email" />
          </TextField>
        </SettingsRow>
        <SettingsRow label="Job title">
          <Select
            defaultSelectedKey="engineering"
            aria-label="Job title"
            className="w-56"
          >
            <SelectTrigger />
            <SelectContent>
              <SelectItem id="engineering">Product engineer</SelectItem>
              <SelectItem id="design">Product designer</SelectItem>
              <SelectItem id="pm">Product manager</SelectItem>
              <SelectItem id="support">Support engineer</SelectItem>
            </SelectContent>
          </Select>
        </SettingsRow>
        <SettingsRow
          stacked
          label="Bio"
          description="Shown on your public profile and in mentions."
        >
          <TextField
            value={bio}
            onChange={setBio}
            aria-label="Bio"
            className="w-full"
          >
            <TextArea rows={4} maxLength={280} />
            <Description>{280 - bio.length} characters remaining.</Description>
          </TextField>
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup
        title="Workspace"
        action={
          <Badge variant="accent" appearance="subtle">
            Owner
          </Badge>
        }
      >
        <SettingsRow label="Workspace name">
          <TextField
            defaultValue="Northwind Labs"
            aria-label="Workspace name"
            className="w-56"
          >
            <Input />
          </TextField>
        </SettingsRow>
        <SettingsRow label="Workspace URL">
          <TextField
            defaultValue="northwind-labs"
            aria-label="Workspace URL"
            className="w-72"
          >
            <InputGroup>
              <InputGroupAddon>app.northwind.dev/</InputGroupAddon>
              <Input />
            </InputGroup>
          </TextField>
        </SettingsRow>
        <SettingsRow label="Default landing page">
          <Select
            defaultSelectedKey="overview"
            aria-label="Default landing page"
            className="w-56"
          >
            <SelectTrigger />
            <SelectContent>
              <SelectItem id="overview">Overview</SelectItem>
              <SelectItem id="deployments">Deployments</SelectItem>
              <SelectItem id="issues">Issues</SelectItem>
              <SelectItem id="analytics">Analytics</SelectItem>
            </SelectContent>
          </Select>
        </SettingsRow>
        <SettingsRow label="Time zone">
          <Select
            defaultSelectedKey="wet"
            aria-label="Time zone"
            className="w-56"
          >
            <SelectTrigger />
            <SelectContent>
              <SelectItem id="wet">Lisbon — WET (UTC+0)</SelectItem>
              <SelectItem id="cet">Berlin — CET (UTC+1)</SelectItem>
              <SelectItem id="est">New York — EST (UTC−5)</SelectItem>
              <SelectItem id="pst">San Francisco — PST (UTC−8)</SelectItem>
            </SelectContent>
          </Select>
        </SettingsRow>
      </SettingsGroup>

      <DangerZone />
    </>
  )
}

function DangerZone() {
  const [isOpen, setIsOpen] = useState(false)
  const [confirmation, setConfirmation] = useState("")
  const [isScheduled, setIsScheduled] = useState(false)
  const canDelete = confirmation === "northwind-labs"

  if (isScheduled) {
    return (
      <Alert variant="warning">
        <TriangleAlertIcon />
        <AlertTitle>Deletion scheduled for August 29, 2026</AlertTitle>
        <AlertDescription>
          Northwind Labs stays available until then. Every member keeps access
          while the workspace is pending deletion.
        </AlertDescription>
        <AlertAction>
          <Button
            size="sm"
            onPress={() => {
              setIsScheduled(false)
              setConfirmation("")
            }}
          >
            Cancel deletion
          </Button>
        </AlertAction>
      </Alert>
    )
  }

  return (
    <SettingsGroup title="Danger zone" danger>
      <SettingsRow
        label="Transfer ownership"
        description="Hand the workspace to another admin."
      >
        <Button>Transfer</Button>
      </SettingsRow>
      <SettingsRow
        label="Delete this workspace"
        description="Removes 24 projects, 1,842 issues and all deploy history."
      >
        <Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
          <Button variant="danger">Delete workspace</Button>
          <Modal>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Northwind Labs?</DialogTitle>
                <DialogDescription>
                  This cannot be undone once the 7-day grace period ends.
                </DialogDescription>
              </DialogHeader>
              <DialogBody className="gap-4">
                <Alert variant="danger">
                  <TriangleAlertIcon />
                  <AlertTitle>18 members will lose access</AlertTitle>
                  <AlertDescription>
                    Projects, integrations and audit logs are deleted with the
                    workspace.
                  </AlertDescription>
                </Alert>
                <TextField
                  value={confirmation}
                  onChange={setConfirmation}
                  className="w-full"
                >
                  <Label>
                    Type <span className="font-mono">northwind-labs</span> to
                    confirm
                  </Label>
                  <Input placeholder="northwind-labs" />
                </TextField>
              </DialogBody>
              <DialogFooter>
                <Button onPress={() => setIsOpen(false)}>Cancel</Button>
                <Button
                  variant="danger"
                  isDisabled={!canDelete}
                  onPress={() => {
                    setIsOpen(false)
                    setIsScheduled(true)
                  }}
                >
                  Delete workspace
                </Button>
              </DialogFooter>
            </DialogContent>
          </Modal>
        </Dialog>
      </SettingsRow>
    </SettingsGroup>
  )
}

function NotificationsSection() {
  return (
    <>
      <SettingsGroup title="Channels">
        {CHANNELS.map((channel) => (
          <SwitchRow
            key={channel.id}
            label={channel.label}
            description={channel.description}
            defaultSelected={channel.defaultSelected}
          />
        ))}
      </SettingsGroup>

      <SettingsGroup title="Email me about">
        <SettingsRow
          stacked
          label="Topics"
          description="Applies to the daily and weekly digests too."
        >
          <CheckboxGroup
            aria-label="Email topics"
            defaultValue={["mentions", "reviews", "incidents"]}
          >
            <FieldGroup>
              <Checkbox value="mentions">
                <CheckboxControl />
                <Label>Mentions and replies</Label>
              </Checkbox>
              <Checkbox value="reviews">
                <CheckboxControl />
                <Label>Review requests on my pull requests</Label>
              </Checkbox>
              <Checkbox value="incidents">
                <CheckboxControl />
                <Label>Incidents on services I own</Label>
              </Checkbox>
              <Checkbox value="releases">
                <CheckboxControl />
                <Label>Release notes and changelog</Label>
              </Checkbox>
              <Checkbox value="billing">
                <CheckboxControl />
                <Label>Invoices and billing receipts</Label>
              </Checkbox>
            </FieldGroup>
          </CheckboxGroup>
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup title="Delivery">
        <SettingsRow
          stacked
          label="Frequency"
          description="How often batched notifications leave the queue."
        >
          <RadioGroup defaultValue="daily" aria-label="Delivery frequency">
            <FieldGroup>
              <Radio value="realtime">
                <RadioControl>
                  <RadioIndicator />
                  <FieldContent>
                    <Label>Real time</Label>
                    <Description>
                      Every event as it happens — roughly 40 a day.
                    </Description>
                  </FieldContent>
                </RadioControl>
              </Radio>
              <Radio value="daily">
                <RadioControl>
                  <RadioIndicator />
                  <FieldContent>
                    <Label>Daily digest</Label>
                    <Description>One summary at 09:00 local time.</Description>
                  </FieldContent>
                </RadioControl>
              </Radio>
              <Radio value="weekly">
                <RadioControl>
                  <RadioIndicator />
                  <FieldContent>
                    <Label>Weekly digest</Label>
                    <Description>
                      Monday mornings, everything at once.
                    </Description>
                  </FieldContent>
                </RadioControl>
              </Radio>
            </FieldGroup>
          </RadioGroup>
        </SettingsRow>
        <SettingsRow label="Quiet hours">
          <Select
            defaultSelectedKey="22-08"
            aria-label="Quiet hours"
            className="w-48"
          >
            <SelectTrigger />
            <SelectContent>
              <SelectItem id="off">Off</SelectItem>
              <SelectItem id="22-08">22:00 — 08:00</SelectItem>
              <SelectItem id="20-09">20:00 — 09:00</SelectItem>
              <SelectItem id="weekends">Weekends only</SelectItem>
            </SelectContent>
          </Select>
        </SettingsRow>
        <SettingsRow label="Break quiet hours for">
          <Select
            defaultSelectedKey="mentions"
            aria-label="Break quiet hours for"
            className="w-56"
          >
            <SelectTrigger />
            <SelectContent>
              <SelectItem id="nothing">Nothing</SelectItem>
              <SelectItem id="mentions">Direct mentions</SelectItem>
              <SelectItem id="incidents">Incidents I'm on call for</SelectItem>
            </SelectContent>
          </Select>
        </SettingsRow>
      </SettingsGroup>
    </>
  )
}

function AppearanceSection() {
  return (
    <>
      <SettingsGroup title="Appearance">
        <SettingsRow label="Theme">
          <SegmentedControl
            aria-label="Theme"
            defaultSelectedKeys={new Set(["system"])}
          >
            <SegmentedControlItem id="system">System</SegmentedControlItem>
            <SegmentedControlItem id="light">Light</SegmentedControlItem>
            <SegmentedControlItem id="dark">Dark</SegmentedControlItem>
          </SegmentedControl>
        </SettingsRow>
        <SettingsRow label="Language">
          <Select
            defaultSelectedKey="en"
            aria-label="Language"
            className="w-64"
          >
            <SelectTrigger />
            <SelectContent>
              <SelectItem id="en">English (United States)</SelectItem>
              <SelectItem id="en-gb">English (United Kingdom)</SelectItem>
              <SelectItem id="fr">Français</SelectItem>
              <SelectItem id="de">Deutsch</SelectItem>
              <SelectItem id="pt">Português</SelectItem>
              <SelectItem id="ja">日本語</SelectItem>
            </SelectContent>
          </Select>
        </SettingsRow>
        <SettingsRow label="Date format">
          <Select
            defaultSelectedKey="iso"
            aria-label="Date format"
            className="w-48"
          >
            <SelectTrigger />
            <SelectContent>
              <SelectItem id="iso">2026-08-22</SelectItem>
              <SelectItem id="us">Aug 22, 2026</SelectItem>
              <SelectItem id="eu">22 August 2026</SelectItem>
            </SelectContent>
          </Select>
        </SettingsRow>
        <SettingsRow label="Interface density">
          <SegmentedControl
            aria-label="Interface density"
            defaultSelectedKeys={new Set(["cozy"])}
          >
            <SegmentedControlItem id="compact">Compact</SegmentedControlItem>
            <SegmentedControlItem id="cozy">Cozy</SegmentedControlItem>
            <SegmentedControlItem id="roomy">Roomy</SegmentedControlItem>
          </SegmentedControl>
        </SettingsRow>
        <SwitchRow
          label="Show avatars in lists"
          description="Turn off for a denser, text-only issue list."
          defaultSelected
        />
        <SwitchRow
          label="Collapse the sidebar by default"
          description="Starts every session with the navigation tucked away."
        />
      </SettingsGroup>
    </>
  )
}

function ConnectionsSection() {
  return (
    <>
      <SettingsGroup title="Connected services">
        {INTEGRATIONS.map((integration) => (
          <div
            key={integration.id}
            className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:gap-4"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted text-fg-muted">
              <integration.icon className="size-5" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{integration.name}</span>
                {integration.connected ? (
                  <Badge variant="success" appearance="subtle" size="sm">
                    Connected
                  </Badge>
                ) : null}
              </div>
              <span className="truncate text-sm text-fg-muted">
                {integration.account ?? integration.detail}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {integration.connected ? (
                <>
                  <Tooltip>
                    <Button variant="quiet" size="sm" isIconOnly>
                      <ExternalLinkIcon />
                    </Button>
                    <TooltipContent>Open {integration.name}</TooltipContent>
                  </Tooltip>
                  <Button size="sm">Disconnect</Button>
                </>
              ) : (
                <Button size="sm" variant="primary">
                  Connect
                </Button>
              )}
            </div>
          </div>
        ))}
      </SettingsGroup>
      <Alert>
        <PlugIcon />
        <AlertTitle>Looking for something else?</AlertTitle>
        <AlertDescription>
          Northwind talks to 40+ services through webhooks. Anything not listed
          here can be wired up with a workspace API key.
        </AlertDescription>
      </Alert>
    </>
  )
}

function SecuritySection() {
  return (
    <>
      <SettingsGroup title="Sign-in">
        <SettingsRow label="Password" description="Last changed March 4, 2026.">
          <Button size="sm">Change password</Button>
        </SettingsRow>
        <SwitchRow
          label="Require 2FA for this workspace"
          description="Every member must enrol before their next sign-in."
          defaultSelected
        />
        <SwitchRow
          label="Alert me about new devices"
          description="Email whenever a session starts somewhere new."
        />
        <SettingsRow
          label="Passkeys"
          description="2 registered — MacBook Pro, YubiKey 5C."
        >
          <Button size="sm">
            <KeyboardIcon />
            Add passkey
          </Button>
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup
        title="Active sessions"
        action={
          <Button size="sm" variant="danger">
            <LogOutIcon />
            Revoke all
          </Button>
        }
      >
        <SettingsRow
          stacked
          label="Devices"
          description="Revoke anything you don't recognise."
        >
          <TableContainer>
            <Table aria-label="Active sessions">
              <TableHeader>
                <TableColumn isRowHeader>Device</TableColumn>
                <TableColumn>Location</TableColumn>
                <TableColumn>IP address</TableColumn>
                <TableColumn>Last active</TableColumn>
              </TableHeader>
              <TableBody>
                {SESSIONS.map((session) => (
                  <TableRow key={session.device}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="whitespace-nowrap">
                          {session.device}
                        </span>
                        {session.current && (
                          <Badge
                            variant="success"
                            appearance="subtle"
                            size="sm"
                          >
                            This device
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{session.location}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {session.ip}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {session.lastActive}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </SettingsRow>
      </SettingsGroup>
    </>
  )
}

/* --------------------------------- Block ---------------------------------- */

function SettingsSidebar({
  section,
  onSectionChange,
}: {
  section: string
  onSectionChange: (id: string) => void
}) {
  const { setOpenMobile } = useSidebar()

  return (
    <Sidebar>
      <SidebarHeader className="p-2">
        <SearchField aria-label="Search settings">
          <InputGroup size="sm">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <Input placeholder="Search settings…" />
          </InputGroup>
        </SearchField>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SECTIONS.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={section === item.id}
                    onPress={() => {
                      onSectionChange(item.id)
                      setOpenMobile(false)
                    }}
                  >
                    <item.icon />
                    {item.label}
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
            <SidebarMenuButton>
              <LogOutIcon />
              Log out
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default function SettingsBlock() {
  const [section, setSection] = useState("account")
  const [isDirty, setIsDirty] = useState(false)

  return (
    // Looks like an opened settings modal but is a plain card — the backdrop
    // and card reuse the Modal style's global vars so the fake tracks the axis.
    <div className="relative flex min-h-screen items-center justify-center bg-bg p-4 text-fg sm:p-8">
      <div className="absolute inset-0 bg-overlay/(--modal-backdrop-opacity) backdrop-blur-(--modal-backdrop-blur)" />
      <SidebarProvider className="relative h-[min(46rem,calc(100svh-3rem))] min-h-0 w-full max-w-5xl overflow-hidden rounded-(--modal-radius) border border-border-elevated bg-(--modal-background) shadow-[var(--shadow-overlay,var(--shadow-lg))]">
        <SettingsSidebar section={section} onSectionChange={setSection} />
        <Tooltip>
          <Button
            variant="quiet"
            size="sm"
            isIconOnly
            aria-label="Close settings"
            className="absolute top-2 right-2 z-20"
          >
            <XIcon />
          </Button>
          <TooltipContent>Close</TooltipContent>
        </Tooltip>
        <SidebarInset className="min-w-0 overflow-y-auto bg-transparent">
          {/* Mobile only — the sidebar is a drawer there and needs its trigger. */}
          <header className="sticky top-0 z-10 flex h-12 shrink-0 items-center gap-2 border-b bg-(--modal-background) px-3 md:hidden">
            <SidebarTrigger />
            <span className="font-medium">Settings</span>
          </header>

          {/* Change events bubble, so one handler marks the whole page dirty. */}
          <div onChange={() => setIsDirty(true)}>
            <div className="mx-auto flex w-full max-w-3xl flex-col px-4 py-6 sm:px-8 sm:py-10">
              <div className="flex min-w-0 flex-col gap-10 text-base">
                {section === "account" && <AccountSection />}
                {section === "notifications" && <NotificationsSection />}
                {section === "appearance" && <AppearanceSection />}
                {section === "connections" && <ConnectionsSection />}
                {section === "security" && <SecuritySection />}
              </div>

              <div
                className={cn(
                  "sticky bottom-4 z-10 mt-6 transition-opacity",
                  isDirty ? "opacity-100" : "pointer-events-none opacity-0",
                )}
              >
                <div className="flex items-center justify-between gap-3 rounded-xl border bg-card p-3 shadow-lg">
                  <span className="min-w-0 truncate text-sm text-fg-muted">
                    You have unsaved changes.
                  </span>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button size="sm" onPress={() => setIsDirty(false)}>
                      Discard
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      onPress={() => setIsDirty(false)}
                    >
                      Save changes
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
