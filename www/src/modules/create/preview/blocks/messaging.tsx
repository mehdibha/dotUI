"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import {
  ArchiveIcon,
  ArrowLeftIcon,
  AudioLinesIcon,
  CameraIcon,
  CheckCircle2Icon,
  ClockIcon,
  ImageIcon,
  MoreVerticalIcon,
  PaperclipIcon,
  PinIcon,
  SearchIcon,
  SendIcon,
  Settings2Icon,
  SmileIcon,
  SquarePenIcon,
  UserRoundXIcon,
  Users2Icon,
  VolumeOffIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Avatar, AvatarBadge, AvatarFallback } from "@/registry/ui/avatar"
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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/registry/ui/empty"
import { ListBox, ListBoxItem } from "@/registry/ui/list-box"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"
import { SearchField } from "@/registry/ui/search-field"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import { Separator } from "@/registry/ui/separator"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

/* -------------------------------------------------------------------------- *
 * Messaging — a two-pane chat client: conversation list + thread. Renders in
 * the /create preview iframe, so every surface, bubble and control below is the
 * live design system.
 * -------------------------------------------------------------------------- */

interface Attachment {
  name: string
  meta: string
}

interface ThreadMessage {
  id: string
  from: "me" | "them"
  sender?: string
  text?: string
  attachment?: Attachment
  time: string
  pending?: boolean
}

interface ThreadDay {
  label: string
  messages: ThreadMessage[]
}

interface ChatContact {
  id: string
  name: string
  initials: string
  kind: "dm" | "group"
  presence: string
  online?: boolean
  muted?: boolean
  typing?: boolean
  unread?: number
}

const OPEN_ON_LOAD = "priya"

const CONTACTS: ChatContact[] = [
  {
    id: "priya",
    name: "Priya Raghunathan",
    initials: "PR",
    kind: "dm",
    presence: "Active now",
    online: true,
    typing: true,
    unread: 2,
  },
  {
    id: "design-guild",
    name: "Design Guild",
    initials: "DG",
    kind: "group",
    presence: "6 members · 3 online",
    unread: 5,
  },
  {
    id: "daniel",
    name: "Daniel Okafor",
    initials: "DO",
    kind: "dm",
    presence: "Active now",
    online: true,
    unread: 1,
  },
  {
    id: "marisol",
    name: "Marisol Vega",
    initials: "MV",
    kind: "dm",
    presence: "Last seen 2h ago",
  },
  {
    id: "support",
    name: "Support Escalations",
    initials: "SE",
    kind: "group",
    presence: "12 members · 4 online",
    muted: true,
  },
  {
    id: "ethan",
    name: "Ethan Brière",
    initials: "EB",
    kind: "dm",
    presence: "Last seen Tuesday",
  },
  {
    id: "yuki",
    name: "Yuki Tanaka",
    initials: "YT",
    kind: "dm",
    presence: "Last seen Monday",
  },
]

