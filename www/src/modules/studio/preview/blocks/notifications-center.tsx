import { useState } from "react"
import type { ComponentType, ReactNode } from "react"

import {
  ArchiveIcon,
  BoxIcon,
  CalendarIcon,
  CheckCircle2Icon,
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CircleDashedIcon,
  CircleDotIcon,
  CircleIcon,
  ClockIcon,
  GitBranchIcon,
  InboxIcon,
  LayersIcon,
  ListFilterIcon,
  MailCheckIcon,
  MoreHorizontalIcon,
  SearchIcon,
  SignalHighIcon,
  SignalIcon,
  SquarePenIcon,
  TagIcon,
  TriangleAlertIcon,
  Trash2Icon,
  UserIcon,
  Users2Icon,
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
import { Kbd } from "@/registry/ui/kbd"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSection,
  MenuSectionHeader,
} from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"
import { Separator } from "@/registry/ui/separator"
import {
  Sidebar,
  SidebarContent,
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
import { TextField } from "@/registry/ui/text-field"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"
import { BrandMark, BrandName } from "@/modules/studio/assets/brand"

import { initials } from "./shared"

// A Linear-style inbox: the app sidebar, a list of notifications about
// issues, and the selected issue in context with the comment that caused the
// notification, its activity, and its properties. Snooze, delete and
// read state work from the toolbar or each row's menu.

type Status = "backlog" | "todo" | "progress" | "done"
type Priority = "urgent" | "high" | "medium" | "low"
type Kind = "mention" | "assigned" | "comment" | "status" | "subscribed"

interface Notification {
  id: string
  issue: string
  title: string
  actor: string
  kind: Kind
  summary: string
  time: string
  status: Status
  priority: Priority
  labels: string[]
  project: string
  unread?: boolean
  comment?: string
}

const STATUS: Record<
  Status,
  { label: string; icon: ComponentType<{ className?: string }>; tone: string }
> = {
  backlog: { label: "Backlog", icon: CircleDashedIcon, tone: "text-fg-muted" },
  todo: { label: "Todo", icon: CircleIcon, tone: "text-fg-muted" },
  progress: {
    label: "In progress",
    icon: CircleDotIcon,
    tone: "text-fg-warning",
  },
  done: { label: "Done", icon: CheckCircle2Icon, tone: "text-fg-accent" },
}

const PRIORITY: Record<
  Priority,
  { label: string; icon: ComponentType<{ className?: string }> }
> = {
  urgent: { label: "Urgent", icon: TriangleAlertIcon },
  high: { label: "High", icon: SignalHighIcon },
  medium: { label: "Medium", icon: SignalIcon },
  low: { label: "Low", icon: SignalIcon },
}

const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    issue: "ENG-412",
    title: "Checkout fails when the cart has a gift card",
    actor: "Ana Costa",
    kind: "mention",
    summary: "mentioned you",
    time: "12m",
    status: "progress",
    priority: "urgent",
    labels: ["Bug", "Payments"],
    project: "Checkout v2",
    unread: true,
    comment:
      "@maya can you check the payment intent logs? I think the gift card balance isn't subtracted before we create the intent, so the amount is off by the card's value.",
  },
  {
    id: "n2",
    issue: "ENG-398",
    title: "Rate limit enterprise API keys separately",
    actor: "Jonas Berg",
    kind: "assigned",
    summary: "assigned the issue to you",
    time: "1h",
    status: "todo",
    priority: "high",
    labels: ["API"],
    project: "Enterprise",
    unread: true,
  },
  {
    id: "n3",
    issue: "DES-77",
    title: "Empty states for the new dashboard",
    actor: "Grace Liu",
    kind: "comment",
    summary: "commented: Pushed v2 without the illustrations",
    time: "3h",
    status: "progress",
    priority: "medium",
    labels: ["Design"],
    project: "Dashboard",
    unread: true,
    comment:
      "Pushed v2 without the illustrations. The copy carries it on its own, and it saves us 40 KB on first load.",
  },
  {
    id: "n4",
    issue: "ENG-405",
    title: "Retry webhooks with exponential backoff",
    actor: "Leo Martins",
    kind: "status",
    summary: "moved the issue to Done",
    time: "5h",
    status: "done",
    priority: "high",
    labels: ["Infra"],
    project: "Reliability",
  },
  {
    id: "n5",
    issue: "ENG-377",
    title: "Codemod for the token renames",
    actor: "Daniel Osei",
    kind: "comment",
    summary: "commented: Passes on all 212 files",
    time: "1d",
    status: "progress",
    priority: "medium",
    labels: ["Design system"],
    project: "Tokens v3",
    comment:
      "Passes on all 212 files in the dashboard repo. Two manual fixes left, both in generated code.",
  },
  {
    id: "n6",
    issue: "ENG-371",
    title: "Flaky test in the billing suite",
    actor: "Marco Bellini",
    kind: "status",
    summary: "linked a pull request that was merged",
    time: "1d",
    status: "done",
    priority: "low",
    labels: ["Tests"],
    project: "Reliability",
  },
  {
    id: "n7",
    issue: "DES-70",
    title: "Icon set licensing",
    actor: "Priya Raghavan",
    kind: "subscribed",
    summary: "subscribed you to the issue",
    time: "2d",
    status: "backlog",
    priority: "low",
    labels: ["Legal"],
    project: "Tokens v3",
  },
  {
    id: "n8",
    issue: "ENG-360",
    title: "Upgrade to Postgres 17",
    actor: "Hannah Weiss",
    kind: "assigned",
    summary: "set the due date to Nov 4",
    time: "3d",
    status: "todo",
    priority: "medium",
    labels: ["Infra"],
    project: "Reliability",
  },
]

