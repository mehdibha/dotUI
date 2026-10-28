import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import { TokenFieldValue } from "react-aria-components/TokenField"

import {
  ArrowUpIcon,
  AudioLinesIcon,
  BriefcaseIcon,
  CameraIcon,
  ChartLineIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  CodeIcon,
  CopyIcon,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  FolderIcon,
  FolderPlusIcon,
  GlobeIcon,
  HeartIcon,
  HelpCircleIcon,
  LayersIcon,
  LogOutIcon,
  MessageSquareIcon,
  MicIcon,
  MonitorIcon,
  MoreHorizontalIcon,
  PaletteIcon,
  PencilIcon,
  PinIcon,
  PlusIcon,
  RotateCcwIcon,
  SearchIcon,
  ServerIcon,
  SettingsIcon,
  SparklesIcon,
  SquareIcon,
  TagIcon,
  TelescopeIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Trash2Icon,
  UploadIcon,
  Users2Icon,
  XIcon,
  PaperclipIcon,
  FileTextIcon,
  FileCodeIcon,
  AppWindowIcon,
  TimerIcon,
  InfoIcon,
  ExternalLinkIcon,
  ListIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import { Bubble, BubbleContent } from "@/registry/ui/bubble"
import { Button } from "@/registry/ui/button"
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/registry/ui/collapsible"
import { Command } from "@/registry/ui/command"
import {
  Input,
  InputGroup,
  InputGroupAddon,
  TextArea,
} from "@/registry/ui/input"
import { Kbd } from "@/registry/ui/kbd"
import { Mention } from "@/registry/ui/mention"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuItemDescription,
  MenuItemLabel,
  MenuSection,
  MenuSectionHeader,
  MenuSub,
} from "@/registry/ui/menu"
import { Message, MessageContent } from "@/registry/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/registry/ui/message-scroller"
import { Popover } from "@/registry/ui/popover"
import { SearchField } from "@/registry/ui/search-field"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
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
  useSidebar,
} from "@/registry/ui/sidebar"
import { ToggleButton } from "@/registry/ui/toggle-button"
import { TokenInput } from "@/registry/ui/token-field"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"
import { BrandMark, BrandName } from "@/modules/studio/assets/brand"

// A claude.ai-style assistant: a quiet sidebar (New, Search, Projects,
// pinned projects, recents), a greeting with recent artifacts on a new chat,
// a centered reading column with no assistant chrome, thinking and tool-use
// disclosures, and an artifact that opens in a side panel.

type Block =
  // `plain` is what Copy puts on the clipboard when `content` is markup.
  | { kind: "text"; content: ReactNode; plain?: string }
  | { kind: "thinking"; seconds: number; content: string }
  | { kind: "queries"; items: { table: string; detail: string }[] }
  | { kind: "table"; head: string[]; rows: string[][] }
  | { kind: "artifact" }

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  blocks: Block[]
}

interface Chat {
  id: string
  title: string
  messages: ChatMessage[]
}

const MAIN_CHAT = "pricing"

function exchange(
  id: string,
  question: string,
  ...answer: string[]
): ChatMessage[] {
  return [
    {
      id: `${id}-0`,
      role: "user",
      blocks: [{ kind: "text", content: question }],
    },
    {
      id: `${id}-1`,
      role: "assistant",
      blocks: answer.map((content) => ({ kind: "text" as const, content })),
    },
  ]
}

const SEED_CHATS: Chat[] = [
  {
    id: MAIN_CHAT,
    title: "Trial-to-paid drop after pricing release",
    messages: [
      {
        id: "pricing-0",
        role: "user",
        blocks: [
          {
            kind: "text",
            content:
              "Trial-to-paid fell from 4.8% to 4.2% the week we shipped the new pricing page. Is the release the cause, or is this seasonal?",
          },
        ],
      },
      {
        id: "pricing-1",
        role: "assistant",
        blocks: [
          {
            kind: "thinking",
            seconds: 14,
            content:
              "A seasonal dip would hit every plan about evenly, so the first cut is by plan. Then check whether signups moved, to rule out a change in traffic mix, and compare with last August.",
          },
          {
            kind: "queries",
            items: [
              { table: "growth.trial_cohorts", detail: "14 weekly cohorts" },
              { table: "growth.signups", detail: "week over week" },
              { table: "releases", detail: "2026.8.14" },
            ],
          },
          {
            kind: "text",
            plain:
              "The release is the likelier cause. The drop is isolated to the Team plan, the one card the new layout pushed below the fold.",
            content: (
              <>
                <strong>The release is the likelier cause.</strong> The drop is
                isolated to the Team plan, the one card the new layout pushed
                below the fold.
              </>
            ),
          },
          {
            kind: "table",
            head: ["Plan", "Before", "After", "Change"],
            rows: [
              ["Starter", "4.1%", "4.0%", "−0.1 pt"],
              ["Team", "5.1%", "4.0%", "−1.1 pt"],
              ["Scale", "3.9%", "3.9%", "0.0 pt"],
            ],
          },
          {
            kind: "text",
            content:
              "Signups are up 3.2% week over week, so this is conversion, not traffic mix. Last August's seasonal dip was −0.2 pt, spread evenly across all three plans.",
          },
        ],
      },
      {
        id: "pricing-2",
        role: "user",
        blocks: [
          {
            kind: "text",
            content:
              "Build me a small dashboard that tracks Team conversion by fold position.",
          },
        ],
      },
      {
        id: "pricing-3",
        role: "assistant",
        blocks: [
          {
            kind: "text",
            plain:
              "Here it is. It reads the pricing_plan_toggled event you shipped on Tuesday and splits Team sessions by where the card first rendered.",
            content: (
              <>
                Here it is. It reads the <code>pricing_plan_toggled</code> event
                you shipped on Tuesday and splits Team sessions by where the
                card first rendered.
              </>
            ),
          },
          { kind: "artifact" },
          {
            kind: "text",
            content:
              "Two days of data already back the theory: below the fold, the Team card converts at 3.6%, against 5.4% when it is visible on load.",
          },
        ],
      },
    ],
  },
  {
    id: "webhooks",
    title: "Billing webhook retries",
    messages: exchange(
      "webhooks",
      "Our invoice.paid webhooks sometimes arrive twice. How should the handler cope?",
      "Make the handler idempotent. Store each event ID in a processed_events table with a unique index and skip any ID you have already seen, so a retry becomes harmless.",
      "Write that row and the side effect in one transaction. Otherwise a crash between the two can mark an event as handled when it never ran.",
    ),
  },
  {
    id: "churn",
    title: "Churn themes in support tickets",
    messages: exchange(
      "churn",
      "Summarize the main reasons people gave for cancelling last month.",
      "Three themes cover 71% of the 214 cancellation tickets: the price after the first renewal (32%), missing SSO on the Team plan (24%) and slow CSV exports (15%).",
      "The SSO requests cluster in accounts above 20 seats, which is where most of the lost revenue sits.",
    ),
  },
  {
    id: "cohorts",
    title: "Cohort retention SQL",
    messages: exchange(
      "cohorts",
      "Write a query for monthly retention by signup cohort.",
      "Group users by the month of their first event, then count how many are active in each later month.",
      "Divide each month's active users by the cohort size and pivot on months since signup to get the usual retention triangle.",
    ),
  },
  {
    id: "fees",
    title: "Fee model: cards vs bank transfer",
    messages: exchange(
      "fees",
      "Should annual plans push customers to pay by bank transfer?",
      "For invoices above about $2,000, yes. A card fee of 2.9% plus 30¢ costs $58 on a $2,000 invoice, while a bank transfer costs a flat 80¢.",
      "Keep cards for monthly plans, where the failed-payment retries matter more than the fee.",
    ),
  },
  {
    id: "onboarding",
    title: "Onboarding email rewrite",
    messages: exchange(
      "onboarding",
      "Make our day-3 onboarding email shorter and friendlier.",
      "Here's a version at 74 words, down from 212. It keeps one call to action, connecting a data source, and drops the feature tour.",
      "Subject: Your first report is one click away. Connect your warehouse and Northwind builds your first retention report in under a minute.",
    ),
  },
  {
    id: "board",
    title: "Board deck outline",
    messages: exchange(
      "board",
      "Outline a ten-slide board update for Q3.",
      "Lead with the one number the board will remember, net revenue retention at 114%, then spend three slides on how you got there.",
      "Close with the two asks: approval for the EU entity and a view on the Series B timing.",
    ),
  },
]

