import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"

import {
  ArrowUpIcon,
  BookOpenIcon,
  BoxesIcon,
  CameraIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  ClockIcon,
  CodeIcon,
  CopyIcon,
  CreditCardIcon,
  ServerIcon,
  DownloadIcon,
  EyeIcon,
  FolderIcon,
  GlobeIcon,
  HelpCircleIcon,
  LogOutIcon,
  MessageSquareIcon,
  PenSquareIcon,
  PencilIcon,
  PlusIcon,
  RotateCcwIcon,
  SettingsIcon,
  Settings2Icon,
  SmileIcon,
  SparklesIcon,
  PauseIcon,
  StarIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Trash2Icon,
  UploadIcon,
  XIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Bubble, BubbleContent } from "@/registry/ui/bubble"
import { Button } from "@/registry/ui/button"
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/registry/ui/collapsible"
import { Dialog, DialogContent } from "@/registry/ui/dialog"
import { InputGroup, InputGroupAddon, TextArea } from "@/registry/ui/input"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuItemDescription,
  MenuItemLabel,
  MenuSection,
  MenuSectionHeader,
} from "@/registry/ui/menu"
import { Message, MessageContent } from "@/registry/ui/message"
import { Popover } from "@/registry/ui/popover"
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
} from "@/registry/ui/sidebar"
import { Switch, SwitchControl, SwitchIndicator } from "@/registry/ui/switch"
import { ToggleButton } from "@/registry/ui/toggle-button"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"
import { BrandMark, BrandName } from "@/modules/studio/assets/brand"

// A claude.ai-style assistant: a quiet sidebar of chats, a centered reading
// column with no assistant chrome, thinking and tool-use disclosures, and an
// artifact that opens in a side panel with Preview and Code views.

type Block =
  | { kind: "text"; content: ReactNode }
  | { kind: "thinking"; seconds: number; content: string }
  | { kind: "queries"; items: { table: string; detail: string }[] }
  | { kind: "table"; head: string[]; rows: string[][] }
  | { kind: "artifact" }

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  blocks: Block[]
}