const ACTIVITY = [
  { who: "Ana Costa", what: "created the issue", when: "2h ago" },
  { who: "Ana Costa", what: "set priority to Urgent", when: "2h ago" },
  { who: "Leo Martins", what: "linked ENG-388", when: "1h ago" },
  { who: "Ana Costa", what: "moved from Todo to In progress", when: "40m ago" },
]

const DESCRIPTIONS: Record<string, string> = {
  n1: "Customers who pay part of an order with a gift card see a card error at the last step. It started after the 2026.10.21 release and affects about 3% of checkouts.",
}

function StatusIcon({
  status,
  className,
}: {
  status: Status
  className?: string
}) {
  const { icon: Icon, tone } = STATUS[status]
  return <Icon className={cn("size-3.5 shrink-0", tone, className)} />
}

function ToolbarAction({
  label,
  shortcut,
  onPress,
  children,
}: {
  label: string
  shortcut?: string
  onPress?: () => void
  children: ReactNode
}) {
  return (
    <Tooltip>
      <Button
        variant="quiet"
        size="sm"
        isIconOnly
        aria-label={label}
        onPress={onPress}
      >
        {children}
      </Button>
      <TooltipContent className="flex items-center gap-2">
        {label}
        {shortcut && <Kbd>{shortcut}</Kbd>}
      </TooltipContent>
    </Tooltip>
  )
}

function SnoozeMenu({
  children,
  onSnooze,
}: {
  children: ReactNode
  onSnooze: () => void
}) {
  return (
    <Menu>
      {children}
      <Popover placement="bottom end">
        <MenuContent className="min-w-52" onAction={onSnooze}>
          <MenuSection>
            <MenuSectionHeader>Snooze until</MenuSectionHeader>
            {[
              ["hour", "An hour from now"],
              ["tomorrow", "Tomorrow"],
              ["monday", "Next Monday"],
              ["week", "One week"],
            ].map(([id, label]) => (
              <MenuItem key={id} id={id}>
                {label}
              </MenuItem>
            ))}
          </MenuSection>
        </MenuContent>
      </Popover>
    </Menu>
  )
}

function NotificationRow({
  item,
  isSelected,
  onSelect,
}: {
  item: Notification
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-current={isSelected || undefined}
        className={cn(
          "relative flex w-full items-start gap-3 rounded-(--studio-radius-item) px-3 py-2.5 text-left",
          isSelected ? "bg-muted" : "hover:bg-muted/60",
        )}
      >
        <span className="relative mt-0.5 shrink-0">
          <Avatar size="sm">
            <AvatarFallback>{initials(item.actor)}</AvatarFallback>
          </Avatar>
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="flex items-center gap-2">
            <span
              className={cn(
                "min-w-0 truncate text-sm compact:text-xs",
                item.unread ? "font-medium text-fg" : "text-fg-muted",
              )}
            >
              {item.title}
            </span>
            <span className="ml-auto shrink-0 text-xs text-fg-muted tabular-nums">
              {item.time}
            </span>
          </span>
          <span className="flex items-center gap-1.5 text-xs text-fg-muted">
            <StatusIcon status={item.status} className="size-3" />
            <span className="shrink-0">{item.issue}</span>
            <span className="truncate">
              · {item.actor.split(" ")[0]} {item.summary}
            </span>
          </span>
        </span>
        {item.unread && (
          <span
            aria-label="Unread"
            className="absolute top-1/2 left-0.5 size-1.5 -translate-y-1/2 rounded-full bg-primary"
          />
        )}
      </button>
    </li>
  )
}

