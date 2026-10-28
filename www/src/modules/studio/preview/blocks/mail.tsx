import { useRef, useState } from "react"
import type { KeyboardEvent, ReactNode } from "react"

import {
  ArrowLeftIcon,
  CheckIcon,
  ClockIcon,
  ExternalLinkIcon,
  FileTextIcon,
  ImageIcon,
  LinkIcon,
  LogOutIcon,
  MailIcon,
  MapIcon,
  MoreHorizontalIcon,
  PaperclipIcon,
  SearchIcon,
  SendIcon,
  SettingsIcon,
  SparklesIcon,
  SquarePenIcon,
  StarIcon,
  TagIcon,
  Trash2Icon,
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
import { Input, TextArea } from "@/registry/ui/input"
import { Kbd } from "@/registry/ui/kbd"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSection,
  MenuSectionHeader,
} from "@/registry/ui/menu"
import { Modal } from "@/registry/ui/modal"
import { Popover } from "@/registry/ui/popover"
import { Separator } from "@/registry/ui/separator"
import { Sheet } from "@/registry/ui/sheet"
import { Tab, TabList, Tabs } from "@/registry/ui/tabs"
import { TextField } from "@/registry/ui/text-field"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"
import { BrandMark, BrandName } from "@/modules/studio/assets/brand"

import { initials } from "./shared"

// A Superhuman-style inbox: split inbox tabs over single-line rows, hover
// actions with their shortcuts, keyboard triage (j/k, Enter, E, H), and a
// conversation view with the sender's profile and instant replies.

interface ThreadEntry {
  from: string
  time: string
  paragraphs: string[]
}

interface Conversation {
  id: string
  from: string
  subject: string
  preview: string
  time: string
  unread?: boolean
  labels?: string[]
  attachments?: { name: string; meta: string; kind: "doc" | "image" }[]
  count?: number
}

const ME = "Maya Okonkwo"

const SPLITS = [
  { id: "important", name: "Important" },
  { id: "other", name: "Other", count: 34 },
  { id: "calendar", name: "Calendar", count: 2 },
  { id: "team", name: "Team", count: 5 },
  { id: "news", name: "News", count: 11 },
]

