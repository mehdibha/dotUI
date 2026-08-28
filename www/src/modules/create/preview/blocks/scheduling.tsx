"use client"

import React from "react"
import type { CalendarDate } from "@internationalized/date"
import {
  getLocalTimeZone,
  startOfWeek,
  Time,
  today,
} from "@internationalized/date"

import {
  BellIcon,
  Building2Icon,
  CalendarIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  CopyIcon,
  MonitorIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PinIcon,
  PlusIcon,
  SettingsIcon,
  TimerIcon,
  TrashIcon,
  Users2Icon,
} from "@/registry/icons"
import { Responsive } from "@/registry/lib/responsive"
import { cn } from "@/registry/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeader,
  CalendarHeaderCell,
} from "@/registry/ui/calendar"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox"
import { CheckboxGroup } from "@/registry/ui/checkbox-group"
import { DatePicker } from "@/registry/ui/date-picker"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Drawer } from "@/registry/ui/drawer"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/registry/ui/empty"
import { Description, FieldGroup, Label } from "@/registry/ui/field"
import {
  DateInput,
  Input,
  InputGroup,
  InputGroupAddon,
  TextArea,
} from "@/registry/ui/input"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Modal } from "@/registry/ui/modal"
import { Popover } from "@/registry/ui/popover"
import { SearchField } from "@/registry/ui/search-field"
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
import { Separator } from "@/registry/ui/separator"
import { Switch, SwitchControl } from "@/registry/ui/switch"
import { TextField } from "@/registry/ui/text-field"
import { TimeField } from "@/registry/ui/time-field"
import { ToggleButton } from "@/registry/ui/toggle-button"
import { ToggleButtonGroup } from "@/registry/ui/toggle-button-group"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

/* --------------------------------- Data ----------------------------------- */

type Kind =
  | "standup"
  | "review"
  | "focus"
  | "interview"
  | "deadline"
  | "personal"

const KINDS: Record<
  Kind,
  {
    label: string
    variant: React.ComponentProps<typeof Badge>["variant"]
    dot: string
  }
> = {
  standup: { label: "Standup", variant: "accent", dot: "bg-accent" },
  review: { label: "Review", variant: "info", dot: "bg-info" },
  focus: { label: "Focus", variant: "success", dot: "bg-success" },
  interview: { label: "Interview", variant: "warning", dot: "bg-warning" },
  deadline: { label: "Deadline", variant: "danger", dot: "bg-danger" },
  personal: { label: "Personal", variant: "neutral", dot: "bg-fg-muted" },
}

const TEAM = [
  { id: "nadia", name: "Nadia Okoye", initials: "NO", role: "Design" },
  { id: "marcus", name: "Marcus Field", initials: "MF", role: "Engineering" },
  { id: "priya", name: "Priya Raman", initials: "PR", role: "Product" },
  { id: "tom", name: "Tom Delaney", initials: "TD", role: "Sales" },
  { id: "elena", name: "Elena Vasquez", initials: "EV", role: "Research" },
  { id: "jonas", name: "Jonas Kerr", initials: "JK", role: "Engineering" },
]

type Seed = {
  title: string
  offset: number
  start: number
  duration: number
  kind: Kind
  location: string
  people: string[]
}

