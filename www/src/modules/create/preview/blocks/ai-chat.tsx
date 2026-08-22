"use client"

import React from "react"

import {
  ArchiveIcon,
  ArrowUpIcon,
  ChartLineIcon,
  CheckIcon,
  ChevronsUpDownIcon,
  CopyIcon,
  CreditCardIcon,
  FileCodeIcon,
  GitBranchIcon,
  GlobeIcon,
  LogOutIcon,
  MessageSquareIcon,
  MonitorIcon,
  MoreHorizontalIcon,
  PaperclipIcon,
  PencilIcon,
  PlusIcon,
  RefreshCwIcon,
  SettingsIcon,
  ShareIcon,
  SparklesIcon,
  StarIcon,
  Trash2Icon,
  TrendingUpIcon,
} from "@/registry/icons"
import { AvatarFallback } from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  Conversation,
  Message,
  MessageAvatar,
  MessageContent,
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "@/registry/ui/chat"
import { Kbd } from "@/registry/ui/kbd"
import { Loader } from "@/registry/ui/loader"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"
import { SearchField } from "@/registry/ui/search-field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/ui/select"
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
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/registry/ui/sidebar"
import { ToggleButton } from "@/registry/ui/toggle-button"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  text: string
  bullets?: string[]
  code?: { file: string; source: string }
  chart?: { name: string; meta: string }
  sources?: string[]
  outro?: string
}

const TRACKING_SNIPPET = `import { track } from "@/lib/analytics"

type PlanId = "starter" | "team" | "scale"

export function trackPlanToggle(
  plan: PlanId,
  billing: "monthly" | "annual",
  card: HTMLElement,
) {
  const { top } = card.getBoundingClientRect()

  track("pricing_plan_toggled", {
    plan,
    billing,
    // The hypothesis under test: was the card visible when it was clicked?
    above_fold: top < window.innerHeight,
    viewport_height: window.innerHeight,
    release: "2026.8.14",
  })
}`

const INITIAL_THREAD: ChatMessage[] = [
  {
    id: "m1",
    role: "user",
    text: "Trial-to-paid fell from 4.8% to 4.2% the week we shipped the new pricing page. Is the release the cause, or is this seasonal?",
  },
  {
    id: "m2",
    role: "assistant",
    text: "The release is the likelier cause. The decline is isolated to the Team plan — the one card that moved below the fold in the new layout.",
    bullets: [
      "Team: 5.1% → 4.0% (−1.1pt). Starter and Scale are flat within noise.",
      "Signups are up 3.2% week over week, so this is conversion, not traffic mix.",
      "Last August's seasonal dip was −0.2pt spread evenly across all three plans.",
    ],
    chart: {
      name: "trial-to-paid-by-plan.png",
      meta: "14 weekly cohorts · Northwind warehouse",
    },
    sources: ["growth.trial_cohorts", "release 2026.8.14", "pricing_page"],
  },
  {
    id: "m3",
    role: "user",
    text: "Makes sense. Give me the event we need to confirm the fold theory.",
  },
  {
    id: "m4",
    role: "assistant",
    text: "One toggle event carrying the plan and its rendered position is enough to correlate visibility with conversion:",
    code: { file: "src/analytics/pricing.ts", source: TRACKING_SNIPPET },
    outro:
      "Ship it behind the existing analytics.pricing flag. Two days of traffic gives us roughly 9,000 toggles — enough to split the Team plan by fold position.",
  },
]

const FOLLOW_UP_DATA: Omit<ChatMessage, "id" | "role"> = {
  text: "Here's what the first two days of that event show — the fold theory holds:",
  bullets: [
    "Team cards render below the fold in 68% of sessions on 13-inch laptops.",
    "Those sessions convert at 3.6% versus 5.4% when the card is visible.",
    "Annual billing is unaffected — that toggle sits above the fold everywhere.",
  ],
  sources: ["pricing_plan_toggled", "growth.trial_cohorts"],
}

const FOLLOW_UP_PLAN: Omit<ChatMessage, "id" | "role"> = {
  text: "I drafted the fix as two independent changes so you can ship them separately:",
  bullets: [
    "Move the plan grid above the testimonial strip — recovers ~180px on 13-inch screens.",
    "Collapse the comparison table into a disclosure so the cards are the first thing below the headline.",
  ],
  outro:
    "Both are behind pricing.layout_v3. I'd run them as a 50/50 split for a week before rolling forward.",
}