const INBOX: Conversation[] = [
  {
    id: "tokens",
    from: "Priya Raghavan",
    subject: "Design tokens: naming freeze before v3.0",
    preview:
      "We're two renames away from a stable surface. Can we lock the semantic layer on Thursday?",
    time: "9:41 AM",
    unread: true,
    labels: ["Design system"],
    attachments: [
      { name: "tokens-v3-draft.pdf", meta: "PDF · 1.2 MB", kind: "doc" },
      { name: "semantic-map.png", meta: "PNG · 480 KB", kind: "image" },
    ],
    count: 3,
  },
  {
    id: "offer",
    from: "Daniel Osei",
    subject: "Offer: Senior Product Designer",
    preview:
      "Final numbers attached. Legal signed off this morning, so it can go out today.",
    time: "9:12 AM",
    unread: true,
    labels: ["Recruiting"],
    attachments: [{ name: "offer-letter.pdf", meta: "PDF", kind: "doc" }],
  },
  {
    id: "launch",
    from: "Hannah Weiss",
    subject: "Re: Q4 launch checklist",
    preview:
      "Added the status page item and moved the press embargo to the 12th.",
    time: "8:05 AM",
    unread: true,
    count: 4,
  },
  {
    id: "incident",
    from: "Marco Bellini",
    subject: "Incident review: checkout latency on Oct 24",
    preview:
      "Root cause was the connection pool. The doc is ready for comments before Friday's review.",
    time: "Yesterday",
    labels: ["Incidents"],
  },
  {
    id: "coffee",
    from: "Aiko Tanaka",
    subject: "Coffee next week?",
    preview:
      "I'm in Lisbon from the 4th to the 8th and would love to catch up.",
    time: "Yesterday",
  },
  {
    id: "contract",
    from: "Sam Rivera",
    subject: "Contract redlines from Northwind",
    preview:
      "Two open points left: the liability cap and the renewal notice period.",
    time: "Oct 26",
    attachments: [{ name: "msa-redlines.docx", meta: "DOCX", kind: "doc" }],
  },
  {
    id: "interviews",
    from: "Lena Fischer",
    subject: "Customer interview notes, round 3",
    preview:
      "Six calls this round. The theme is clear: teams want to export straight into their repo.",
    time: "Oct 26",
    labels: ["Research"],
  },
  {
    id: "offsite",
    from: "Tom Okafor",
    subject: "Re: Offsite agenda",
    preview:
      "Locked the venue. Thursday afternoon is open for the roadmap session.",
    time: "Oct 25",
    count: 6,
  },
  {
    id: "board",
    from: "Nadia Petrova",
    subject: "Board deck: final numbers",
    preview:
      "Updated the ARR slide with the October close. One open question on how we define churn.",
    time: "Oct 24",
  },
  {
    id: "limits",
    from: "Jonas Berg",
    subject: "Re: API rate limits for enterprise",
    preview:
      "They're fine with 600 requests a minute if we allow bursts. Can we commit to a date?",
    time: "Oct 24",
    count: 3,
  },
  {
    id: "talk",
    from: "Elena Cruz",
    subject: "Your talk in Lisbon is confirmed",
    preview: "You're on Thursday at 11:20. We'll need slides by the 30th.",
    time: "Oct 23",
    labels: ["Events"],
  },
  {
    id: "pricing",
    from: "Ravi Mehta",
    subject: "Quick question on the pricing page",
    preview:
      "Is the Team plan meant to include SSO? The page and the docs disagree.",
    time: "Oct 23",
  },
  {
    id: "review",
    from: "Grace Liu",
    subject: "Re: Design review notes",
    preview:
      "Agree on the empty states. I'm pushing the motion pass to next sprint.",
    time: "Oct 22",
    count: 2,
  },
]

const THREAD: ThreadEntry[] = [
  {
    from: "Priya Raghavan",
    time: "Mon, Oct 26, 4:18 PM",
    paragraphs: [
      "Kicking off the 3.0 token review. Draft attached; the short version is that the semantic layer is nearly settled.",
    ],
  },
  {
    from: ME,
    time: "Mon, Oct 26, 6:02 PM",
    paragraphs: [
      "Thanks, Priya. What's still open? I'd like to give consumers a date before the planning cycle.",
    ],
  },
  {
    from: "Priya Raghavan",
    time: "9:41 AM",
    paragraphs: [
      "Morning! The audit is done and we're down to two renames: surface-raised becomes card, and text-secondary becomes fg-muted.",
      "Everything else in the 3.0 draft is additive, so consumers upgrade with a codemod and nothing breaks at runtime. Daniel has the codemod working against the dashboard repo already.",
      "Can we lock the semantic layer on Thursday? If so I'll announce the freeze in #design-system this afternoon.",
    ],
  },
]

const INSTANT_REPLIES = [
  "Thursday works, let's lock it.",
  "Can we push the freeze to Monday?",
  "Looping in Daniel for the codemod.",
]

const PROFILE = {
  name: "Priya Raghavan",
  role: "Design Systems Lead at Sable",
  email: "priya@sablecloud.io",
  location: "Lisbon · 2:41 PM local",
  link: "priya.design",
  recent: [
    "Token audit kickoff",
    "Figma library permissions",
    "Re: Icon set licensing",
  ],
}

const SHORTCUTS = [
  { keys: ["J", "K"], label: "Move" },
  { keys: ["↵"], label: "Open" },
  { keys: ["E"], label: "Done" },
  { keys: ["H"], label: "Remind" },
  { keys: ["S"], label: "Star" },
]

function Shortcut({ keys, label }: { keys: string[]; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="flex gap-0.5">
        {keys.map((key) => (
          <Kbd key={key}>{key}</Kbd>
        ))}
      </span>
      {label}
    </span>
  )
}