function PropertyRow({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex min-h-8 items-center gap-2 text-sm compact:text-xs">
      <span className="w-20 shrink-0 text-xs text-fg-muted">{label}</span>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
        {children}
      </div>
    </div>
  )
}

function IssuePanel({
  item,
  onBack,
  onSnooze,
  onDelete,
  onToggleRead,
}: {
  item: Notification
  onBack: () => void
  onSnooze: () => void
  onDelete: () => void
  onToggleRead: () => void
}) {
  const [status, setStatus] = useState<Status>(item.status)
  const [reply, setReply] = useState("")
  const [replies, setReplies] = useState<string[]>([])
  const Priority = PRIORITY[item.priority]

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <div className="flex h-12 shrink-0 items-center gap-1 border-b px-4">
        <Button
          variant="quiet"
          size="sm"
          isIconOnly
          aria-label="Back to inbox"
          className="-ml-2 md:hidden"
          onPress={onBack}
        >
          <ArrowLeftIcon />
        </Button>
        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 items-center gap-1.5 text-sm text-fg-muted compact:text-xs"
        >
          <span className="truncate">{item.project}</span>
          <ChevronRightIcon className="size-3.5 shrink-0" />
          <span className="shrink-0 text-fg">{item.issue}</span>
        </nav>
        <div className="ml-auto flex items-center gap-0.5">
          <SnoozeMenu onSnooze={onSnooze}>
            <Button variant="quiet" size="sm" isIconOnly aria-label="Snooze">
              <ClockIcon />
            </Button>
          </SnoozeMenu>
          <ToolbarAction
            label={item.unread ? "Mark as read" : "Mark as unread"}
            shortcut="U"
            onPress={onToggleRead}
          >
            <MailCheckIcon />
          </ToolbarAction>
          <ToolbarAction
            label="Delete notification"
            shortcut="⌫"
            onPress={onDelete}
          >
            <Trash2Icon />
          </ToolbarAction>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-8">
            <div className="flex flex-col gap-3">
              <h1 className="font-heading text-2xl font-medium text-balance">
                {item.title}
              </h1>
              <p className="text-sm/relaxed text-pretty text-fg-muted compact:text-xs/relaxed">
                {DESCRIPTIONS[item.id] ??
                  "No description yet. Add context, steps to reproduce, or links."}
              </p>
            </div>

            <Separator />

            <div className="flex flex-col gap-4">
              <h2 className="text-sm font-medium compact:text-xs">Activity</h2>
              <ol className="flex flex-col gap-3">
                {(item.id === "n1"
                  ? ACTIVITY
                  : [{ who: item.actor, what: item.summary, when: item.time }]
                ).map((event) => (
                  <li
                    key={event.what}
                    className="flex items-center gap-2.5 text-xs text-fg-muted"
                  >
                    <Avatar size="sm" className="size-5">
                      <AvatarFallback className="text-[0.5rem]">
                        {initials(event.who)}
                      </AvatarFallback>
                    </Avatar>
                    <span>
                      <span className="font-medium text-fg">{event.who}</span>{" "}
                      {event.what}
                    </span>
                    <span>· {event.when}</span>
                  </li>
                ))}
              </ol>

              {item.comment && (
                <article className="flex flex-col gap-2 rounded-(--studio-radius-card) border border-border-focus/60 bg-primary-muted/40 p-4">
                  <header className="flex items-center gap-2 text-xs">
                    <Avatar size="sm">
                      <AvatarFallback>{initials(item.actor)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{item.actor}</span>
                    <span className="text-fg-muted">{item.time} ago</span>
                  </header>
                  <p className="text-sm/relaxed text-pretty compact:text-xs/relaxed">
                    {item.comment}
                  </p>
                </article>
              )}

              {replies.map((text, index) => (
                <article
                  key={index}
                  className="flex flex-col gap-2 rounded-(--studio-radius-card) border p-4"
                >
                  <header className="flex items-center gap-2 text-xs">
                    <Avatar size="sm">
                      <AvatarFallback>MO</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">Maya Okonkwo</span>
                    <span className="text-fg-muted">just now</span>
                  </header>
                  <p className="text-sm/relaxed compact:text-xs/relaxed">
                    {text}
                  </p>
                </article>
              ))}

              <form
                className="flex flex-col gap-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!reply.trim()) return
                  setReplies((current) => [...current, reply.trim()])
                  setReply("")
                }}
              >
                <TextField aria-label="Reply" value={reply} onChange={setReply}>
                  <TextArea placeholder="Leave a reply…" className="min-h-20" />
                </TextField>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="secondary"
                    size="sm"
                    isDisabled={!reply.trim()}
                  >
                    Comment
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <aside className="hidden w-64 shrink-0 flex-col gap-1 overflow-y-auto border-l p-4 xl:flex">
          <PropertyRow label="Status">
            <Menu>
              <Button variant="quiet" size="sm" className="-ml-2">
                <StatusIcon status={status} />
                {STATUS[status].label}
              </Button>
              <Popover placement="bottom start">
                <MenuContent
                  className="min-w-44"
                  selectionMode="single"
                  selectedKeys={[status]}
                  onAction={(key) => setStatus(key as Status)}
                >
                  {(Object.keys(STATUS) as Status[]).map((key) => (
                    <MenuItem key={key} id={key} textValue={STATUS[key].label}>
                      <StatusIcon status={key} />
                      {STATUS[key].label}
                    </MenuItem>
                  ))}
                </MenuContent>
              </Popover>
            </Menu>
          </PropertyRow>
          <PropertyRow label="Priority">
            <Button variant="quiet" size="sm" className="-ml-2">
              <Priority.icon
                className={cn(item.priority === "urgent" && "text-fg-danger")}
              />
              {Priority.label}
            </Button>
          </PropertyRow>
          <PropertyRow label="Assignee">
            <Button variant="quiet" size="sm" className="-ml-2">
              <UserIcon />
              Maya Okonkwo
            </Button>
          </PropertyRow>
          <PropertyRow label="Labels">
            {item.labels.map((label) => (
              <Badge key={label} size="sm" variant="neutral">
                {label}
              </Badge>
            ))}
          </PropertyRow>
          <PropertyRow label="Project">
            <Button variant="quiet" size="sm" className="-ml-2">
              <BoxIcon />
              {item.project}
            </Button>
          </PropertyRow>
          <PropertyRow label="Due date">
            <Button variant="quiet" size="sm" className="-ml-2 text-fg-muted">
              <CalendarIcon />
              Nov 4
            </Button>
          </PropertyRow>
          <Separator className="my-3" />
          <PropertyRow label="Branch">
            <span className="flex min-w-0 items-center gap-1.5 font-mono text-xs text-fg-muted">
              <GitBranchIcon className="size-3.5 shrink-0" />
              <span className="truncate">maya/{item.issue.toLowerCase()}</span>
            </span>
          </PropertyRow>
        </aside>
      </div>
    </div>
  )
}

