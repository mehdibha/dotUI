'use client'

import { cn } from '@/registry/lib/utils'
import { Avatar, AvatarFallback } from '@/registry/ui/avatar'

import { DemoCaret, useAutoplay } from '../autoplay'

// A faithful, looping reproduction of the Mention component: at rest the
// suggestions popover is open on an active `@` query; on hover the scene plays —
// pick the first suggestion, keep writing, then `@`-mention a second person.
// Every surface uses the real design-system token classes (field, popover,
// highlighted menu item) so it restyles under any preset.

interface Person {
  id: string
  name: string
}

const PEOPLE: Person[] = [
  { id: 'alexmiller', name: 'Alex Miller' },
  { id: 'amandarivera', name: 'Amanda Rivera' },
  { id: 'sarahjones', name: 'Sarah Jones' },
  { id: 'davidkim', name: 'David Kim' },
  { id: 'emmawatson', name: 'Emma Watson' },
]

// The people matching the active `@` query, minus anyone already mentioned.
function suggestions(query: string | null, mentioned: string[]): Person[] {
  if (query === null) return []
  const q = query.toLowerCase()
  return PEOPLE.filter((p) => {
    if (mentioned.includes(p.id)) return false
    if (q === '') return true
    return (
      p.name.toLowerCase().replace(/\s+/g, '').startsWith(q) ||
      p.id.startsWith(q)
    )
  }).slice(0, 3)
}

interface Part {
  mention: boolean
  text: string
}

interface Frame {
  parts: Part[]
  query: string | null
  pressing: boolean
  /** How long this frame holds before advancing, in ms. */
  d: number
}

// Author the scene once as a flat list of keyframes; feeding the durations into
// `useAutoplay` gives looping, hover-gating and reduced-motion for free, and the
// resting frame (index 0) is the "popover already open" default.
function buildFrames(): Frame[] {
  const frames: Frame[] = []
  const parts: Part[] = [{ mention: false, text: 'Great work ' }]
  let query: string | null = null

  const snap = (d: number, pressing = false) =>
    frames.push({ parts: parts.map((p) => ({ ...p })), query, pressing, d })

  const typeText = (text: string, per = 90) => {
    let tail = parts[parts.length - 1]
    if (!tail || tail.mention) {
      tail = { mention: false, text: '' }
      parts.push(tail)
    }
    for (const ch of text) {
      tail.text += ch
      snap(per)
    }
  }

  const typeQuery = (text: string, per = 105) => {
    for (const ch of text) {
      query = (query ?? '') + ch
      snap(per)
    }
  }

  const select = (id: string) => {
    snap(220, true) // press the highlighted suggestion
    parts.push({ mention: true, text: id })
    parts.push({ mention: false, text: ' ' })
    query = null
  }

  // First mention query is already open at rest.
  query = 'a'
  snap(1300)
  select('alexmiller')
  snap(650)
  typeText('and ')
  snap(320)
  // Type `@` to open the picker again, narrow it, and mention a second person.
  query = ''
  snap(380)
  typeQuery('sa')
  snap(620)
  select('sarahjones')
  snap(1700)

  return frames
}

const FRAMES = buildFrames()
const PHASES = FRAMES.map((f, i) => ({ name: String(i), duration: f.d }))
const REST_FRAME: Frame = FRAMES[0] ?? {
  parts: [],
  query: null,
  pressing: false,
  d: 0,
}

const EASE = 'cubic-bezier(0.32,0.72,0,1)'

/** The popover unfolds out of the column flow, riding the field up as it opens. */
function Surface({
  open,
  children,
}: {
  open: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className="grid overflow-hidden"
      style={{
        gridTemplateRows: open ? '1fr' : '0fr',
        transition: `grid-template-rows 300ms ${EASE}`,
      }}
    >
      <div className="min-h-0">
        <div
          className="pt-2"
          style={{
            opacity: open ? 1 : 0,
            transform: open ? 'none' : 'translateY(-4px) scale(0.96)',
            transition: `opacity 200ms ease, transform 260ms ${EASE}`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export function MentionDemo() {
  const { index } = useAutoplay(PHASES)
  const frame = FRAMES[index] ?? REST_FRAME
  const mentioned = frame.parts.filter((p) => p.mention).map((p) => p.text)
  const items = suggestions(frame.query, mentioned)
  const open = items.length > 0

  return (
    <div className="absolute inset-0 flex items-center justify-center px-6">
      <div className="flex w-full max-w-[19rem] flex-col">
        <div className="rounded-(--input-radius) border border-border-focus bg-field px-3 py-2.5 text-sm/relaxed text-fg ring-2 ring-border-focus-muted">
          <span className="break-words whitespace-pre-wrap">
            {frame.parts.map((p, i) =>
              p.mention ? (
                <span
                  key={i}
                  className="rounded-sm bg-muted px-1 font-medium text-fg"
                >
                  @{p.text}
                </span>
              ) : (
                <span key={i}>{p.text}</span>
              ),
            )}
            {frame.query !== null && <span>@{frame.query}</span>}
            <DemoCaret />
          </span>
        </div>

        <Surface open={open}>
          <div
            data-popover=""
            className="rounded-(--popover-radius) border bg-popover p-1 shadow-md"
          >
            {items.map((person, i) => {
              const active = i === 0
              return (
                <div
                  key={person.id}
                  className={cn(
                    'flex items-center gap-2 rounded-sm px-2 py-1.5 transition-transform',
                    active && 'bg-highlight text-fg-on-highlight',
                    active && frame.pressing && 'scale-[0.98]',
                  )}
                >
                  <Avatar size="sm">
                    <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-col leading-tight">
                    <span className="truncate text-[0.8rem] font-medium">
                      {person.name}
                    </span>
                    <span
                      className={cn(
                        'truncate text-xs',
                        active ? 'text-fg-on-highlight/70' : 'text-fg-muted',
                      )}
                    >
                      @{person.id}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </Surface>
      </div>
    </div>
  )
}