function RowAction({
  label,
  shortcut,
  onPress,
  children,
}: {
  label: string
  shortcut: string
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
        <Kbd>{shortcut}</Kbd>
      </TooltipContent>
    </Tooltip>
  )
}

function RemindMenu({
  children,
  onRemind,
}: {
  children: ReactNode
  onRemind: () => void
}) {
  return (
    <Menu>
      {children}
      <Popover placement="bottom end">
        <MenuContent className="min-w-56" onAction={onRemind}>
          <MenuSection>
            <MenuSectionHeader>Remind me</MenuSectionHeader>
            {[
              ["later", "Later today", "6:00 PM"],
              ["tomorrow", "Tomorrow", "Thu 8:00 AM"],
              ["weekend", "This weekend", "Sat 9:00 AM"],
              ["next-week", "Next week", "Mon 8:00 AM"],
            ].map(([id, label, when]) => (
              <MenuItem key={id} id={id} textValue={label}>
                {label}
                <span className="ml-auto text-fg-muted tabular-nums">
                  {when}
                </span>
              </MenuItem>
            ))}
          </MenuSection>
        </MenuContent>
      </Popover>
    </Menu>
  )
}

function ConversationRow({
  conversation,
  isFocused,
  isStarred,
  onFocus,
  onOpen,
  onDone,
  onStar,
}: {
  conversation: Conversation
  isFocused: boolean
  isStarred: boolean
  onFocus: () => void
  onOpen: () => void
  onDone: () => void
  onStar: () => void
}) {
  return (
    <li
      className={cn(
        "group/row relative flex items-center border-b border-border/60",
        isFocused && "bg-muted",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-0 left-0 w-0.5 bg-primary opacity-0",
          isFocused && "opacity-100",
        )}
      />
      <button
        type="button"
        data-row=""
        onClick={onOpen}
        onFocus={onFocus}
        onMouseEnter={onFocus}
        className="flex h-11 w-full min-w-0 items-center gap-4 pr-4 pl-5 text-left text-sm outline-none sm:pl-8 compact:h-9 compact:text-xs"
      >
        <span
          className={cn(
            "w-28 shrink-0 truncate sm:w-40",
            conversation.unread ? "font-semibold text-fg" : "text-fg-muted",
          )}
        >
          {conversation.from}
          {conversation.count && (
            <span className="ml-1.5 font-normal text-fg-muted">
              {conversation.count}
            </span>
          )}
        </span>
        <span className="flex min-w-0 flex-1 items-center gap-2">
          {conversation.labels?.map((label) => (
            <Badge
              key={label}
              size="sm"
              variant="neutral"
              className="hidden shrink-0 md:inline-flex"
            >
              {label}
            </Badge>
          ))}
          <span className="min-w-0 truncate">
            <span
              className={cn(
                conversation.unread ? "font-medium text-fg" : "text-fg",
              )}
            >
              {conversation.subject}
            </span>
            <span className="ml-2 hidden text-fg-muted sm:inline">
              {conversation.preview}
            </span>
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-2 text-xs text-fg-muted tabular-nums group-hover/row:invisible">
          {isStarred && <StarIcon className="size-3.5 text-fg-warning" />}
          {conversation.attachments && <PaperclipIcon className="size-3.5" />}
          <span className="w-16 text-right">{conversation.time}</span>
        </span>
      </button>
      <div className="invisible absolute right-3 flex items-center gap-0.5 group-hover/row:visible">
        <RowAction label="Mark done" shortcut="E" onPress={onDone}>
          <CheckIcon />
        </RowAction>
        <RemindMenu onRemind={onDone}>
          <Button variant="quiet" size="sm" isIconOnly aria-label="Remind me">
            <ClockIcon />
          </Button>
        </RemindMenu>
        <RowAction
          label={isStarred ? "Unstar" : "Star"}
          shortcut="S"
          onPress={onStar}
        >
          <StarIcon className={cn(isStarred && "text-fg-warning")} />
        </RowAction>
      </div>
    </li>
  )
}

