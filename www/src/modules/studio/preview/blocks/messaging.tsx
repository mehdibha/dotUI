import { useEffect, useRef, useState } from "react"

import {
  ArrowUpIcon,
  AudioLinesIcon,
  CameraIcon,
  ImageIcon,
  InfoIcon,
  LinkIcon,
  MapIcon,
  PinIcon,
  PlusIcon,
  SmileIcon,
  SquarePenIcon,
  Trash2Icon,
  VolumeOffIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Bubble, BubbleContent, BubbleReactions } from "@/registry/ui/bubble"
import { Button } from "@/registry/ui/button"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Message, MessageAvatar, MessageContent } from "@/registry/ui/message"
import { Popover } from "@/registry/ui/popover"
import { SearchField } from "@/registry/ui/search-field"
import { Separator } from "@/registry/ui/separator"
import { TextField } from "@/registry/ui/text-field"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

import { initials } from "./shared"

// A Messages-style client (macOS): pinned conversations as large avatars,
// a list with the selection filled in the accent, and a thread of grouped
// bubbles with tapbacks, a rich link, a photo, read receipts and typing.

interface ChatMessage {
  id: string
  from: string
  text?: string
  link?: { title: string; site: string }
  photo?: string
  tapback?: string
}

interface Conversation {
  id: string
  name: string
  members?: string[]
  preview: string
  time: string
  unread?: boolean
  muted?: boolean
  isTyping?: boolean
  thread: { day: string; messages: ChatMessage[] }
}

const ME = "me"

const CONVERSATIONS: Conversation[] = [
  {
    id: "priya",
    name: "Priya Raghavan",
    preview: "Here's the semantic map, printed for the wall",
    time: "9:52 AM",
    isTyping: true,
    thread: {
      day: "Today 9:41 AM",
      messages: [
        {
          id: "p1",
          from: "Priya Raghavan",
          text: "Are you still in Lisbon on Thursday?",
        },
        {
          id: "p2",
          from: "Priya Raghavan",
          text: "We're doing a small token freeze party at the office, 6pm",
        },
        {
          id: "p3",
          from: ME,
          text: "Landing Wednesday night, so yes!",
          tapback: "❤️",
        },
        { id: "p4", from: ME, text: "Should I bring the codemod demo?" },
        {
          id: "p5",
          from: "Priya Raghavan",
          text: "Please. Daniel wants to see it run on the dashboard repo",
        },
        {
          id: "p6",
          from: "Priya Raghavan",
          link: {
            title: "Design tokens v3.0: the semantic layer",
            site: "tokens.sable.dev",
          },
        },
        { id: "p7", from: ME, photo: "semantic-map.jpg" },
        {
          id: "p8",
          from: ME,
          text: "Here's the semantic map, printed for the wall",
          tapback: "😂",
        },
      ],
    },
  },
  {
    id: "guild",
    name: "Design Guild",
    members: ["Marisol Vega", "Ethan Brière", "Yuki Tanaka"],
    preview: "Yuki: I'll book the big room for the critique",
    time: "9:20 AM",
    unread: true,
    thread: {
      day: "Today 8:55 AM",
      messages: [
        {
          id: "g1",
          from: "Marisol Vega",
          text: "Critique moved to 3pm, the room was double booked",
        },
        {
          id: "g2",
          from: "Ethan Brière",
          text: "Works for me. Bringing the onboarding flows",
        },
        {
          id: "g3",
          from: "Ethan Brière",
          text: "Fair warning, there are 40 screens",
          tapback: "👍",
        },
        { id: "g4", from: ME, text: "Let's timebox it to the first-run path" },
        {
          id: "g5",
          from: "Yuki Tanaka",
          text: "I'll book the big room for the critique",
        },
      ],
    },
  },
  {
    id: "daniel",
    name: "Daniel Osei",
    preview: "Codemod passes on all 212 files",
    time: "8:47 AM",
    unread: true,
    thread: { day: "Today 8:47 AM", messages: [] },
  },
  {
    id: "marisol",
    name: "Marisol Vega",
    preview: "Sent you the Figma link",
    time: "Yesterday",
    thread: { day: "Yesterday 6:12 PM", messages: [] },
  },
  {
    id: "support",
    name: "Support Escalations",
    members: ["Leo Martins", "Ana Costa"],
    preview: "Leo: Northwind is back up, closing the incident",
    time: "Yesterday",
    muted: true,
    thread: { day: "Yesterday 2:30 PM", messages: [] },
  },
  {
    id: "ethan",
    name: "Ethan Brière",
    preview: "Haha that's the one",
    time: "Monday",
    thread: { day: "Monday 7:02 PM", messages: [] },
  },
  {
    id: "yuki",
    name: "Yuki Tanaka",
    preview: "Thanks for the intro!",
    time: "Sunday",
    thread: { day: "Sunday 11:40 AM", messages: [] },
  },
  {
    id: "leo",
    name: "Leo Martins",
    preview: "See you at 7",
    time: "Oct 24",
    thread: { day: "Oct 24 5:15 PM", messages: [] },
  },
]

