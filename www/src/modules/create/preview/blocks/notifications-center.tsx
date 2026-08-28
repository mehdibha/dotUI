import { useMemo, useState } from "react"

import {
  ArchiveIcon,
  BellIcon,
  CheckCircle2Icon,
  CheckIcon,
  CircleDotIcon,
  GitBranchIcon,
  InboxIcon,
  ListFilterIcon,
  MailCheckIcon,
  MailIcon,
  MessageSquareIcon,
  MoreVerticalIcon,
  SettingsIcon,
  StarIcon,
  TagIcon,
  Trash2Icon,
  TriangleAlertIcon,
  Users2Icon,
  VolumeOffIcon,
  ZapIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Avatar, AvatarBadge, AvatarFallback } from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/ui/empty"
import { Description, FieldContent, Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuItemDescription,
  MenuItemLabel,
  MenuSection,
  MenuSectionHeader,
} from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"
import { SearchField } from "@/registry/ui/search-field"
import { Separator } from "@/registry/ui/separator"
import { Switch, SwitchControl } from "@/registry/ui/switch"
import { Tab, TabList, TabPanel, Tabs } from "@/registry/ui/tabs"
import { ToggleButton } from "@/registry/ui/toggle-button"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

type Category = "mentions" | "reviews" | "deploys" | "team" | "activity"

type Kind =
  | "mention"
  | "comment"
  | "review"
  | "approval"
  | "invite"
  | "deploy"
  | "incident"
  | "release"
  | "star"
  | "assign"

type TabId = "all" | "mentions" | "following" | "archive"

interface Item {
  id: string
  actor: string
  kind: Kind
  category: Category
  action: string
  target?: string
  quote?: string
  meta?: string
  day: string
  time: string
  unread: boolean
  archived: boolean
  isMention?: boolean
  isFollowing?: boolean
  invite?: { workspace: string; role: string }
}

const TABS: { id: TabId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "mentions", label: "Mentions" },
  { id: "following", label: "Following" },
  { id: "archive", label: "Archive" },
]

const CATEGORIES: { id: Category; label: string; hint: string }[] = [
  { id: "mentions", label: "Mentions & replies", hint: "Direct and threaded" },
  { id: "reviews", label: "Reviews", hint: "Pull requests you own" },
  { id: "deploys", label: "Deploys & incidents", hint: "Atlas production" },
  { id: "team", label: "Team & invites", hint: "Workspaces and access" },
  { id: "activity", label: "Activity", hint: "Stars, releases, assignments" },
]

const DAYS = ["Today", "Yesterday", "Earlier this week"]

const KIND_STYLE: Record<Kind, { icon: typeof BellIcon; tone: string }> = {
  mention: { icon: MessageSquareIcon, tone: "bg-accent-muted text-fg-accent" },
  comment: { icon: MessageSquareIcon, tone: "bg-neutral text-fg-on-neutral" },
  review: { icon: GitBranchIcon, tone: "bg-info-muted text-fg-info" },
  approval: {
    icon: CheckCircle2Icon,
    tone: "bg-success-muted text-fg-success",
  },
  invite: { icon: Users2Icon, tone: "bg-accent-muted text-fg-accent" },
  deploy: { icon: ZapIcon, tone: "bg-success-muted text-fg-success" },
  incident: {
    icon: TriangleAlertIcon,
    tone: "bg-warning-muted text-fg-warning",
  },
  release: { icon: TagIcon, tone: "bg-info-muted text-fg-info" },
  star: { icon: StarIcon, tone: "bg-warning-muted text-fg-warning" },
  assign: { icon: CircleDotIcon, tone: "bg-neutral text-fg-on-neutral" },
}