function ThreadMessage({
  entry,
  isExpanded,
  onExpand,
}: {
  entry: ThreadEntry
  isExpanded: boolean
  onExpand: () => void
}) {
  if (!isExpanded) {
    return (
      <button
        type="button"
        onClick={onExpand}
        className="flex w-full items-center gap-3 border-b py-3 text-left text-sm hover:bg-muted compact:text-xs"
      >
        <span className="w-32 shrink-0 truncate font-medium">
          {entry.from === ME ? "Me" : entry.from}
        </span>
        <span className="min-w-0 flex-1 truncate text-fg-muted">
          {entry.paragraphs[0]}
        </span>
        <span className="shrink-0 text-xs text-fg-muted">{entry.time}</span>
      </button>
    )
  }
  return (
    <article className="flex flex-col gap-4 border-b py-5">
      <header className="flex items-center gap-3">
        <Avatar size="sm">
          <AvatarFallback>{initials(entry.from)}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium compact:text-xs">
            {entry.from}
          </span>
          <span className="truncate text-xs text-fg-muted">
            to {entry.from === ME ? "Priya" : "me"}
          </span>
        </div>
        <span className="shrink-0 text-xs text-fg-muted">{entry.time}</span>
      </header>
      <div className="flex flex-col gap-3 text-sm/relaxed text-pretty compact:text-xs/relaxed">
        {entry.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </article>
  )
}

function Attachments({
  items,
}: {
  items: NonNullable<Conversation["attachments"]>
}) {
  return (
    <div className="flex flex-wrap gap-2 py-4">
      {items.map((file) => {
        const Icon = file.kind === "image" ? ImageIcon : FileTextIcon
        return (
          <button
            type="button"
            key={file.name}
            className="flex w-56 items-center gap-3 rounded-(--studio-radius-card) border p-2 text-left hover:bg-muted"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-(--studio-radius-item) bg-muted text-fg-muted">
              <Icon className="size-4" />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium compact:text-xs">
                {file.name}
              </span>
              <span className="text-xs text-fg-muted">{file.meta}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

function ProfilePanel() {
  return (
    <aside className="hidden w-72 shrink-0 flex-col gap-6 overflow-y-auto border-l p-6 xl:flex">
      <div className="flex flex-col gap-3">
        <Avatar size="lg">
          <AvatarFallback>{initials(PROFILE.name)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-0.5">
          <span className="font-heading text-base font-medium">
            {PROFILE.name}
          </span>
          <span className="text-sm text-fg-muted compact:text-xs">
            {PROFILE.role}
          </span>
        </div>
      </div>
      <ul className="flex flex-col gap-2.5 text-sm compact:text-xs [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-fg-muted">
        <li className="flex items-center gap-2.5">
          <MailIcon />
          <span className="truncate">{PROFILE.email}</span>
        </li>
        <li className="flex items-center gap-2.5">
          <MapIcon />
          <span className="truncate">{PROFILE.location}</span>
        </li>
        <li className="flex items-center gap-2.5">
          <LinkIcon />
          <span className="truncate">{PROFILE.link}</span>
        </li>
      </ul>
      <Separator />
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-fg-muted">
          Recent conversations
        </span>
        <ul className="flex flex-col">
          {PROFILE.recent.map((subject) => (
            <li key={subject}>
              <button
                type="button"
                className="-mx-2 flex w-[calc(100%+1rem)] items-center gap-2 rounded-(--studio-radius-item) px-2 py-1.5 text-left text-sm hover:bg-muted compact:text-xs"
              >
                <span className="truncate">{subject}</span>
                <ExternalLinkIcon className="ml-auto size-3.5 shrink-0 text-fg-muted" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

function ConversationView({
  conversation,
  isStarred,
  onBack,
  onDone,
  onStar,
}: {
  conversation: Conversation
  isStarred: boolean
  onBack: () => void
  onDone: () => void
  onStar: () => void
}) {
  const [expanded, setExpanded] = useState([THREAD.length - 1])
  const [reply, setReply] = useState("")
  const [sent, setSent] = useState<ThreadEntry[]>([])
  const thread = conversation.id === "tokens" ? THREAD : []
  const entries: ThreadEntry[] = [
    ...(thread.length
      ? thread
      : [
          {
            from: conversation.from,
            time: conversation.time,
            paragraphs: [conversation.preview],
          },
        ]),
    ...sent,
  ]

  const send = (text: string) => {
    if (!text.trim()) return
    setSent((current) => [
      ...current,
      { from: ME, time: "Just now", paragraphs: [text.trim()] },
    ])
    setExpanded((current) => [...current, entries.length])
    setReply("")
  }

  return (
    <div
      className="flex min-h-0 flex-1"
      onKeyDown={(e) => {
        if (e.key === "Escape") onBack()
      }}
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-12 shrink-0 items-center gap-1 border-b px-3 sm:px-6">
          <Tooltip>
            <Button
              variant="quiet"
              size="sm"
              isIconOnly
              aria-label="Back to inbox"
              onPress={onBack}
            >
              <ArrowLeftIcon />
            </Button>
            <TooltipContent className="flex items-center gap-2">
              Back <Kbd>Esc</Kbd>
            </TooltipContent>
          </Tooltip>
          <div className="ml-auto flex items-center gap-0.5">
            <RowAction label="Mark done" shortcut="E" onPress={onDone}>
              <CheckIcon />
            </RowAction>
            <RemindMenu onRemind={onDone}>
              <Button
                variant="quiet"
                size="sm"
                isIconOnly
                aria-label="Remind me"
              >
                <ClockIcon />
              </Button>
            </RemindMenu>
            <RowAction
              label={isStarred ? "Unstar" : "Star"}
              shortcut="S"
              onPress={onStar}
            >
              <StarIcon className={cn(isStarred && "text-fg-warning")} />
            </RowAction>
            <Menu>
              <Button variant="quiet" size="sm" isIconOnly aria-label="More">
                <MoreHorizontalIcon />
              </Button>
              <Popover placement="bottom end">
                <MenuContent className="min-w-48">
                  <MenuItem>
                    <TagIcon />
                    Add label
                  </MenuItem>
                  <MenuItem>
                    <MailIcon />
                    Mark unread
                  </MenuItem>
                  <Separator />
                  <MenuItem variant="danger">
                    <Trash2Icon />
                    Trash
                  </MenuItem>
                </MenuContent>
              </Popover>
            </Menu>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-10">
          <div className="mx-auto flex max-w-3xl flex-col pt-8 pb-10">
            <div className="flex flex-col gap-2 pb-4">
              <h1 className="font-heading text-xl font-medium text-balance">
                {conversation.subject}
              </h1>
              {conversation.labels && (
                <div className="flex gap-1.5">
                  {conversation.labels.map((label) => (
                    <Badge key={label} size="sm" variant="neutral">
                      {label}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="border-t">
              {entries.map((entry, index) => (
                <ThreadMessage
                  key={`${entry.time}-${index}`}
                  entry={entry}
                  isExpanded={expanded.includes(index)}
                  onExpand={() => setExpanded((current) => [...current, index])}
                />
              ))}
            </div>
            {conversation.attachments && (
              <Attachments items={conversation.attachments} />
            )}

            <form
              className="mt-6 flex flex-col gap-3"
              onSubmit={(e) => {
                e.preventDefault()
                send(reply)
              }}
            >
              <div className="flex flex-wrap items-center gap-2">
                <SparklesIcon className="size-4 text-fg-muted" />
                {INSTANT_REPLIES.map((text) => (
                  <Button
                    key={text}
                    variant="secondary"
                    size="sm"
                    onPress={() => setReply(text)}
                  >
                    {text}
                  </Button>
                ))}
              </div>
              <TextField
                aria-label="Reply"
                value={reply}
                onChange={setReply}
                className="w-full"
              >
                <TextArea
                  placeholder="Reply to Priya…"
                  className="min-h-24"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault()
                      send(reply)
                    }
                  }}
                />
              </TextField>
              <div className="flex items-center gap-2">
                <Button
                  type="submit"
                  variant="primary"
                  isDisabled={!reply.trim()}
                >
                  <SendIcon />
                  Send
                </Button>
                <span className="flex items-center gap-1 text-xs text-fg-muted">
                  <Kbd>⌘</Kbd>
                  <Kbd>↵</Kbd>
                </span>
                <Button
                  variant="quiet"
                  size="sm"
                  isIconOnly
                  aria-label="Attach"
                  className="ml-auto"
                >
                  <PaperclipIcon />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ProfilePanel />
    </div>
  )
}

function ComposeDialog() {
  const [isOpen, setOpen] = useState(false)
  return (
    <Dialog isOpen={isOpen} onOpenChange={setOpen}>
      <Tooltip>
        <Button variant="primary" size="sm">
          <SquarePenIcon />
          <span className="hidden sm:inline">Compose</span>
        </Button>
        <TooltipContent className="flex items-center gap-2">
          Compose <Kbd>C</Kbd>
        </TooltipContent>
      </Tooltip>
      <Responsive
        render={(isMobile) => {
          const content = (
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New message</DialogTitle>
              </DialogHeader>
              <DialogBody className="flex flex-col gap-3">
                <TextField aria-label="To" defaultValue="priya@sablecloud.io">
                  <Input placeholder="To" />
                </TextField>
                <TextField aria-label="Subject">
                  <Input placeholder="Subject" />
                </TextField>
                <TextField aria-label="Message">
                  <TextArea
                    placeholder="Write something…"
                    className="min-h-40"
                  />
                </TextField>
              </DialogBody>
              <DialogFooter>
                <Button variant="quiet" slot="close">
                  Discard
                </Button>
                <Button variant="primary" onPress={() => setOpen(false)}>
                  <SendIcon />
                  Send
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

export default function MailBlock() {
  const [split, setSplit] = useState("important")
  const [inbox, setInbox] = useState(INBOX)
  const [focusedId, setFocusedId] = useState<string | null>("tokens")
  const [openId, setOpenId] = useState<string | null>(null)
  const [starred, setStarred] = useState<string[]>(["offer"])
  const listRef = useRef<HTMLUListElement>(null)

  const open = inbox.find((c) => c.id === openId)
  const unread = inbox.filter((c) => c.unread).length

  const done = (id: string) => {
    const index = inbox.findIndex((c) => c.id === id)
    const next = inbox[index + 1] ?? inbox[index - 1]
    setInbox((current) => current.filter((c) => c.id !== id))
    setFocusedId(next?.id ?? null)
    if (openId === id) setOpenId(null)
  }

  const toggleStar = (id: string) =>
    setStarred((current) =>
      current.includes(id) ? current.filter((s) => s !== id) : [...current, id],
    )

  const openConversation = (id: string) => {
    setOpenId(id)
    setInbox((current) =>
      current.map((c) => (c.id === id ? { ...c, unread: false } : c)),
    )
  }

  // Superhuman's triage keys, scoped to the list so typing elsewhere is safe.
  const onListKeyDown = (e: KeyboardEvent) => {
    const index = inbox.findIndex((c) => c.id === focusedId)
    const move = (step: number) => {
      const next = inbox[Math.min(inbox.length - 1, Math.max(0, index + step))]
      if (!next) return
      setFocusedId(next.id)
      listRef.current
        ?.querySelectorAll<HTMLElement>("[data-row]")
        [inbox.indexOf(next)]?.focus()
    }
    if (e.key === "j" || e.key === "ArrowDown") move(1)
    else if (e.key === "k" || e.key === "ArrowUp") move(-1)
    else if (e.key === "e" && focusedId) done(focusedId)
    else if (e.key === "s" && focusedId) toggleStar(focusedId)
    else return
    e.preventDefault()
  }

  return (
    <div className="flex h-svh min-h-svh flex-col bg-bg text-fg">
      <header className="flex h-14 shrink-0 items-center gap-3 px-4 sm:px-8">
        <BrandMark className="size-6">
          <span className="flex size-6 items-center justify-center rounded-(--studio-radius-item) bg-primary text-fg-on-primary">
            <MailIcon className="size-3.5" />
          </span>
        </BrandMark>
        <span className="font-heading text-base font-medium">
          <BrandName>Courier</BrandName>
        </span>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="quiet" size="sm" className="text-fg-muted">
            <SearchIcon />
            <span className="hidden sm:inline">Search</span>
            <Kbd className="hidden sm:inline-flex">/</Kbd>
          </Button>
          <ComposeDialog />
          <Menu>
            <Button
              variant="quiet"
              size="sm"
              isIconOnly
              aria-label="Account"
              className="rounded-(--studio-radius-pill)"
            >
              <Avatar size="sm">
                <AvatarFallback>{initials(ME)}</AvatarFallback>
              </Avatar>
            </Button>
            <Popover placement="bottom end">
              <MenuContent className="min-w-56">
                <MenuSection>
                  <MenuSectionHeader>maya@sablecloud.io</MenuSectionHeader>
                  <MenuItem>
                    <SettingsIcon />
                    Settings
                  </MenuItem>
                  <MenuItem>
                    <SquarePenIcon />
                    Snippets
                  </MenuItem>
                </MenuSection>
                <Separator />
                <MenuItem>
                  <LogOutIcon />
                  Sign out
                </MenuItem>
              </MenuContent>
            </Popover>
          </Menu>
        </div>
      </header>

      {open ? (
        <ConversationView
          key={open.id}
          conversation={open}
          isStarred={starred.includes(open.id)}
          onBack={() => setOpenId(null)}
          onDone={() => done(open.id)}
          onStar={() => toggleStar(open.id)}
        />
      ) : (
        <>
          <Tabs
            selectedKey={split}
            onSelectionChange={(key) => setSplit(String(key))}
            className="shrink-0 px-4 sm:px-8"
          >
            <TabList aria-label="Split inbox" variant="line">
              {SPLITS.map((tab) => (
                <Tab key={tab.id} id={tab.id}>
                  {tab.name}
                  <span className="text-fg-muted tabular-nums">
                    {tab.id === "important" ? unread || "" : tab.count}
                  </span>
                </Tab>
              ))}
            </TabList>
          </Tabs>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {split !== "important" || inbox.length === 0 ? (
              <Empty className="h-full">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <CheckIcon />
                  </EmptyMedia>
                  <EmptyTitle>
                    {inbox.length === 0 && split === "important"
                      ? "Inbox zero"
                      : "Nothing new here"}
                  </EmptyTitle>
                  <EmptyDescription>
                    You're all caught up. Enjoy the quiet.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <ul
                ref={listRef}
                aria-label="Important"
                onKeyDown={onListKeyDown}
                className="border-t"
              >
                {inbox.map((conversation) => (
                  <ConversationRow
                    key={conversation.id}
                    conversation={conversation}
                    isFocused={conversation.id === focusedId}
                    isStarred={starred.includes(conversation.id)}
                    onFocus={() => setFocusedId(conversation.id)}
                    onOpen={() => openConversation(conversation.id)}
                    onDone={() => done(conversation.id)}
                    onStar={() => toggleStar(conversation.id)}
                  />
                ))}
              </ul>
            )}
          </div>

          <footer className="hidden h-10 shrink-0 items-center gap-5 border-t px-8 text-xs text-fg-muted md:flex">
            {SHORTCUTS.map((shortcut) => (
              <Shortcut key={shortcut.label} {...shortcut} />
            ))}
            <span className="ml-auto flex items-center gap-1.5">
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
              Command
            </span>
          </footer>
        </>
      )}
    </div>
  )
}
