"use client"

import * as React from "react"

import {
  AlertCircleIcon,
  ArchiveIcon,
  ArrowLeftIcon,
  BadgeCheckIcon,
  ChevronsUpDownIcon,
  ClockIcon,
  FileTextIcon,
  ImageIcon,
  InboxIcon,
  ListFilterIcon,
  LogOutIcon,
  MailCheckIcon,
  MailIcon,
  MoreHorizontalIcon,
  PaperclipIcon,
  PinIcon,
  SendIcon,
  SettingsIcon,
  SquarePenIcon,
  StarIcon,
  TagIcon,
  Trash2Icon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/ui/empty"
import { TextArea } from "@/registry/ui/input"
import { ListBox, ListBoxItem } from "@/registry/ui/list-box"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"
import { SearchField } from "@/registry/ui/search-field"
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
import { Tab, TabList, Tabs } from "@/registry/ui/tabs"
import { TextField } from "@/registry/ui/text-field"
import { ToggleButton } from "@/registry/ui/toggle-button"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

type IconProps = React.ComponentProps<"svg">

// The curated icon set has no reply/forward glyphs, so these three are inline.
// Same geometry and stroke as the rest of the set, sized by the button's rules.
function StrokeIcon({ paths, ...props }: { paths: string[] } & IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}

const ReplyIcon = (props: IconProps) => (
  <StrokeIcon
    paths={["m9 17-5-5 5-5", "M20 18v-2a4 4 0 0 0-4-4H4"]}
    {...props}
  />
)

const ReplyAllIcon = (props: IconProps) => (
  <StrokeIcon
    paths={["m7 17-5-5 5-5", "m12 17-5-5 5-5", "M22 18v-2a4 4 0 0 0-4-4H7"]}
    {...props}
  />
)

const ForwardIcon = (props: IconProps) => (
  <StrokeIcon
    paths={["m15 17 5-5-5-5", "M4 18v-2a4 4 0 0 1 4-4h12"]}
    {...props}
  />
)

interface ThreadEntry {
  author: string
  email: string
  initials: string
  time: string
  paragraphs: string[]
}

interface Message {
  id: string
  from: string
  email: string
  initials: string
  subject: string
  preview: string
  time: string
  unread: boolean
  labels: string[]
  attachments?: { name: string; meta: string; kind: "doc" | "image" }[]
  thread: ThreadEntry[]
}

const ME = {
  author: "Maya Okonkwo",
  email: "maya@sablecloud.io",
  initials: "MO",
}

const FOLDERS = [
  // Inbox and Starred counts are derived from state below.
  { id: "inbox", name: "Inbox", icon: InboxIcon },
  { id: "starred", name: "Starred", icon: StarIcon },
  { id: "snoozed", name: "Snoozed", icon: ClockIcon, count: 2 },
  { id: "sent", name: "Sent", icon: SendIcon },
  { id: "drafts", name: "Drafts", icon: SquarePenIcon, count: 3 },
  { id: "archive", name: "Archive", icon: ArchiveIcon },
  { id: "spam", name: "Spam", icon: AlertCircleIcon, count: 5 },
  { id: "trash", name: "Trash", icon: Trash2Icon },
]

const LABELS = [
  { id: "design-system", name: "Design system", count: 4 },
  { id: "billing", name: "Billing" },
  { id: "recruiting", name: "Recruiting", count: 1 },
  { id: "incidents", name: "Incidents" },
]

const MESSAGES: Message[] = [
  {
    id: "tokens-freeze",
    from: "Priya Raghavan",
    email: "priya@sablecloud.io",
    initials: "PR",
    subject: "Design tokens: naming freeze before v3.0",
    preview:
      "We're two renames away from a stable surface — can we lock the semantic layer on Thursday?",
    time: "9:41 AM",
    unread: true,
    labels: ["Design system"],
    attachments: [
      { name: "tokens-v3-draft.pdf", meta: "PDF · 1.2 MB", kind: "doc" },
      { name: "semantic-map.png", meta: "PNG · 480 KB", kind: "image" },
    ],
    thread: [
      {
        author: "Priya Raghavan",
        email: "priya@sablecloud.io",
        initials: "PR",
        time: "Aug 22, 9:41 AM",
        paragraphs: [
          "Morning — the token audit is done. We're down to two renames on the semantic layer: `surface-raised` becomes `card`, and `text-secondary` becomes `fg-muted`. Everything else in the 3.0 draft is additive, so consumers upgrade with a codemod and nothing breaks at runtime.",
          "I'd like to freeze naming on Thursday so the platform team can cut the migration branch on Friday. After that, any rename waits for 4.0. Draft spec and the semantic map are attached.",
        ],
      },
      {
        author: "Jonas Kelleher",
        email: "jonas@sablecloud.io",
        initials: "JK",
        time: "Aug 22, 10:06 AM",
        paragraphs: [
          "Thursday works for platform. One ask: keep `surface-raised` as a deprecated alias for one minor so the marketing site doesn't have to land its rewrite in the same week.",
        ],
      },
      {
        author: "Maya Okonkwo",
        email: "maya@sablecloud.io",
        initials: "MO",
        time: "Aug 22, 10:22 AM",
        paragraphs: [
          "Agreed on both. I'll write the deprecation notice into the changelog and flag it in the release notes so nobody discovers it from a lint error.",
        ],
      },
    ],
  },
  {
    id: "infra-spend",
    from: "Tomás Herrera",
    email: "tomas@sablecloud.io",
    initials: "TH",
    subject: "Re: Q3 infrastructure spend is up 18%",
    preview:
      "Most of it is the staging cluster we never scaled back down after the migration.",
    time: "8:12 AM",
    unread: true,
    labels: ["Billing"],
    thread: [
      {
        author: "Tomás Herrera",
        email: "tomas@sablecloud.io",
        initials: "TH",
        time: "Aug 22, 8:12 AM",
        paragraphs: [
          "I traced the 18%. About $4,100 of the $6,300 delta is the staging cluster we scaled up for the June migration and never scaled back down. Another $1,400 is image egress from the docs CDN — that one is real growth, traffic is up 31% quarter over quarter.",
          "I can drop staging to three nodes tonight with no impact on CI times. Say the word.",
        ],
      },
    ],
  },
  {
    id: "invoice-2291",
    from: "Sable Cloud Billing",
    email: "billing@sablecloud.io",
    initials: "SC",
    subject: "Invoice #SC-2291 · $1,480.00 paid",
    preview:
      "Your August invoice was paid automatically with the card ending 4471.",
    time: "Yesterday",
    unread: false,
    labels: ["Billing"],
    attachments: [
      { name: "invoice-SC-2291.pdf", meta: "PDF · 82 KB", kind: "doc" },
    ],
    thread: [
      {
        author: "Sable Cloud Billing",
        email: "billing@sablecloud.io",
        initials: "SC",
        time: "Aug 21, 4:03 PM",
        paragraphs: [
          "Invoice #SC-2291 for $1,480.00 was paid automatically on August 21 with the Visa ending 4471. Your next invoice is scheduled for September 21.",
          "This period covers 14 seats on the Team plan, 2.1 TB of egress, and the Enterprise support add-on. A full breakdown is attached.",
        ],
      },
    ],
  },
  {
    id: "onboarding-findings",
    from: "Dan Whitfield",
    email: "dan@northlight.design",
    initials: "DW",
    subject: "Onboarding flow: 6 usability findings",
    preview:
      "Five of eight participants missed the workspace switcher entirely on the first pass.",
    time: "Yesterday",
    unread: true,
    labels: ["Design system"],
    thread: [
      {
        author: "Dan Whitfield",
        email: "dan@northlight.design",
        initials: "DW",
        time: "Aug 21, 2:18 PM",
        paragraphs: [
          "Eight moderated sessions, 45 minutes each. The headline: five of eight participants never found the workspace switcher on the first pass — it reads as a page title, not a control. Adding the chevron and a hover surface fixed it for the three participants we tested the patch with.",
          "The other five findings are smaller: the invite step's empty state is doing too much, and the plan comparison table is unreadable below 400px. Full write-up goes out Monday.",
        ],
      },
    ],
  },
  {
    id: "pricing-handoff",
    from: "Aiko Tanaka",
    email: "aiko@sablecloud.io",
    initials: "AT",
    subject: "Figma → code handoff for the Pricing page",
    preview:
      "Everything is on the shared type scale now, so the handoff should be mostly mechanical.",
    time: "Tue",
    unread: false,
    labels: ["Design system"],
    thread: [
      {
        author: "Aiko Tanaka",
        email: "aiko@sablecloud.io",
        initials: "AT",
        time: "Aug 19, 11:52 AM",
        paragraphs: [
          "Pricing is ready for handoff. I rebuilt the tiers on the shared type scale and the 4px spacing grid, so there should be no one-off values left to chase. The only custom piece is the annual/monthly toggle, which uses the segmented control at the small size.",
          "One open question for engineering: do we render the comparison table as a real table on mobile, or stack it into cards? I drew both.",
        ],
      },
      {
        author: "Maya Okonkwo",
        email: "maya@sablecloud.io",
        initials: "MO",
        time: "Aug 19, 1:07 PM",
        paragraphs: [
          "Cards below 640px. The table is only legible if we drop three columns, and dropping columns on a pricing page is how you lose the sale.",
        ],
      },
    ],
  },
  {
    id: "offer-letter",
    from: "Sofia Marchetti",
    email: "sofia@sablecloud.io",
    initials: "SM",
    subject: "Offer letter for Elena Vidal (Senior Product Designer)",
    preview:
      "Panel came back unanimous. Ready to send the offer once you sign off on the level.",
    time: "Tue",
    unread: true,
    labels: ["Recruiting"],
    thread: [
      {
        author: "Sofia Marchetti",
        email: "sofia@sablecloud.io",
        initials: "SM",
        time: "Aug 19, 9:30 AM",
        paragraphs: [
          "The panel came back unanimous on Elena — four strong hires, no reservations. Her systems portfolio is the closest match we've seen to the work queued for next year.",
          "I've drafted the offer at Senior, band 4: $172,000 base, 0.14% equity over four years, start date October 6. I need your sign-off on the level before it goes out this afternoon.",
        ],
      },
    ],
  },
  {
    id: "postmortem-418",
    from: "Reliability Bot",
    email: "alerts@sablecloud.io",
    initials: "RB",
    subject: "Postmortem: 22-minute API latency spike (INC-418)",
    preview:
      "Root cause was a missing index on the audit-log table after Monday's migration.",
    time: "Mon",
    unread: false,
    labels: ["Incidents"],
    thread: [
      {
        author: "Reliability Bot",
        email: "alerts@sablecloud.io",
        initials: "RB",
        time: "Aug 18, 6:44 PM",
        paragraphs: [
          "INC-418 is resolved. Between 14:06 and 14:28 UTC, p95 API latency rose from 118ms to 3.4s across all regions. Root cause: Monday's migration dropped and did not recreate the composite index on the audit-log table, so every workspace read fell back to a sequential scan.",
          "Impact: 41,200 slow requests, 380 timeouts, no data loss. The index is back, and a migration check that fails CI when an index disappears has been merged.",
        ],
      },
    ],
  },
  {
    id: "a11y-audit",
    from: "Hannah Lindqvist",
    email: "hannah@sablecloud.io",
    initials: "HL",
    subject: "Re: Accessibility audit — 9 remaining AA issues",
    preview:
      "Down from 34. The last nine are all contrast on disabled controls and two focus traps.",
    time: "Sun",
    unread: true,
    labels: ["Design system"],
    thread: [
      {
        author: "Hannah Lindqvist",
        email: "hannah@sablecloud.io",
        initials: "HL",
        time: "Aug 17, 3:12 PM",
        paragraphs: [
          "We're at nine open AA issues, down from thirty-four in June. Seven are contrast on disabled controls — our disabled foreground sits at 3.1:1 against the muted surface and needs 4.5:1. Fixing it in the token layer clears all seven at once.",
          "The other two are focus traps: the command palette doesn't return focus to its trigger, and the drawer lets Tab escape behind the overlay.",
        ],
      },
    ],
  },
  {
    id: "renewal",
    from: "Noah Feldman",
    email: "noah@aperturelabs.com",
    initials: "NF",
    subject: "Contract renewal: Sable Cloud Enterprise",
    preview:
      "Legal cleared the redlines. We'd like to move to a two-year term at the current rate.",
    time: "Sat",
    unread: false,
    labels: ["Billing"],
    thread: [
      {
        author: "Noah Feldman",
        email: "noah@aperturelabs.com",
        initials: "NF",
        time: "Aug 16, 10:05 AM",
        paragraphs: [
          "Our legal team cleared the redlines you sent — the only change is the data-residency clause in section 7, which now names Frankfurt explicitly.",
          "We'd like to renew for a two-year term at the current rate, with seats moving from 60 to 85 in January. If that works, send the countersigned copy and we'll process it this week.",
        ],
      },
    ],
  },
]

const TOOLBAR_ACTIONS = [
  { id: "archive", label: "Archive", icon: ArchiveIcon },
  { id: "delete", label: "Move to trash", icon: Trash2Icon },
  { id: "snooze", label: "Snooze", icon: ClockIcon, hideOnNarrow: true },
  {
    id: "spam",
    label: "Report spam",
    icon: AlertCircleIcon,
    hideOnNarrow: true,
  },
]

function MessageRow({
  message,
  isStarred,
}: {
  message: Message
  isStarred: boolean
}) {
  return (
    <div className="flex w-full min-w-0 items-start gap-2.5 py-1.5">
      <span
        aria-hidden
        className={cn(
          "mt-3 size-2 shrink-0 rounded-full",
          message.unread ? "bg-primary" : "bg-transparent",
        )}
      />
      <Avatar size="md" className="mt-0.5 shrink-0">
        <AvatarFallback>{message.initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              "min-w-0 truncate text-sm",
              message.unread ? "font-semibold" : "font-medium",
            )}
          >
            {message.from}
          </span>
          <span className="ml-auto shrink-0 text-xs text-fg-muted tabular-nums">
            {message.time}
          </span>
        </div>
        <p
          className={cn(
            "truncate text-sm",
            message.unread ? "font-medium text-fg" : "text-fg-muted",
          )}
        >
          {message.subject}
        </p>
        <p className="truncate text-xs text-fg-muted">{message.preview}</p>
        {(message.labels.length > 0 || message.attachments || isStarred) && (
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {message.labels.map((label) => (
              <Badge key={label} appearance="subtle" variant="accent" size="sm">
                {label}
              </Badge>
            ))}
            {message.attachments && (
              <span className="flex items-center gap-1 text-xs text-fg-muted">
                <PaperclipIcon className="size-3" />
                {message.attachments.length}
              </span>
            )}
            {isStarred && <StarIcon className="size-3 text-fg-warning" />}
          </div>
        )}
      </div>
    </div>
  )
}