const ITEMS: Item[] = [
  {
    id: "n-1",
    actor: "Priya Raghunathan",
    kind: "mention",
    category: "mentions",
    action: "mentioned you in",
    target: "atlas-web #2148",
    quote:
      "The timeline chart still jitters when the cursor crosses a gap — can you take this one?",
    day: "Today",
    time: "12m",
    unread: true,
    archived: false,
    isMention: true,
    isFollowing: true,
  },
  {
    id: "n-2",
    actor: "Marcus Delaney",
    kind: "invite",
    category: "team",
    action: "invited you to join",
    target: "Northwind Design Systems",
    day: "Today",
    time: "41m",
    unread: true,
    archived: false,
    invite: { workspace: "Northwind Design Systems", role: "Editor" },
  },
  {
    id: "n-3",
    actor: "Sofia Ibarra",
    kind: "review",
    category: "reviews",
    action: "requested your review on",
    target: "Rework token resolver caching #2151",
    meta: "+412 −168 across 9 files",
    day: "Today",
    time: "1h",
    unread: true,
    archived: false,
    isFollowing: true,
  },
  {
    id: "n-4",
    actor: "Atlas CI",
    kind: "deploy",
    category: "deploys",
    action: "shipped a production deploy of",
    target: "atlas-web@4.19.2",
    meta: "Built in 3m 12s · 0 failing checks",
    day: "Today",
    time: "2h",
    unread: false,
    archived: false,
  },
  {
    id: "n-5",
    actor: "Théo Lambert",
    kind: "comment",
    category: "mentions",
    action: "replied to your comment on",
    target: "Chart tooltips overflow on mobile",
    quote: "Reproduced on iOS 18.2 — it only happens in RTL layouts.",
    day: "Today",
    time: "3h",
    unread: true,
    archived: false,
    isMention: true,
  },
  {
    id: "n-6",
    actor: "Nadia Osei",
    kind: "invite",
    category: "team",
    action: "invited you to review the",
    target: "Q3 pricing experiment",
    day: "Yesterday",
    time: "18:40",
    unread: false,
    archived: false,
    invite: { workspace: "Growth · Q3 pricing", role: "Reviewer" },
  },
  {
    id: "n-7",
    actor: "Jonas Winther",
    kind: "release",
    category: "activity",
    action: "published",
    target: "atlas-sdk v2.4.0",
    quote: "Adds streaming query results and trims 180 kB off the wasm bundle.",
    day: "Yesterday",
    time: "11:15",
    unread: false,
    archived: false,
    isFollowing: true,
  },
  {
    id: "n-8",
    actor: "Ravi Menon",
    kind: "incident",
    category: "deploys",
    action: "resolved incident",
    target: "Elevated p95 on query-gateway",
    meta: "22m duration · 1.4% of requests affected",
    day: "Yesterday",
    time: "09:27",
    unread: false,
    archived: false,
  },
  {
    id: "n-9",
    actor: "Camille Rousseau",
    kind: "star",
    category: "activity",
    action: "starred",
    target: "northwind/atlas-charts",
    day: "Yesterday",
    time: "08:02",
    unread: false,
    archived: false,
  },
  {
    id: "n-10",
    actor: "Elena Vasquez",
    kind: "mention",
    category: "mentions",
    action: "mentioned you in",
    target: "#design-systems",
    quote:
      "Density axis spec is owned by you — pulling you in before we lock it.",
    day: "Earlier this week",
    time: "Tue",
    unread: false,
    archived: false,
    isMention: true,
  },
  {
    id: "n-11",
    actor: "Hana Kobayashi",
    kind: "approval",
    category: "reviews",
    action: "approved your pull request",
    target: "Density tokens for compact tables #2103",
    day: "Earlier this week",
    time: "Tue",
    unread: false,
    archived: false,
    isFollowing: true,
  },
  {
    id: "n-12",
    actor: "Marcus Delaney",
    kind: "assign",
    category: "activity",
    action: "assigned you",
    target: "Audit chart color contrast",
    meta: "Due Friday · Atlas 4.20",
    day: "Earlier this week",
    time: "Mon",
    unread: false,
    archived: false,
  },
  {
    id: "n-13",
    actor: "Atlas CI",
    kind: "deploy",
    category: "deploys",
    action: "rolled back",
    target: "atlas-api@3.8.4",
    meta: "Reverted to 3.8.3 after 6 failing health checks",
    day: "Earlier this week",
    time: "Mon",
    unread: false,
    archived: true,
  },
  {
    id: "n-14",
    actor: "Camille Rousseau",
    kind: "star",
    category: "activity",
    action: "starred",
    target: "northwind/atlas-sdk",
    day: "Earlier this week",
    time: "Mon",
    unread: false,
    archived: true,
  },
]