const PINNED = ["priya", "guild", "daniel"]

const [DEFAULT_CONVERSATION] = CONVERSATIONS as [
  Conversation,
  ...Conversation[],
]

function firstName(name: string) {
  return name.split(" ")[0]
}

function threadOf(conversation: Conversation): ChatMessage[] {
  if (conversation.thread.messages.length) return conversation.thread.messages
  const text = conversation.preview.replace(/^\w+: /, "")
  return [
    {
      id: `${conversation.id}-1`,
      from: conversation.members?.[0] ?? conversation.name,
      text,
    },
  ]
}

function ConversationAvatar({
  conversation,
  size = "md",
}: {
  conversation: Conversation
  size?: "sm" | "md" | "lg"
}) {
  return (
    <Avatar size={size}>
      <AvatarFallback>{initials(conversation.name)}</AvatarFallback>
    </Avatar>
  )
}

function TypingBubble() {
  return (
    <Bubble variant="muted" aria-label="Typing">
      <BubbleContent>
        <span className="flex h-5 items-center gap-1">
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              className="size-1.5 animate-pulse rounded-full bg-fg-muted"
              style={{ animationDelay: `${dot * 180}ms` }}
            />
          ))}
        </span>
      </BubbleContent>
    </Bubble>
  )
}

function ThreadBubble({ message }: { message: ChatMessage }) {
  const outgoing = message.from === ME

  if (message.photo)
    return (
      <div
        role="img"
        aria-label={message.photo}
        className="flex aspect-4/3 w-56 items-center justify-center overflow-hidden rounded-(--studio-bubble-radius) bg-primary-muted text-fg-muted"
      >
        <ImageIcon className="size-8" />
      </div>
    )

  if (message.link)
    return (
      <Bubble variant="muted" className="w-64">
        <BubbleContent className="p-0">
          <div className="flex aspect-video items-center justify-center bg-primary-muted text-fg-muted">
            <LinkIcon className="size-6" />
          </div>
          <div className="flex flex-col gap-0.5 px-3 py-2">
            <span className="text-sm leading-snug font-medium compact:text-xs">
              {message.link.title}
            </span>
            <span className="text-xs text-fg-muted">{message.link.site}</span>
          </div>
        </BubbleContent>
      </Bubble>
    )

  return (
    <Bubble
      align={outgoing ? "end" : "start"}
      variant={outgoing ? "primary" : "muted"}
    >
      <BubbleContent>{message.text}</BubbleContent>
      {message.tapback && (
        <BubbleReactions side="top" align={outgoing ? "start" : "end"}>
          {message.tapback}
        </BubbleReactions>
      )}
    </Bubble>
  )
}

function Thread({
  conversation,
  sent,
}: {
  conversation: Conversation
  sent: ChatMessage[]
}) {
  const messages = [...threadOf(conversation), ...sent]
  const lastOutgoing = messages.map((m) => m.from).lastIndexOf(ME)

  // Consecutive messages from one sender form a group: one name over the
  // first bubble, one avatar beside the last.
  const groups: ChatMessage[][] = []
  for (const message of messages) {
    const last = groups.at(-1)
    if (last && last[0]?.from === message.from) last.push(message)
    else groups.push([message])
  }

  let index = -1
  return (
    <div className="flex flex-col gap-4">
      <p className="text-center text-xs text-fg-muted">
        <span className="font-medium">
          {conversation.thread.day.split(" ")[0]}
        </span>{" "}
        {conversation.thread.day.split(" ").slice(1).join(" ")}
      </p>
      {groups.map((group) => {
        const from = group[0]?.from ?? ME
        const outgoing = from === ME
        return (
          <Message
            key={group[0]?.id}
            align={outgoing ? "end" : "start"}
            className="gap-2"
          >
            {!outgoing && conversation.members && (
              <MessageAvatar>
                <Avatar size="sm">
                  <AvatarFallback>{initials(from)}</AvatarFallback>
                </Avatar>
              </MessageAvatar>
            )}
            <MessageContent className="gap-1">
              {!outgoing && conversation.members && (
                <span className="px-3 text-xs text-fg-muted">
                  {firstName(from)}
                </span>
              )}
              {group.map((message) => {
                index += 1
                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex w-full flex-col gap-1",
                      outgoing ? "items-end" : "items-start",
                      message.tapback && "mt-3",
                    )}
                  >
                    <ThreadBubble message={message} />
                    {index === lastOutgoing && (
                      <span className="px-1 text-xs font-medium text-fg-muted">
                        {sent.length ? "Delivered" : "Read 9:52 AM"}
                      </span>
                    )}
                  </div>
                )
              })}
            </MessageContent>
          </Message>
        )
      })}
      {conversation.isTyping && !sent.length && (
        <Message align="start">
          <MessageContent>
            <TypingBubble />
          </MessageContent>
        </Message>
      )}
    </div>
  )
}