function Attachment({
  name,
  meta,
  kind,
}: {
  name: string
  meta: string
  kind: "doc" | "image"
}) {
  const Icon = kind === "image" ? ImageIcon : FileTextIcon
  return (
    <div className="flex w-full items-center gap-3 rounded-lg border bg-card p-2.5 sm:w-64">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-fg-muted">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="text-xs text-fg-muted">{meta}</p>
      </div>
    </div>
  )
}

function ThreadMessage({ entry, to }: { entry: ThreadEntry; to: string }) {
  return (
    <article className="rounded-xl border bg-card p-4 sm:p-5">
      <header className="flex items-start gap-3">
        <Avatar size="md" className="shrink-0">
          <AvatarFallback>{entry.initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-sm font-medium">{entry.author}</span>
            <span className="truncate text-xs text-fg-muted">
              {entry.email}
            </span>
          </div>
          <p className="text-xs text-fg-muted">to {to}</p>
        </div>
        <span className="shrink-0 text-xs text-fg-muted tabular-nums">
          {entry.time}
        </span>
      </header>
      <div className="mt-4 flex flex-col gap-3">
        {entry.paragraphs.map((paragraph) => (
          <p
            key={paragraph.slice(0, 32)}
            className="text-sm/relaxed text-pretty"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  )
}

export default function MailBlock() {
  const [folder, setFolder] = React.useState("inbox")
  const [filter, setFilter] = React.useState<"all" | "unread">("all")
  const [query, setQuery] = React.useState("")
  const [selectedId, setSelectedId] = React.useState("tokens-freeze")
  const [pane, setPane] = React.useState<"list" | "message">("list")
  const [starred, setStarred] = React.useState<string[]>([
    "tokens-freeze",
    "offer-letter",
  ])
  const [reply, setReply] = React.useState("")
  const [sent, setSent] = React.useState<ThreadEntry[]>([])

  const visible = MESSAGES.filter((message) => {
    if (filter === "unread" && !message.unread) return false
    if (!query) return true
    const haystack =
      `${message.from} ${message.subject} ${message.preview}`.toLowerCase()
    return haystack.includes(query.toLowerCase())
  })

  const selected =
    visible.find((message) => message.id === selectedId) ??
    MESSAGES.find((message) => message.id === selectedId)
  const unreadCount = MESSAGES.filter((message) => message.unread).length
  const folderName = FOLDERS.find((item) => item.id === folder)?.name ?? "Inbox"

  const openMessage = (id: string) => {
    setSelectedId(id)
    setPane("message")
    setSent([])
    setReply("")
  }

  const toggleStar = (id: string, isStarred: boolean) => {
    setStarred((current) =>
      isStarred ? [...current, id] : current.filter((item) => item !== id),
    )
  }

  const sendReply = () => {
    const body = reply.trim()
    if (!body) return
    setSent((current) => [
      ...current,
      { ...ME, time: "Just now", paragraphs: [body] },
    ])
    setReply("")
  }

  const thread = selected ? [...selected.thread, ...sent] : []
  const replyTo = selected?.from.split(" ")[0] ?? "sender"

  return (
    <div className="min-h-screen bg-bg text-fg">
      <SidebarProvider
        className="h-screen min-h-0 overflow-hidden"
        style={{ "--sidebar-width": "13.5rem" } as React.CSSProperties}
      >
        <Sidebar collapsible="icon">
          <SidebarHeader className="gap-3">
            <div className="flex items-center gap-2 px-1 pt-1">
              <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary text-fg-on-primary">
                <MailIcon className="size-3.5" />
              </div>
              <span className="truncate text-sm font-semibold group-data-[collapsible=icon]:hidden">
                Sable Mail
              </span>
            </div>
            <Button
              variant="primary"
              className="w-full group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0!"
            >
              <SquarePenIcon />
              <span className="group-data-[collapsible=icon]:hidden">
                Compose
              </span>
            </Button>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Mailboxes</SidebarGroupLabel>
              <SidebarMenu>
                {FOLDERS.map((item) => {
                  const count =
                    item.id === "inbox"
                      ? unreadCount
                      : item.id === "starred"
                        ? starred.length
                        : item.count
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={item.id === folder}
                        tooltip={item.name}
                        onPress={() => setFolder(item.id)}
                      >
                        <item.icon />
                        <span>{item.name}</span>
                      </SidebarMenuButton>
                      {count ? (
                        <SidebarMenuBadge>{count}</SidebarMenuBadge>
                      ) : null}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Labels</SidebarGroupLabel>
              <SidebarMenu>
                {LABELS.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton tooltip={item.name}>
                      <TagIcon />
                      <span>{item.name}</span>
                    </SidebarMenuButton>
                    {item.count ? (
                      <SidebarMenuBadge>{item.count}</SidebarMenuBadge>
                    ) : null}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <Menu>
                  <SidebarMenuButton size="lg">
                    <Avatar
                      size="sm"
                      className="group-data-[collapsible=icon]:size-4"
                    >
                      <AvatarFallback>{ME.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-col gap-0.5 leading-none">
                      <span className="truncate font-medium text-fg">
                        {ME.author}
                      </span>
                      <span className="truncate text-xs">{ME.email}</span>
                    </div>
                    <ChevronsUpDownIcon className="ml-auto" />
                  </SidebarMenuButton>
                  <Popover placement="top" className="w-(--trigger-width)">
                    <MenuContent>
                      <MenuItem>
                        <BadgeCheckIcon />
                        Account
                      </MenuItem>
                      <MenuItem>
                        <SettingsIcon />
                        Mail settings
                      </MenuItem>
                      <MenuItem>
                        <LogOutIcon />
                        Sign out
                      </MenuItem>
                    </MenuContent>
                  </Popover>
                </Menu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="min-w-0 flex-row overflow-hidden">
          {/* Message list pane — the only pane on mobile until a row is opened. */}
          <div
            className={cn(
              "min-w-0 flex-col border-r md:flex md:w-64 md:shrink-0 lg:w-80 xl:w-96",
              pane === "list" ? "flex w-full" : "hidden",
            )}
          >
            <div className="flex h-14 shrink-0 items-center gap-2 border-b px-3">
              <SidebarTrigger />
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <h1 className="truncate text-sm font-semibold">{folderName}</h1>
                <Badge appearance="subtle" size="sm">
                  {visible.length}
                </Badge>
              </div>
              <Menu>
                <Button variant="quiet" size="sm" isIconOnly aria-label="Sort">
                  <ListFilterIcon />
                </Button>
                <Popover placement="bottom end">
                  <MenuContent>
                    <MenuItem>Newest first</MenuItem>
                    <MenuItem>Oldest first</MenuItem>
                    <MenuItem>Unread first</MenuItem>
                    <MenuItem>Sender A–Z</MenuItem>
                  </MenuContent>
                </Popover>
              </Menu>
            </div>

            <div className="shrink-0 px-3 pt-3">
              <SearchField
                aria-label="Search mail"
                placeholder="Search mail"
                value={query}
                onChange={setQuery}
              />
            </div>

            <Tabs
              selectedKey={filter}
              onSelectionChange={(key) => setFilter(key as "all" | "unread")}
              className="shrink-0 border-b px-3"
            >
              <TabList variant="line" aria-label="Filter messages">
                <Tab id="all">All</Tab>
                <Tab id="unread">
                  Unread
                  <Badge appearance="subtle" size="sm" className="ml-1.5">
                    {unreadCount}
                  </Badge>
                </Tab>
              </TabList>
            </Tabs>

            {visible.length === 0 ? (
              <div className="flex flex-1 items-center justify-center p-6">
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <MailCheckIcon />
                    </EmptyMedia>
                    <EmptyTitle>Nothing here</EmptyTitle>
                    <EmptyDescription>
                      No message matches “{query || "this filter"}”.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </div>
            ) : (
              <ListBox
                aria-label="Messages"
                selectionMode="single"
                disallowEmptySelection
                selectedKeys={selected ? [selected.id] : []}
                onSelectionChange={(keys) => {
                  const [first] = [...(keys as Set<React.Key>)]
                  if (first != null) openMessage(String(first))
                }}
                onAction={(key) => openMessage(String(key))}
                className="max-h-none min-h-0 flex-1 p-2 **:data-listbox-item-indicator:hidden"
              >
                {visible.map((message) => (
                  <ListBoxItem
                    key={message.id}
                    id={message.id}
                    textValue={`${message.from} — ${message.subject}`}
                    className="items-start data-selection-mode:pr-2 selected:bg-accent-muted"
                  >
                    <MessageRow
                      message={message}
                      isStarred={starred.includes(message.id)}
                    />
                  </ListBoxItem>
                ))}
              </ListBox>
            )}
          </div>

          {/* Reading pane */}
          <div
            className={cn(
              "min-w-0 flex-1 flex-col md:flex",
              pane === "message" ? "flex" : "hidden",
            )}
          >
            {selected ? (
              <>
                <div className="flex h-14 shrink-0 items-center gap-1 border-b px-2 sm:px-3">
                  <Button
                    variant="quiet"
                    size="sm"
                    isIconOnly
                    aria-label="Back to list"
                    className="md:hidden"
                    onPress={() => setPane("list")}
                  >
                    <ArrowLeftIcon />
                  </Button>
                  {TOOLBAR_ACTIONS.map((action) => (
                    <Tooltip key={action.id}>
                      <Button
                        variant="quiet"
                        size="sm"
                        isIconOnly
                        aria-label={action.label}
                        className={cn(action.hideOnNarrow && "hidden lg:flex")}
                      >
                        <action.icon />
                      </Button>
                      <TooltipContent>{action.label}</TooltipContent>
                    </Tooltip>
                  ))}
                  <Separator
                    orientation="vertical"
                    className="mx-1 hidden h-5 sm:block"
                  />
                  <Tooltip>
                    <ToggleButton
                      variant="quiet"
                      size="sm"
                      isIconOnly
                      aria-label="Star message"
                      isSelected={starred.includes(selected.id)}
                      onChange={(isSelected) =>
                        toggleStar(selected.id, isSelected)
                      }
                      className="selected:bg-transparent selected:text-fg-warning selected:hover:bg-inverse/10 selected:pressed:bg-inverse/20"
                    >
                      <StarIcon />
                    </ToggleButton>
                    <TooltipContent>
                      {starred.includes(selected.id) ? "Unstar" : "Star"}
                    </TooltipContent>
                  </Tooltip>
                  <div className="ml-auto flex items-center gap-1">
                    <Tooltip>
                      <Button
                        variant="quiet"
                        size="sm"
                        isIconOnly
                        aria-label="Reply"
                      >
                        <ReplyIcon />
                      </Button>
                      <TooltipContent>Reply</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <Button
                        variant="quiet"
                        size="sm"
                        isIconOnly
                        aria-label="Reply all"
                        className="hidden sm:flex"
                      >
                        <ReplyAllIcon />
                      </Button>
                      <TooltipContent>Reply all</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <Button
                        variant="quiet"
                        size="sm"
                        isIconOnly
                        aria-label="Forward"
                        className="hidden sm:flex"
                      >
                        <ForwardIcon />
                      </Button>
                      <TooltipContent>Forward</TooltipContent>
                    </Tooltip>
                    <Menu>
                      <Button
                        variant="quiet"
                        size="sm"
                        isIconOnly
                        aria-label="More actions"
                      >
                        <MoreHorizontalIcon />
                      </Button>
                      <Popover placement="bottom end">
                        <MenuContent>
                          <MenuItem>
                            <MailIcon />
                            Mark as unread
                          </MenuItem>
                          <MenuItem>
                            <PinIcon />
                            Pin to top
                          </MenuItem>
                          <MenuItem>
                            <TagIcon />
                            Add label
                          </MenuItem>
                          <MenuItem>
                            <ClockIcon />
                            Snooze until tomorrow
                          </MenuItem>
                        </MenuContent>
                      </Popover>
                    </Menu>
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto">
                  <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-5 sm:px-6 sm:py-6">
                    <div className="flex flex-col gap-2">
                      <h2 className="font-heading text-xl font-semibold text-balance sm:text-2xl">
                        {selected.subject}
                      </h2>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {selected.labels.map((label) => (
                          <Badge
                            key={label}
                            appearance="subtle"
                            variant="accent"
                          >
                            {label}
                          </Badge>
                        ))}
                        <Badge appearance="subtle" variant="neutral">
                          {thread.length}{" "}
                          {thread.length === 1 ? "message" : "messages"}
                        </Badge>
                      </div>
                    </div>

                    {thread.map((entry, index) => (
                      <ThreadMessage
                        key={`${entry.email}-${entry.time}-${index}`}
                        entry={entry}
                        to={entry.email === ME.email ? selected.from : "me"}
                      />
                    ))}

                    {selected.attachments && (
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-medium tracking-widest text-fg-muted uppercase">
                          {selected.attachments.length}{" "}
                          {selected.attachments.length === 1
                            ? "attachment"
                            : "attachments"}
                        </span>
                        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                          {selected.attachments.map((attachment) => (
                            <Attachment key={attachment.name} {...attachment} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="shrink-0 border-t bg-bg px-4 py-3 sm:px-6 sm:py-4">
                  <div className="mx-auto flex w-full max-w-3xl flex-col gap-2">
                    <TextField
                      aria-label={`Reply to ${replyTo}`}
                      value={reply}
                      onChange={setReply}
                    >
                      <TextArea
                        placeholder={`Reply to ${replyTo}…`}
                        className="min-h-20"
                      />
                    </TextField>
                    <div className="flex items-center gap-1">
                      <Tooltip>
                        <Button
                          variant="quiet"
                          size="sm"
                          isIconOnly
                          aria-label="Attach file"
                        >
                          <PaperclipIcon />
                        </Button>
                        <TooltipContent>Attach file</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <Button
                          variant="quiet"
                          size="sm"
                          isIconOnly
                          aria-label="Insert image"
                        >
                          <ImageIcon />
                        </Button>
                        <TooltipContent>Insert image</TooltipContent>
                      </Tooltip>
                      <Button
                        variant="primary"
                        size="sm"
                        className="ml-auto"
                        isDisabled={reply.trim().length === 0}
                        onPress={sendReply}
                      >
                        <SendIcon />
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center p-6">
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <InboxIcon />
                    </EmptyMedia>
                    <EmptyTitle>No message selected</EmptyTitle>
                    <EmptyDescription>
                      Pick a conversation from the list to read it here.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </div>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
