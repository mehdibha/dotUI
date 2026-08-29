"use client"

import React from "react"
import type { CalendarDate } from "@internationalized/date"
import { getLocalTimeZone, today } from "@internationalized/date"

import {
  ArrowLeftIcon,
  CalendarIcon,
  CircleCheckIcon,
  ClockIcon,
  GlobeIcon,
  MonitorIcon,
  PlusIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Calendar } from "@/registry/ui/calendar"
import { Label } from "@/registry/ui/field"
import { Input, TextArea } from "@/registry/ui/input"
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
import { TextField } from "@/registry/ui/text-field"

/* --------------------------------- Data ----------------------------------- */

const HOST = { name: "Nadia Okoye", initials: "NO" }

const EVENT = {
  title: "Product walkthrough",
  description:
    "A quick call to walk through the product, answer questions and see if it fits your team.",
}

const DURATIONS = [15, 30, 45, 60]

const TIMEZONES = [
  "America/Los_Angeles",
  "America/New_York",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Australia/Sydney",
]

const DAY_START = 9 * 60
const DAY_END = 17 * 60

/* -------------------------------- Helpers --------------------------------- */

function timezoneLabel(zone: string) {
  const city = zone.split("/").at(-1)?.replaceAll("_", " ") ?? zone
  return city
}

function isWeekend(date: CalendarDate) {
  const day = date.toDate(getLocalTimeZone()).getDay()
  return day === 0 || day === 6
}

// Deterministic "already booked" slots so the grid looks organic without
// changing between renders.
function isBooked(date: CalendarDate, minutes: number) {
  return (date.day * 31 + date.month * 7 + minutes / 5) % 7 < 2
}

function slotsFor(date: CalendarDate, duration: number) {
  const slots: number[] = []
  for (let t = DAY_START; t + duration <= DAY_END; t += duration) {
    if (!isBooked(date, t)) slots.push(t)
  }
  return slots
}

function formatSlot(minutes: number, use24: boolean) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (use24)
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
  return `${h % 12 || 12}:${String(m).padStart(2, "0")}${h < 12 ? "am" : "pm"}`
}

function formatDay(date: CalendarDate, options: Intl.DateTimeFormatOptions) {
  return date.toDate(getLocalTimeZone()).toLocaleDateString(undefined, options)
}

/* ------------------------------- Event meta -------------------------------- */