const THREAD: ChatMessage[] = [
  {
    id: "m1",
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
    id: "m2",
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
        content: (
          <>
            <strong>The release is the likelier cause.</strong> The drop is
            isolated to the Team plan, the one card the new layout pushed below
            the fold.
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
    id: "m3",
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
    id: "m4",
    role: "assistant",
    blocks: [
      {
        kind: "text",
        content: (
          <>
            Here it is. It reads the <code>pricing_plan_toggled</code> event you
            shipped on Tuesday and splits Team sessions by where the card first
            rendered.
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

const MODELS = [
  { id: "atlas", name: "Atlas 4", detail: "For complex, multi-step work" },
  {
    id: "meridian",
    name: "Meridian 4",
    detail: "Smart, efficient for every day",
  },
  { id: "swift", name: "Swift 4", detail: "Fastest for quick answers" },
]

const STARRED = ["Q3 retention memo for the board", "Pricing experiments"]

const THREAD_TITLE = "Trial-to-paid drop after pricing release"

const RECENTS = [
  THREAD_TITLE,
  "Billing webhook retries",
  "Churn themes in support tickets",
  "Cohort retention SQL",
  "Fee model: Stripe vs Paddle",
  "Onboarding email rewrite",
  "Hiring plan for growth team",
  "Board deck outline",
]

const QUICK_STARTS = [
  { icon: PenSquareIcon, label: "Write" },
  { icon: BookOpenIcon, label: "Learn" },
  { icon: CodeIcon, label: "Code" },
  { icon: SmileIcon, label: "Life stuff" },
  { icon: SparklesIcon, label: "Surprise me" },
]

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

function ChatMenu() {
  return (
    <MenuContent className="min-w-48">
      <MenuItem>
        <StarIcon />
        Star
      </MenuItem>
      <MenuItem>
        <PencilIcon />
        Rename
      </MenuItem>
      <MenuItem>
        <FolderIcon />
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

function IconAction({
  label,
  children,
  onPress,
}: {
  label: string
  children: ReactNode
  onPress?: () => void
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

function plainText(blocks: Block[]) {
  return blocks
    .map((block) => (block.kind === "text" ? block.content : null))
    .filter((content): content is string => typeof content === "string")
    .join("\n\n")
}

function ThreadMessage({
  message,
  isLast,
  artifactOpen,
  onOpenArtifact,
}: {
  message: ChatMessage
  isLast: boolean
  artifactOpen: boolean
  onOpenArtifact: () => void
}) {
  if (message.role === "user") {
    const text = plainText(message.blocks)
    return (
      <Message align="end" className="group/turn">
        <MessageContent className="items-end">
          <Bubble align="end" variant="muted" className="max-w-[85%]">
            <BubbleContent>
              <p className="text-pretty">{text}</p>
            </BubbleContent>
          </Bubble>
          <div className="flex items-center gap-0.5 text-fg-muted opacity-0 transition-opacity group-focus-within/turn:opacity-100 group-hover/turn:opacity-100">
            <IconAction label="Edit">
              <PencilIcon />
            </IconAction>
            <CopyAction text={text} />
          </div>
        </MessageContent>
      </Message>
    )
  }

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
        <div className="-ml-2 flex items-center gap-0.5 text-fg-muted">
          <CopyAction text={plainText(message.blocks)} />
          <IconAction label="Good response">
            <ThumbsUpIcon />
          </IconAction>
          <IconAction label="Bad response">
            <ThumbsDownIcon />
          </IconAction>
          <IconAction label="Retry">
            <RotateCcwIcon />
          </IconAction>
        </div>
        {isLast && <AssistantMark />}
      </MessageContent>
    </Message>
  )
}

function AssistantMark({ className }: { className?: string }) {
  return (
    <BrandMark className={cn("size-7", className)}>
      <SparklesIcon className={cn("size-6 text-primary", className)} />
    </BrandMark>
  )
}

function Composer({
  draft,
  onDraftChange,
  onSend,
  isThinking,
  placeholder,
}: {
  draft: string
  onDraftChange: (draft: string) => void
  onSend: () => void
  isThinking: boolean
  placeholder: string
}) {
  const [model, setModel] = useState("meridian")
  const [extendedThinking, setExtendedThinking] = useState(true)
  const modelName = MODELS.find((m) => m.id === model)?.name

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSend()
      }}
      className="w-full min-w-0"
    >
      <InputGroup>
        <TextArea
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          placeholder={placeholder}
          aria-label="Message"
          className="min-h-14"
          onKeyDown={(e) => {
            if (
              e.defaultPrevented ||
              e.key !== "Enter" ||
              e.shiftKey ||
              e.nativeEvent.isComposing
            )
              return
            e.preventDefault()
            e.currentTarget.form?.requestSubmit()
          }}
        />
        <InputGroupAddon>
          <div className="flex min-w-0 items-center gap-1">
            <Menu>
              <Button
                variant="secondary"
                size="sm"
                isIconOnly
                aria-label="Add content"
              >
                <PlusIcon />
              </Button>
              <Popover placement="top start">
                <MenuContent className="min-w-56">
                  <MenuItem>
                    <UploadIcon />
                    Add files or photos
                  </MenuItem>
                  <MenuItem>
                    <CameraIcon />
                    Take a screenshot
                  </MenuItem>
                  <MenuItem>
                    <FolderIcon />
                    Add to project
                  </MenuItem>
                </MenuContent>
              </Popover>
            </Menu>
            <Dialog>
              <Button
                variant="secondary"
                size="sm"
                isIconOnly
                aria-label="Search and tools"
              >
                <Settings2Icon />
              </Button>
              <Popover placement="top start">
                <DialogContent className="w-64 gap-1 p-1.5">
                  {[
                    { icon: GlobeIcon, label: "Web search", on: true },
                    { icon: ServerIcon, label: "Warehouse", on: true },
                    { icon: BookOpenIcon, label: "Research", on: false },
                  ].map((tool) => (
                    <Switch
                      key={tool.label}
                      defaultSelected={tool.on}
                      className="w-full justify-between gap-3 rounded-(--studio-radius-item) px-2 py-1.5 text-sm hover:bg-muted compact:text-xs"
                    >
                      <span className="flex items-center gap-2 [&_svg]:size-4 [&_svg]:text-fg-muted">
                        <tool.icon />
                        {tool.label}
                      </span>
                      <SwitchControl>
                        <SwitchIndicator />
                      </SwitchControl>
                    </Switch>
                  ))}
                </DialogContent>
              </Popover>
            </Dialog>
            <Tooltip>
              <ToggleButton
                variant="secondary"
                size="sm"
                isIconOnly
                aria-label="Extended thinking"
                isSelected={extendedThinking}
                onChange={setExtendedThinking}
              >
                <ClockIcon />
              </ToggleButton>
              <TooltipContent>
                Extended thinking {extendedThinking ? "on" : "off"}
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-1">
            <Menu>
              <Button variant="quiet" size="sm">
                {modelName}
                <ChevronDownIcon />
              </Button>
              <Popover placement="top end">
                <MenuContent
                  className="min-w-64"
                  selectionMode="single"
                  selectedKeys={[model]}
                  onSelectionChange={(keys) => {
                    const [key] = keys === "all" ? [] : [...keys]
                    if (key) setModel(String(key))
                  }}
                >
                  {MODELS.map((m) => (
                    <MenuItem key={m.id} id={m.id} textValue={m.name}>
                      <MenuItemLabel>{m.name}</MenuItemLabel>
                      <MenuItemDescription>{m.detail}</MenuItemDescription>
                    </MenuItem>
                  ))}
                </MenuContent>
              </Popover>
            </Menu>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isIconOnly
              aria-label={isThinking ? "Stop response" : "Send message"}
              isDisabled={!isThinking && !draft.trim()}
            >
              {isThinking ? <PauseIcon /> : <ArrowUpIcon />}
            </Button>
          </div>
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}

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
            <span className="size-2 rounded-full bg-primary" />
            Visible
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-fg-muted/50" />
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
          <pre className="p-4 font-mono text-xs leading-relaxed">
            <code>{ARTIFACT_SOURCE}</code>
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

function ChatSidebar({
  activeChat,
  onSelectChat,
  onNewChat,
}: {
  activeChat: string | null
  onSelectChat: (chat: string) => void
  onNewChat: () => void
}) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="pointer-events-none">
              <AssistantMark className="size-5" />
              <span className="truncate font-heading text-lg font-medium text-fg">
                <BrandName>Lumen</BrandName>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="New chat"
              isActive={activeChat === null}
              onPress={onNewChat}
            >
              <span className="flex size-5 shrink-0 items-center justify-center rounded-(--studio-radius-pill) bg-primary text-fg-on-primary">
                <PlusIcon className="size-3.5" />
              </span>
              <span className="font-medium">New chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {[
            { icon: MessageSquareIcon, label: "Chats" },
            { icon: FolderIcon, label: "Projects" },
            { icon: BoxesIcon, label: "Artifacts" },
          ].map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton tooltip={item.label}>
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {[
          { label: "Starred", items: STARRED },
          { label: "Recents", items: RECENTS },
        ].map((group) => (
          <SidebarGroup
            key={group.label}
            className="group-data-[collapsible=icon]:hidden"
          >
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item}>
                  <SidebarMenuButton
                    isActive={item === activeChat}
                    onPress={() => onSelectChat(item)}
                  >
                    <span className="truncate">{item}</span>
                  </SidebarMenuButton>
                  <Menu>
                    <SidebarMenuAction showOnHover aria-label="Chat actions">
                      <ChevronDownIcon />
                    </SidebarMenuAction>
                    <Popover placement="bottom start">
                      <ChatMenu />
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
                <Avatar size="sm">
                  <AvatarFallback>MB</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col gap-0.5 leading-none">
                  <span className="truncate font-medium text-fg">
                    Mehdi Benhadjali
                  </span>
                  <span className="truncate text-xs">Pro plan</span>
                </div>
                <ChevronsUpDownIcon className="ml-auto" />
              </SidebarMenuButton>
              <Popover placement="top" className="w-(--trigger-width)">
                <MenuContent>
                  <MenuSection>
                    <MenuSectionHeader>mehdi@northwind.co</MenuSectionHeader>
                    <MenuItem>
                      <SettingsIcon />
                      Settings
                    </MenuItem>
                    <MenuItem>
                      <CreditCardIcon />
                      Upgrade plan
                    </MenuItem>
                    <MenuItem>
                      <HelpCircleIcon />
                      Get help
                    </MenuItem>
                  </MenuSection>
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
  )
}

export default function AiChatBlock() {
  const [activeChat, setActiveChat] = useState<string | null>(THREAD_TITLE)
  const [messages, setMessages] = useState(THREAD)
  const [draft, setDraft] = useState("")
  const [isThinking, setThinking] = useState(false)
  const [replies, setReplies] = useState(0)
  const [artifactOpen, setArtifactOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, isThinking, activeChat])

  useEffect(() => {
    if (!isThinking) return
    const timer = setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: `a${current.length}`,
          role: "assistant",
          blocks: FOLLOW_UPS[replies % FOLLOW_UPS.length] ?? [],
        },
      ])
      setReplies((count) => count + 1)
      setThinking(false)
    }, 1600)
    return () => clearTimeout(timer)
  }, [isThinking, replies])

  const send = () => {
    if (isThinking) return setThinking(false)
    const text = draft.trim()
    if (!text) return
    setMessages((current) => [
      ...current,
      {
        id: `u${current.length}`,
        role: "user",
        blocks: [{ kind: "text", content: text }],
      },
    ])
    setDraft("")
    setThinking(true)
    if (activeChat === null) setActiveChat(THREAD_TITLE)
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
      isThinking={isThinking}
      placeholder={activeChat ? "Reply…" : "How can I help you today?"}
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
          activeChat={activeChat}
          onSelectChat={setActiveChat}
          onNewChat={() => {
            setActiveChat(null)
            setArtifactOpen(false)
          }}
        />

        <SidebarInset className="relative flex h-svh min-h-0 flex-row overflow-hidden">
          <main className="flex min-h-0 min-w-0 flex-1 flex-col">
            <header className="flex h-12 shrink-0 items-center gap-1 px-2 sm:px-3">
              <SidebarTrigger />
              {activeChat && (
                <>
                  <Menu>
                    <Button variant="quiet" size="sm" className="min-w-0">
                      <span className="truncate">{activeChat}</span>
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
              )}
            </header>

            {activeChat ? (
              <>
                <div
                  ref={scrollRef}
                  role="log"
                  className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6"
                >
                  <div className="mx-auto flex max-w-2xl flex-col gap-6 pt-4 pb-8 text-sm compact:text-xs">
                    {messages.map((message, index) => (
                      <ThreadMessage
                        key={message.id}
                        message={message}
                        isLast={index === messages.length - 1 && !isThinking}
                        artifactOpen={artifactOpen}
                        onOpenArtifact={openArtifact}
                      />
                    ))}
                    {isThinking && (
                      <div className="flex items-center gap-2 font-sans text-fg-muted">
                        <AssistantMark className="size-5 animate-pulse" />
                        Thinking…
                      </div>
                    )}
                  </div>
                </div>
                <div className="shrink-0 px-4 pb-3 sm:px-6">
                  <div className="mx-auto flex max-w-2xl flex-col gap-2">
                    {composer}
                    <p className="text-center text-xs text-fg-muted">
                      <BrandName>Lumen</BrandName> can make mistakes. Please
                      double-check responses.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-8 overflow-y-auto px-4 pb-16 sm:px-6">
                <h1 className="flex items-center gap-3 text-center font-heading text-3xl font-normal tracking-tight">
                  <AssistantMark className="size-8" />
                  {greeting()}, Mehdi
                </h1>
                <div className="flex w-full max-w-2xl flex-col gap-4">
                  {composer}
                  <div className="flex flex-wrap justify-center gap-2">
                    {QUICK_STARTS.map((item) => (
                      <Button
                        key={item.label}
                        variant="secondary"
                        size="sm"
                        onPress={() => setDraft(`${item.label}: `)}
                      >
                        <item.icon />
                        {item.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>

          {artifactOpen && activeChat && (
            <ArtifactPanel onClose={() => setArtifactOpen(false)} />
          )}
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