const INITIAL_THREADS: Record<string, ThreadDay[]> = {
  priya: [
    {
      label: "Yesterday",
      messages: [
        {
          id: "p1",
          from: "them",
          time: "09:12",
          text: "Morning! Did the invoice PDF regression make it to staging?",
        },
        {
          id: "p2",
          from: "me",
          time: "09:14",
          text: "Not yet — multi-currency totals are off by a cent.",
        },
        {
          id: "p3",
          from: "me",
          time: "09:15",
          text: "Rounding runs twice: once per line item, then again on the summary.",
        },
        {
          id: "p4",
          from: "them",
          time: "09:18",
          text: "That explains the €0.01 drift finance flagged on 14 invoices.",
        },
      ],
    },
    {
      label: "Today",
      messages: [
        {
          id: "p5",
          from: "them",
          time: "12:29",
          text: "Fix is up — PR #482. One rounding pass, at render time.",
        },
        {
          id: "p6",
          from: "them",
          time: "12:30",
          attachment: { name: "invoice-totals-after.png", meta: "284 KB" },
        },
        {
          id: "p7",
          from: "me",
          time: "12:36",
          text: "Ran the currency fixtures against it — 214 passing, 0 failing.",
        },
        {
          id: "p8",
          from: "them",
          time: "12:41",
          text: "Then I'll ship it tonight, once the 18:00 freeze lifts.",
        },
      ],
    },
  ],
  "design-guild": [
    {
      label: "Yesterday",
      messages: [
        {
          id: "d1",
          from: "them",
          sender: "Tomas Lindqvist",
          time: "16:04",
          text: "Radius ladder is on staging — the base rung is 10px now.",
        },
      ],
    },
    {
      label: "Today",
      messages: [
        {
          id: "d2",
          from: "them",
          sender: "Amélie Fontaine",
          time: "11:52",
          text: "Cards read much softer. Buttons still feel a touch sharp next to them.",
        },
        {
          id: "d3",
          from: "them",
          sender: "Tomas Lindqvist",
          time: "11:56",
          attachment: { name: "radius-ladder-compare.png", meta: "512 KB" },
        },
        {
          id: "d4",
          from: "them",
          sender: "Tomas Lindqvist",
          time: "11:58",
          text: "That's the sm rung. I can take it to 0.6 of base and redeploy.",
        },
        {
          id: "d5",
          from: "me",
          time: "12:02",
          text: "Do it — but leave inputs where they are, they match the spec sheet.",
        },
      ],
    },
  ],
  daniel: [
    {
      label: "Today",
      messages: [
        {
          id: "n1",
          from: "them",
          time: "10:22",
          text: "Can you take PR #482 before standup? It touches the billing exporter.",
        },
        {
          id: "n2",
          from: "me",
          time: "10:25",
          text: "Queued. Priya's fixtures land first, then I'll review it properly.",
        },
      ],
    },
  ],
  marisol: [
    {
      label: "Yesterday",
      messages: [
        {
          id: "m1",
          from: "me",
          time: "15:40",
          text: "Pushed the new pricing table — Growth is $49, Scale is $180.",
        },
        {
          id: "m2",
          from: "them",
          time: "15:47",
          text: "Thanks! The pricing page numbers line up with the contract now.",
        },
      ],
    },
  ],
  support: [
    {
      label: "Yesterday",
      messages: [
        {
          id: "s1",
          from: "them",
          sender: "Hana Sato",
          time: "14:11",
          text: "Refund for order #A-3391 processed — €212.40 back to the customer.",
        },
      ],
    },
  ],
  ethan: [
    {
      label: "Tue",
      messages: [
        {
          id: "e1",
          from: "them",
          time: "09:03",
          text: "Sent over the Q3 retention deck — churn is down to 2.1%.",
        },
      ],
    },
  ],
  yuki: [
    {
      label: "Mon",
      messages: [
        {
          id: "y1",
          from: "them",
          time: "18:20",
          text: "See you at the Lisbon offsite next week.",
        },
      ],
    },
  ],
}

// The bubble shapes the chat primitive only ships for the `user` role — mirrored
// onto `assistant` for incoming, and tinted primary for outgoing.
const INCOMING_BUBBLE = [
  "group-data-[role=assistant]/message:w-fit",
  "group-data-[role=assistant]/message:max-w-[85%]",
  "group-data-[role=assistant]/message:rounded-(--chat-message-radius)",
  "group-data-[role=assistant]/message:bg-muted",
  "group-data-[role=assistant]/message:px-3",
  "group-data-[role=assistant]/message:py-2",
].join(" ")

const OUTGOING_BUBBLE = [
  "group-data-[role=user]/message:bg-primary",
  "group-data-[role=user]/message:text-fg-on-primary",
].join(" ")

function lastMessageOf(days: ThreadDay[]) {
  const day = days[days.length - 1]
  return day ? day.messages[day.messages.length - 1] : undefined
}

function previewOf(days: ThreadDay[]) {
  const message = lastMessageOf(days)
  if (!message) return "No messages yet"
  const body = message.text ?? `Attachment · ${message.attachment?.name}`
  if (message.from === "me") return `You: ${body}`
  if (message.sender) return `${message.sender.split(" ")[0]}: ${body}`
  return body
}

function stampOf(days: ThreadDay[]) {
  const day = days[days.length - 1]
  if (!day) return ""
  return day.label === "Today"
    ? (lastMessageOf(days)?.time ?? day.label)
    : day.label
}

function ContactAvatar({
  contact,
  size = "md",
}: {
  contact: ChatContact
  size?: "sm" | "md" | "lg"
}) {
  return (
    <Avatar size={size} className="shrink-0">
      <AvatarFallback>
        {contact.kind === "group" ? (
          <Users2Icon className="size-4" />
        ) : (
          contact.initials
        )}
      </AvatarFallback>
      {contact.online && (
        <AvatarBadge className="bg-success" aria-label="Online" />
      )}
    </Avatar>
  )
}

function DayDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <Separator className="flex-1" />
      <span className="shrink-0 text-xs font-medium text-fg-muted">
        {label}
      </span>
      <Separator className="flex-1" />
    </div>
  )
}

function AttachmentTile({ attachment }: { attachment: Attachment }) {
  return (
    <div className="flex w-44 max-w-full flex-col gap-1.5">
      <div className="flex aspect-[4/3] items-center justify-center rounded-md bg-bg text-fg-muted">
        <ImageIcon className="size-6" />
      </div>
      <span className="truncate text-xs text-fg-muted">
        {attachment.name} · {attachment.meta}
      </span>
    </div>
  )
}

function TypingIndicator({ contact }: { contact: ChatContact }) {
  return (
    <Message role="assistant" aria-label={`${contact.name} is typing`}>
      <MessageAvatar name={contact.initials} />
      <MessageContent className={INCOMING_BUBBLE}>
        <span className="flex items-center gap-1">
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              className="size-1.5 animate-bounce rounded-full bg-fg-muted"
              style={{ animationDelay: `${dot * 140}ms` }}
            />
          ))}
        </span>
      </MessageContent>
    </Message>
  )
}

function MessageBubble({
  message,
  contact,
  showAvatar,
}: {
  message: ThreadMessage
  contact: ChatContact
  showAvatar: boolean
}) {
  const outgoing = message.from === "me"
  return (
    <Message role={outgoing ? "user" : "assistant"}>
      {!outgoing && (
        <MessageAvatar
          name={message.sender ? message.sender.slice(0, 2) : contact.initials}
          className={cn(!showAvatar && "invisible")}
        />
      )}
      <MessageContent className={outgoing ? OUTGOING_BUBBLE : INCOMING_BUBBLE}>
        {!outgoing && message.sender && showAvatar && (
          <span className="text-xs font-medium text-fg-accent">
            {message.sender}
          </span>
        )}
        {message.text && <span>{message.text}</span>}
        {message.attachment && (
          <AttachmentTile attachment={message.attachment} />
        )}
        <span
          className={cn(
            "flex items-center gap-1 self-end text-[0.6875rem]",
            outgoing ? "text-fg-on-primary/70" : "text-fg-muted",
          )}
        >
          {message.time}
          {outgoing &&
            (message.pending ? (
              <ClockIcon className="size-3" />
            ) : (
              <CheckCircle2Icon className="size-3" />
            ))}
        </span>
      </MessageContent>
    </Message>
  )
}