const FOLLOW_UPS: Block[][] = [
  [
    {
      kind: "text",
      content:
        "The gap holds on every device but is widest on 13-inch laptops, where the card lands below the fold in 68% of sessions.",
    },
    {
      kind: "text",
      content:
        "Moving the plan grid above the testimonial strip recovers about 180px there, enough to bring the Team card back into view.",
    },
  ],
  [
    {
      kind: "text",
      content:
        "I'd ship it as a 50/50 split behind pricing.layout_v3 for a week. With current traffic that gives roughly 9,000 Team sessions, enough to read a one-point lift.",
    },
  ],
]

const GENERIC_REPLY: Block[] = [
  {
    kind: "text",
    content:
      "Happy to dig into that. So I can give you something useful rather than generic: who is it for, and what would a good result look like?",
  },
]

const MODELS = [
  { id: "atlas", name: "Atlas 5.1", detail: "For your toughest challenges" },
  {
    id: "meridian",
    name: "Meridian 5.5",
    detail: "For complex work and everyday tasks",
  },
  {
    id: "cadence",
    name: "Cadence 5.5",
    detail: "Most efficient for simpler tasks",
  },
  { id: "swift", name: "Swift 5.5", detail: "Fastest for quick answers" },
]

const OLDER_MODELS = [
  { id: "meridian-5", name: "Meridian 5", detail: "Previous generation" },
  { id: "atlas-4", name: "Atlas 4.8", detail: "Previous generation" },
  { id: "cadence-5", name: "Cadence 5", detail: "Previous generation" },
]

const EFFORTS = [
  { id: "low", name: "Low", detail: "Answers right away" },
  { id: "medium", name: "Medium", detail: "Thinks when it helps" },
  { id: "high", name: "High", detail: "Thinks longer for hard problems" },
]

const MODES = [
  {
    id: "manual",
    name: "Manual",
    detail: (
      <>
        <BrandName>Lumen</BrandName> asks before using new tools or opening new
        sites.
      </>
    ),
  },
  {
    id: "auto",
    name: "Auto",
    detail: (
      <>
        <BrandName>Lumen</BrandName> runs on its own and pauses to ask if
        anything looks unsafe.
      </>
    ),
  },
]

const NAV = [
  { icon: SearchIcon, label: "Search" },
  { icon: FolderIcon, label: "Projects", badge: "New" },
  { icon: LayersIcon, label: "Artifacts" },
  { icon: ClockIcon, label: "Scheduled" },
  { icon: PaletteIcon, label: "Design" },
  { icon: BriefcaseIcon, label: "Customize" },
]

const PROJECTS = [
  {
    id: "growth",
    name: "Northwind growth",
    icon: ChartLineIcon,
    tone: "text-fg-info",
  },
  { id: "pricing", name: "Pricing v3", icon: TagIcon, tone: "text-fg-success" },
  { id: "hiring", name: "Hiring", icon: Users2Icon, tone: "text-fg-accent" },
  {
    id: "platform",
    name: "Data platform",
    icon: CodeIcon,
    tone: "text-fg-warning",
  },
  {
    id: "brand",
    name: "Brand refresh",
    icon: HeartIcon,
    tone: "text-fg-danger",
  },
]

const ALL_PROJECTS = [
  ...PROJECTS,
  { id: "research", name: "Customer research" },
  { id: "planning", name: "Q4 planning" },
]

const COMMANDS = [
  { id: "files", name: "Add files", icon: PaperclipIcon, tone: undefined },
  { id: "usage", name: "Usage", icon: TimerIcon, tone: undefined },
  { id: "doc", name: "Doc", icon: FileTextIcon, tone: "text-fg-info" },
  {
    id: "slides",
    name: "Slides",
    icon: AppWindowIcon,
    tone: "text-fg-warning",
  },
  { id: "design", name: "Design", icon: PaletteIcon, tone: "text-fg-accent" },
  {
    id: "dashboard",
    name: "Dashboard",
    icon: ChartLineIcon,
    tone: "text-fg-danger",
  },
  ...["deep-research", "meeting-notes", "morning-brief", "skill-creator"].map(
    (name) => ({ id: name, name, icon: FileCodeIcon, tone: "text-fg-muted" }),
  ),
]

const MENTIONABLE = [
  ...["Q3 retention memo", "Pricing v3 launch plan", "Board deck outline"].map(
    (name) => ({
      id: name,
      name,
      kind: "Docs",
      icon: FileTextIcon,
      tone: "text-fg-info",
    }),
  ),
  ...[
    "Fold position tracker",
    "Churn themes review",
    "Cohort retention explorer",
  ].map((name) => ({
    id: name,
    name,
    kind: undefined,
    icon: LayersIcon,
    tone: undefined,
  })),
]

const EMPTY_DRAFT = new TokenFieldValue([])

const DEVICES = [
  { name: "13-inch laptop", visible: 5.6, below: 3.4, share: 68 },
  { name: "15-inch and up", visible: 5.3, below: 3.9, share: 22 },
  { name: "Tablet", visible: 5.2, below: 3.8, share: 41 },
  { name: "Phone", visible: 4.9, below: 3.7, share: 74 },
]

