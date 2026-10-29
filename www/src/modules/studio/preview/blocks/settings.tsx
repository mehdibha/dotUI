import { useState } from "react"
import type { ReactNode } from "react"

import {
  ArrowLeftIcon,
  BellIcon,
  CreditCardIcon,
  MenuIcon,
  MonitorIcon,
  MoonIcon,
  PlusIcon,
  SearchIcon,
  Settings2Icon,
  SunIcon,
  User2Icon,
  Users2Icon,
} from "@/registry/icons"
import { Responsive } from "@/registry/lib/responsive"
import { cn } from "@/registry/lib/utils"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Label } from "@/registry/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { Modal } from "@/registry/ui/modal"
import { ProgressBar, ProgressBarControl } from "@/registry/ui/progress-bar"
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
import { Sheet } from "@/registry/ui/sheet"
import { Switch, SwitchControl, SwitchIndicator } from "@/registry/ui/switch"
import { TextField } from "@/registry/ui/text-field"
import { BrandMark, BrandName } from "@/modules/studio/assets/brand"

import { formatMoney, initials } from "./shared"

// Linear-style settings: a settings-only sidebar, then pages built from
// titled groups of rows — label and description on the left, the control
// on the right. Every page in the sidebar is real, and every control works.

type Page = "preferences" | "profile" | "notifications" | "members" | "billing"

const NAV: {
  label: string
  items: { id: Page; label: string; icon: typeof BellIcon }[]
}[] = [
  {
    label: "Account",
    items: [
      { id: "preferences", label: "Preferences", icon: Settings2Icon },
      { id: "profile", label: "Profile", icon: User2Icon },
      { id: "notifications", label: "Notifications", icon: BellIcon },
    ],
  },
  {
    label: "Workspace",
    items: [
      { id: "members", label: "Members", icon: Users2Icon },
      { id: "billing", label: "Billing", icon: CreditCardIcon },
    ],
  },
]