export default function MessagingBlock() {
  const [threads, setThreads] = useState(INITIAL_THREADS)
  const [unread, setUnread] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      CONTACTS.map((c) => [c.id, c.id === OPEN_ON_LOAD ? 0 : (c.unread ?? 0)]),
    ),
  )
  const [activeId, setActiveId] = useState(OPEN_ON_LOAD)
  const [filter, setFilter] = useState("all")
  const [query, setQuery] = useState("")
  const [draft, setDraft] = useState("")
  const [sent, setSent] = useState(false)
  const [pane, setPane] = useState<"list" | "thread">("list")
  const scroller = useRef<HTMLDivElement>(null)

  const active = CONTACTS.find((c) => c.id === activeId)
  const activeThread = threads[activeId]
  const totalUnread = Object.values(unread).reduce((a, b) => a + b, 0)

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return CONTACTS.filter((contact) => {
      if (filter === "unread" && !unread[contact.id]) return false
      if (filter === "groups" && contact.kind !== "group") return false
      if (!needle) return true
      const haystack = `${contact.name} ${previewOf(threads[contact.id] ?? [])}`
      return haystack.toLowerCase().includes(needle)
    })
  }, [filter, query, threads, unread])

  useEffect(() => {
    const el = scroller.current
    if (el) el.scrollTop = el.scrollHeight
  }, [activeId, activeThread])

  function openConversation(id: string) {
    setActiveId(id)
    setUnread((current) => ({ ...current, [id]: 0 }))
    setDraft("")
    setSent(false)
    setPane("thread")
  }

  function send() {
    const text = draft.trim()
    if (!text) return
    setThreads((current) => {
      const days = current[activeId] ?? []
      const message: ThreadMessage = {
        id: `${activeId}-${Date.now()}`,
        from: "me",
        text,
        time: "12:47",
        pending: true,
      }
      const last = days[days.length - 1]
      const next =
        last?.label === "Today"
          ? [
              ...days.slice(0, -1),
              { ...last, messages: [...last.messages, message] },
            ]
          : [...days, { label: "Today", messages: [message] }]
      return { ...current, [activeId]: next }
    })
    setDraft("")
    setSent(true)
  }

  if (!active) return null

  return (
    <div className="flex h-screen min-h-screen flex-col overflow-hidden bg-bg text-fg">
      <div className="flex min-h-0 flex-1">
        {/* Conversation list */}
        <aside
          className={cn(
            "flex w-full min-w-0 shrink-0 flex-col border-r border-border-muted bg-sidebar md:w-80 lg:w-96",
            pane === "thread" && "max-md:hidden",
          )}
        >
          <div className="flex items-center gap-2 px-4 py-3">
            <h1 className="flex min-w-0 flex-1 items-center gap-2 text-base font-semibold">
              Messages
              {totalUnread > 0 && (
                <Badge variant="accent" size="sm">
                  {totalUnread}
                </Badge>
              )}
            </h1>
            <Tooltip delay={300}>
              <Button
                variant="quiet"
                size="sm"
                isIconOnly
                aria-label="New message"
              >
                <SquarePenIcon />
              </Button>
              <TooltipContent>New message</TooltipContent>
            </Tooltip>
            <Menu>
              <Button
                variant="quiet"
                size="sm"
                isIconOnly
                aria-label="Inbox options"
              >
                <MoreVerticalIcon />
              </Button>
              <Popover placement="bottom end">
                <MenuContent>
                  <MenuItem textValue="Mark all as read">
                    <CheckCircle2Icon />
                    Mark all as read
                  </MenuItem>
                  <MenuItem textValue="Archived">
                    <ArchiveIcon />
                    Archived
                  </MenuItem>
                  <MenuItem textValue="Message settings">
                    <Settings2Icon />
                    Message settings
                  </MenuItem>
                </MenuContent>
              </Popover>
            </Menu>
          </div>

          <div className="flex flex-col gap-3 px-4 pb-3">
            <SearchField
              aria-label="Search conversations"
              placeholder="Search people and messages…"
              value={query}
              onChange={setQuery}
            />
            <SegmentedControl
              aria-label="Filter conversations"
              selectedKeys={[filter]}
              onSelectionChange={(keys) => {
                const key = [...keys][0]
                if (key != null) setFilter(String(key))
              }}
            >
              <SegmentedControlItem id="all">All</SegmentedControlItem>
              <SegmentedControlItem id="unread">Unread</SegmentedControlItem>
              <SegmentedControlItem id="groups">Groups</SegmentedControlItem>
            </SegmentedControl>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
            {visible.length === 0 ? (
              <Empty className="py-10">
                <EmptyHeader>
                  <EmptyTitle>No conversations</EmptyTitle>
                  <EmptyDescription>
                    Nothing matches this filter. Try another search term.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <ListBox
                aria-label="Conversations"
                onAction={(key) => openConversation(String(key))}
                className="max-h-none p-0"
              >
                {visible.map((contact) => {
                  const count = unread[contact.id] ?? 0
                  const days = threads[contact.id] ?? []
                  return (
                    <ListBoxItem
                      key={contact.id}
                      id={contact.id}
                      textValue={`${contact.name}, ${count} unread`}
                      className={cn(
                        "items-start gap-3 px-2 py-2.5",
                        contact.id === activeId && "bg-muted",
                      )}
                    >
                      <ContactAvatar contact={contact} size="lg" />
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <div className="flex min-w-0 items-baseline gap-2">
                          <span className="min-w-0 flex-1 truncate text-sm font-medium">
                            {contact.name}
                          </span>
                          <span className="shrink-0 text-xs text-fg-muted tabular-nums">
                            {stampOf(days)}
                          </span>
                        </div>
                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className={cn(
                              "min-w-0 flex-1 truncate text-xs",
                              contact.typing
                                ? "text-fg-accent"
                                : "text-fg-muted",
                            )}
                          >
                            {contact.typing ? "typing…" : previewOf(days)}
                          </span>
                          {contact.muted && (
                            <VolumeOffIcon className="size-3.5 shrink-0 text-fg-muted" />
                          )}
                          {count > 0 && (
                            <Badge variant="accent" size="sm">
                              {count}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </ListBoxItem>
                  )
                })}
              </ListBox>
            )}
          </div>

          <div className="flex items-center gap-3 border-t border-border-muted px-4 py-3">
            <Avatar size="md" className="shrink-0">
              <AvatarFallback>AN</AvatarFallback>
              <AvatarBadge className="bg-success" aria-label="Online" />
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">Amara Nwosu</p>
              <p className="truncate text-xs text-fg-muted">
                Product · Billing squad
              </p>
            </div>
            <Button variant="quiet" size="sm" isIconOnly aria-label="Settings">
              <Settings2Icon />
            </Button>
          </div>
        </aside>

        {/* Thread */}
        <section
          className={cn(
            "flex min-w-0 flex-1 flex-col",
            pane === "list" && "max-md:hidden",
          )}
        >
          <header className="flex items-center gap-3 border-b border-border-muted px-3 py-3 md:px-4">
            <Button
              variant="quiet"
              size="sm"
              isIconOnly
              className="md:hidden"
              onPress={() => setPane("list")}
              aria-label="Back to conversations"
            >
              <ArrowLeftIcon />
            </Button>
            <ContactAvatar contact={active} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{active.name}</p>
              <p className="truncate text-xs text-fg-muted">
                {active.typing ? "typing…" : active.presence}
              </p>
            </div>
            <Tooltip delay={300}>
              <Button
                variant="quiet"
                size="sm"
                isIconOnly
                aria-label="Start a voice call"
              >
                <AudioLinesIcon />
              </Button>
              <TooltipContent>Voice call</TooltipContent>
            </Tooltip>
            <Tooltip delay={300}>
              <Button
                variant="quiet"
                size="sm"
                isIconOnly
                className="max-sm:hidden"
                aria-label="Start a video call"
              >
                <CameraIcon />
              </Button>
              <TooltipContent>Video call</TooltipContent>
            </Tooltip>
            <Menu>
              <Button
                variant="quiet"
                size="sm"
                isIconOnly
                aria-label="Conversation options"
              >
                <MoreVerticalIcon />
              </Button>
              <Popover placement="bottom end">
                <MenuContent>
                  <MenuItem textValue="Search in conversation">
                    <SearchIcon />
                    Search in conversation
                  </MenuItem>
                  <MenuItem textValue="Pin conversation">
                    <PinIcon />
                    Pin conversation
                  </MenuItem>
                  <MenuItem textValue="Mute notifications">
                    <VolumeOffIcon />
                    Mute notifications
                  </MenuItem>
                  <MenuItem textValue="Archive">
                    <ArchiveIcon />
                    Archive
                  </MenuItem>
                  <MenuItem variant="danger" textValue="Block contact">
                    <UserRoundXIcon />
                    Block contact
                  </MenuItem>
                </MenuContent>
              </Popover>
            </Menu>
          </header>

          <Conversation
            ref={scroller}
            aria-label={`Conversation with ${active.name}`}
          >
            {activeThread?.map((day) => (
              <div key={day.label} className="flex flex-col gap-4">
                <DayDivider label={day.label} />
                {day.messages.map((message, index) => {
                  const previous = day.messages[index - 1]
                  const showAvatar =
                    !previous ||
                    previous.from !== message.from ||
                    previous.sender !== message.sender
                  return (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      contact={active}
                      showAvatar={showAvatar}
                    />
                  )
                })}
              </div>
            ))}
            {active.typing && !sent && <TypingIndicator contact={active} />}
          </Conversation>

          {/* pb-16: the /create preview floats its toolbar over the page bottom. */}
          <div className="border-t border-border-muted p-3 pb-16 md:px-4">
            <PromptInput
              onSubmit={(e) => {
                e.preventDefault()
                send()
              }}
            >
              <PromptInputTextarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={`Message ${
                  active.kind === "group"
                    ? active.name
                    : active.name.split(" ")[0]
                }…`}
                aria-label="Write a message"
              />
              <PromptInputToolbar>
                <div className="flex items-center gap-1">
                  <Button variant="quiet" isIconOnly aria-label="Attach a file">
                    <PaperclipIcon />
                  </Button>
                  <Button variant="quiet" isIconOnly aria-label="Send a photo">
                    <ImageIcon />
                  </Button>
                  <Button
                    variant="quiet"
                    isIconOnly
                    className="max-sm:hidden"
                    aria-label="Insert an emoji"
                  >
                    <SmileIcon />
                  </Button>
                </div>
                <PromptInputSubmit isIconOnly aria-label="Send message">
                  <SendIcon />
                </PromptInputSubmit>
              </PromptInputToolbar>
            </PromptInput>
          </div>
        </section>
      </div>
    </div>
  )
}