function ConversationMenu({ isPinned }: { isPinned: boolean }) {
  return (
    <MenuContent className="min-w-48">
      <MenuItem>
        <PinIcon />
        {isPinned ? "Unpin" : "Pin"}
      </MenuItem>
      <MenuItem>
        <VolumeOffIcon />
        Hide alerts
      </MenuItem>
      <Separator />
      <MenuItem variant="danger">
        <Trash2Icon />
        Delete
      </MenuItem>
    </MenuContent>
  )
}

export default function MessagingBlock() {
  const [selectedId, setSelectedId] = useState("priya")
  const [query, setQuery] = useState("")
  const [read, setRead] = useState<string[]>([])
  const [draft, setDraft] = useState("")
  const [sent, setSent] = useState<Record<string, ChatMessage[]>>({})
  const [pane, setPane] = useState<"list" | "thread">("thread")
  const scrollRef = useRef<HTMLDivElement>(null)

  const selected =
    CONVERSATIONS.find((c) => c.id === selectedId) ?? DEFAULT_CONVERSATION
  const selectedSent = sent[selected.id] ?? []
  const pinned = CONVERSATIONS.filter((c) => PINNED.includes(c.id))
  const list = CONVERSATIONS.filter(
    (c) =>
      !PINNED.includes(c.id) &&
      c.name.toLowerCase().includes(query.trim().toLowerCase()),
  )
  const isUnread = (c: Conversation) => c.unread && !read.includes(c.id)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [selectedId, selectedSent.length])

  const select = (id: string) => {
    setSelectedId(id)
    setRead((current) => [...current, id])
    setPane("thread")
  }

  const send = () => {
    const text = draft.trim()
    if (!text) return
    setSent((current) => ({
      ...current,
      [selected.id]: [
        ...(current[selected.id] ?? []),
        { id: `s${Date.now()}`, from: ME, text },
      ],
    }))
    setDraft("")
  }

  return (
    <div className="flex h-svh min-h-svh bg-bg text-fg">
      <aside
        className={cn(
          "flex w-full shrink-0 flex-col border-r bg-muted/40 md:w-80",
          pane === "thread" && "max-md:hidden",
        )}
      >
        <div className="flex items-center gap-2 p-3">
          <SearchField
            aria-label="Search"
            placeholder="Search"
            value={query}
            onChange={setQuery}
            className="flex-1"
          />
          <Tooltip>
            <Button variant="quiet" isIconOnly aria-label="New message">
              <SquarePenIcon />
            </Button>
            <TooltipContent>New message</TooltipContent>
          </Tooltip>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
          {!query && (
            <div className="grid grid-cols-3 gap-1 pb-3">
              {pinned.map((conversation) => (
                <button
                  type="button"
                  key={conversation.id}
                  onClick={() => select(conversation.id)}
                  className={cn(
                    "relative flex flex-col items-center gap-1.5 rounded-(--studio-radius-item) px-1 pt-3 pb-2 text-xs",
                    conversation.id === selected.id
                      ? "bg-muted font-medium"
                      : "hover:bg-muted",
                  )}
                >
                  {isUnread(conversation) && (
                    <span className="absolute top-3 left-3 size-2 rounded-full bg-primary" />
                  )}
                  <Avatar size="lg" className="size-14">
                    <AvatarFallback className="text-base">
                      {initials(conversation.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-full truncate">
                    {conversation.members
                      ? conversation.name
                      : firstName(conversation.name)}
                  </span>
                </button>
              ))}
            </div>
          )}

          <ul className="flex flex-col">
            {list.map((conversation) => {
              const isSelected = conversation.id === selected.id
              return (
                <li key={conversation.id} className="group/row relative">
                  <button
                    type="button"
                    onClick={() => select(conversation.id)}
                    className={cn(
                      "flex w-full items-start gap-2.5 rounded-(--studio-radius-item) py-2.5 pr-2 pl-4 text-left",
                      isSelected
                        ? "bg-primary text-fg-on-primary"
                        : "hover:bg-muted",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "absolute top-1/2 left-1 size-2 -translate-y-1/2 rounded-full",
                        isUnread(conversation) && !isSelected
                          ? "bg-primary"
                          : "bg-transparent",
                      )}
                    />
                    <ConversationAvatar conversation={conversation} />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="flex items-baseline gap-2">
                        <span className="min-w-0 truncate text-sm font-medium compact:text-xs">
                          {conversation.name}
                        </span>
                        {conversation.muted && (
                          <VolumeOffIcon
                            aria-label="Alerts hidden"
                            className="size-3 shrink-0 opacity-60"
                          />
                        )}
                        <span
                          className={cn(
                            "ml-auto shrink-0 text-xs",
                            !isSelected && "text-fg-muted",
                          )}
                        >
                          {conversation.time}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "line-clamp-2 text-sm/snug compact:text-xs/snug",
                          !isSelected && "text-fg-muted",
                        )}
                      >
                        {conversation.preview}
                      </span>
                    </span>
                  </button>
                  <Menu>
                    <Button
                      variant="quiet"
                      size="xs"
                      isIconOnly
                      aria-label="Conversation options"
                      className="absolute right-2 bottom-2 opacity-0 group-hover/row:opacity-100"
                    >
                      <PinIcon />
                    </Button>
                    <Popover placement="bottom end">
                      <ConversationMenu isPinned={false} />
                    </Popover>
                  </Menu>
                </li>
              )
            })}
          </ul>
        </div>
      </aside>

      <main
        className={cn(
          "flex min-w-0 flex-1 flex-col",
          pane === "list" && "max-md:hidden",
        )}
      >
        <header className="relative flex h-16 shrink-0 items-center justify-center border-b px-3">
          <Button
            variant="quiet"
            size="sm"
            className="absolute left-2 md:hidden"
            onPress={() => setPane("list")}
          >
            Back
          </Button>
          <button
            type="button"
            className="flex flex-col items-center gap-0.5 rounded-(--studio-radius-item) px-2 py-1 hover:bg-muted"
          >
            <ConversationAvatar conversation={selected} size="sm" />
            <span className="text-xs font-medium">
              {selected.members ? selected.name : firstName(selected.name)}
              {selected.members && (
                <span className="font-normal text-fg-muted">
                  {" "}
                  · {selected.members.length + 1} people
                </span>
              )}
            </span>
          </button>
          <div className="absolute right-3 flex items-center gap-1">
            <Tooltip>
              <Button
                variant="quiet"
                size="sm"
                isIconOnly
                aria-label="Video call"
              >
                <CameraIcon />
              </Button>
              <TooltipContent>Video call</TooltipContent>
            </Tooltip>
            <Tooltip>
              <Button variant="quiet" size="sm" isIconOnly aria-label="Details">
                <InfoIcon />
              </Button>
              <TooltipContent>Details</TooltipContent>
            </Tooltip>
          </div>
        </header>

        <div
          ref={scrollRef}
          role="log"
          className="min-h-0 flex-1 overflow-y-auto px-4 py-6 text-sm sm:px-6 compact:text-xs"
        >
          <div className="mx-auto max-w-3xl">
            <Thread conversation={selected} sent={selectedSent} />
          </div>
        </div>

        <form
          className="shrink-0 px-4 pb-4 sm:px-6"
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
        >
          <div className="mx-auto flex max-w-3xl items-center gap-2">
            <Menu>
              <Button variant="secondary" isIconOnly aria-label="Apps">
                <PlusIcon />
              </Button>
              <Popover placement="top start">
                <MenuContent className="min-w-48">
                  <MenuItem>
                    <ImageIcon />
                    Photos
                  </MenuItem>
                  <MenuItem>
                    <CameraIcon />
                    Camera
                  </MenuItem>
                  <MenuItem>
                    <MapIcon />
                    Location
                  </MenuItem>
                </MenuContent>
              </Popover>
            </Menu>
            <TextField
              aria-label="Message"
              value={draft}
              onChange={setDraft}
              className="flex-1"
            >
              <InputGroup>
                <Input placeholder="Message" />
                <InputGroupAddon>
                  <Button
                    variant="quiet"
                    size="sm"
                    isIconOnly
                    aria-label="Emoji"
                  >
                    <SmileIcon />
                  </Button>
                  {draft.trim() ? (
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      isIconOnly
                      aria-label="Send"
                    >
                      <ArrowUpIcon />
                    </Button>
                  ) : (
                    <Button
                      variant="quiet"
                      size="sm"
                      isIconOnly
                      aria-label="Record audio"
                    >
                      <AudioLinesIcon />
                    </Button>
                  )}
                </InputGroupAddon>
              </InputGroup>
            </TextField>
          </div>
        </form>
      </main>
    </div>
  )
}