const WEEK_STATS: { icon: typeof BellIcon; label: string; value: string }[] = [
  { icon: MessageSquareIcon, label: "Mentions", value: "14" },
  { icon: GitBranchIcon, label: "Review requests", value: "9" },
  { icon: ZapIcon, label: "Deploys", value: "23" },
  { icon: TriangleAlertIcon, label: "Incidents", value: "1" },
]

const DELIVERY: { id: string; label: string; hint: string }[] = [
  { id: "digest", label: "Daily email digest", hint: "Sent at 08:30 CET" },
  { id: "push", label: "Desktop push", hint: "Mentions and reviews only" },
  { id: "quiet", label: "Weekend quiet hours", hint: "Sat–Sun, all channels" },
]

function initialsOf(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
}

function matchesTab(item: Item, tab: TabId) {
  if (tab === "archive") return item.archived
  if (item.archived) return false
  if (tab === "mentions") return Boolean(item.isMention)
  if (tab === "following") return Boolean(item.isFollowing)
  return true
}

function matchesQuery(item: Item, query: string) {
  if (!query) return true
  const haystack = [item.actor, item.action, item.target, item.quote, item.meta]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
  return haystack.includes(query.toLowerCase())
}

/* --------------------------------- Row ----------------------------------- */

function NotificationRow({
  item,
  invite,
  onToggleRead,
  onArchive,
  onInvite,
}: {
  item: Item
  invite?: "accepted" | "declined"
  onToggleRead: (id: string) => void
  onArchive: (id: string) => void
  onInvite: (id: string, answer: "accepted" | "declined") => void
}) {
  const { icon: KindIcon, tone } = KIND_STYLE[item.kind]

  return (
    <li
      className={cn(
        "group relative flex gap-3 rounded-lg border border-transparent px-2 py-3 transition-colors hover:border-border-muted hover:bg-card sm:px-3",
        item.unread && "bg-card",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "mt-4 size-2 shrink-0 rounded-full",
          item.unread ? "bg-accent" : "bg-transparent",
        )}
      />
      <Avatar size="md" className="mt-0.5 shrink-0">
        <AvatarFallback>{initialsOf(item.actor)}</AvatarFallback>
        <AvatarBadge className={tone}>
          <KindIcon />
        </AvatarBadge>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-start gap-3">
          <p className="min-w-0 flex-1 text-sm leading-snug text-fg-muted">
            <span className="font-medium text-fg">{item.actor}</span>{" "}
            {item.action}{" "}
            {item.target ? (
              <span className="font-medium text-fg">{item.target}</span>
            ) : null}
          </p>
          <span className="shrink-0 text-xs text-fg-muted tabular-nums">
            {item.time}
          </span>
        </div>

        {item.quote ? (
          <p className="rounded-md border-l-2 border-border-muted bg-muted px-3 py-2 text-sm text-pretty text-fg-muted">
            “{item.quote}”
          </p>
        ) : null}

        {item.meta ? (
          <span className="text-xs text-fg-muted">{item.meta}</span>
        ) : null}

        {item.invite && !invite ? (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button
              size="sm"
              variant="primary"
              onPress={() => onInvite(item.id, "accepted")}
            >
              <CheckIcon />
              Accept
            </Button>
            <Button size="sm" onPress={() => onInvite(item.id, "declined")}>
              Decline
            </Button>
            <Badge size="sm" variant="accent" appearance="subtle">
              {item.invite.role}
            </Badge>
          </div>
        ) : null}

        {item.invite && invite ? (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-xs",
              invite === "accepted" ? "text-fg-success" : "text-fg-muted",
            )}
          >
            {invite === "accepted" ? <CheckCircle2Icon /> : <MailIcon />}
            {invite === "accepted"
              ? `You joined ${item.invite.workspace}`
              : `Invitation to ${item.invite.workspace} declined`}
          </span>
        ) : null}
      </div>

      <div className="flex shrink-0 items-start gap-0.5 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:focus-within:opacity-100">
        <Tooltip>
          <Button
            size="sm"
            variant="quiet"
            isIconOnly
            aria-label={item.unread ? "Mark as read" : "Mark as unread"}
            onPress={() => onToggleRead(item.id)}
          >
            {item.unread ? <CheckIcon /> : <MailIcon />}
          </Button>
          <TooltipContent>
            {item.unread ? "Mark as read" : "Mark as unread"}
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <Button
            size="sm"
            variant="quiet"
            isIconOnly
            aria-label={item.archived ? "Move to inbox" : "Archive"}
            onPress={() => onArchive(item.id)}
          >
            {item.archived ? <InboxIcon /> : <ArchiveIcon />}
          </Button>
          <TooltipContent>
            {item.archived ? "Move to inbox" : "Archive"}
          </TooltipContent>
        </Tooltip>
      </div>
    </li>
  )
}

