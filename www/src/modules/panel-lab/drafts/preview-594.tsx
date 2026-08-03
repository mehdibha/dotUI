'use client'

/* Draft #594 — the hover preview rail. A FRAME experiment, not a section one:
   the panel chrome is the v2 frame verbatim, but hovering a section floats a
   live preview card beside the panel, aligned with the hovered card. One
   shared container stays mounted across sections — it glides to the new card
   and morphs its height while the content crossfades, so moving down the
   panel reads as one surface retargeting, never popping tooltips.

   Motion model: glide + height share one no-bounce spring (they must move as
   a unit); content swaps with a short direction-aware ease-out fade; the
   container itself enters/exits with a scale fade. Reduced motion drops the
   glide and offsets, keeping only fades. */

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  BellIcon,
  CalendarIcon,
  ChevronsUpDownIcon,
  HeartIcon,
  HouseIcon,
  MailIcon,
  MousePointerClickIcon,
  SearchIcon,
  SendIcon,
  SettingsIcon,
  StarIcon,
  TrashIcon,
} from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { Button } from '@/registry/ui/button'

import type { Lab } from '../data'
import { ChapterCard } from '../variants/chapter'
import type { Chapter } from '../variants/chapter'

const PREVIEW_W = 300
/* The page mounts the panel at this fixed height (version-page.tsx). */
const FRAME_H = 720
const EASE_OUT = [0.215, 0.61, 0.355, 1] as const
const GLIDE = {
  type: 'spring',
  stiffness: 500,
  damping: 46,
  mass: 0.8,
} as const

interface Hovered {
  id: string
  /** Card top relative to the frame, unclamped. */
  top: number
  /** +1 when the hover moved down the panel, -1 up — steers the crossfade. */
  dir: 1 | -1
}