function AppSidebar({ unread }: { unread: number }) {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-1">
            <SidebarMenuButton className="min-w-0 flex-1">
              <BrandMark className="size-5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-(--studio-radius-detail) bg-primary text-[0.625rem] font-semibold text-fg-on-primary">
                  S
                </span>
              </BrandMark>
              <span className="truncate font-medium">
                <BrandName>Sable</BrandName>
              </span>
              <ChevronDownIcon className="size-3.5 text-fg-muted" />
            </SidebarMenuButton>
            <Button variant="quiet" size="sm" isIconOnly aria-label="Search">
              <SearchIcon />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              isIconOnly
              aria-label="New issue"
            >
              <SquarePenIcon />
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive>
              <InboxIcon />
              <span>Inbox</span>
            </SidebarMenuButton>
            {unread > 0 && <SidebarMenuBadge>{unread}</SidebarMenuBadge>}
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <CircleDotIcon />
              <span>My issues</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarMenu>
            {[
              { icon: BoxIcon, label: "Projects" },
              { icon: LayersIcon, label: "Views" },
              { icon: Users2Icon, label: "Members" },
            ].map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton>
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Your teams</SidebarGroupLabel>
          <SidebarMenu>
            {[
              { key: "ENG", name: "Engineering" },
              { key: "DES", name: "Design" },
            ].map((team) => (
              <SidebarMenuItem key={team.key}>
                <SidebarMenuButton>
                  <span className="flex size-4 shrink-0 items-center justify-center rounded-(--studio-radius-detail) bg-muted text-[0.5rem] font-semibold text-fg-muted">
                    {team.key[0]}
                  </span>
                  <span>{team.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

type Filter = "all" | "unread" | "mention"

export default function NotificationsCenterBlock() {
  const [items, setItems] = useState(NOTIFICATIONS)
  const [selectedId, setSelectedId] = useState<string | null>("n1")
  const [filter, setFilter] = useState<Filter>("all")

  const visible = items.filter(
    (item) =>
      filter === "all" ||
      (filter === "unread" && item.unread) ||
      (filter === "mention" && item.kind === "mention"),
  )
  const selected = items.find((item) => item.id === selectedId)
  const unread = items.filter((item) => item.unread).length

  const select = (id: string) => {
    setSelectedId(id)
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, unread: false } : item,
      ),
    )
  }

  // Removing a row moves the selection to its neighbour, like Linear.
  const remove = (id: string) => {
    const index = visible.findIndex((item) => item.id === id)
    const next = visible[index + 1] ?? visible[index - 1]
    setItems((current) => current.filter((item) => item.id !== id))
    setSelectedId(next?.id ?? null)
  }

  const toggleRead = (id: string) =>
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, unread: !item.unread } : item,
      ),
    )

  return (
    <div className="min-h-screen bg-bg text-fg">
      <SidebarProvider className="h-svh min-h-svh">
        <AppSidebar unread={unread} />
        <SidebarInset className="flex h-svh min-h-0 flex-row overflow-hidden">
          <section
            aria-label="Inbox"
            className={cn(
              "flex w-full shrink-0 flex-col border-r md:w-96",
              selected && "max-md:hidden",
            )}
          >
            <div className="flex h-12 shrink-0 items-center gap-1 border-b px-3">
              <SidebarTrigger />
              <h1 className="text-sm font-medium compact:text-xs">Inbox</h1>
              <div className="ml-auto flex items-center gap-0.5">
                <Menu>
                  <Button
                    variant={filter === "all" ? "quiet" : "secondary"}
                    size="sm"
                    isIconOnly
                    aria-label="Filter"
                  >
                    <ListFilterIcon />
                  </Button>
                  <Popover placement="bottom end">
                    <MenuContent
                      className="min-w-44"
                      selectionMode="single"
                      selectedKeys={[filter]}
                      onAction={(key) => setFilter(key as Filter)}
                    >
                      <MenuItem id="all">All notifications</MenuItem>
                      <MenuItem id="unread">Unread</MenuItem>
                      <MenuItem id="mention">Mentions</MenuItem>
                    </MenuContent>
                  </Popover>
                </Menu>
                <Menu>
                  <Button
                    variant="quiet"
                    size="sm"
                    isIconOnly
                    aria-label="Inbox options"
                  >
                    <MoreHorizontalIcon />
                  </Button>
                  <Popover placement="bottom end">
                    <MenuContent className="min-w-56">
                      <MenuItem
                        onAction={() =>
                          setItems((current) =>
                            current.map((item) => ({ ...item, unread: false })),
                          )
                        }
                      >
                        <MailCheckIcon />
                        Mark all as read
                      </MenuItem>
                      <MenuItem>
                        <ArchiveIcon />
                        Delete all read
                      </MenuItem>
                      <Separator />
                      <MenuItem>
                        <TagIcon />
                        Notification settings
                      </MenuItem>
                    </MenuContent>
                  </Popover>
                </Menu>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-1.5">
              {visible.length ? (
                <ul className="flex flex-col gap-px">
                  {visible.map((item) => (
                    <NotificationRow
                      key={item.id}
                      item={item}
                      isSelected={item.id === selectedId}
                      onSelect={() => select(item.id)}
                    />
                  ))}
                </ul>
              ) : (
                <Empty className="h-full">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <InboxIcon />
                    </EmptyMedia>
                    <EmptyTitle>No notifications</EmptyTitle>
                    <EmptyDescription>
                      Mentions, assignments and updates on issues you follow
                      land here.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </div>
          </section>

          {selected ? (
            <IssuePanel
              key={selected.id}
              item={selected}
              onBack={() => setSelectedId(null)}
              onSnooze={() => remove(selected.id)}
              onDelete={() => remove(selected.id)}
              onToggleRead={() => toggleRead(selected.id)}
            />
          ) : (
            <Empty className="max-md:hidden">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <InboxIcon />
                </EmptyMedia>
                <EmptyTitle>Inbox</EmptyTitle>
                <EmptyDescription>
                  Select a notification to read it.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
