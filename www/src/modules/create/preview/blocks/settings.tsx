import { useState } from "react"

import { useIsMobile } from "@/registry/hooks/use-mobile"
import {
  ActivityIcon,
  BellIcon,
  Building2Icon,
  CreditCardIcon,
  ExternalLinkIcon,
  FolderIcon,
  FrameIcon,
  GitBranchIcon,
  ImageIcon,
  KeyboardIcon,
  LogOutIcon,
  MessageSquareIcon,
  PaletteIcon,
  PlugIcon,
  ShieldIcon,
  TriangleAlertIcon,
  UploadIcon,
  UserIcon,
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
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
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
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Modal } from "@/registry/ui/modal"
import { Popover } from "@/registry/ui/popover"
import {
  Radio,
  RadioControl,
  RadioGroup,
  RadioIndicator,
} from "@/registry/ui/radio-group"
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
import { TextField } from "@/registry/ui/text-field"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"
import { Appearance } from "@/components/showcase/appearance"
import { TwoFactor } from "@/components/showcase/two-factor"

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

function SectionIntro({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="font-heading text-lg font-semibold tracking-tight">
        {title}
      </h2>
      <p className="text-pretty text-fg-muted">{description}</p>
    </div>
  )
}

function ProfileCard() {
  const [photo, setPhoto] = useState<string | null>(null)
  const [bio, setBio] = useState(
    "Product engineer working on the Northwind platform team. Previously infrastructure at Halcyon.",
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          This information appears on your public profile and in mentions.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="relative">
          <div className="flex h-28 items-center justify-center rounded-xl border bg-muted text-fg-muted sm:h-32">
            <ImageIcon className="size-6" />
          </div>
          <div className="absolute right-3 bottom-3">
            <FileTrigger acceptedFileTypes={["image/png", "image/jpeg"]}>
              <Button size="sm">Change cover</Button>
            </FileTrigger>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar size="lg" className="size-16 shrink-0">
            {photo && <AvatarImage src={photo} alt="Mara Ellison" />}
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <FileTrigger
                acceptedFileTypes={["image/png", "image/jpeg"]}
                onSelect={(files) => {
                  const file = files ? Array.from(files)[0] : null
                  if (file) setPhoto(URL.createObjectURL(file))
                }}
              >
                <Button size="sm">
                  <UploadIcon />
                  Upload photo
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
            </div>
            <p className="text-xs text-fg-muted">
              Square PNG or JPG, at least 256×256 and under 2 MB.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField defaultValue="Mara Ellison" className="w-full">
            <Label>Full name</Label>
            <Input />
          </TextField>
          <TextField defaultValue="mara-ellison" className="w-full">
            <Label>Username</Label>
            <InputGroup>
              <InputGroupAddon>northwind.dev/</InputGroupAddon>
              <Input />
            </InputGroup>
          </TextField>
          <TextField defaultValue="mara@northwind.dev" className="w-full">
            <Label>Email</Label>
            <Input type="email" />
            <Description>Used for sign-in and receipts.</Description>
          </TextField>
          <Select defaultSelectedKey="engineering" className="w-full">
            <Label>Job title</Label>
            <SelectTrigger />
            <SelectContent>
              <SelectItem id="engineering">Product engineer</SelectItem>
              <SelectItem id="design">Product designer</SelectItem>
              <SelectItem id="pm">Product manager</SelectItem>
              <SelectItem id="support">Support engineer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TextField value={bio} onChange={setBio} className="w-full">
          <Label>Bio</Label>
          <TextArea rows={4} maxLength={280} />
          <Description>{280 - bio.length} characters remaining.</Description>
        </TextField>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="quiet">Cancel</Button>
        <Button variant="primary">Save profile</Button>
      </CardFooter>
    </Card>
  )
}

function WorkspaceCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workspace</CardTitle>
        <CardDescription>
          Names and defaults shared by everyone at Northwind Labs.
        </CardDescription>
        <CardAction>
          <Badge variant="accent" appearance="subtle">
            Owner
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <TextField defaultValue="Northwind Labs" className="w-full">
          <Label>Workspace name</Label>
          <Input />
        </TextField>
        <TextField defaultValue="northwind-labs" className="w-full">
          <Label>Workspace URL</Label>
          <InputGroup>
            <InputGroupAddon>app.northwind.dev/</InputGroupAddon>
            <Input />
          </InputGroup>
        </TextField>
        <Select defaultSelectedKey="overview" className="w-full">
          <Label>Default landing page</Label>
          <SelectTrigger />
          <SelectContent>
            <SelectItem id="overview">Overview</SelectItem>
            <SelectItem id="deployments">Deployments</SelectItem>
            <SelectItem id="issues">Issues</SelectItem>
            <SelectItem id="analytics">Analytics</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultSelectedKey="wet" className="w-full">
          <Label>Time zone</Label>
          <SelectTrigger />
          <SelectContent>
            <SelectItem id="wet">Lisbon — WET (UTC+0)</SelectItem>
            <SelectItem id="cet">Berlin — CET (UTC+1)</SelectItem>
            <SelectItem id="est">New York — EST (UTC−5)</SelectItem>
            <SelectItem id="pst">San Francisco — PST (UTC−8)</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
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
    <Card className="border-border-danger">
      <CardHeader>
        <CardTitle className="text-fg-danger">Danger zone</CardTitle>
        <CardDescription>
          These actions affect every member of Northwind Labs.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-col">
            <span className="font-medium">Transfer ownership</span>
            <span className="text-sm text-fg-muted">
              Hand the workspace to another admin.
            </span>
          </div>
          <Button className="shrink-0">Transfer</Button>
        </div>
        <Separator />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-col">
            <span className="font-medium">Delete this workspace</span>
            <span className="text-sm text-fg-muted">
              Removes 24 projects, 1,842 issues and all deploy history.
            </span>
          </div>
          <Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
            <Button variant="danger" className="shrink-0">
              Delete workspace
            </Button>
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
        </div>
      </CardContent>
    </Card>
  )
}