function Group({
  title,
  description,
  action,
  children,
}: {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-sm font-medium compact:text-xs">{title}</h2>
          {description && (
            <p className="mt-0.5 text-sm text-fg-muted compact:text-xs">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
      <div className="divide-y rounded-(--studio-radius-card) border">
        {children}
      </div>
    </section>
  )
}

function Row({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3.5">
      <div className="min-w-0 flex-1 basis-56">
        <p className="text-sm compact:text-xs">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-pretty text-fg-muted">
            {description}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center">{children}</div>
    </div>
  )
}

function SwitchRow({
  label,
  description,
  defaultSelected,
}: {
  label: string
  description?: string
  defaultSelected?: boolean
}) {
  return (
    <Row label={label} description={description}>
      <Switch aria-label={label} defaultSelected={defaultSelected}>
        <SwitchControl>
          <SwitchIndicator />
        </SwitchControl>
      </Switch>
    </Row>
  )
}

function SelectRow({
  label,
  description,
  options,
  defaultValue,
}: {
  label: string
  description?: string
  options: string[]
  defaultValue: string
}) {
  return (
    <Row label={label} description={description}>
      <Select aria-label={label} defaultValue={defaultValue} className="w-44">
        <SelectTrigger className="w-44" />
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} id={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Row>
  )
}

function PreferencesPage() {
  const [theme, setTheme] = useState("system")
  return (
    <>
      <Group title="General">
        <SelectRow
          label="Default home view"
          description="The view you see when you open the app"
          options={["Inbox", "My issues", "Active cycle", "Projects"]}
          defaultValue="Inbox"
        />
        <SelectRow
          label="Display names"
          description="How people are shown across the workspace"
          options={["Full name", "Username"]}
          defaultValue="Full name"
        />
        <SelectRow
          label="First day of the week"
          options={["Sunday", "Monday", "Saturday"]}
          defaultValue="Monday"
        />
        <SwitchRow
          label="Convert text emoticons into emojis"
          description="Strings like :) become 🙂 as you type"
          defaultSelected
        />
      </Group>
      <Group title="Interface and theme">
        <Row
          label="Interface theme"
          description="Match your system, or pick one"
        >
          <SegmentedControl
            aria-label="Interface theme"
            selectedKeys={[theme]}
            onSelectionChange={(keys) => {
              const [key] = [...keys]
              if (key) setTheme(String(key))
            }}
          >
            <SegmentedControlItem id="light" aria-label="Light">
              <SunIcon />
            </SegmentedControlItem>
            <SegmentedControlItem id="dark" aria-label="Dark">
              <MoonIcon />
            </SegmentedControlItem>
            <SegmentedControlItem id="system" aria-label="System">
              <MonitorIcon />
            </SegmentedControlItem>
          </SegmentedControl>
        </Row>
        <SelectRow
          label="Font size"
          options={["Small", "Default", "Large"]}
          defaultValue="Default"
        />
        <SwitchRow
          label="Use pointer cursors"
          description="Show a pointer instead of an arrow over clickable elements"
        />
      </Group>
      <Group title="Automations">
        <SwitchRow
          label="Auto-assign to self"
          description="Issues you create are assigned to you"
          defaultSelected
        />
        <SwitchRow
          label="Move issue to started on branch copy"
          description="Copying a git branch name moves the issue to In Progress"
          defaultSelected
        />
        <SelectRow
          label="Git attachment format"
          description="Title format for pull requests linked to issues"
          options={["Title", "Issue ID: Title", "Title (Issue ID)"]}
          defaultValue="Issue ID: Title"
        />
      </Group>
    </>
  )
}

function ProfilePage() {
  const [name, setName] = useState("Erin Calloway")
  return (
    <>
      <Group title="Profile">
        <Row
          label="Profile picture"
          description="Shown next to your comments and issues"
        >
          <div className="flex items-center gap-3">
            <Avatar size="lg">
              <AvatarFallback>{initials(name || "?")}</AvatarFallback>
            </Avatar>
            <Button variant="secondary" size="sm">
              Upload
            </Button>
          </div>
        </Row>
        <Row label="Full name">
          <TextField
            aria-label="Full name"
            value={name}
            onChange={setName}
            className="w-64"
          >
            <Input />
          </TextField>
        </Row>
        <Row label="Username" description="One word, like a nickname">
          <TextField aria-label="Username" defaultValue="erin" className="w-64">
            <InputGroup>
              <InputGroupAddon>@</InputGroupAddon>
              <Input />
            </InputGroup>
          </TextField>
        </Row>
        <Row label="Email">
          <span className="text-sm text-fg-muted compact:text-xs">
            erin@northwind.co
          </span>
        </Row>
      </Group>
      <Group title="Workspace access">
        <Row
          label="Leave workspace"
          description="You'll lose access to every team and issue in Northwind"
        >
          <Button variant="secondary" size="sm" className="text-fg-danger">
            Leave
          </Button>
        </Row>
      </Group>
    </>
  )
}

function NotificationsPage() {
  const events = [
    { label: "Assigned to me", desktop: true, email: true, slack: true },
    {
      label: "Mentioned in a comment",
      desktop: true,
      email: true,
      slack: true,
    },
    {
      label: "Comment on a subscribed issue",
      desktop: true,
      email: false,
      slack: false,
    },
    {
      label: "Status change on a subscribed issue",
      desktop: false,
      email: false,
      slack: false,
    },
    {
      label: "Issue I created is completed",
      desktop: true,
      email: false,
      slack: true,
    },
  ]
  return (
    <>
      <Group
        title="Notify me about"
        description="Choose where each kind of update reaches you"
      >
        <div className="hidden grid-cols-[minmax(0,1fr)_repeat(3,4.5rem)] gap-2 px-4 py-2.5 text-xs font-medium text-fg-muted sm:grid">
          <span>Event</span>
          <span className="text-center">Desktop</span>
          <span className="text-center">Email</span>
          <span className="text-center">Slack</span>
        </div>
        {events.map((event) => (
          <div
            key={event.label}
            className="grid grid-cols-[minmax(0,1fr)_repeat(3,4.5rem)] items-center gap-2 px-4 py-3"
          >
            <span className="text-sm compact:text-xs">{event.label}</span>
            {(["desktop", "email", "slack"] as const).map((channel) => (
              <Switch
                key={channel}
                aria-label={`${event.label}: ${channel}`}
                defaultSelected={event[channel]}
                className="justify-self-center"
              >
                <SwitchControl>
                  <SwitchIndicator />
                </SwitchControl>
              </Switch>
            ))}
          </div>
        ))}
      </Group>
      <Group title="Email digest">
        <SelectRow
          label="Send a digest of unread notifications"
          options={["Never", "Every hour", "Daily", "Weekly"]}
          defaultValue="Daily"
        />
        <SwitchRow
          label="Product updates"
          description="Changelog and new features, about once a month"
          defaultSelected
        />
      </Group>
    </>
  )
}

const MEMBERS = [
  {
    name: "Erin Calloway",
    email: "erin@northwind.co",
    role: "Admin",
    joined: "Jan 2024",
  },
  {
    name: "Priya Raman",
    email: "priya@northwind.co",
    role: "Admin",
    joined: "Mar 2024",
  },
  {
    name: "Marcus Lee",
    email: "marcus@northwind.co",
    role: "Member",
    joined: "Jun 2024",
  },
  {
    name: "Hana Sato",
    email: "hana@northwind.co",
    role: "Member",
    joined: "Feb 2025",
  },
  {
    name: "Tobias Lindqvist",
    email: "tobias@fjordlabs.se",
    role: "Guest",
    joined: "Sep 2026",
  },
]

function InviteDialog({ onInvite }: { onInvite: (email: string) => void }) {
  const [isOpen, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("Member")
  const send = () => {
    if (!email.includes("@")) return
    onInvite(email)
    setEmail("")
    setOpen(false)
  }
  return (
    <Dialog isOpen={isOpen} onOpenChange={setOpen}>
      <Button variant="primary" size="sm">
        <PlusIcon />
        Invite
      </Button>
      <Responsive
        render={(isMobile) => {
          const content = (
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Invite to <BrandName>Northwind</BrandName>
                </DialogTitle>
                <DialogDescription>
                  They'll get an email with a link to join.
                </DialogDescription>
              </DialogHeader>
              <DialogBody className="flex flex-col gap-4">
                <TextField
                  type="email"
                  value={email}
                  onChange={setEmail}
                  autoFocus
                >
                  <Label>Email</Label>
                  <Input placeholder="name@company.com" />
                </TextField>
                <Select
                  value={role}
                  onChange={(key) => setRole(String(key))}
                  className="w-full"
                >
                  <Label>Role</Label>
                  <SelectTrigger className="w-full" />
                  <SelectContent>
                    {["Admin", "Member", "Guest"].map((r) => (
                      <SelectItem key={r} id={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </DialogBody>
              <DialogFooter>
                <Button variant="quiet" slot="close">
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  isDisabled={!email.includes("@")}
                  onPress={send}
                >
                  Send invite
                </Button>
              </DialogFooter>
            </DialogContent>
          )
          return isMobile ? <Sheet>{content}</Sheet> : <Modal>{content}</Modal>
        }}
      />
    </Dialog>
  )
}

function MembersPage() {
  const [query, setQuery] = useState("")
  const [invited, setInvited] = useState<string[]>([])
  const visible = MEMBERS.filter((m) =>
    `${m.name} ${m.email}`.toLowerCase().includes(query.toLowerCase()),
  )
  return (
    <Group
      title={`${MEMBERS.length} members`}
      description="Manage who can access Northwind and what they can do"
      action={
        <InviteDialog onInvite={(email) => setInvited((i) => [...i, email])} />
      }
    >
      <div className="px-4 py-2.5">
        <TextField
          aria-label="Search members"
          value={query}
          onChange={setQuery}
        >
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <Input placeholder="Search by name or email" />
          </InputGroup>
        </TextField>
      </div>
      {invited.map((email) => (
        <div key={email} className="flex items-center gap-3 px-4 py-3">
          <Avatar size="sm">
            <AvatarFallback>{email[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="min-w-0 flex-1 truncate text-sm compact:text-xs">
            {email}
          </span>
          <Badge size="sm" variant="neutral">
            Invited
          </Badge>
          <Button
            variant="quiet"
            size="xs"
            onPress={() => setInvited((i) => i.filter((e) => e !== email))}
          >
            Revoke
          </Button>
        </div>
      ))}
      {visible.map((member) => (
        <div key={member.email} className="flex items-center gap-3 px-4 py-3">
          <Avatar size="sm">
            <AvatarFallback>{initials(member.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm compact:text-xs">
              {member.name}
              {member.email === "erin@northwind.co" && (
                <span className="text-fg-muted"> (you)</span>
              )}
            </p>
            <p className="truncate text-xs text-fg-muted">{member.email}</p>
          </div>
          <span className="hidden text-xs text-fg-muted sm:block">
            Joined {member.joined}
          </span>
          <Select
            aria-label={`Role for ${member.name}`}
            defaultValue={member.role}
            isDisabled={member.email === "erin@northwind.co"}
            className="w-28"
          >
            <SelectTrigger className="w-28" />
            <SelectContent>
              {["Admin", "Member", "Guest"].map((r) => (
                <SelectItem key={r} id={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
      {visible.length === 0 && (
        <p className="px-4 py-8 text-center text-sm text-fg-muted compact:text-xs">
          No members match “{query}”.
        </p>
      )}
    </Group>
  )
}

function BillingPage() {
  const [annual, setAnnual] = useState(true)
  return (
    <>
      <Group title="Plan">
        <div className="flex flex-wrap items-center gap-4 px-4 py-4">
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 font-medium">
              Business
              <Badge size="sm" variant="accent">
                Current plan
              </Badge>
            </p>
            <p className="mt-0.5 text-sm text-fg-muted compact:text-xs">
              {formatMoney(annual ? 12 : 14, { digits: 0 })} per member per
              month, billed {annual ? "yearly" : "monthly"}
            </p>
          </div>
          <Switch
            isSelected={annual}
            onChange={setAnnual}
            className="text-sm compact:text-xs"
          >
            <SwitchControl>
              <SwitchIndicator />
            </SwitchControl>
            Annual billing
          </Switch>
          <Button variant="secondary" size="sm">
            Change plan
          </Button>
        </div>
        <div className="grid gap-4 px-4 py-4 sm:grid-cols-2">
          <ProgressBar value={62} aria-label="Seats used" className="gap-1.5">
            <div className="flex justify-between text-sm compact:text-xs">
              <span>Seats</span>
              <span className="text-fg-muted tabular-nums">5 of 8</span>
            </div>
            <ProgressBarControl />
          </ProgressBar>
          <ProgressBar value={34} aria-label="Issues used" className="gap-1.5">
            <div className="flex justify-between text-sm compact:text-xs">
              <span>File storage</span>
              <span className="text-fg-muted tabular-nums">3.4 of 10 GB</span>
            </div>
            <ProgressBarControl />
          </ProgressBar>
        </div>
      </Group>
      <Group title="Payment method">
        <Row label="Visa ending in 4242" description="Expires 04/29">
          <Button variant="secondary" size="sm">
            Update
          </Button>
        </Row>
        <Row label="Billing email" description="Invoices are sent here">
          <span className="text-sm text-fg-muted compact:text-xs">
            billing@northwind.co
          </span>
        </Row>
      </Group>
      <Group title="Invoices">
        {[
          { date: "Oct 1, 2026", amount: 480 },
          { date: "Sep 1, 2026", amount: 480 },
          { date: "Aug 1, 2026", amount: 420 },
        ].map((invoice) => (
          <div
            key={invoice.date}
            className="flex items-center gap-4 px-4 py-3 text-sm compact:text-xs"
          >
            <span className="flex-1">{invoice.date}</span>
            <span className="tabular-nums">{formatMoney(invoice.amount)}</span>
            <Badge size="sm" variant="success">
              Paid
            </Badge>
            <Button variant="quiet" size="xs">
              View
            </Button>
          </div>
        ))}
      </Group>
    </>
  )
}

const PAGES: Record<
  Page,
  { title: string; description: string; render: () => ReactNode }
> = {
  preferences: {
    title: "Preferences",
    description: "Your personal settings for how the app looks and behaves",
    render: () => <PreferencesPage />,
  },
  profile: {
    title: "Profile",
    description: "How you appear to the rest of the workspace",
    render: () => <ProfilePage />,
  },
  notifications: {
    title: "Notifications",
    description: "Decide what reaches you, and where",
    render: () => <NotificationsPage />,
  },
  members: {
    title: "Members",
    description: "People in the Northwind workspace",
    render: () => <MembersPage />,
  },
  billing: {
    title: "Billing",
    description: "Your plan, usage and invoices",
    render: () => <BillingPage />,
  },
}

export default function SettingsBlock() {
  const [page, setPage] = useState<Page>("preferences")
  const [navOpen, setNavOpen] = useState(false)
  const current = PAGES[page]

  return (
    <div className="flex h-svh min-h-svh bg-bg text-fg">
      <nav
        aria-label="Settings"
        className={cn(
          "w-60 shrink-0 flex-col gap-5 overflow-y-auto border-r px-3 py-4",
          navOpen
            ? "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-20 max-md:flex max-md:bg-bg"
            : "hidden md:flex",
        )}
      >
        <Button variant="quiet" size="sm" className="justify-start self-start">
          <ArrowLeftIcon />
          Back to app
        </Button>
        {NAV.map((group) => (
          <div key={group.label} className="flex flex-col gap-0.5">
            <span className="flex items-center gap-2 px-2 pb-1 text-xs font-medium text-fg-muted">
              {group.label === "Workspace" && (
                <BrandMark className="size-4">
                  <span className="flex size-4 items-center justify-center rounded-(--studio-radius-detail) bg-primary text-[9px] font-semibold text-fg-on-primary">
                    N
                  </span>
                </BrandMark>
              )}
              {group.label === "Workspace" ? (
                <BrandName>Northwind</BrandName>
              ) : (
                group.label
              )}
            </span>
            {group.items.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-current={page === item.id ? "page" : undefined}
                onClick={() => {
                  setPage(item.id)
                  setNavOpen(false)
                }}
                className={cn(
                  "flex cursor-interactive items-center gap-2.5 rounded-(--studio-radius-item) px-2 py-1.5 text-left text-sm compact:text-xs [&_svg]:size-4 [&_svg]:text-fg-muted",
                  page === item.id ? "bg-muted font-medium" : "hover:bg-muted",
                )}
              >
                <item.icon />
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>
      {navOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-10 bg-inverse/20 md:hidden"
          onClick={() => setNavOpen(false)}
        />
      )}

      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-8 sm:px-8 sm:py-14">
          <div className="flex items-start gap-3">
            <Button
              variant="quiet"
              size="sm"
              isIconOnly
              aria-label="Open settings menu"
              className="-ml-2 md:hidden"
              onPress={() => setNavOpen(true)}
            >
              <MenuIcon />
            </Button>
            <div>
              <h1 className="font-heading text-2xl font-semibold">
                {current.title}
              </h1>
              <p className="mt-1 text-sm text-fg-muted compact:text-xs">
                {current.description}
              </p>
            </div>
          </div>
          {current.render()}
        </div>
      </main>
    </div>
  )
}