function EventPane({
  duration,
  onDurationChange,
  timezone,
  onTimezoneChange,
  booking,
}: {
  duration: number
  onDurationChange: (minutes: number) => void
  timezone: string
  onTimezoneChange: (zone: string) => void
  booking: { date: CalendarDate; slot: number; use24: boolean } | null
}) {
  return (
    <div className="flex flex-col gap-4 p-6 lg:w-72 lg:shrink-0">
      <div className="flex flex-col gap-2">
        <Avatar size="lg">
          <AvatarFallback>{HOST.initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm text-fg-muted">{HOST.name}</span>
          <h1 className="text-xl font-semibold tracking-tight">
            {EVENT.title}
          </h1>
        </div>
        <p className="text-sm text-fg-muted">{EVENT.description}</p>
      </div>

      <div className="flex flex-col gap-3 text-sm">
        {booking && (
          <div className="flex items-start gap-2.5 font-medium">
            <CalendarIcon className="mt-0.5 size-4 shrink-0 text-fg-muted" />
            <span>
              {formatDay(booking.date, {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
              <br />
              {formatSlot(booking.slot, booking.use24)} –{" "}
              {formatSlot(booking.slot + duration, booking.use24)}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2.5">
          <ClockIcon className="size-4 shrink-0 text-fg-muted" />
          {booking ? (
            <span className="font-medium">{duration} minutes</span>
          ) : (
            <Select
              aria-label="Meeting duration"
              value={String(duration)}
              onChange={(value) => value && onDurationChange(Number(value))}
            >
              <SelectTrigger className="w-32" />
              <SelectContent>
                {DURATIONS.map((minutes) => (
                  <SelectItem key={minutes} id={String(minutes)}>
                    {minutes} min
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          <MonitorIcon className="size-4 shrink-0 text-fg-muted" />
          <span className="font-medium">Zoom</span>
        </div>
        <div className="flex items-center gap-2.5">
          <GlobeIcon className="size-4 shrink-0 text-fg-muted" />
          <Select
            aria-label="Timezone"
            value={timezone}
            onChange={(value) => value && onTimezoneChange(String(value))}
          >
            <SelectTrigger className="w-44" />
            <SelectContent>
              {TIMEZONES.map((zone) => (
                <SelectItem
                  key={zone}
                  id={zone}
                  textValue={timezoneLabel(zone)}
                >
                  {timezoneLabel(zone)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

/* --------------------------------- Slots ----------------------------------- */

function SlotsPane({
  date,
  duration,
  use24,
  onUse24Change,
  selectedSlot,
  onSelectSlot,
  onConfirm,
}: {
  date: CalendarDate
  duration: number
  use24: boolean
  onUse24Change: (use24: boolean) => void
  selectedSlot: number | null
  onSelectSlot: (slot: number) => void
  onConfirm: () => void
}) {
  const slots = slotsFor(date, duration)
  return (
    <div className="flex min-h-0 flex-col lg:w-60 lg:shrink-0">
      <div className="flex items-center justify-between gap-2 p-6 pb-3">
        <span className="text-sm font-semibold">
          {formatDay(date, { weekday: "short" })}{" "}
          <span className="font-normal text-fg-muted">{date.day}</span>
        </span>
        <SegmentedControl
          aria-label="Time format"
          selectedKeys={[use24 ? "24h" : "12h"]}
          onSelectionChange={(keys) => onUse24Change([...keys][0] === "24h")}
        >
          <SegmentedControlItem id="12h">12h</SegmentedControlItem>
          <SegmentedControlItem id="24h">24h</SegmentedControlItem>
        </SegmentedControl>
      </div>
      <div className="flex flex-col gap-2 px-6 pb-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        {slots.map((slot) =>
          slot === selectedSlot ? (
            <div key={slot} className="flex gap-2">
              <Button className="pointer-events-none flex-1 tabular-nums">
                {formatSlot(slot, use24)}
              </Button>
              <Button variant="primary" className="flex-1" onPress={onConfirm}>
                Confirm
              </Button>
            </div>
          ) : (
            <Button
              key={slot}
              className="w-full font-medium text-accent tabular-nums"
              onPress={() => onSelectSlot(slot)}
            >
              {formatSlot(slot, use24)}
            </Button>
          ),
        )}
      </div>
    </div>
  )
}

/* ---------------------------------- Form ------------------------------------ */

function DetailsPane({
  name,
  onNameChange,
  email,
  onEmailChange,
  notes,
  onNotesChange,
  onBack,
  onBook,
}: {
  name: string
  onNameChange: (value: string) => void
  email: string
  onEmailChange: (value: string) => void
  notes: string
  onNotesChange: (value: string) => void
  onBack: () => void
  onBook: () => void
}) {
  const [showGuests, setShowGuests] = React.useState(false)
  return (
    <div className="flex min-h-0 flex-1 flex-col lg:overflow-y-auto">
      <div className="flex flex-col gap-4 p-6">
        <TextField value={name} onChange={onNameChange} className="w-full">
          <Label>Your name</Label>
          <Input placeholder="Ada Lovelace" className="w-full" />
        </TextField>
        <TextField
          value={email}
          onChange={onEmailChange}
          type="email"
          className="w-full"
        >
          <Label>Email address</Label>
          <Input placeholder="ada@example.com" className="w-full" />
        </TextField>
        {showGuests ? (
          <TextField className="w-full">
            <Label>Guests</Label>
            <Input
              placeholder="guest@example.com, guest2@example.com"
              className="w-full"
            />
          </TextField>
        ) : (
          <Button
            variant="quiet"
            className="self-start"
            onPress={() => setShowGuests(true)}
          >
            <PlusIcon />
            Add guests
          </Button>
        )}
        <TextField value={notes} onChange={onNotesChange} className="w-full">
          <Label>Additional notes</Label>
          <TextArea
            placeholder="Anything that will help prepare for the meeting…"
            className="w-full"
            rows={3}
          />
        </TextField>
        <p className="text-xs text-fg-muted">
          By proceeding, you agree to our terms and privacy policy.
        </p>
        <div className="mt-auto flex justify-end gap-2">
          <Button variant="quiet" onPress={onBack}>
            <ArrowLeftIcon />
            Back
          </Button>
          <Button variant="primary" onPress={onBook}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------- Confirmed --------------------------------- */

function ConfirmedPane({
  booking,
  duration,
  timezone,
  name,
  email,
  notes,
  onReset,
}: {
  booking: { date: CalendarDate; slot: number; use24: boolean }
  duration: number
  timezone: string
  name: string
  email: string
  notes: string
  onReset: () => void
}) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 p-8 text-center lg:justify-center">
      <CircleCheckIcon className="size-10 text-success" />
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight">
          This meeting is scheduled
        </h1>
        <p className="text-sm text-fg-muted">
          We sent an email with a calendar invitation with the details to
          everyone.
        </p>
      </div>
      <Separator />
      <dl className="grid w-full grid-cols-[5rem_1fr] gap-x-4 gap-y-3 text-left text-sm">
        <dt className="font-medium">What</dt>
        <dd className="text-fg-muted">
          {EVENT.title} between {HOST.name} and {name.trim() || "you"}
        </dd>
        <dt className="font-medium">When</dt>
        <dd className="text-fg-muted">
          {formatDay(booking.date, {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
          <br />
          {formatSlot(booking.slot, booking.use24)} –{" "}
          {formatSlot(booking.slot + duration, booking.use24)} (
          {timezoneLabel(timezone)})
        </dd>
        <dt className="font-medium">Who</dt>
        <dd className="text-fg-muted">
          <span className="flex items-center gap-1.5">
            {HOST.name}
            <Badge variant="accent" appearance="subtle" size="sm">
              Host
            </Badge>
          </span>
          {email.trim() || "you@example.com"}
        </dd>
        <dt className="font-medium">Where</dt>
        <dd className="text-fg-muted">Zoom — link in the invite</dd>
        {notes.trim() && (
          <>
            <dt className="font-medium">Notes</dt>
            <dd className="text-fg-muted">{notes}</dd>
          </>
        )}
      </dl>
      <Separator />
      <p className="text-sm text-fg-muted">
        Need to make a change?{" "}
        <Button variant="link" size="sm" className="h-auto p-0">
          Reschedule
        </Button>{" "}
        or{" "}
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0"
          onPress={onReset}
        >
          Cancel
        </Button>
      </p>
      <Button onPress={onReset}>
        <CalendarIcon />
        Schedule another meeting
      </Button>
    </div>
  )
}

/* ---------------------------------- Page ------------------------------------ */

export default function Scheduling() {
  const now = React.useMemo(() => today(getLocalTimeZone()), [])
  const firstAvailable = React.useMemo(() => {
    let date = now
    while (isWeekend(date)) date = date.add({ days: 1 })
    return date
  }, [now])

  const [step, setStep] = React.useState<"slots" | "details" | "confirmed">(
    "slots",
  )
  const [selectedDate, setSelectedDate] =
    React.useState<CalendarDate>(firstAvailable)
  const [selectedSlot, setSelectedSlot] = React.useState<number | null>(null)
  const [duration, setDuration] = React.useState(30)
  const [use24, setUse24] = React.useState(false)
  const [timezone, setTimezone] = React.useState(() => {
    const local = getLocalTimeZone()
    return TIMEZONES.includes(local) ? local : "Europe/Paris"
  })
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [notes, setNotes] = React.useState("")

  const booking =
    selectedSlot === null
      ? null
      : { date: selectedDate, slot: selectedSlot, use24 }

  const reset = () => {
    setStep("slots")
    setSelectedSlot(null)
    setName("")
    setEmail("")
    setNotes("")
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3 overflow-hidden bg-bg p-4 text-fg sm:p-6">
      <div
        className={cn(
          "flex min-h-0 w-full max-w-4xl flex-col overflow-y-auto rounded-xl border bg-card shadow-xs",
          "lg:h-[560px] lg:max-h-full lg:flex-row lg:divide-x lg:overflow-hidden",
          "max-lg:divide-y",
          step === "confirmed" && "lg:h-auto lg:max-w-xl lg:divide-x-0",
        )}
      >
        {step === "confirmed" && booking ? (
          <ConfirmedPane
            booking={booking}
            duration={duration}
            timezone={timezone}
            name={name}
            email={email}
            notes={notes}
            onReset={reset}
          />
        ) : (
          <>
            <EventPane
              duration={duration}
              onDurationChange={(minutes) => {
                setDuration(minutes)
                setSelectedSlot(null)
              }}
              timezone={timezone}
              onTimezoneChange={setTimezone}
              booking={step === "details" ? booking : null}
            />
            {step === "slots" ? (
              <>
                <div className="flex flex-1 items-start justify-center p-6">
                  <Calendar
                    aria-label="Pick a date"
                    value={selectedDate}
                    onChange={(date) => {
                      if (!date) return
                      setSelectedDate(date)
                      setSelectedSlot(null)
                    }}
                    minValue={now}
                    maxValue={now.add({ days: 45 })}
                    isDateUnavailable={(date) =>
                      isWeekend(date as CalendarDate)
                    }
                    style={{ "--cell-size": "2.75rem" } as React.CSSProperties}
                  />
                </div>
                <SlotsPane
                  date={selectedDate}
                  duration={duration}
                  use24={use24}
                  onUse24Change={setUse24}
                  selectedSlot={selectedSlot}
                  onSelectSlot={setSelectedSlot}
                  onConfirm={() => setStep("details")}
                />
              </>
            ) : (
              <DetailsPane
                name={name}
                onNameChange={setName}
                email={email}
                onEmailChange={setEmail}
                notes={notes}
                onNotesChange={setNotes}
                onBack={() => setStep("slots")}
                onBook={() => setStep("confirmed")}
              />
            )}
          </>
        )}
      </div>
      <span className="text-xs text-fg-muted">
        Powered by <span className="font-semibold">Cadence</span>
      </span>
    </div>
  )
}