function AccountSection() {
  return (
    <>
      <SectionIntro
        title="Account"
        description="Your profile, the workspace it belongs to, and the actions you can't take back."
      />
      <ProfileCard />
      <WorkspaceCard />
      <DangerZone />
    </>
  )
}

function NotificationsSection() {
  return (
    <>
      <SectionIntro
        title="Notifications"
        description="Choose where Northwind reaches you and how often it batches updates."
      />
      <Card>
        <CardHeader>
          <CardTitle>Channels</CardTitle>
          <CardDescription>
            Turn a channel off to silence it everywhere.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {CHANNELS.map((channel) => (
            <Switch
              key={channel.id}
              className="w-full"
              defaultSelected={channel.defaultSelected}
            >
              <SwitchControl>
                <FieldContent>
                  <Label>{channel.label}</Label>
                  <Description>{channel.description}</Description>
                </FieldContent>
                <SwitchIndicator />
              </SwitchControl>
            </Switch>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email me about</CardTitle>
          <CardDescription>
            Applies to the daily and weekly digests too.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delivery</CardTitle>
          <CardDescription>
            How often batched notifications leave the queue.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
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
          <Separator />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select defaultSelectedKey="22-08" className="w-full">
              <Label>Quiet hours</Label>
              <SelectTrigger />
              <SelectContent>
                <SelectItem id="off">Off</SelectItem>
                <SelectItem id="22-08">22:00 — 08:00</SelectItem>
                <SelectItem id="20-09">20:00 — 09:00</SelectItem>
                <SelectItem id="weekends">Weekends only</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultSelectedKey="mentions" className="w-full">
              <Label>Break quiet hours for</Label>
              <SelectTrigger />
              <SelectContent>
                <SelectItem id="nothing">Nothing</SelectItem>
                <SelectItem id="mentions">Direct mentions</SelectItem>
                <SelectItem id="incidents">
                  Incidents I'm on call for
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button variant="primary">Save preferences</Button>
        </CardFooter>
      </Card>
    </>
  )
}

function AppearanceSection() {
  return (
    <>
      <SectionIntro
        title="Appearance"
        description="Theme, language and the small display choices that follow you across devices."
      />
      <Appearance />
      <Card>
        <CardHeader>
          <CardTitle>Display</CardTitle>
          <CardDescription>
            Applies to this browser and syncs to the Northwind desktop app.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Select defaultSelectedKey="en" className="w-full">
              <Label>Language</Label>
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
            <Select defaultSelectedKey="iso" className="w-full">
              <Label>Date format</Label>
              <SelectTrigger />
              <SelectContent>
                <SelectItem id="iso">2026-08-22</SelectItem>
                <SelectItem id="us">Aug 22, 2026</SelectItem>
                <SelectItem id="eu">22 August 2026</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label id="density-label">Interface density</Label>
            <SegmentedControl
              aria-labelledby="density-label"
              defaultSelectedKeys={new Set(["cozy"])}
              className="grid w-full grid-cols-3"
            >
              <SegmentedControlItem id="compact">Compact</SegmentedControlItem>
              <SegmentedControlItem id="cozy">Cozy</SegmentedControlItem>
              <SegmentedControlItem id="roomy">Roomy</SegmentedControlItem>
            </SegmentedControl>
          </div>
          <Separator />
          <Switch className="w-full" defaultSelected>
            <SwitchControl>
              <FieldContent>
                <Label>Show avatars in lists</Label>
                <Description>
                  Turn off for a denser, text-only issue list.
                </Description>
              </FieldContent>
              <SwitchIndicator />
            </SwitchControl>
          </Switch>
          <Switch className="w-full">
            <SwitchControl>
              <FieldContent>
                <Label>Collapse the sidebar by default</Label>
                <Description>
                  Starts every session with the navigation tucked away.
                </Description>
              </FieldContent>
              <SwitchIndicator />
            </SwitchControl>
          </Switch>
        </CardContent>
      </Card>
    </>
  )
}

function ConnectionsSection() {
  return (
    <>
      <SectionIntro
        title="Connections"
        description="Services linked to your Northwind account. Disconnecting stops the sync but keeps imported data."
      />
      <Card className="gap-0 py-0">
        <CardContent className="flex flex-col p-0">
          {INTEGRATIONS.map((integration, index) => (
            <div key={integration.id}>
              {index > 0 && <Separator />}
              <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
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
            </div>
          ))}
        </CardContent>
      </Card>
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
      <SectionIntro
        title="Security"
        description="Sign-in factors and the devices currently holding a session."
      />
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <TwoFactor />
        <Card>
          <CardHeader>
            <CardTitle>Sign-in</CardTitle>
            <CardDescription>
              Last password change: March 4, 2026.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Switch className="w-full" defaultSelected>
              <SwitchControl>
                <FieldContent>
                  <Label>Require 2FA for this workspace</Label>
                  <Description>
                    Every member must enrol before their next sign-in.
                  </Description>
                </FieldContent>
                <SwitchIndicator />
              </SwitchControl>
            </Switch>
            <Switch className="w-full">
              <SwitchControl>
                <FieldContent>
                  <Label>Alert me about new devices</Label>
                  <Description>
                    Email whenever a session starts somewhere new.
                  </Description>
                </FieldContent>
                <SwitchIndicator />
              </SwitchControl>
            </Switch>
            <Separator />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex min-w-0 flex-col">
                <span className="font-medium">Passkeys</span>
                <span className="text-sm text-fg-muted">
                  2 registered — MacBook Pro, YubiKey 5C
                </span>
              </div>
              <Button size="sm">
                <KeyboardIcon />
                Add passkey
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active sessions</CardTitle>
          <CardDescription>
            Revoke anything you don't recognise.
          </CardDescription>
          <CardAction>
            <Button size="sm" variant="danger">
              <LogOutIcon />
              Revoke all
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </>
  )
}

export default function SettingsBlock() {
  const [section, setSection] = useState("account")
  const [isDirty, setIsDirty] = useState(false)
  const isMobile = useIsMobile()

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-20 border-b bg-bg/85 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-fg-on-primary">
            <Building2Icon className="size-4" />
          </div>
          <span className="truncate font-medium">Northwind Labs</span>
          <Badge
            appearance="subtle"
            size="sm"
            className="hidden sm:inline-flex"
          >
            Pro
          </Badge>
          <div className="ml-auto flex items-center gap-1">
            <Tooltip>
              <Button variant="quiet" isIconOnly aria-label="Notifications">
                <BellIcon />
              </Button>
              <TooltipContent>3 unread notifications</TooltipContent>
            </Tooltip>
            <Menu>
              <Button variant="quiet" isIconOnly aria-label="Account menu">
                <Avatar size="sm">
                  <AvatarFallback>ME</AvatarFallback>
                </Avatar>
              </Button>
              <Popover>
                <MenuContent>
                  <MenuItem>Profile</MenuItem>
                  <MenuItem>Command menu</MenuItem>
                  <MenuItem>Billing</MenuItem>
                  <MenuItem variant="danger">Sign out</MenuItem>
                </MenuContent>
              </Popover>
            </Menu>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Settings
          </h1>
          <p className="max-w-prose text-pretty text-fg-muted">
            Manage your profile, how Northwind notifies you, and the services
            connected to this workspace.
          </p>
        </div>

        {/* Change events bubble, so one handler marks the whole page dirty. */}
        <main className="mt-8" onChange={() => setIsDirty(true)}>
          <Tabs
            orientation={isMobile ? "horizontal" : "vertical"}
            selectedKey={section}
            onSelectionChange={(key) => setSection(String(key))}
            className="gap-6 md:gap-10"
          >
            <div className="max-w-full overflow-x-auto md:w-52 md:shrink-0 md:overflow-visible">
              {/* w-max keeps the list as wide as its tabs so the horizontal
                  scroll reaches all of them — a w-full list would centre the
                  overflow and strand the first tab off-screen. */}
              <TabList
                aria-label="Settings sections"
                className="w-max min-w-full"
              >
                {SECTIONS.map((item) => (
                  <Tab key={item.id} id={item.id}>
                    <item.icon />
                    {item.label}
                  </Tab>
                ))}
              </TabList>
            </div>

            {SECTIONS.map((item) => (
              <TabPanel
                key={item.id}
                id={item.id}
                className="flex min-w-0 flex-col gap-6 text-base"
              >
                {item.id === "account" && <AccountSection />}
                {item.id === "notifications" && <NotificationsSection />}
                {item.id === "appearance" && <AppearanceSection />}
                {item.id === "connections" && <ConnectionsSection />}
                {item.id === "security" && <SecuritySection />}
              </TabPanel>
            ))}
          </Tabs>

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
        </main>
      </div>
    </div>
  )
}