const ARTIFACT_SOURCE = `import { useQuery } from "@/lib/warehouse"

const DEVICES = ["13-inch laptop", "15-inch and up", "Tablet", "Phone"]

export default function FoldTracker() {
  const { data } = useQuery({
    event: "pricing_plan_toggled",
    where: { plan: "team" },
    groupBy: ["device", "above_fold"],
    since: "2026-08-14",
  })

  return (
    <main className="dashboard">
      <h1>Team trial-to-paid by fold position</h1>
      <Stats
        visible={data.rate({ above_fold: true })}
        below={data.rate({ above_fold: false })}
      />
      {DEVICES.map((device) => (
        <DeviceRow key={device} device={device} rows={data.for(device)} />
      ))}
    </main>
  )
}`

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

function chatTitle(text: string) {
  const title = text.charAt(0).toUpperCase() + text.slice(1)
  return title.length > 40 ? `${title.slice(0, 40).trimEnd()}…` : title
}

function plainText(blocks: Block[]) {
  return blocks
    .map((block) => {
      if (block.kind === "table")
        return [block.head, ...block.rows]
          .map((row) => row.join("\t"))
          .join("\n")
      if (block.kind !== "text") return null
      return (
        block.plain ??
        (typeof block.content === "string" ? block.content : null)
      )
    })
    .filter((content) => content !== null)
    .join("\n\n")
}

function AssistantMark({ className }: { className?: string }) {
  return (
    <BrandMark className={cn("size-7", className)}>
      <SparklesIcon className={cn("size-6 text-primary", className)} />
    </BrandMark>
  )
}

function IconAction({
  label,
  children,
  onPress,
  className,
}: {
  label: string
  children: ReactNode
  onPress?: () => void
  className?: string
}) {
  return (
    <Tooltip>
      <Button
        variant="quiet"
        size="sm"
        isIconOnly
        aria-label={label}
        onPress={onPress}
        className={className}
      >
        {children}
      </Button>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

function CopyAction({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(timer)
  }, [copied])

  return (
    <IconAction
      label={copied ? "Copied" : "Copy"}
      onPress={() => {
        setCopied(true)
        void navigator.clipboard?.writeText(text).catch(() => {})
      }}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </IconAction>
  )
}

function ChatMenu() {
  return (
    <MenuContent className="min-w-48">
      <MenuItem>
        <PinIcon />
        Pin
      </MenuItem>
      <MenuItem>
        <PencilIcon />
        Rename
      </MenuItem>
      <MenuItem>
        <FolderPlusIcon />
        Add to project
      </MenuItem>
      <Separator />
      <MenuItem variant="danger">
        <Trash2Icon />
        Delete
      </MenuItem>
    </MenuContent>
  )
}

// MARK: Thread

function Disclosure({
  icon,
  label,
  children,
}: {
  icon: ReactNode
  label: string
  children: ReactNode
}) {
  return (
    <Collapsible className="w-full">
      <CollapsibleTrigger className="group/disclosure flex w-fit items-center gap-2 rounded-(--studio-radius-item) py-1 font-sans text-sm text-fg-muted transition-colors hover:text-fg compact:text-xs [&_svg]:size-4">
        {icon}
        {label}
        <ChevronRightIcon className="transition-transform group-aria-expanded/disclosure:rotate-90" />
      </CollapsibleTrigger>
      <CollapsiblePanel>
        <div className="mt-1 ml-2 border-l pl-4">{children}</div>
      </CollapsiblePanel>
    </Collapsible>
  )
}

function ArtifactCard({
  isOpen,
  onOpen,
}: {
  isOpen: boolean
  onOpen: () => void
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "flex w-full max-w-md items-center gap-3 rounded-(--studio-radius-card) border bg-bg p-2 pr-4 text-left font-sans transition-colors hover:bg-muted",
        isOpen && "border-border-focus",
      )}
    >
      <span className="flex h-12 w-14 shrink-0 items-center justify-center rounded-(--studio-radius-item) border bg-muted text-fg-muted">
        <CodeIcon className="size-5" />
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate text-sm font-medium compact:text-xs">
          Fold position tracker
        </span>
        <span className="truncate text-xs text-fg-muted">
          Interactive artifact · Version 2
        </span>
      </span>
    </button>
  )
}