const MODELS = [
  { id: "fable", name: "Fable 5", detail: "Deep reasoning" },
  { id: "opus", name: "Opus 4.8", detail: "Complex analysis" },
  { id: "sonnet", name: "Sonnet 4.6", detail: "Everyday work" },
  { id: "haiku", name: "Haiku 4.5", detail: "Fastest" },
]

const SUGGESTIONS = [
  { icon: MonitorIcon, label: "Break it down by device" },
  { icon: MessageSquareIcon, label: "Draft the #growth update" },
  { icon: TrendingUpIcon, label: "Compare with the August release" },
  { icon: GitBranchIcon, label: "Write the rollback plan" },
]

const HISTORY: { label: string; items: string[] }[] = [
  {
    label: "Today",
    items: [
      "Trial-to-paid drop after pricing release",
      "Q3 retention memo for the board",
    ],
  },
  {
    label: "Yesterday",
    items: ["Billing webhook retries", "Churn themes in Zendesk tickets"],
  },
  {
    label: "Last 7 days",
    items: [
      "Cohort retention SQL",
      "Stripe vs Paddle fee model",
      "Onboarding email rewrite",
    ],
  },
]

function ConversationMenu() {
  return (
    <MenuContent className="min-w-52">
      <MenuItem>
        <PencilIcon />
        Rename
      </MenuItem>
      <MenuItem>
        <ShareIcon />
        Share link
      </MenuItem>
      <MenuItem>
        <StarIcon />
        Add to favorites
      </MenuItem>
      <Separator />
      <MenuItem>
        <ArchiveIcon />
        Archive
      </MenuItem>
      <MenuItem variant="danger">
        <Trash2Icon />
        Delete
      </MenuItem>
    </MenuContent>
  )
}

function CodeBlock({ file, source }: { file: string; source: string }) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(timer)
  }, [copied])

  return (
    <div className="w-full overflow-hidden rounded-lg border bg-card">
      <div className="flex items-center gap-2 border-b px-3 py-1.5">
        <FileCodeIcon className="size-3.5 shrink-0 text-fg-muted" />
        <span className="truncate font-mono text-xs text-fg-muted">{file}</span>
        <Button
          variant="quiet"
          size="xs"
          className="ml-auto"
          onPress={() => {
            setCopied(true)
            void navigator.clipboard?.writeText(source).catch(() => {})
          }}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="overflow-x-auto bg-muted p-3 font-mono text-xs leading-relaxed">
        <code>{source}</code>
      </pre>
    </div>
  )
}