const SEEDS: Seed[] = [
  {
    title: "Engineering standup",
    offset: -3,
    start: 540,
    duration: 15,
    kind: "standup",
    location: "Zoom",
    people: ["MF", "JK"],
  },
  {
    title: "Q3 roadmap review",
    offset: -2,
    start: 780,
    duration: 60,
    kind: "review",
    location: "Room 4B",
    people: ["PR", "NO", "TD"],
  },
  {
    title: "Interview — Staff designer",
    offset: -1,
    start: 600,
    duration: 45,
    kind: "interview",
    location: "Room 2A",
    people: ["NO", "PR"],
  },
  {
    title: "Daily standup",
    offset: 0,
    start: 540,
    duration: 15,
    kind: "standup",
    location: "Zoom",
    people: ["MF", "JK", "PR"],
  },
  {
    title: "Design review — booking flow",
    offset: 0,
    start: 630,
    duration: 45,
    kind: "review",
    location: "Room 4B",
    people: ["NO", "PR"],
  },
  {
    title: "Focus — pricing spec",
    offset: 0,
    start: 750,
    duration: 90,
    kind: "focus",
    location: "Anywhere",
    people: [],
  },
  {
    title: "1:1 with Priya Raman",
    offset: 0,
    start: 900,
    duration: 30,
    kind: "standup",
    location: "Zoom",
    people: ["PR"],
  },
  {
    title: "Sprint planning",
    offset: 1,
    start: 555,
    duration: 45,
    kind: "standup",
    location: "Room 4B",
    people: ["MF", "JK", "PR", "NO"],
  },
  {
    title: "Customer call — Halden Group",
    offset: 1,
    start: 840,
    duration: 45,
    kind: "review",
    location: "Zoom",
    people: ["TD", "PR"],
  },
  {
    title: "Interview — Backend engineer",
    offset: 2,
    start: 600,
    duration: 60,
    kind: "interview",
    location: "Room 2A",
    people: ["MF", "JK"],
  },
  {
    title: "Dentist",
    offset: 2,
    start: 810,
    duration: 30,
    kind: "personal",
    location: "Offsite",
    people: [],
  },
  {
    title: "Daily standup",
    offset: 3,
    start: 540,
    duration: 15,
    kind: "standup",
    location: "Zoom",
    people: ["MF", "JK", "PR"],
  },
  {
    title: "Focus — API cleanup",
    offset: 3,
    start: 720,
    duration: 120,
    kind: "focus",
    location: "Anywhere",
    people: [],
  },
  {
    title: "Design critique",
    offset: 4,
    start: 600,
    duration: 45,
    kind: "review",
    location: "Room 4B",
    people: ["NO", "EV"],
  },
  {
    title: "Team dinner",
    offset: 4,
    start: 1140,
    duration: 120,
    kind: "personal",
    location: "Offsite",
    people: ["NO", "MF", "PR", "TD"],
  },
  {
    title: "Monthly business review",
    offset: 7,
    start: 570,
    duration: 90,
    kind: "review",
    location: "Room 1",
    people: ["PR", "TD", "EV"],
  },
  {
    title: "Ship 4.2 to production",
    offset: 9,
    start: 600,
    duration: 30,
    kind: "deadline",
    location: "Anywhere",
    people: ["MF"],
  },
  {
    title: "Partner sync — Volta",
    offset: 11,
    start: 630,
    duration: 45,
    kind: "review",
    location: "Zoom",
    people: ["TD", "PR"],
  },
  {
    title: "Research offsite — Lisbon",
    offset: 14,
    start: 540,
    duration: 480,
    kind: "personal",
    location: "Offsite",
    people: ["EV", "NO"],
  },
]

type CalEvent = Omit<Seed, "offset"> & { id: string; date: CalendarDate }

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const AVAILABILITY_DAYS = [
  { id: "mon", label: "Mon" },
  { id: "tue", label: "Tue" },
  { id: "wed", label: "Wed" },
  { id: "thu", label: "Thu" },
  { id: "fri", label: "Fri" },
  { id: "sat", label: "Sat" },
  { id: "sun", label: "Sun" },
]

/* -------------------------------- Helpers --------------------------------- */