export function HoverPreviewFrame({
  chapters,
  lab,
}: {
  chapters: Chapter[]
  lab: Lab
}) {
  const reduce = useReducedMotion()
  const frameRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef(new Map<string, HTMLDivElement>())
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const contentObserver = useRef<ResizeObserver>(undefined)
  const [hovered, setHovered] = useState<Hovered | null>(null)
  const [contentH, setContentH] = useState(0)

  useEffect(() => () => clearTimeout(leaveTimer.current), [])

  const topOf = (id: string) => {
    const frame = frameRef.current
    const card = cardRefs.current.get(id)
    if (!frame || !card) return 0
    return card.getBoundingClientRect().top - frame.getBoundingClientRect().top
  }

  const hoverCard = (id: string) => {
    clearTimeout(leaveTimer.current)
    setHovered((prev) => ({
      id,
      top: topOf(id),
      dir:
        prev &&
        chapters.findIndex((c) => c.id === id) <
          chapters.findIndex((c) => c.id === prev.id)
          ? -1
          : 1,
    }))
  }

  /* Grace delay so brushing past the panel edge doesn't flicker the card. */
  const scheduleLeave = () => {
    clearTimeout(leaveTimer.current)
    leaveTimer.current = setTimeout(() => setHovered(null), 120)
  }

  /* Keep the preview glued to its card while the panel scrolls under it. */
  const onScroll = () => {
    setHovered((prev) => prev && { ...prev, top: topOf(prev.id) })
  }

  const measureRef = useCallback((node: HTMLDivElement | null) => {
    contentObserver.current?.disconnect()
    if (!node) return
    const observer = new ResizeObserver(() => setContentH(node.offsetHeight))
    observer.observe(node)
    contentObserver.current = observer
  }, [])

  const active = hovered && chapters.find((c) => c.id === hovered.id)
  /* Align with the card, but never let the preview leave the frame. */
  const previewTop = hovered
    ? Math.max(4, Math.min(hovered.top, FRAME_H - contentH - 4))
    : 0
  const dir = reduce ? 0 : (hovered?.dir ?? 1)

  return (
    <div ref={frameRef} className="relative flex h-full min-h-0 flex-col">
      {/* Floating glass header — cards dip under it, never past it. */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-2 rounded-xl border border-border/45 bg-neutral/90 p-1.5 shadow-[0_4px_16px_-4px_rgb(0_0_0/0.2),0_2px_6px_-2px_rgb(0_0_0/0.12)] backdrop-blur-sm">
        <Button
          variant="quiet"
          size="sm"
          className="min-w-0 justify-start gap-1.5 font-medium"
        >
          <span className="truncate">Acme design system</span>
          <ChevronsUpDownIcon className="size-3.5 shrink-0 text-fg-muted" />
        </Button>
        <Button
          size="sm"
          variant="quiet"
          isIconOnly
          aria-label="Search controls"
          className="shrink-0"
        >
          <SearchIcon />
        </Button>
      </div>

      {/* The story scroll: every chapter its own card, wrapped for hover. */}
      <div
        className="no-scrollbar flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain rounded-xl pt-[56px] pb-[62px] *:shrink-0"
        onPointerLeave={scheduleLeave}
        onScroll={onScroll}
      >
        {chapters.map((chapter) => (
          <div
            key={chapter.id}
            ref={(node) => {
              if (node) cardRefs.current.set(chapter.id, node)
              else cardRefs.current.delete(chapter.id)
            }}
            onPointerEnter={() => hoverCard(chapter.id)}
          >
            <ChapterCard chapter={chapter} lab={lab} />
          </div>
        ))}
      </div>

      {/* Floating glass footer — same treatment as the header. */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-2 rounded-xl border border-border/45 bg-neutral/90 p-2 shadow-[0_-4px_16px_-4px_rgb(0_0_0/0.2),0_-2px_6px_-2px_rgb(0_0_0/0.12)] backdrop-blur-sm">
        <Button size="sm" className="flex-1">
          Save
        </Button>
        <Button variant="primary" size="sm" className="flex-1">
          Export
        </Button>
      </div>

      {/* The preview rail: one container, retargeted — never re-mounted —
          as the hover moves between sections. Inert by design. */}
      <AnimatePresence>
        {active && hovered && (
          <motion.div
            key="preview"
            aria-hidden
            className="pointer-events-none absolute top-0 left-full z-30 ml-4 origin-left overflow-hidden rounded-2xl border border-border/45 bg-card shadow-[0_12px_32px_-8px_rgb(0_0_0/0.24),0_4px_12px_-4px_rgb(0_0_0/0.12)] select-none"
            style={{ width: PREVIEW_W }}
            initial={{
              opacity: 0,
              scale: reduce ? 1 : 0.96,
              y: previewTop,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: previewTop,
              height: contentH || 'auto',
            }}
            exit={{
              opacity: 0,
              scale: reduce ? 1 : 0.98,
              transition: { duration: 0.15, ease: EASE_OUT },
            }}
            transition={{
              opacity: { duration: 0.2, ease: EASE_OUT },
              scale: { duration: 0.2, ease: EASE_OUT },
              y: reduce ? { duration: 0 } : GLIDE,
              height: reduce ? { duration: 0 } : GLIDE,
            }}
          >
            <div ref={measureRef}>
              <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                <motion.div
                  key={active.id}
                  custom={dir}
                  variants={contentVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.18, ease: EASE_OUT }}
                  className="flex flex-col gap-3 p-4"
                >
                  <div className="flex items-center gap-2">
                    <active.icon className="size-3.5 text-fg-muted" />
                    <span className="text-[0.8125rem] font-medium text-fg">
                      {active.label}
                    </span>
                    <span className="ml-auto text-[11px] text-fg-muted">
                      Live preview
                    </span>
                  </div>
                  <PreviewBody id={active.id} lab={lab} />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const contentVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    y: 14 * dir,
    filter: 'blur(4px)',
  }),
  center: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: (dir: number) => ({
    opacity: 0,
    y: -10 * dir,
    filter: 'blur(4px)',
  }),
}

/* ------------------------------- Previews -------------------------------- */
/* One demo per chapter — enough real UI to read the section's decisions at a
   glance, reacting to the lab state where a single value carries the idea. */

function PreviewBody({ id, lab }: { id: string; lab: Lab }) {
  switch (id) {
    case 'color':
      return <ColorPreview lab={lab} />
    case 'typography':
      return <TypePreview />
    case 'icons':
      return <IconsPreview lab={lab} />
    case 'shape':
      return <ShapePreview lab={lab} />
    case 'space':
      return <SpacePreview lab={lab} />
    case 'details':
      return <DetailsPreview lab={lab} />
    case 'components':
      return <ComponentsPreview lab={lab} />
    default:
      return (
        <p className="text-xs/relaxed text-fg-muted">
          No preview for this section yet.
        </p>
      )
  }
}

function Caption({ children }: { children: React.ReactNode }) {
  return <span className="text-[11px] text-fg-muted">{children}</span>
}

function ColorPreview({ lab }: { lab: Lab }) {
  const semantics = [
    { label: 'Accent', className: 'bg-accent' },
    { label: 'Success', className: 'bg-success' },
    { label: 'Warning', className: 'bg-warning' },
    { label: 'Danger', className: 'bg-danger' },
    { label: 'Info', className: 'bg-info' },
  ]
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2.5 rounded-lg border border-border/45 bg-bg p-2.5">
        <span
          className="size-8 shrink-0 rounded-md"
          style={{ backgroundColor: lab.state.brand }}
        />
        <div className="flex min-w-0 flex-col">
          <span className="text-xs font-medium text-fg">Brand</span>
          <span className="truncate font-mono text-[11px] text-fg-muted uppercase">
            {lab.state.brand}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Caption>Semantic scales</Caption>
        <div className="flex gap-1.5">
          {semantics.map((semantic) => (
            <div key={semantic.label} className="flex flex-1 flex-col gap-1">
              <span className={`h-7 rounded-md ${semantic.className}`} />
              <span className="text-center text-[10px] text-fg-muted">
                {semantic.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Caption>Modes</Caption>
        <div className="flex gap-1.5">
          {lab.state.modes.map((mode) => (
            <span
              key={mode.id}
              className="flex-1 rounded-md border border-border/45 px-2 py-1 text-center text-[11px]"
              style={{
                backgroundColor: `oklch(${mode.bg}% 0 0)`,
                color: mode.polarity === 'light' ? 'black' : 'white',
              }}
            >
              {mode.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function TypePreview() {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-end gap-3 rounded-lg border border-border/45 bg-bg p-3">
        <span className="text-4xl/none font-semibold text-fg">Ag</span>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-fg">
            Ship your design system
          </span>
          <span className="text-xs text-fg-muted">
            Every decision, one panel — previewed live on real components.
          </span>
        </div>
      </div>
      <span className="rounded-lg border border-border/45 bg-bg px-3 py-2 font-mono text-[11px] text-fg-muted">
        npx shadcn add button
      </span>
    </div>
  )
}

const ICON_SAMPLE = [
  HouseIcon,
  SearchIcon,
  BellIcon,
  HeartIcon,
  StarIcon,
  SettingsIcon,
  CalendarIcon,
  MailIcon,
]

function IconsPreview({ lab }: { lab: Lab }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="grid grid-cols-4 gap-1.5">
        {ICON_SAMPLE.map((Icon, index) => (
          <span
            key={index}
            className="flex h-11 items-center justify-center rounded-lg border border-border/45 bg-bg"
          >
            <Icon
              className="size-4.5 text-fg"
              strokeWidth={lab.state.iconStroke}
            />
          </span>
        ))}
      </div>
      <Caption>
        {lab.state.iconLibrary} · stroke {lab.state.iconStroke}
      </Caption>
    </div>
  )
}

/* Role ratios from the #575 rung ladder (md/lg/xl over the base radius). */
const SHAPE_ROLE_DEMOS = [
  { label: 'Control', ratio: 0.75 },
  { label: 'Surface', ratio: 1 },
  { label: 'Panel', ratio: 1.5 },
]

function ShapePreview({ lab }: { lab: Lab }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-1.5">
        {SHAPE_ROLE_DEMOS.map((role) => (
          <div key={role.label} className="flex flex-1 flex-col gap-1">
            <span
              className="flex h-14 items-center justify-center border border-border bg-bg font-mono text-[10px] text-fg-muted"
              style={{ borderRadius: lab.state.radiusPx * role.ratio }}
            >
              {Math.round(lab.state.radiusPx * role.ratio)}px
            </span>
            <span className="text-center text-[10px] text-fg-muted">
              {role.label}
            </span>
          </div>
        ))}
      </div>
      <Caption>Base radius {lab.state.radiusPx}px</Caption>
    </div>
  )
}

const DENSITY_PADDING: Record<string, string> = {
  compact: 'py-1',
  default: 'py-1.5',
  comfortable: 'py-2.5',
}

function SpacePreview({ lab }: { lab: Lab }) {
  const padding = DENSITY_PADDING[lab.state.density] ?? DENSITY_PADDING.default
  const rows = [
    { icon: MousePointerClickIcon, label: 'Select all' },
    { icon: SendIcon, label: 'Share…' },
    { icon: SettingsIcon, label: 'Preferences' },
    { icon: TrashIcon, label: 'Delete' },
  ]
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-col rounded-lg border border-border/45 bg-bg p-1">
        {rows.map((row) => (
          <span
            key={row.label}
            className={`flex items-center gap-2 rounded-md px-2 text-xs text-fg first:bg-muted ${padding}`}
          >
            <row.icon className="size-3.5 text-fg-muted" />
            {row.label}
          </span>
        ))}
      </div>
      <Caption>Density: {lab.state.density}</Caption>
    </div>
  )
}

const SHADOW_DEMOS = [
  { label: 'Card', className: 'shadow-sm' },
  { label: 'Popover', className: 'shadow-md' },
  { label: 'Modal', className: 'shadow-xl' },
]

function DetailsPreview({ lab }: { lab: Lab }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-2 rounded-lg bg-bg p-3">
        {SHADOW_DEMOS.map((demo) => (
          <span
            key={demo.label}
            className={`flex h-12 flex-1 items-center justify-center rounded-lg border border-border/45 bg-card text-[10px] text-fg-muted ${lab.state.shadows === 'none' ? '' : demo.className}`}
          >
            {demo.label}
          </span>
        ))}
      </div>
      <Caption>Shadows: {lab.state.shadows}</Caption>
    </div>
  )
}

function ComponentsPreview({ lab }: { lab: Lab }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <Button variant="primary" size="sm">
          Confirm
        </Button>
        <Button size="sm">Cancel</Button>
        <Button variant="quiet" size="sm">
          Skip
        </Button>
      </div>
      <span className="flex h-8 items-center rounded-lg border border-border bg-bg px-2.5 text-xs text-fg-muted">
        Email address
      </span>
      <Caption>
        Button: {lab.state.buttonStyle} · Input: {lab.state.inputStyle}
      </Caption>
    </div>
  )
}