function ResponseBlock({
  block,
  artifactOpen,
  onOpenArtifact,
}: {
  block: Block
  artifactOpen: boolean
  onOpenArtifact: () => void
}) {
  switch (block.kind) {
    case "text":
      return (
        <p className="text-pretty [&_code]:rounded-(--studio-radius-detail) [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em]">
          {block.content}
        </p>
      )
    case "thinking":
      return (
        <Disclosure
          icon={<ClockIcon />}
          label={`Thought for ${block.seconds} seconds`}
        >
          <p className="text-pretty text-fg-muted">{block.content}</p>
        </Disclosure>
      )
    case "queries":
      return (
        <Disclosure
          icon={<ServerIcon />}
          label={`Ran ${block.items.length} warehouse queries`}
        >
          <ul className="flex flex-col gap-1.5 font-sans text-xs">
            {block.items.map((item) => (
              <li key={item.table} className="flex items-center gap-2">
                <span className="font-mono text-fg">{item.table}</span>
                <span className="text-fg-muted">{item.detail}</span>
              </li>
            ))}
          </ul>
        </Disclosure>
      )
    case "table":
      return (
        <div className="w-full overflow-x-auto">
          <table className="w-full max-w-md border-collapse font-sans text-sm tabular-nums compact:text-xs">
            <thead>
              <tr className="border-b text-left text-fg-muted">
                {block.head.map((cell, index) => (
                  <th
                    key={cell}
                    className={cn(
                      "py-2 pr-4 font-medium",
                      index > 0 && "text-right",
                    )}
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row[0]} className="border-b last:border-b-0">
                  {row.map((cell, index) => (
                    <td
                      key={index}
                      className={cn(
                        "py-2 pr-4",
                        index > 0 && "text-right",
                        row[0] === "Team" && "font-medium",
                      )}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case "artifact":
      return <ArtifactCard isOpen={artifactOpen} onOpen={onOpenArtifact} />
  }
}

function UserTurn({
  message,
  onEdit,
}: {
  message: ChatMessage
  onEdit: (text: string) => void
}) {
  const text = plainText(message.blocks)
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(text)

  if (editing) {
    const save = () => {
      if (!value.trim()) return
      setEditing(false)
      if (value.trim() !== text) onEdit(value.trim())
    }
    return (
      <Message align="end">
        <MessageContent>
          <InputGroup className="w-full">
            <TextArea
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              aria-label="Edit message"
              className="min-h-16"
              onKeyDown={(e) => {
                if (e.key === "Escape") setEditing(false)
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  save()
                }
              }}
            />
            <InputGroupAddon>
              <div className="ml-auto flex items-center gap-1">
                <Button
                  variant="quiet"
                  size="sm"
                  onPress={() => {
                    setValue(text)
                    setEditing(false)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  isDisabled={!value.trim()}
                  onPress={save}
                >
                  Save
                </Button>
              </div>
            </InputGroupAddon>
          </InputGroup>
        </MessageContent>
      </Message>
    )
  }

  return (
    <Message align="end" className="group/turn pb-8">
      <MessageContent className="items-end">
        <Bubble align="end" variant="muted" className="max-w-[85%]">
          <BubbleContent>
            <p className="text-pretty whitespace-pre-wrap">{text}</p>
          </BubbleContent>
        </Bubble>
      </MessageContent>
      <div className="absolute right-0 bottom-0 flex items-center gap-0.5 text-fg-muted opacity-0 transition-opacity group-focus-within/turn:opacity-100 group-hover/turn:opacity-100">
        <IconAction
          label="Edit"
          onPress={() => {
            setValue(text)
            setEditing(true)
          }}
        >
          <PencilIcon />
        </IconAction>
        <CopyAction text={text} />
      </div>
    </Message>
  )
}

function AssistantActions({
  text,
  isLast,
  onRetry,
}: {
  text: string
  isLast: boolean
  onRetry: () => void
}) {
  const [feedback, setFeedback] = useState<"good" | "bad" | null>(null)

  return (
    <div className="-ml-2 flex items-center gap-0.5 text-fg-muted">
      <CopyAction text={text} />
      {[
        { id: "good" as const, label: "Good response", icon: ThumbsUpIcon },
        { id: "bad" as const, label: "Bad response", icon: ThumbsDownIcon },
      ].map((item) => (
        <Tooltip key={item.id}>
          <ToggleButton
            variant="quiet"
            size="sm"
            isIconOnly
            aria-label={item.label}
            isSelected={feedback === item.id}
            onChange={(selected) => setFeedback(selected ? item.id : null)}
          >
            <item.icon />
          </ToggleButton>
          <TooltipContent>{item.label}</TooltipContent>
        </Tooltip>
      ))}
      {isLast && (
        <>
          <IconAction label="Retry" onPress={onRetry}>
            <RotateCcwIcon />
          </IconAction>
          <p className="ml-auto hidden pl-4 text-right font-sans text-xs sm:block">
            <BrandName>Lumen</BrandName> can make mistakes. Please double-check
            responses.
          </p>
        </>
      )}
    </div>
  )
}

function AssistantTurn({
  message,
  isLast,
  artifactOpen,
  onOpenArtifact,
  onRetry,
}: {
  message: ChatMessage
  isLast: boolean
  artifactOpen: boolean
  onOpenArtifact: () => void
  onRetry: () => void
}) {
  return (
    <Message>
      <MessageContent className="gap-4 leading-relaxed">
        {message.blocks.map((block, index) => (
          <ResponseBlock
            key={index}
            block={block}
            artifactOpen={artifactOpen}
            onOpenArtifact={onOpenArtifact}
          />
        ))}
        <AssistantActions
          text={plainText(message.blocks)}
          isLast={isLast}
          onRetry={onRetry}
        />
        {isLast && <AssistantMark />}
      </MessageContent>
    </Message>
  )
}

// MARK: Composer

function ComposerMenu({
  label,
  value,
  children,
  className,
}: {
  label: ReactNode
  value?: string
  children: ReactNode
  className?: string
}) {
  return (
    <Menu>
      <Button
        variant="quiet"
        size="sm"
        aria-label={value}
        className={className}
      >
        {label}
      </Button>
      <Popover placement="bottom end">{children}</Popover>
    </Menu>
  )
}

function Composer({
  draft,
  onDraftChange,
  onSend,
  isPending,
  placeholder,
  showProject,
}: {
  draft: TokenFieldValue
  onDraftChange: (draft: TokenFieldValue) => void
  onSend: () => void
  isPending: boolean
  placeholder: string
  showProject?: boolean
}) {
  const [model, setModel] = useState("meridian")
  const [effort, setEffort] = useState("medium")
  const [mode, setMode] = useState("manual")
  const [project, setProject] = useState<string | null>(null)
  const [tools, setTools] = useState<Set<string>>(new Set(["web"]))
  const [language, setLanguage] = useState("en")

  const modelName = [...MODELS, ...OLDER_MODELS].find(
    (m) => m.id === model,
  )?.name
  const effortName = EFFORTS.find((e) => e.id === effort)?.name
  const projectName = ALL_PROJECTS.find((p) => p.id === project)?.name
  const pick = (set: (key: string) => void) => (keys: "all" | Set<unknown>) => {
    const [key] = keys === "all" ? [] : [...keys]
    if (key) set(String(key))
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSend()
      }}
      className="flex w-full min-w-0 flex-col gap-1.5"
    >
      <InputGroup>
        <Mention
          aria-label="Message"
          trigger={/[@/]/}
          placement="top start"
          value={draft}
          onChange={onDraftChange}
          onSubmit={() => onSend()}
          getItemText={(key) => String(key)}
          className="w-full"
        >
          {({ trigger }) => (
            <>
              <TokenInput placeholder={placeholder} className="min-h-16" />
              <Popover className="min-w-80">
                {trigger === "/" ? (
                  <MenuContent
                    aria-label="Commands"
                    items={COMMANDS}
                    renderEmptyState={() => "No matches"}
                  >
                    {(item) => (
                      <MenuItem id={item.id} textValue={item.name}>
                        <item.icon className={item.tone} />
                        {item.name}
                      </MenuItem>
                    )}
                  </MenuContent>
                ) : (
                  <MenuContent
                    aria-label="Artifacts"
                    renderEmptyState={() => "No matches"}
                  >
                    <MenuSection>
                      <MenuSectionHeader>Artifacts</MenuSectionHeader>
                      {MENTIONABLE.map((item) => (
                        <MenuItem
                          key={item.id}
                          id={item.id}
                          textValue={item.name}
                        >
                          <item.icon className={item.tone} />
                          <MenuItemLabel>
                            {item.name}
                            {item.kind && (
                              <span className="ml-2 text-fg-muted">
                                {item.kind}
                              </span>
                            )}
                          </MenuItemLabel>
                        </MenuItem>
                      ))}
                    </MenuSection>
                  </MenuContent>
                )}
              </Popover>
            </>
          )}
        </Mention>
        <InputGroupAddon>
          <Menu>
            <Button
              variant="quiet"
              size="sm"
              isIconOnly
              aria-label="Add content"
            >
              <PlusIcon />
            </Button>
            <Popover placement="bottom start">
              <MenuContent className="min-w-60">
                <MenuItem>
                  <UploadIcon />
                  Add files or photos
                </MenuItem>
                <MenuItem>
                  <CameraIcon />
                  Take a screenshot
                </MenuItem>
                <MenuItem>
                  <FolderPlusIcon />
                  Add to project
                </MenuItem>
                <Separator />
                <MenuSection
                  selectionMode="multiple"
                  selectedKeys={tools}
                  onSelectionChange={(keys) =>
                    setTools(
                      keys === "all"
                        ? new Set()
                        : new Set([...keys].map(String)),
                    )
                  }
                >
                  <MenuItem id="research" textValue="Research">
                    <TelescopeIcon />
                    Research
                  </MenuItem>
                  <MenuItem id="web" textValue="Web search">
                    <GlobeIcon />
                    Web search
                  </MenuItem>
                  <MenuItem id="warehouse" textValue="Warehouse">
                    <ServerIcon />
                    Warehouse
                  </MenuItem>
                </MenuSection>
              </MenuContent>
            </Popover>
          </Menu>
          <div className="ml-auto flex shrink-0 items-center gap-0.5">
            <IconAction label="Dictate">
              <MicIcon />
            </IconAction>
            <Menu>
              <Button
                variant="quiet"
                size="sm"
                isIconOnly
                aria-label="Dictation language"
                className="-ml-1 w-5"
              >
                <ChevronDownIcon />
              </Button>
              <Popover placement="bottom end">
                <MenuContent
                  className="min-w-44"
                  selectionMode="single"
                  selectedKeys={[language]}
                  onSelectionChange={pick(setLanguage)}
                >
                  <MenuSectionHeader>Dictation language</MenuSectionHeader>
                  <MenuItem id="en">English</MenuItem>
                  <MenuItem id="fr">Français</MenuItem>
                  <MenuItem id="es">Español</MenuItem>
                </MenuContent>
              </Popover>
            </Menu>
            {isPending ? (
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isIconOnly
                aria-label="Stop response"
              >
                <SquareIcon className="fill-current" />
              </Button>
            ) : draft.toString().trim() ? (
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isIconOnly
                aria-label="Send message"
              >
                <ArrowUpIcon />
              </Button>
            ) : (
              <IconAction label="Use voice mode">
                <AudioLinesIcon />
              </IconAction>
            )}
          </div>
        </InputGroupAddon>
      </InputGroup>

      <div className="flex min-w-0 items-center gap-1">
        {showProject && (
          <Menu>
            <Button variant="quiet" size="sm" className="min-w-0">
              <span className="truncate">{projectName ?? "Project"}</span>
              <ChevronDownIcon />
            </Button>
            <Popover placement="bottom start" className="w-72 outline-hidden">
              <Command aria-label="Projects">
                <SearchField autoFocus aria-label="Search or create a project">
                  <InputGroup>
                    <InputGroupAddon>
                      <SearchIcon />
                    </InputGroupAddon>
                    <Input placeholder="Search or create a project" />
                  </InputGroup>
                </SearchField>
                <MenuContent
                  aria-label="Projects"
                  selectionMode="single"
                  selectedKeys={project ? [project] : []}
                  onSelectionChange={pick(setProject)}
                >
                  {ALL_PROJECTS.map((p) => (
                    <MenuItem key={p.id} id={p.id} textValue={p.name}>
                      <FolderIcon />
                      {p.name}
                    </MenuItem>
                  ))}
                </MenuContent>
                <Separator />
                <MenuContent aria-label="Project actions">
                  <MenuItem>
                    <PlusIcon />
                    New project
                  </MenuItem>
                </MenuContent>
              </Command>
            </Popover>
          </Menu>
        )}
        <div className="ml-auto flex shrink-0 items-center">
          <ComposerMenu
            value={`${modelName}, ${effortName} effort`}
            label={
              <>
                {modelName}
                <span className="text-fg-muted">{effortName}</span>
              </>
            }
          >
            <MenuContent className="min-w-72">
              <MenuSection
                aria-label="Model"
                selectionMode="single"
                selectedKeys={[model]}
                onSelectionChange={pick(setModel)}
              >
                {MODELS.map((m) => (
                  <MenuItem key={m.id} id={m.id} textValue={m.name}>
                    <MenuItemLabel>{m.name}</MenuItemLabel>
                    <MenuItemDescription>{m.detail}</MenuItemDescription>
                  </MenuItem>
                ))}
              </MenuSection>
              <Separator />
              <MenuSub>
                <MenuItem textValue="Effort">
                  <MenuItemLabel>Effort</MenuItemLabel>
                  <span className="ml-auto pl-4 text-fg-muted">
                    {effortName}
                  </span>
                </MenuItem>
                <Popover>
                  <MenuContent
                    className="min-w-60"
                    selectionMode="single"
                    selectedKeys={[effort]}
                    onSelectionChange={pick(setEffort)}
                  >
                    {EFFORTS.map((e) => (
                      <MenuItem key={e.id} id={e.id} textValue={e.name}>
                        <MenuItemLabel>{e.name}</MenuItemLabel>
                        <MenuItemDescription>{e.detail}</MenuItemDescription>
                      </MenuItem>
                    ))}
                  </MenuContent>
                </Popover>
              </MenuSub>
              <Separator />
              <MenuSub>
                <MenuItem>More models</MenuItem>
                <Popover>
                  <MenuContent
                    className="min-w-60"
                    selectionMode="single"
                    selectedKeys={[model]}
                    onSelectionChange={pick(setModel)}
                  >
                    {OLDER_MODELS.map((m) => (
                      <MenuItem key={m.id} id={m.id} textValue={m.name}>
                        <MenuItemLabel>{m.name}</MenuItemLabel>
                        <MenuItemDescription>{m.detail}</MenuItemDescription>
                      </MenuItem>
                    ))}
                  </MenuContent>
                </Popover>
              </MenuSub>
            </MenuContent>
          </ComposerMenu>
          <ComposerMenu
            value={`${MODES.find((m) => m.id === mode)?.name} permission mode`}
            label={MODES.find((m) => m.id === mode)?.name}
          >
            <MenuContent className="w-72">
              <MenuSection
                selectionMode="single"
                selectedKeys={[mode]}
                onSelectionChange={pick(setMode)}
              >
                <MenuSectionHeader>Permission mode</MenuSectionHeader>
                {MODES.map((m) => (
                  <MenuItem key={m.id} id={m.id} textValue={m.name}>
                    <MenuItemLabel>{m.name}</MenuItemLabel>
                    <MenuItemDescription>{m.detail}</MenuItemDescription>
                  </MenuItem>
                ))}
              </MenuSection>
            </MenuContent>
          </ComposerMenu>
        </div>
      </div>
    </form>
  )
}

// MARK: New chat

function PagePreview({ children }: { children: ReactNode }) {
  return (
    <div className="h-28 overflow-hidden border-b bg-muted px-5 pt-4">
      <div className="flex h-full flex-col gap-1.5 overflow-hidden rounded-t-(--studio-radius-item) border border-b-0 bg-bg p-3 text-[0.5rem] leading-tight text-fg-muted">
        {children}
      </div>
    </div>
  )
}

function Lines({ widths }: { widths: string[] }) {
  return (
    <div className="flex flex-col gap-1">
      {widths.map((width, index) => (
        <span
          key={index}
          className="h-1 rounded-(--studio-radius-track) bg-fg-muted/25"
          style={{ width }}
        />
      ))}
    </div>
  )
}

const RECENT_ARTIFACTS = [
  {
    title: "Fold position tracker",
    when: "12h ago",
    opensThread: true,
    preview: (
      <>
        <span className="text-[0.5625rem] font-medium text-fg">
          Team trial-to-paid by fold position
        </span>
        <div className="grid grid-cols-3 gap-1">
          {["5.4%", "3.6%", "61%"].map((value) => (
            <span
              key={value}
              className="rounded-(--studio-radius-detail) border px-1 py-0.5 font-medium text-fg tabular-nums"
            >
              {value}
            </span>
          ))}
        </div>
        {[92, 70, 86, 64].map((width, index) => (
          <span
            key={index}
            className="h-1 rounded-(--studio-radius-track) bg-primary"
            style={{ width: `${width}%` }}
          />
        ))}
      </>
    ),
  },
  {
    title: "Q3 retention memo for the board",
    when: "16h ago",
    preview: (
      <>
        <span className="font-heading text-[0.5625rem] font-medium text-fg">
          Q3 retention memo
        </span>
        <span>Oct 26, 2026 · Draft</span>
        <span className="font-medium text-fg">Summary</span>
        <Lines widths={["100%", "94%", "98%", "60%"]} />
      </>
    ),
  },
  {
    title: "Churn themes review",
    when: "Yesterday",
    preview: (
      <>
        <span className="text-[0.5625rem] font-medium text-fg">
          Churn themes, September
        </span>
        {[
          ["Renewal price", "32%"],
          ["Missing SSO", "24%"],
          ["Slow exports", "15%"],
          ["Other", "29%"],
        ].map(([label, value]) => (
          <span
            key={label}
            className="flex justify-between border-b pb-0.5 tabular-nums last:border-b-0"
          >
            <span>{label}</span>
            <span className="text-fg">{value}</span>
          </span>
        ))}
      </>
    ),
  },
]

function RecentArtifacts({ onOpenTracker }: { onOpenTracker: () => void }) {
  return (
    <section aria-labelledby="recent-artifacts" className="flex flex-col gap-2">
      <div className="flex items-center justify-between pl-1">
        <h2 id="recent-artifacts" className="text-sm text-fg-muted">
          Recent artifacts
        </h2>
        <Button variant="quiet" size="sm">
          View all
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {RECENT_ARTIFACTS.map((artifact, index) => (
          <button
            key={artifact.title}
            type="button"
            onClick={artifact.opensThread ? onOpenTracker : undefined}
            className={cn(
              "flex min-w-0 flex-col overflow-hidden rounded-(--studio-radius-card) border bg-card text-left font-sans transition-colors hover:bg-muted",
              index === 2 && "max-sm:hidden",
            )}
          >
            <PagePreview>{artifact.preview}</PagePreview>
            <span className="flex min-w-0 flex-col gap-0.5 px-3 py-2.5">
              <span className="truncate text-sm font-medium compact:text-xs">
                {artifact.title}
              </span>
              <span className="text-xs text-fg-muted">{artifact.when}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}

// MARK: Artifact

function ArtifactPreview() {
  return (
    <div className="flex flex-col gap-6 p-6 font-sans">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-lg font-medium">
          Team trial-to-paid by fold position
        </h2>
        <p className="text-sm text-fg-muted">
          pricing_plan_toggled · since Aug 14 · 2,418 sessions
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Visible on load", value: "5.4%" },
          { label: "Below the fold", value: "3.6%" },
          { label: "Sessions below", value: "61%" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-1 rounded-(--studio-radius-card) border p-3"
          >
            <span className="text-xs text-fg-muted">{stat.label}</span>
            <span className="text-xl font-medium tabular-nums">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 text-xs text-fg-muted">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-(--studio-radius-pill) bg-primary" />
            Visible
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-(--studio-radius-pill) bg-fg-muted/50" />
            Below the fold
          </span>
        </div>
        {DEVICES.map((device) => (
          <div key={device.name} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between text-sm">
              <span>{device.name}</span>
              <span className="text-xs text-fg-muted tabular-nums">
                {device.share}% below
              </span>
            </div>
            {[
              { value: device.visible, tone: "bg-primary" },
              { value: device.below, tone: "bg-fg-muted/50" },
            ].map((bar) => (
              <div key={bar.tone} className="flex items-center gap-2">
                <div className="h-2 flex-1 rounded-(--studio-radius-track) bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-(--studio-radius-track)",
                      bar.tone,
                    )}
                    style={{ width: `${(bar.value / 6) * 100}%` }}
                  />
                </div>
                <span className="w-9 text-right text-xs text-fg-muted tabular-nums">
                  {bar.value.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function ArtifactPanel({ onClose }: { onClose: () => void }) {
  const [view, setView] = useState<"preview" | "code">("preview")

  return (
    <aside
      aria-label="Artifact"
      className="flex min-h-0 min-w-0 flex-col border-l bg-bg max-lg:absolute max-lg:inset-0 max-lg:z-10 lg:w-[min(48%,40rem)] lg:shrink-0"
    >
      <header className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
        <SegmentedControl
          aria-label="Artifact view"
          selectedKeys={[view]}
          onSelectionChange={(keys) => {
            const [key] = [...keys]
            if (key) setView(key as "preview" | "code")
          }}
        >
          <SegmentedControlItem id="preview" aria-label="Preview">
            <EyeIcon />
          </SegmentedControlItem>
          <SegmentedControlItem id="code" aria-label="Code">
            <CodeIcon />
          </SegmentedControlItem>
        </SegmentedControl>
        <span className="min-w-0 truncate text-sm font-medium compact:text-xs">
          Fold position tracker
        </span>
        <div className="ml-auto flex shrink-0 items-center gap-1">
          <CopyAction text={ARTIFACT_SOURCE} />
          <IconAction label="Download">
            <DownloadIcon />
          </IconAction>
          <Button variant="secondary" size="sm" className="hidden sm:flex">
            Publish
          </Button>
          <IconAction label="Close" onPress={onClose}>
            <XIcon />
          </IconAction>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-auto">
        {view === "preview" ? (
          <ArtifactPreview />
        ) : (
          <pre className="py-4 font-mono text-xs leading-relaxed">
            <code className="grid grid-cols-[auto_1fr]">
              {ARTIFACT_SOURCE.split("\n").map((line, index) => (
                <span key={index} className="contents">
                  <span className="pr-4 pl-4 text-right text-fg-muted select-none">
                    {index + 1}
                  </span>
                  <span className="pr-4">{line || " "}</span>
                </span>
              ))}
            </code>
          </pre>
        )}
      </div>

      <footer className="flex h-11 shrink-0 items-center gap-1 border-t px-3 text-xs text-fg-muted">
        <IconAction label="Previous version">
          <ChevronLeftIcon />
        </IconAction>
        <span className="tabular-nums">Version 2 of 2</span>
        <IconAction label="Next version">
          <ChevronRightIcon />
        </IconAction>
        <span className="ml-auto">Last edited just now</span>
      </footer>
    </aside>
  )
}

// MARK: Sidebar

function SidebarSection({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <Collapsible defaultExpanded>
        <SidebarGroupLabel>
          <CollapsibleTrigger className="group/section flex items-center gap-1 transition-colors hover:text-fg [&_svg]:size-3.5">
            {label}
            <ChevronDownIcon className="transition-transform group-aria-[expanded=false]/section:-rotate-90" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsiblePanel>
          <SidebarMenu>{children}</SidebarMenu>
        </CollapsiblePanel>
      </Collapsible>
    </SidebarGroup>
  )
}

function ChatSidebar({
  chats,
  recents,
  activeChat,
  onSelectChat,
  onNewChat,
}: {
  chats: Record<string, Chat>
  recents: string[]
  activeChat: string | null
  onSelectChat: (chat: string) => void
  onNewChat: () => void
}) {
  // On phones the sidebar is a sheet: picking a chat closes it.
  const { setOpenMobile } = useSidebar()
  const select = (chat: string | null) => {
    setOpenMobile(false)
    if (chat) onSelectChat(chat)
    else onNewChat()
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex h-10 items-center gap-1">
          <SidebarTrigger />
          <span className="truncate font-heading text-xl font-medium text-fg group-data-[collapsible=icon]:hidden">
            <BrandName>Lumen</BrandName>
          </span>
          <SegmentedControl
            aria-label="Workspace"
            defaultSelectedKeys={["chat"]}
            className="ml-auto group-data-[collapsible=icon]:hidden"
          >
            <SegmentedControlItem id="chat" aria-label="Chat">
              <MessageSquareIcon />
            </SegmentedControlItem>
            <SegmentedControlItem id="code" aria-label="Code">
              <CodeIcon />
            </SegmentedControlItem>
          </SegmentedControl>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="New chat"
              isActive={activeChat === null}
              onPress={() => select(null)}
            >
              <PlusIcon />
              <span>New</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {NAV.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton tooltip={item.label}>
                <item.icon />
                <span className="flex min-w-0 items-center gap-2">
                  {item.label}
                  {item.badge && (
                    <Badge
                      size="sm"
                      className="group-data-[collapsible=icon]:hidden"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarSection label="Pinned">
          {PROJECTS.map((project) => (
            <SidebarMenuItem key={project.id}>
              <SidebarMenuButton>
                <project.icon className={project.tone} />
                <span>{project.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarSection>
        <SidebarSection label="Recents">
          {recents.map((id) => (
            <SidebarMenuItem key={id}>
              <SidebarMenuButton
                isActive={id === activeChat}
                onPress={() => select(id)}
              >
                <span>{chats[id]?.title}</span>
              </SidebarMenuButton>
              <Menu>
                <SidebarMenuAction showOnHover aria-label="Chat actions">
                  <MoreHorizontalIcon />
                </SidebarMenuAction>
                <Popover placement="bottom start">
                  <ChatMenu />
                </Popover>
              </Menu>
            </SidebarMenuItem>
          ))}
        </SidebarSection>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <Menu>
              <SidebarMenuButton>
                <Avatar size="sm" className="-ml-1">
                  <AvatarFallback>M</AvatarFallback>
                </Avatar>
                <span className="flex min-w-0 items-center gap-1">
                  <span className="truncate font-medium text-fg">Mehdi</span>
                  <span className="text-fg-muted">· Max</span>
                  <ChevronDownIcon className="size-3.5 shrink-0" />
                </span>
              </SidebarMenuButton>
              <Popover placement="top start" className="min-w-64">
                <MenuContent>
                  <MenuSection>
                    <MenuSectionHeader>mehdi@northwind.co</MenuSectionHeader>
                    <MenuItem textValue="Settings">
                      <SettingsIcon />
                      <MenuItemLabel>Settings</MenuItemLabel>
                      <Kbd className="ml-auto">⇧⌘,</Kbd>
                    </MenuItem>
                    <MenuItem>
                      <TimerIcon />
                      Usage
                    </MenuItem>
                    <MenuItem>
                      <GlobeIcon />
                      Language
                    </MenuItem>
                    <MenuItem>
                      <HelpCircleIcon />
                      Get help
                    </MenuItem>
                  </MenuSection>
                  <Separator />
                  <MenuItem>
                    <ListIcon />
                    View all plans
                  </MenuItem>
                  <MenuItem>
                    <MonitorIcon />
                    Get apps and extensions
                  </MenuItem>
                  <MenuItem>
                    <TagIcon />
                    Share guest passes
                  </MenuItem>
                  <MenuSub>
                    <MenuItem>
                      <InfoIcon />
                      Learn more
                    </MenuItem>
                    <Popover>
                      <MenuContent>
                        <MenuItem>About Lumen</MenuItem>
                        <MenuItem>Usage policy</MenuItem>
                        <MenuItem>Privacy policy</MenuItem>
                      </MenuContent>
                    </Popover>
                  </MenuSub>
                  <Separator />
                  <MenuItem textValue="Get API keys">
                    <CodeIcon />
                    <MenuItemLabel>Get API keys</MenuItemLabel>
                    <ExternalLinkIcon className="ml-auto" />
                  </MenuItem>
                  <Separator />
                  <MenuItem>
                    <LogOutIcon />
                    Log out
                  </MenuItem>
                </MenuContent>
              </Popover>
            </Menu>
            <Tooltip>
              <SidebarMenuAction aria-label="Get apps and extensions">
                <MonitorIcon />
              </SidebarMenuAction>
              <TooltipContent>Get apps and extensions</TooltipContent>
            </Tooltip>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

// MARK: Block

export default function AiChatBlock() {
  const [chats, setChats] = useState<Record<string, Chat>>(() =>
    Object.fromEntries(SEED_CHATS.map((chat) => [chat.id, chat])),
  )
  const [recents, setRecents] = useState(() => SEED_CHATS.map((c) => c.id))
  const [activeChat, setActiveChat] = useState<string | null>(MAIN_CHAT)
  // The chat waiting on a reply. Replies land in their own chat, so leaving
  // one mid-reply is safe, as on claude.ai.
  const [pendingChat, setPendingChat] = useState<string | null>(null)
  const [draft, setDraft] = useState(EMPTY_DRAFT)
  const [artifactOpen, setArtifactOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const newChats = useRef(0)

  const chat = activeChat ? chats[activeChat] : undefined
  const isPending = pendingChat !== null && pendingChat === activeChat

  useEffect(() => {
    if (!pendingChat) return
    const timer = setTimeout(() => {
      setChats((current) => {
        const target = current[pendingChat]
        if (!target) return current
        const replies = target.messages.filter((m) => m.role === "assistant")
        const blocks =
          pendingChat === MAIN_CHAT
            ? (FOLLOW_UPS[replies.length % FOLLOW_UPS.length] ?? GENERIC_REPLY)
            : GENERIC_REPLY
        const reply: ChatMessage = {
          id: `${pendingChat}-${target.messages.length}-${Date.now()}`,
          role: "assistant",
          blocks,
        }
        return {
          ...current,
          [pendingChat]: { ...target, messages: [...target.messages, reply] },
        }
      })
      setPendingChat(null)
    }, 1600)
    return () => clearTimeout(timer)
  }, [pendingChat])

  const updateMessages = (
    id: string,
    update: (messages: ChatMessage[]) => ChatMessage[],
  ) =>
    setChats((current) => {
      const target = current[id]
      if (!target) return current
      return {
        ...current,
        [id]: { ...target, messages: update(target.messages) },
      }
    })

  const send = () => {
    if (isPending) return setPendingChat(null)
    const text = draft.toString().trim()
    if (!text) return
    let id = activeChat
    if (!id) {
      newChats.current += 1
      id = `new-${newChats.current}`
      const created: Chat = { id, title: chatTitle(text), messages: [] }
      setChats((current) => ({ ...current, [created.id]: created }))
      setRecents((current) => [created.id, ...current])
      setActiveChat(id)
    }
    updateMessages(id, (messages) => [
      ...messages,
      {
        id: `${id}-${messages.length}-${Date.now()}`,
        role: "user",
        blocks: [{ kind: "text", content: text }],
      },
    ])
    setDraft(EMPTY_DRAFT)
    setPendingChat(id)
  }

  const editMessage = (messageId: string, text: string) => {
    if (!activeChat) return
    updateMessages(activeChat, (messages) => {
      const index = messages.findIndex((m) => m.id === messageId)
      return messages
        .slice(0, index + 1)
        .map((m) =>
          m.id === messageId
            ? { ...m, blocks: [{ kind: "text", content: text }] }
            : m,
        )
    })
    setPendingChat(activeChat)
  }

  const retry = () => {
    if (!activeChat) return
    updateMessages(activeChat, (messages) => messages.slice(0, -1))
    setPendingChat(activeChat)
  }

  const openChat = (id: string | null) => {
    setActiveChat(id)
    setDraft(EMPTY_DRAFT)
    setArtifactOpen(false)
  }

  const openArtifact = () => {
    setArtifactOpen(true)
    // The artifact takes the room the chat list was using.
    setSidebarOpen(false)
  }

  const composer = (
    <Composer
      draft={draft}
      onDraftChange={setDraft}
      onSend={send}
      isPending={isPending}
      placeholder={chat ? "Reply…" : "How can I help you today?"}
      showProject={!chat}
    />
  )

  return (
    <div className="min-h-screen bg-bg text-fg">
      <SidebarProvider
        className="h-svh min-h-svh"
        isOpen={sidebarOpen}
        onOpenChange={setSidebarOpen}
      >
        <ChatSidebar
          chats={chats}
          recents={recents}
          activeChat={activeChat}
          onSelectChat={openChat}
          onNewChat={() => openChat(null)}
        />

        <SidebarInset className="relative flex h-svh min-h-0 flex-row overflow-hidden">
          <main className="flex min-h-0 min-w-0 flex-1 flex-col">
            <header className="flex h-12 shrink-0 items-center gap-1 px-2 sm:px-3">
              <SidebarTrigger className="md:hidden" />
              {chat ? (
                <>
                  <Menu>
                    <Button variant="quiet" size="sm" className="min-w-0">
                      <span className="truncate">{chat.title}</span>
                      <ChevronDownIcon />
                    </Button>
                    <Popover placement="bottom start">
                      <ChatMenu />
                    </Popover>
                  </Menu>
                  <Button variant="secondary" size="sm" className="ml-auto">
                    Share
                  </Button>
                </>
              ) : (
                <IconAction label="Incognito chat" className="ml-auto">
                  <EyeOffIcon />
                </IconAction>
              )}
            </header>

            {chat ? (
              <>
                <MessageScrollerProvider
                  key={chat.id}
                  autoScroll
                  defaultScrollPosition="end"
                >
                  <MessageScroller className="min-h-0 flex-1">
                    <MessageScrollerViewport className="px-4 sm:px-6">
                      <MessageScrollerContent className="mx-auto w-full max-w-2xl pt-4 pb-8 text-sm compact:text-xs">
                        {chat.messages.map((message, index) => (
                          <MessageScrollerItem
                            key={message.id}
                            messageId={message.id}
                            scrollAnchor={message.role === "user"}
                          >
                            {message.role === "user" ? (
                              <UserTurn
                                message={message}
                                onEdit={(text) => editMessage(message.id, text)}
                              />
                            ) : (
                              <AssistantTurn
                                message={message}
                                isLast={
                                  index === chat.messages.length - 1 &&
                                  !isPending
                                }
                                artifactOpen={artifactOpen}
                                onOpenArtifact={openArtifact}
                                onRetry={retry}
                              />
                            )}
                          </MessageScrollerItem>
                        ))}
                        {isPending && (
                          <MessageScrollerItem>
                            <AssistantMark className="size-7 animate-pulse" />
                            <span className="sr-only">Thinking…</span>
                          </MessageScrollerItem>
                        )}
                      </MessageScrollerContent>
                    </MessageScrollerViewport>
                    <MessageScrollerButton />
                  </MessageScroller>
                </MessageScrollerProvider>
                <div className="shrink-0 px-4 pb-3 sm:px-6">
                  <div className="mx-auto max-w-2xl">{composer}</div>
                </div>
              </>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 sm:px-6">
                <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-8 pt-8 pb-12">
                  <h1 className="flex items-center justify-center gap-3 text-center font-heading text-3xl font-normal tracking-tight sm:text-4xl">
                    <AssistantMark className="size-9" />
                    {greeting()}, Mehdi
                  </h1>
                  {composer}
                  <RecentArtifacts
                    onOpenTracker={() => {
                      openChat(MAIN_CHAT)
                      openArtifact()
                    }}
                  />
                </div>
              </div>
            )}
          </main>

          {artifactOpen && chat?.id === MAIN_CHAT && (
            <ArtifactPanel onClose={() => setArtifactOpen(false)} />
          )}
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