function formatTime(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const suffix = h < 12 ? "AM" : "PM"
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${suffix}`
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

function formatDay(date: CalendarDate, withYear = false) {
  return date.toDate(getLocalTimeZone()).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    ...(withYear ? { year: "numeric" } : {}),
  })
}

function locationIcon(location: string) {
  if (location.startsWith("Zoom")) return MonitorIcon
  if (location.startsWith("Room")) return Building2Icon
  return PinIcon
}

function compareEvents(a: CalEvent, b: CalEvent) {
  return a.date.compare(b.date) || a.start - b.start
}

/* ------------------------------- Primitives ------------------------------- */

function People({ initials }: { initials: string[] }) {
  if (initials.length === 0) return null
  const visible = initials.slice(0, 3)
  const overflow = initials.length - visible.length
  return (
    <AvatarGroup size="sm">
      {visible.map((i) => (
        <Avatar key={i}>
          <AvatarFallback>{i}</AvatarFallback>
        </Avatar>
      ))}
      {overflow > 0 && <AvatarGroupCount>+{overflow}</AvatarGroupCount>}
    </AvatarGroup>
  )
}

function EventRow({
  event,
  onRemove,
}: {
  event: CalEvent
  onRemove: (id: string) => void
}) {
  const kind = KINDS[event.kind]
  const LocationIcon = locationIcon(event.location)
  return (
    <li className="flex items-start gap-3 rounded-lg border bg-card p-3">
      <span className={cn("mt-1 h-9 w-1 shrink-0 rounded-full", kind.dot)} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex min-w-0 items-center gap-2">
          <span className="min-w-0 flex-1 truncate text-sm font-medium">
            {event.title}
          </span>
          <Badge variant={kind.variant} appearance="subtle" size="sm">
            {kind.label}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fg-muted">
          <span className="flex items-center gap-1">
            <ClockIcon className="size-3" />
            {formatTime(event.start)} · {formatDuration(event.duration)}
          </span>
          <span className="flex items-center gap-1">
            <LocationIcon className="size-3" />
            {event.location}
          </span>
        </div>
        <People initials={event.people} />
      </div>
      <Menu>
        <Button variant="quiet" size="sm" isIconOnly aria-label="Event actions">
          <MoreHorizontalIcon />
        </Button>
        <Popover>
          <MenuContent>
            <MenuItem textValue="Edit event">
              <PencilIcon />
              Edit event
            </MenuItem>
            <MenuItem textValue="Duplicate">
              <CopyIcon />
              Duplicate
            </MenuItem>
            <Separator />
            <MenuItem
              variant="danger"
              textValue="Delete"
              onAction={() => onRemove(event.id)}
            >
              <TrashIcon />
              Delete
            </MenuItem>
          </MenuContent>
        </Popover>
      </Menu>
    </li>
  )
}

function Stat({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string
  value: string
  hint: string
  icon: typeof CalendarIcon
}) {
  return (
    <Card size="sm">
      <CardContent className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-fg-muted">
          <Icon className="size-4" />
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="text-xs text-fg-muted">{label}</span>
          <span className="text-lg leading-tight font-semibold tabular-nums">
            {value}
          </span>
        </div>
        <span className="ml-auto hidden text-xs text-fg-muted sm:block">
          {hint}
        </span>
      </CardContent>
    </Card>
  )
}

/* --------------------------------- Views ---------------------------------- */

function MonthView({
  selected,
  onSelect,
  eventsOn,
}: {
  selected: CalendarDate
  onSelect: (date: CalendarDate) => void
  eventsOn: (date: CalendarDate) => CalEvent[]
}) {
  return (
    <Calendar
      aria-label="Team calendar"
      value={selected}
      onChange={(date) => date && onSelect(date)}
      className="w-full"
    >
      <CalendarHeader />
      <CalendarGrid className="w-full">
        <CalendarGridHeader>
          {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => (
            <CalendarCell
              date={date}
              className="flex aspect-auto h-16 w-full flex-col items-stretch justify-start gap-1 overflow-hidden rounded-md p-1 text-left transition-colors outline-none hover:bg-inverse/5! focus-visible:focus-ring sm:h-24 sm:p-2 outside-month:text-fg-muted/40 selected:bg-accent/15! selected:text-fg!"
            >
              {({ formattedDate, isOutsideMonth }) => {
                const dayEvents = eventsOn(date as CalendarDate)
                const visible = dayEvents.slice(0, 2)
                const overflow = dayEvents.length - visible.length
                return (
                  <>
                    <span className="text-center text-xs font-medium sm:text-left">
                      {formattedDate}
                    </span>
                    {!isOutsideMonth && dayEvents.length > 0 && (
                      <>
                        <div className="flex justify-center gap-0.5 sm:hidden">
                          {dayEvents.slice(0, 3).map((e) => (
                            <span
                              key={e.id}
                              className={cn(
                                "size-1.5 rounded-full",
                                KINDS[e.kind].dot,
                              )}
                            />
                          ))}
                        </div>
                        <div className="hidden min-w-0 flex-col items-stretch gap-0.5 sm:flex">
                          {visible.map((e) => (
                            <Badge
                              key={e.id}
                              variant={KINDS[e.kind].variant}
                              appearance="subtle"
                              size="sm"
                              className="flex w-full min-w-0 justify-start overflow-hidden"
                            >
                              <span className="min-w-0 flex-1 truncate">
                                {e.title}
                              </span>
                            </Badge>
                          ))}
                          {overflow > 0 && (
                            <span className="px-1 text-[10px] text-fg-muted">
                              +{overflow} more
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </>
                )
              }}
            </CalendarCell>
          )}
        </CalendarGridBody>
      </CalendarGrid>
    </Calendar>
  )
}

function WeekView({
  selected,
  onSelect,
  now,
  eventsOn,
}: {
  selected: CalendarDate
  onSelect: (date: CalendarDate) => void
  now: CalendarDate
  eventsOn: (date: CalendarDate) => CalEvent[]
}) {
  const start = startOfWeek(selected, "en-US")
  const days = Array.from({ length: 7 }, (_, i) => start.add({ days: i }))
  const shortDate = (date: CalendarDate) =>
    date
      .toDate(getLocalTimeZone())
      .toLocaleDateString(undefined, { month: "short", day: "numeric" })
  const rangeLabel = `${shortDate(start)} – ${shortDate(start.add({ days: 6 }))}`

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant="quiet"
          size="sm"
          isIconOnly
          aria-label="Previous week"
          onPress={() => onSelect(selected.subtract({ weeks: 1 }))}
        >
          <ChevronLeftIcon />
        </Button>
        <span className="text-sm font-medium">{rangeLabel}</span>
        <Button
          variant="quiet"
          size="sm"
          isIconOnly
          aria-label="Next week"
          onPress={() => onSelect(selected.add({ weeks: 1 }))}
        >
          <ChevronRightIcon />
        </Button>
        <Button size="sm" className="ml-auto" onPress={() => onSelect(now)}>
          Today
        </Button>
      </div>
      <div className="-mx-1 overflow-x-auto px-1">
        <div className="grid min-w-3xl grid-cols-7 gap-px overflow-hidden rounded-lg border bg-border">
          {days.map((day, i) => {
            const dayEvents = eventsOn(day)
            const isToday = day.compare(now) === 0
            const isSelected = day.compare(selected) === 0
            return (
              <div key={day.toString()} className="flex flex-col bg-bg">
                <button
                  type="button"
                  onClick={() => onSelect(day)}
                  className={cn(
                    "flex cursor-interactive flex-col items-start gap-0.5 border-b px-2 py-2 text-left transition-colors hover:bg-inverse/5",
                    isSelected && "bg-accent/10",
                  )}
                >
                  <span className="text-[10px] tracking-wide text-fg-muted uppercase">
                    {WEEKDAYS[i]}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-medium tabular-nums",
                      isToday && "text-accent",
                    )}
                  >
                    {day.day}
                  </span>
                </button>
                <div className="flex min-h-56 flex-col gap-1 p-1.5">
                  {dayEvents.map((e) => (
                    <div
                      key={e.id}
                      className="flex flex-col gap-0.5 rounded-md border bg-card p-1.5"
                    >
                      <span className="flex items-center gap-1 text-[10px] text-fg-muted tabular-nums">
                        <span
                          className={cn(
                            "size-1.5 shrink-0 rounded-full",
                            KINDS[e.kind].dot,
                          )}
                        />
                        {formatTime(e.start)}
                      </span>
                      <span className="line-clamp-2 text-xs font-medium">
                        {e.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function AgendaView({
  events,
  now,
  onRemove,
}: {
  events: CalEvent[]
  now: CalendarDate
  onRemove: (id: string) => void
}) {
  const upcoming = events
    .filter((e) => e.date.compare(now) >= 0)
    .sort(compareEvents)
    .slice(0, 14)

  const groups: { date: CalendarDate; items: CalEvent[] }[] = []
  for (const event of upcoming) {
    const last = groups.at(-1)
    if (last && last.date.compare(event.date) === 0) last.items.push(event)
    else groups.push({ date: event.date, items: [event] })
  }

  return (
    <div className="flex flex-col gap-5">
      {groups.map((group) => (
        <div key={group.date.toString()} className="flex flex-col gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium">
              {group.date.compare(now) === 0 ? "Today" : formatDay(group.date)}
            </span>
            <span className="text-xs text-fg-muted">
              {group.items.length}{" "}
              {group.items.length === 1 ? "event" : "events"}
            </span>
          </div>
          <ul className="flex flex-col gap-2">
            {group.items.map((event) => (
              <EventRow key={event.id} event={event} onRemove={onRemove} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------- New event -------------------------------- */

function NewEventDialog({
  defaultDate,
  onCreate,
}: {
  defaultDate: CalendarDate
  onCreate: (event: {
    title: string
    date: CalendarDate
    start: number
    kind: Kind
    location: string
    people: string[]
  }) => void
}) {
  const [isOpen, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState("Roadmap sync — Q4 planning")
  const [date, setDate] = React.useState<CalendarDate>(defaultDate)
  const [start, setStart] = React.useState<Time | null>(new Time(10, 30))
  const [kind, setKind] = React.useState("review")
  const [location, setLocation] = React.useState("Zoom")
  const [attendees, setAttendees] = React.useState<string[]>([
    "nadia",
    "marcus",
  ])

  const submit = () => {
    onCreate({
      title: title.trim() || "Untitled event",
      date,
      start: start ? start.hour * 60 + start.minute : 600,
      kind: kind as Kind,
      location,
      people: attendees.map(
        (id) => TEAM.find((m) => m.id === id)?.initials ?? "??",
      ),
    })
    setOpen(false)
  }

  const content = (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>New event</DialogTitle>
        <DialogDescription>
          Invite your team and hold the room. Everyone sees it on the shared
          calendar right away.
        </DialogDescription>
      </DialogHeader>
      <DialogBody className="gap-4">
        <TextField value={title} onChange={setTitle} className="w-full">
          <Label>Title</Label>
          <Input placeholder="Event title" className="w-full" />
        </TextField>

        <div className="grid gap-4 sm:grid-cols-2">
          <DatePicker
            value={date}
            onChange={(value) => value && setDate(value)}
            className="w-full"
          >
            <Label>Date</Label>
            <InputGroup>
              <DateInput />
              <InputGroupAddon>
                <Button
                  variant="secondary"
                  size="sm"
                  isIconOnly
                  aria-label="Pick a date"
                >
                  <CalendarIcon />
                </Button>
              </InputGroupAddon>
            </InputGroup>
            <Popover>
              <DialogContent>
                <Calendar />
              </DialogContent>
            </Popover>
          </DatePicker>

          <TimeField value={start} onChange={setStart} className="w-full">
            <Label>Starts at</Label>
            <DateInput />
          </TimeField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            className="w-full"
            value={kind}
            onChange={(value) => value && setKind(String(value))}
          >
            <Label>Type</Label>
            <SelectTrigger />
            <SelectContent>
              {(Object.keys(KINDS) as Kind[]).map((key) => (
                <SelectItem key={key} id={key}>
                  {KINDS[key].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            className="w-full"
            value={location}
            onChange={(value) => value && setLocation(String(value))}
          >
            <Label>Location</Label>
            <SelectTrigger />
            <SelectContent>
              <SelectItem id="Zoom">Zoom</SelectItem>
              <SelectItem id="Room 1">Room 1 — Atrium</SelectItem>
              <SelectItem id="Room 2A">Room 2A — Focus</SelectItem>
              <SelectItem id="Room 4B">Room 4B — Studio</SelectItem>
              <SelectItem id="Offsite">Offsite</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select<(typeof TEAM)[number], "multiple">
          className="w-full"
          selectionMode="multiple"
          value={attendees}
          onChange={(keys) => setAttendees(keys.map(String))}
          placeholder="Add teammates"
        >
          <Label>Attendees</Label>
          <SelectTrigger />
          <SelectContent selectionMode="multiple">
            {TEAM.map((member) => (
              <SelectItem
                key={member.id}
                id={member.id}
                textValue={member.name}
              >
                {member.name} · {member.role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <TextField className="w-full">
          <Label>Notes</Label>
          <TextArea
            placeholder="Agenda, links, prep work…"
            className="w-full"
            rows={3}
          />
        </TextField>

        <Switch defaultSelected>
          <SwitchControl />
          <Label>Send invites by email</Label>
        </Switch>
      </DialogBody>
      <DialogFooter>
        <Button slot="close">Cancel</Button>
        <Button variant="primary" onPress={submit}>
          <CheckIcon />
          Create event
        </Button>
      </DialogFooter>
    </DialogContent>
  )

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (open) setDate(defaultDate)
        setOpen(open)
      }}
    >
      <Button variant="primary">
        <PlusIcon />
        New event
      </Button>
      <Responsive
        render={(isMobile) =>
          isMobile ? <Drawer>{content}</Drawer> : <Modal>{content}</Modal>
        }
      />
    </Dialog>
  )
}

/* ---------------------------------- Page ---------------------------------- */

export default function Scheduling() {
  const now = React.useMemo(() => today(getLocalTimeZone()), [])
  const [events, setEvents] = React.useState<CalEvent[]>(() =>
    SEEDS.map(({ offset, ...seed }, index) => ({
      ...seed,
      id: `seed-${index}`,
      date: now.add({ days: offset }),
    })),
  )
  const [selected, setSelected] = React.useState<CalendarDate>(now)
  const [view, setView] = React.useState("month")
  const [availableDays, setAvailableDays] = React.useState(5)
  const [hoursStart, setHoursStart] = React.useState<Time | null>(
    new Time(9, 0),
  )
  const [hoursEnd, setHoursEnd] = React.useState<Time | null>(new Time(17, 30))
  const nextId = React.useRef(0)

  const byDay = React.useMemo(() => {
    const map = new Map<string, CalEvent[]>()
    for (const event of [...events].sort(compareEvents)) {
      const key = event.date.toString()
      map.set(key, [...(map.get(key) ?? []), event])
    }
    return map
  }, [events])

  const eventsOn = React.useCallback(
    (date: CalendarDate) => byDay.get(date.toString()) ?? [],
    [byDay],
  )

  const removeEvent = React.useCallback(
    (id: string) => setEvents((prev) => prev.filter((e) => e.id !== id)),
    [],
  )

  const selectedEvents = eventsOn(selected)
  const weekStart = startOfWeek(now, "en-US")
  const weekEnd = weekStart.add({ days: 6 })
  const weekEvents = events.filter(
    (e) => e.date.compare(weekStart) >= 0 && e.date.compare(weekEnd) <= 0,
  )
  const meetingMinutes = weekEvents
    .filter((e) => e.kind !== "focus" && e.kind !== "personal")
    .reduce((total, e) => total + e.duration, 0)
  const focusMinutes = weekEvents
    .filter((e) => e.kind === "focus")
    .reduce((total, e) => total + e.duration, 0)
  const upcoming = events
    .filter((e) => e.date.compare(now) >= 0)
    .sort(compareEvents)
    .slice(0, 5)

  const hoursLabel =
    hoursStart && hoursEnd
      ? `${formatTime(hoursStart.hour * 60 + hoursStart.minute)} – ${formatTime(
          hoursEnd.hour * 60 + hoursEnd.minute,
        )}`
      : "Not set"

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-20 border-b bg-bg/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-fg-on-primary">
            <CalendarIcon className="size-4" />
          </span>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold">Cadence</span>
            <span className="hidden text-xs text-fg-muted sm:block">
              Northwind product team
            </span>
          </div>
          <SearchField
            aria-label="Search events"
            className="ml-4 hidden w-56 lg:flex"
          >
            <Input placeholder="Search events" />
          </SearchField>
          <div className="ml-auto flex items-center gap-2">
            <Tooltip>
              <Button variant="quiet" isIconOnly aria-label="Notifications">
                <BellIcon />
              </Button>
              <TooltipContent>3 pending invites</TooltipContent>
            </Tooltip>
            <Tooltip>
              <Button
                variant="quiet"
                isIconOnly
                aria-label="Calendar settings"
                className="hidden sm:inline-flex"
              >
                <SettingsIcon />
              </Button>
              <TooltipContent>Calendar settings</TooltipContent>
            </Tooltip>
            <NewEventDialog
              defaultDate={selected}
              onCreate={(event) =>
                setEvents((prev) => [
                  ...prev,
                  { ...event, id: `new-${nextId.current++}`, duration: 45 },
                ])
              }
            />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Schedule
          </h1>
          <p className="text-sm text-fg-muted">
            {formatDay(now, true)} · {selectedEvents.length} event
            {selectedEvents.length === 1 ? "" : "s"} on the selected day.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat
            label="This week"
            value={`${weekEvents.length} events`}
            hint="across 6 people"
            icon={CalendarIcon}
          />
          <Stat
            label="In meetings"
            value={formatDuration(meetingMinutes)}
            hint="of a 40h week"
            icon={Users2Icon}
          />
          <Stat
            label="Focus time"
            value={formatDuration(focusMinutes)}
            hint="protected"
            icon={TimerIcon}
          />
          <Stat
            label="Pending invites"
            value="3"
            hint="awaiting reply"
            icon={BellIcon}
          />
        </div>

        <Card>
          <CardContent className="flex flex-col gap-5 lg:flex-row lg:items-end lg:gap-8">
            <div className="flex min-w-0 flex-col gap-2">
              <Label id="availability-label">Weekly availability</Label>
              <div className="-m-1 overflow-x-auto p-1">
                <ToggleButtonGroup
                  aria-labelledby="availability-label"
                  selectionMode="multiple"
                  defaultSelectedKeys={["mon", "tue", "wed", "thu", "fri"]}
                  onSelectionChange={(keys) => setAvailableDays(keys.size)}
                >
                  {AVAILABILITY_DAYS.map((day) => (
                    <ToggleButton key={day.id} id={day.id}>
                      {day.label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </div>
              <Description>
                Bookable {availableDays} day{availableDays === 1 ? "" : "s"} a
                week · {hoursLabel}
              </Description>
            </div>
            <Separator
              orientation="vertical"
              className="hidden h-12 lg:block"
            />
            <div className="flex flex-wrap items-end gap-4">
              <TimeField
                value={hoursStart}
                onChange={setHoursStart}
                className="w-36"
              >
                <Label>Day starts</Label>
                <DateInput />
              </TimeField>
              <TimeField
                value={hoursEnd}
                onChange={setHoursEnd}
                className="w-36"
              >
                <Label>Day ends</Label>
                <DateInput />
              </TimeField>
            </div>
            <Switch defaultSelected className="lg:ml-auto">
              <SwitchControl />
              <Label>Auto-decline outside hours</Label>
            </Switch>
          </CardContent>
        </Card>

        <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle>Team calendar</CardTitle>
              <CardDescription className="hidden sm:block">
                Shared across product, design and engineering.
              </CardDescription>
              <CardAction>
                <SegmentedControl
                  aria-label="Calendar view"
                  selectedKeys={[view]}
                  onSelectionChange={(keys) => {
                    const next = [...keys][0]
                    if (next) setView(String(next))
                  }}
                >
                  <SegmentedControlItem id="month">Month</SegmentedControlItem>
                  <SegmentedControlItem id="week">Week</SegmentedControlItem>
                  <SegmentedControlItem id="agenda">
                    Agenda
                  </SegmentedControlItem>
                </SegmentedControl>
              </CardAction>
            </CardHeader>
            <CardContent>
              {view === "month" && (
                <MonthView
                  selected={selected}
                  onSelect={setSelected}
                  eventsOn={eventsOn}
                />
              )}
              {view === "week" && (
                <WeekView
                  selected={selected}
                  onSelect={setSelected}
                  now={now}
                  eventsOn={eventsOn}
                />
              )}
              {view === "agenda" && (
                <AgendaView events={events} now={now} onRemove={removeEvent} />
              )}
            </CardContent>
          </Card>

          <aside className="flex min-w-0 flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {selected.compare(now) === 0 ? "Today" : formatDay(selected)}
                </CardTitle>
                <CardDescription>
                  {selectedEvents.length === 0
                    ? "Nothing scheduled"
                    : `${selectedEvents.length} event${
                        selectedEvents.length === 1 ? "" : "s"
                      } · ${formatDuration(
                        selectedEvents.reduce((t, e) => t + e.duration, 0),
                      )} booked`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedEvents.length === 0 ? (
                  <Empty>
                    <EmptyHeader>
                      <EmptyTitle>A clear day</EmptyTitle>
                      <EmptyDescription>
                        No events on this date yet — a good slot for deep work.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {selectedEvents.map((event) => (
                      <EventRow
                        key={event.id}
                        event={event}
                        onRemove={removeEvent}
                      />
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Upcoming</CardTitle>
                <CardDescription>
                  The next five on your calendar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col divide-y">
                  {upcoming.map((event) => {
                    const kind = KINDS[event.kind]
                    return (
                      <li
                        key={event.id}
                        className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
                      >
                        <div className="flex w-11 shrink-0 flex-col items-center">
                          <span className="text-[10px] tracking-wide text-fg-muted uppercase">
                            {
                              WEEKDAYS[
                                event.date.toDate(getLocalTimeZone()).getDay()
                              ]
                            }
                          </span>
                          <span className="text-sm font-semibold tabular-nums">
                            {event.date.day}
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <span className="truncate text-sm font-medium">
                            {event.title}
                          </span>
                          <span className="text-xs text-fg-muted tabular-nums">
                            {formatTime(event.start)} ·{" "}
                            {formatDuration(event.duration)}
                          </span>
                        </div>
                        <Badge
                          variant={kind.variant}
                          appearance="subtle"
                          size="sm"
                        >
                          {kind.label}
                        </Badge>
                      </li>
                    )
                  })}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Calendars</CardTitle>
              </CardHeader>
              <CardContent>
                <CheckboxGroup
                  aria-label="Visible calendars"
                  defaultValue={["team", "personal", "interviews"]}
                >
                  <FieldGroup>
                    <Checkbox value="team">
                      <CheckboxControl />
                      <Label>Product team</Label>
                    </Checkbox>
                    <Checkbox value="personal">
                      <CheckboxControl />
                      <Label>Personal</Label>
                    </Checkbox>
                    <Checkbox value="interviews">
                      <CheckboxControl />
                      <Label>Hiring loop</Label>
                    </Checkbox>
                    <Checkbox value="holidays">
                      <CheckboxControl />
                      <Label>Company holidays</Label>
                    </Checkbox>
                  </FieldGroup>
                </CheckboxGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Who's on today</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {TEAM.slice(0, 4).map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <Avatar size="sm">
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm">{member.name}</span>
                      <span className="text-xs text-fg-muted">
                        {member.role}
                      </span>
                    </div>
                    <Badge
                      variant={member.id === "tom" ? "warning" : "success"}
                      appearance="subtle"
                      size="sm"
                    >
                      {member.id === "tom" ? "Away" : "Free"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  )
}