function MessageActions() {
  const actions = [
    { icon: CopyIcon, label: "Copy response" },
    { icon: RefreshCwIcon, label: "Try again" },
    { icon: ShareIcon, label: "Share response" },
  ]
  return (
    <div className="flex items-center gap-0.5 text-fg-muted">
      {actions.map((action) => (
        <Tooltip key={action.label}>
          <Button
            variant="quiet"
            size="xs"
            isIconOnly
            aria-label={action.label}
          >
            <action.icon />
          </Button>
          <TooltipContent>{action.label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}

function ThreadMessage({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user"
  return (
    <Message role={message.role} className="mx-auto max-w-3xl">
      {isUser ? (
        <MessageAvatar name="Mehdi" />
      ) : (
        <MessageAvatar aria-label="Lumen">
          <AvatarFallback className="bg-primary text-fg-on-primary">
            <SparklesIcon className="size-3.5" />
          </AvatarFallback>
        </MessageAvatar>
      )}
      <MessageContent>
        <p className="text-pretty">{message.text}</p>

        {message.bullets && (
          <ul className="flex flex-col gap-1.5">
            {message.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2 text-pretty text-fg-muted">
                <span aria-hidden className="text-fg-muted">
                  —
                </span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        )}

        {message.chart && (
          <div className="w-full max-w-sm overflow-hidden rounded-lg border">
            <div className="flex aspect-[16/9] items-center justify-center bg-muted text-fg-muted">
              <ChartLineIcon className="size-8" />
            </div>
            <div className="flex items-center justify-between gap-2 border-t px-3 py-2">
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-xs font-medium">
                  {message.chart.name}
                </span>
                <span className="truncate text-xs text-fg-muted">
                  {message.chart.meta}
                </span>
              </div>
              <Button variant="quiet" size="xs">
                Open
              </Button>
            </div>
          </div>
        )}

        {message.code && <CodeBlock {...message.code} />}

        {message.outro && (
          <p className="text-pretty text-fg-muted">{message.outro}</p>
        )}

        {message.sources && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-fg-muted">Sources</span>
            {message.sources.map((source) => (
              <Badge
                key={source}
                appearance="subtle"
                variant="accent"
                size="sm"
              >
                {source}
              </Badge>
            ))}
          </div>
        )}

        {!isUser && <MessageActions />}
      </MessageContent>
    </Message>
  )
}

export default function AiChatBlock() {
  const [messages, setMessages] = React.useState(INITIAL_THREAD)
  const [draft, setDraft] = React.useState("")
  const [isThinking, setThinking] = React.useState(false)
  const [model, setModel] = React.useState("fable")
  const [webSearch, setWebSearch] = React.useState(true)
  const [replyCount, setReplyCount] = React.useState(0)
  const [activeChat, setActiveChat] = React.useState(
    "Trial-to-paid drop after pricing release",
  )
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, isThinking])

  React.useEffect(() => {
    if (!isThinking) return
    const timer = setTimeout(() => {
      const reply = replyCount % 2 === 0 ? FOLLOW_UP_DATA : FOLLOW_UP_PLAN
      setMessages((current) => [
        ...current,
        { id: `a${current.length}`, role: "assistant", ...reply },
      ])
      setReplyCount((count) => count + 1)
      setThinking(false)
    }, 1400)
    return () => clearTimeout(timer)
  }, [isThinking, replyCount])

  const send = () => {
    const text = draft.trim()
    if (!text || isThinking) return
    setMessages((current) => [
      ...current,
      { id: `u${current.length}`, role: "user", text },
    ])
    setDraft("")
    setThinking(true)
  }

  return (
    <div className="min-h-screen bg-bg text-fg">
      <SidebarProvider className="h-svh min-h-svh">
        <Sidebar>
          <SidebarHeader className="gap-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-fg-on-primary">
                    <SparklesIcon className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-medium text-fg">Lumen</span>
                    <span className="text-xs">Northwind workspace</span>
                  </div>
                  <ChevronsUpDownIcon className="ml-auto" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <Button variant="secondary" className="w-full justify-start">
              <PlusIcon />
              New chat
            </Button>
            <SearchField aria-label="Search chats" placeholder="Search chats" />
          </SidebarHeader>
          <SidebarContent>
            {HISTORY.map((group) => (
              <SidebarGroup key={group.label}>
                <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item}>
                      <SidebarMenuButton
                        isActive={item === activeChat}
                        onPress={() => setActiveChat(item)}
                      >
                        <MessageSquareIcon />
                        <span className="truncate">{item}</span>
                      </SidebarMenuButton>
                      <Menu>
                        <SidebarMenuAction
                          showOnHover
                          aria-label="Chat actions"
                        >
                          <MoreHorizontalIcon />
                        </SidebarMenuAction>
                        <Popover>
                          <ConversationMenu />
                        </Popover>
                      </Menu>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            ))}
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <Menu>
                  <SidebarMenuButton size="lg">
                    <MessageAvatar name="Mehdi" className="size-8" />
                    <div className="flex min-w-0 flex-col gap-0.5 leading-none">
                      <span className="truncate font-medium text-fg">
                        Mehdi Benhadjali
                      </span>
                      <span className="truncate text-xs">Growth · Pro</span>
                    </div>
                    <ChevronsUpDownIcon className="ml-auto" />
                  </SidebarMenuButton>
                  <Popover placement="top" className="w-(--trigger-width)">
                    <MenuContent>
                      <MenuItem>
                        <SettingsIcon />
                        Settings
                      </MenuItem>
                      <MenuItem>
                        <CreditCardIcon />
                        Usage & billing
                      </MenuItem>
                      <Separator />
                      <MenuItem>
                        <LogOutIcon />
                        Log out
                      </MenuItem>
                    </MenuContent>
                  </Popover>
                </Menu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex h-svh min-h-0 flex-col overflow-hidden">
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3 sm:px-4">
            <SidebarTrigger />
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium">{activeChat}</span>
              <span className="truncate text-xs text-fg-muted">
                {messages.length} messages · updated 4m ago
              </span>
            </div>
            <Badge
              appearance="subtle"
              variant="accent"
              className="ml-2 hidden sm:inline-flex"
            >
              Growth
            </Badge>
            <div className="ml-auto flex items-center gap-1">
              <Button variant="quiet" size="sm" className="hidden sm:flex">
                <ShareIcon />
                Share
              </Button>
              <Menu>
                <Button
                  variant="quiet"
                  size="sm"
                  isIconOnly
                  aria-label="Conversation options"
                >
                  <MoreHorizontalIcon />
                </Button>
                <Popover>
                  <ConversationMenu />
                </Popover>
              </Menu>
            </div>
          </header>

          <Conversation ref={scrollRef} className="min-h-0 flex-1 px-3 sm:px-6">
            {messages.map((message) => (
              <ThreadMessage key={message.id} message={message} />
            ))}
            {isThinking && (
              <Message className="mx-auto max-w-3xl">
                <MessageAvatar aria-label="Lumen">
                  <AvatarFallback className="bg-primary text-fg-on-primary">
                    <SparklesIcon className="size-3.5" />
                  </AvatarFallback>
                </MessageAvatar>
                <MessageContent>
                  <span className="flex items-center gap-2 text-fg-muted">
                    <Loader className="size-4" />
                    Querying weekly cohorts…
                  </span>
                </MessageContent>
              </Message>
            )}
          </Conversation>

          <div className="shrink-0 border-t bg-bg px-3 pt-3 pb-4 sm:px-6">
            <div className="mx-auto flex max-w-3xl flex-col gap-3">
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                {SUGGESTIONS.map((suggestion) => (
                  <Button
                    key={suggestion.label}
                    variant="secondary"
                    size="sm"
                    className="shrink-0"
                    onPress={() => setDraft(suggestion.label)}
                  >
                    <suggestion.icon />
                    {suggestion.label}
                  </Button>
                ))}
              </div>

              <PromptInput
                onSubmit={(e) => {
                  e.preventDefault()
                  send()
                }}
              >
                <PromptInputTextarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Ask about the pricing release, a metric, or a query…"
                  aria-label="Message Lumen"
                />
                <PromptInputToolbar>
                  <div className="flex min-w-0 items-center gap-1">
                    <Tooltip>
                      <Button
                        variant="quiet"
                        size="sm"
                        isIconOnly
                        aria-label="Attach a file"
                      >
                        <PaperclipIcon />
                      </Button>
                      <TooltipContent>Attach a file</TooltipContent>
                    </Tooltip>
                    <ToggleButton
                      variant="quiet"
                      size="sm"
                      isSelected={webSearch}
                      onChange={setWebSearch}
                    >
                      <GlobeIcon />
                      <span className="hidden sm:inline">Search</span>
                    </ToggleButton>
                    <Select
                      aria-label="Model"
                      value={model}
                      onChange={(key) => setModel(String(key))}
                      className="w-auto"
                    >
                      <SelectTrigger variant="quiet" size="sm" />
                      <SelectContent className="min-w-56">
                        {MODELS.map((m) => (
                          <SelectItem key={m.id} id={m.id} textValue={m.name}>
                            <div className="flex flex-col">
                              <span>{m.name}</span>
                              <span className="text-xs text-fg-muted">
                                {m.detail}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <PromptInputSubmit
                    isIconOnly
                    aria-label="Send message"
                    isDisabled={!draft.trim() || isThinking}
                  >
                    <ArrowUpIcon />
                  </PromptInputSubmit>
                </PromptInputToolbar>
              </PromptInput>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-fg-muted">
                <span>
                  Lumen can be wrong — check figures against the warehouse.
                </span>
                <span className="hidden items-center gap-1 sm:flex">
                  <Kbd>⏎</Kbd> to send
                  <Kbd>⇧⏎</Kbd> for a new line
                </span>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