/* --------------------------------- Rail ----------------------------------- */

function SideRail() {
  const [delivery, setDelivery] = useState<Record<string, boolean>>({
    digest: true,
    push: true,
    quiet: false,
  })

  return (
    <aside className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">This week</CardTitle>
          <CardDescription>Atlas and 3 shared repositories</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {WEEK_STATS.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-fg-muted">
                <stat.icon className="size-3.5" />
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-fg-muted">
                {stat.label}
              </span>
              <span className="text-sm font-medium tabular-nums">
                {stat.value}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Delivery</CardTitle>
          <CardDescription>
            How Atlas reaches you outside the app
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {DELIVERY.map((row) => (
            <Switch
              key={row.id}
              className="flex w-full items-center justify-between gap-3"
              isSelected={delivery[row.id]}
              onChange={(isSelected) =>
                setDelivery((prev) => ({ ...prev, [row.id]: isSelected }))
              }
            >
              <FieldContent className="min-w-0">
                <Label>{row.label}</Label>
                <Description className="truncate text-xs">
                  {row.hint}
                </Description>
              </FieldContent>
              <SwitchControl />
            </Switch>
          ))}
        </CardContent>
        <CardFooter>
          <Button size="sm" className="w-full">
            <SettingsIcon />
            All notification settings
          </Button>
        </CardFooter>
      </Card>
    </aside>
  )
}

/* --------------------------------- Page ----------------------------------- */

export default function NotificationsCenter() {
  const [items, setItems] = useState<Item[]>(ITEMS)
  const [tab, setTab] = useState<TabId>("all")
  const [query, setQuery] = useState("")
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [categories, setCategories] = useState<Set<string>>(
    () => new Set(CATEGORIES.map((c) => c.id)),
  )
  const [invites, setInvites] = useState<
    Record<string, "accepted" | "declined">
  >({})

  const unreadByTab = useMemo(() => {
    const counts: Record<TabId, number> = {
      all: 0,
      mentions: 0,
      following: 0,
      archive: 0,
    }
    for (const t of TABS) {
      counts[t.id] = items.filter(
        (item) => matchesTab(item, t.id) && item.unread,
      ).length
    }
    return counts
  }, [items])

  const visible = useMemo(
    () =>
      items.filter(
        (item) =>
          matchesTab(item, tab) &&
          categories.has(item.category) &&
          (!unreadOnly || item.unread) &&
          matchesQuery(item, query),
      ),
    [items, tab, categories, unreadOnly, query],
  )

  const groups = DAYS.map((day) => ({
    day,
    rows: visible.filter((item) => item.day === day),
  })).filter((group) => group.rows.length > 0)

  const inboxUnread = items.filter(
    (item) => !item.archived && item.unread,
  ).length
  const isFiltered =
    unreadOnly || query.length > 0 || categories.size < CATEGORIES.length

  const markAllRead = () =>
    setItems((prev) => prev.map((item) => ({ ...item, unread: false })))

  const toggleRead = (id: string) =>
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, unread: !item.unread } : item,
      ),
    )

  const toggleArchive = (id: string) =>
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, archived: !item.archived, unread: false }
          : item,
      ),
    )

  const archiveRead = () =>
    setItems((prev) =>
      prev.map((item) => (item.unread ? item : { ...item, archived: true })),
    )

  const clearArchive = () =>
    setItems((prev) => prev.filter((item) => !item.archived))

  const resetFilters = () => {
    setUnreadOnly(false)
    setQuery("")
    setCategories(new Set(CATEGORIES.map((c) => c.id)))
  }

  return (
    <div className="min-h-screen bg-bg text-fg">
      <Tabs
        selectedKey={tab}
        onSelectionChange={(key) => setTab(key as TabId)}
        className="flex min-h-screen flex-col gap-0"
      >
        <header className="sticky top-0 z-20 border-b bg-bg/90 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 pt-4 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-fg-on-primary">
                <BellIcon className="size-4" />
              </span>
              <div className="flex min-w-0 flex-col">
                <h1 className="truncate font-heading text-lg font-semibold tracking-tight">
                  Notifications
                </h1>
                <p className="truncate text-xs text-fg-muted">
                  Northwind Analytics · {inboxUnread} unread
                </p>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <SearchField
                  aria-label="Search notifications"
                  value={query}
                  onChange={setQuery}
                  className="hidden w-56 md:flex"
                >
                  <Input placeholder="Search notifications…" size="sm" />
                </SearchField>

                <ToggleButton
                  size="sm"
                  isSelected={unreadOnly}
                  onChange={setUnreadOnly}
                  className="hidden sm:inline-flex"
                >
                  Unread only
                </ToggleButton>

                <Menu>
                  <Button size="sm" aria-label="Filter notifications">
                    <ListFilterIcon />
                    <span className="hidden sm:inline">Filter</span>
                    {categories.size < CATEGORIES.length ? (
                      <Badge size="sm" variant="accent">
                        {categories.size}
                      </Badge>
                    ) : null}
                  </Button>
                  <Popover placement="bottom end">
                    <MenuContent
                      selectionMode="multiple"
                      selectedKeys={categories}
                      onSelectionChange={(keys) => {
                        if (keys === "all") {
                          setCategories(new Set(CATEGORIES.map((c) => c.id)))
                        } else {
                          setCategories(new Set([...keys].map(String)))
                        }
                      }}
                      className="min-w-64"
                    >
                      <MenuSection>
                        <MenuSectionHeader>Show categories</MenuSectionHeader>
                        {CATEGORIES.map((category) => (
                          <MenuItem
                            key={category.id}
                            id={category.id}
                            textValue={category.label}
                          >
                            <MenuItemLabel>{category.label}</MenuItemLabel>
                            <MenuItemDescription>
                              {category.hint}
                            </MenuItemDescription>
                          </MenuItem>
                        ))}
                      </MenuSection>
                    </MenuContent>
                  </Popover>
                </Menu>

                <Button
                  size="sm"
                  variant="primary"
                  onPress={markAllRead}
                  isDisabled={inboxUnread === 0}
                >
                  <MailCheckIcon />
                  <span className="hidden sm:inline">Mark all read</span>
                </Button>

                <Menu>
                  <Button
                    size="sm"
                    variant="quiet"
                    isIconOnly
                    aria-label="More options"
                  >
                    <MoreVerticalIcon />
                  </Button>
                  <Popover placement="bottom end">
                    <MenuContent className="min-w-56">
                      <MenuItem onAction={markAllRead}>
                        <MailCheckIcon />
                        Mark everything as read
                      </MenuItem>
                      <MenuItem onAction={archiveRead}>
                        <ArchiveIcon />
                        Archive read notifications
                      </MenuItem>
                      <Separator />
                      <MenuItem>
                        <VolumeOffIcon />
                        Mute Atlas for 8 hours
                      </MenuItem>
                      <MenuItem>
                        <SettingsIcon />
                        Notification settings
                      </MenuItem>
                      <Separator />
                      <MenuItem variant="danger" onAction={clearArchive}>
                        <Trash2Icon />
                        Clear archive
                      </MenuItem>
                    </MenuContent>
                  </Popover>
                </Menu>
              </div>
            </div>

            <SearchField
              aria-label="Search notifications"
              value={query}
              onChange={setQuery}
              className="md:hidden"
            >
              <Input placeholder="Search notifications…" size="sm" />
            </SearchField>

            {/* The line indicator sits a few px below the list box; the
                scroller needs bottom room or it clips the underline. */}
            <div className="-mx-4 -mb-1.5 no-scrollbar overflow-x-auto px-4 pb-1.5 sm:-mx-6 sm:px-6">
              <TabList variant="line" aria-label="Notification views">
                {TABS.map((t) => (
                  <Tab key={t.id} id={t.id}>
                    {t.label}
                    {unreadByTab[t.id] > 0 ? (
                      <Badge size="sm">{unreadByTab[t.id]}</Badge>
                    ) : null}
                  </Tab>
                ))}
              </TabList>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="min-w-0">
              {TABS.map((t) => (
                <TabPanel key={t.id} id={t.id} className="flex flex-col gap-6">
                  {groups.length === 0 ? (
                    <Empty className="rounded-xl border bg-card">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <InboxIcon />
                        </EmptyMedia>
                        <EmptyTitle>
                          {isFiltered
                            ? "Nothing matches"
                            : "You're all caught up"}
                        </EmptyTitle>
                        <EmptyDescription>
                          {isFiltered
                            ? "No notifications match the current filters. Widen the categories or clear the search."
                            : "New mentions, reviews and deploys will land here as your team works."}
                        </EmptyDescription>
                      </EmptyHeader>
                      {isFiltered ? (
                        <EmptyContent>
                          <Button onPress={resetFilters}>Clear filters</Button>
                        </EmptyContent>
                      ) : null}
                    </Empty>
                  ) : (
                    groups.map((group) => (
                      <section key={group.day} className="flex flex-col gap-1">
                        <div className="flex items-center gap-3 px-1 pb-1">
                          <h2 className="text-xs font-medium tracking-widest text-fg-muted uppercase">
                            {group.day}
                          </h2>
                          <span className="text-xs text-fg-muted tabular-nums">
                            {group.rows.length}
                          </span>
                          <Separator className="flex-1" />
                        </div>
                        <ul className="flex flex-col">
                          {group.rows.map((item) => (
                            <NotificationRow
                              key={item.id}
                              item={item}
                              invite={invites[item.id]}
                              onToggleRead={toggleRead}
                              onArchive={toggleArchive}
                              onInvite={(id, answer) => {
                                setInvites((prev) => ({
                                  ...prev,
                                  [id]: answer,
                                }))
                                setItems((prev) =>
                                  prev.map((entry) =>
                                    entry.id === id
                                      ? { ...entry, unread: false }
                                      : entry,
                                  ),
                                )
                              }}
                            />
                          ))}
                        </ul>
                      </section>
                    ))
                  )}
                </TabPanel>
              ))}
            </div>

            <SideRail />
          </div>
        </main>
      </Tabs>
    </div>
  )
}
