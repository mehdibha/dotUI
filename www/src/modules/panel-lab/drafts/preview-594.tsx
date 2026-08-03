"use client"

/* Draft #594 — the hover preview rail. A FRAME experiment, not a section one:
   the panel chrome is the v2 frame verbatim, but interacting with the panel
   floats a live preview card beside it. One shared container stays mounted —
   it glides to the active spot and morphs its height while the content
   crossfades, so moving through the panel reads as one surface retargeting.

   Control previews only. Rows with something meaningful to show have their
   own preview (Brand shows the color in real demos, the Input row shows real
   inputs), anchored to the ROW. Rows without one show nothing — a section
   fallback proved noisy between controls, so it's gone. The 120ms grace also
   covers the gaps between rows, so control-to-control never flickers.

   Three signals drive the target, strongest first: an OPEN overlay (a picker,
   select or menu whose trigger reads aria-expanded inside the panel) pins its
   row; then the HOVERED row/section; then the FOCUSED row, so keyboard use
   and open disclosures keep their preview when the pointer leaves. Rows are
   resolved from the DOM (data-row / slot=trigger / aria-label / the
   data-disclosure root), so section bodies stay untouched.

   Motion model: glide + height share one no-bounce spring; content swaps
   with a short direction-aware ease-out fade; the container enters/exits
   with a scale fade. Reduced motion keeps only the fades.

   Dev tweaks (group "Preview rail"): preview side vs the panel, what happens
   while an overlay is open, where row overlays open (threaded to the shared
   rows via RowOverlayPlacementContext), and the disable affordance. */

import { useCallback, useEffect, useRef, useState } from "react"
import {
  BellIcon,
  CalendarIcon,
  CheckIcon,
  ChevronsUpDownIcon,
  EyeIcon,
  EyeOffIcon,
  HeartIcon,
  HouseIcon,
  LoaderCircleIcon,
  LoaderIcon,
  MailIcon,
  MousePointerClickIcon,
  SearchIcon,
  SendIcon,
  SettingsIcon,
  StarIcon,
  TrashIcon,
} from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { fontStack } from "@/lib/fonts"
import { Button } from "@/registry/ui/button"
import { RowOverlayPlacementContext } from "@/modules/control-lab/rows"
import type { RowOverlayPlacement } from "@/modules/control-lab/rows"
import { useLoadedFamilies } from "@/modules/create/typography"
import { useTweak } from "@/dev/tweaker"

import { SHAPE_RUNGS } from "../data"
import type { Lab } from "../data"
import { ChapterCard } from "../variants/chapter"
import type { Chapter } from "../variants/chapter"

const PREVIEW_W = 300
/* The page mounts the panel at this fixed height (version-page.tsx). */
const FRAME_H = 720
const EASE_OUT = [0.215, 0.61, 0.355, 1] as const
const GLIDE = {
  type: "spring",
  stiffness: 500,
  damping: 46,
  mass: 0.8,
} as const

/* ------------------------------ Target model ------------------------------ */

interface Target {
  /** Content identity — drives the crossfade. */
  key: string
  sectionId: string
  /** The matched row's label. */
  control: string
  /** Element the preview aligns to (the row or its disclosure root). */
  anchor: Element
  /** Anchor top relative to the frame, unclamped. */
  top: number
}

/** Row label: the ROW_LABEL span, else the element's own aria-label. */
function labelOf(el: Element): string | null {
  return (
    el.querySelector(".font-medium.truncate")?.textContent?.trim() ??
    el.getAttribute("aria-label")?.trim() ??
    null
  )
}

/** Climb from a DOM node to the innermost row with a registered preview:
 *  a labeled row first, then the enclosing disclosure (so "Success" inside
 *  Semantic colors attributes to Semantic colors). No match → no preview. */
function resolveTarget(
  start: Element,
): { sectionId: string; control: string; anchor: Element } | null {
  const section = start.closest("[data-chapter]")
  if (!section) return null
  const sectionId = section.getAttribute("data-chapter") ?? ""
  const registry = CONTROL_PREVIEWS[sectionId]

  let node: Element | null = start
  while (registry && node && node !== section) {
    const candidate: Element | null = node.closest(
      '[data-row], button[slot="trigger"], [aria-label], [data-disclosure]',
    )
    if (!candidate || !section.contains(candidate)) break
    const label = labelOf(candidate)
    if (label && registry[label]) {
      return { sectionId, control: label, anchor: candidate }
    }
    node = candidate.parentElement
  }
  return null
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
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const contentObserver = useRef<ResizeObserver>(undefined)
  const [openT, setOpenT] = useState<Target | null>(null)
  const [hoverT, setHoverT] = useState<Target | null>(null)
  const [focusT, setFocusT] = useState<Target | null>(null)
  const [contentH, setContentH] = useState(0)
  const [enabled, setEnabled] = useState(true)

  const side = useTweak("Preview side", {
    type: "select",
    options: ["right", "right far", "left"],
    default: "right",
    group: "Preview rail",
  })
  const whileOpen = useTweak("While overlay open", {
    type: "select",
    options: ["show", "hide"],
    default: "show",
    group: "Preview rail",
  })
  const overlayPlacement = useTweak("Overlay placement", {
    type: "select",
    options: ["right top", "left top", "bottom start"],
    default: "right top",
    group: "Preview rail",
  })
  const affordance = useTweak("Disable affordance", {
    type: "select",
    options: ["none", "header eye", "press P"],
    default: "none",
    group: "Preview rail",
  })

  useEffect(() => () => clearTimeout(leaveTimer.current), [])
  useEffect(() => {
    if (affordance === "none") setEnabled(true)
  }, [affordance])
  useEffect(() => {
    if (affordance !== "press P") return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "p" && e.key !== "P") return
      const el = e.target as HTMLElement | null
      if (el?.closest("input, textarea, [contenteditable]")) return
      setEnabled((v) => !v)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [affordance])

  const toTarget = useCallback(
    (resolved: ReturnType<typeof resolveTarget>): Target | null => {
      const frame = frameRef.current
      if (!resolved || !frame) return null
      const { sectionId, control, anchor } = resolved
      return {
        key: `${sectionId}:${control}`,
        sectionId,
        control,
        anchor,
        top:
          anchor.getBoundingClientRect().top -
          frame.getBoundingClientRect().top,
      }
    },
    [],
  )

  /* Pin the row whose overlay (picker/select/menu) is open — its trigger
     keeps aria-expanded while focus lives in the portal. Disclosures also
     read aria-expanded but lack aria-haspopup, so they don't pin. */
  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const update = () => {
      const trigger = frame.querySelector(
        '[aria-haspopup][aria-expanded="true"]',
      )
      setOpenT(trigger ? toTarget(resolveTarget(trigger)) : null)
    }
    const observer = new MutationObserver(update)
    observer.observe(frame, {
      subtree: true,
      attributes: true,
      attributeFilter: ["aria-expanded"],
    })
    return () => observer.disconnect()
  }, [toTarget])

  /* A non-control spot doesn't clear immediately — the grace delay carries
     the preview across the gaps between rows, so only genuinely leaving the
     controls (heroes, captions, out of the panel) hides it. */
  const onPointerOver = (e: React.PointerEvent) => {
    const target = toTarget(resolveTarget(e.target as Element))
    if (target) {
      clearTimeout(leaveTimer.current)
      setHoverT(target)
    } else {
      scheduleLeave()
    }
  }

  /* Grace delay so brushing past the panel edge doesn't flicker the card. */
  const scheduleLeave = () => {
    clearTimeout(leaveTimer.current)
    leaveTimer.current = setTimeout(() => setHoverT(null), 120)
  }

  const onFocus = (e: React.FocusEvent) => {
    setFocusT(toTarget(resolveTarget(e.target as Element)))
  }
  const onBlur = (e: React.FocusEvent) => {
    if (!frameRef.current?.contains(e.relatedTarget as Node | null)) {
      setFocusT(null)
    }
  }

  /* Keep the preview glued to its anchor while the panel scrolls under it. */
  const onScroll = () => {
    const frame = frameRef.current
    if (!frame) return
    const frameTop = frame.getBoundingClientRect().top
    const refresh = (t: Target | null) =>
      t && { ...t, top: t.anchor.getBoundingClientRect().top - frameTop }
    setOpenT(refresh)
    setHoverT(refresh)
    setFocusT(refresh)
  }

  const measureRef = useCallback((node: HTMLDivElement | null) => {
    contentObserver.current?.disconnect()
    if (!node) return
    const observer = new ResizeObserver(() => setContentH(node.offsetHeight))
    observer.observe(node)
    contentObserver.current = observer
  }, [])

  const display = !enabled
    ? null
    : openT && whileOpen === "hide"
      ? null
      : (openT ?? hoverT ?? focusT)
  const chapter = display && chapters.find((c) => c.id === display.sectionId)

  /* Crossfade direction: toward the new anchor. Render-time ref bookkeeping
     so the exiting content still animates away from where it sat. */
  const lastRef = useRef<{ key: string; top: number } | null>(null)
  const dirRef = useRef<1 | -1>(1)
  if (display && lastRef.current && display.key !== lastRef.current.key) {
    dirRef.current = display.top >= lastRef.current.top ? 1 : -1
  }
  if (display) lastRef.current = { key: display.key, top: display.top }
  const dir = reduce ? 0 : dirRef.current

  /* Align with the anchor, but never let the preview leave the frame. */
  const previewTop = display
    ? Math.max(4, Math.min(display.top, FRAME_H - contentH - 4))
    : 0

  return (
    <div
      ref={frameRef}
      className="relative flex h-full min-h-0 flex-col"
      // "left" keeps the page usable: the panel slides over so the preview
      // lands where the panel was, and row overlays open into free space.
      style={
        side === "left"
          ? { transform: `translateX(${PREVIEW_W + 16}px)` }
          : undefined
      }
    >
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
        <div className="flex shrink-0 items-center">
          {affordance === "header eye" && (
            <Button
              size="sm"
              variant="quiet"
              isIconOnly
              aria-label={enabled ? "Hide previews" : "Show previews"}
              onPress={() => setEnabled((v) => !v)}
              className={enabled ? undefined : "text-fg-muted"}
            >
              {enabled ? <EyeIcon /> : <EyeOffIcon />}
            </Button>
          )}
          <Button
            size="sm"
            variant="quiet"
            isIconOnly
            aria-label="Search controls"
          >
            <SearchIcon />
          </Button>
        </div>
      </div>

      {/* The story scroll: every chapter its own card, tagged for resolution. */}
      <RowOverlayPlacementContext.Provider
        value={overlayPlacement as RowOverlayPlacement}
      >
        <div
          className="no-scrollbar flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain rounded-xl pt-[56px] pb-[62px] *:shrink-0"
          onPointerOver={onPointerOver}
          onPointerLeave={scheduleLeave}
          onFocus={onFocus}
          onBlur={onBlur}
          onScroll={onScroll}
        >
          {chapters.map((c) => (
            <div key={c.id} data-chapter={c.id}>
              <ChapterCard chapter={c} lab={lab} />
            </div>
          ))}
        </div>
      </RowOverlayPlacementContext.Provider>

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
          as the target moves between rows and sections. Inert by design. */}
      <AnimatePresence>
        {display && chapter && (
          <motion.div
            key="preview"
            aria-hidden
            className={`pointer-events-none absolute top-0 z-30 overflow-hidden rounded-2xl border border-border/45 bg-card shadow-[0_12px_32px_-8px_rgb(0_0_0/0.24),0_4px_12px_-4px_rgb(0_0_0/0.12)] select-none ${
              side === "left"
                ? "right-full mr-4 origin-right"
                : side === "right far"
                  ? "left-full ml-[352px] origin-left"
                  : "left-full ml-4 origin-left"
            }`}
            style={{ width: PREVIEW_W }}
            initial={{ opacity: 0, scale: reduce ? 1 : 0.96, y: previewTop }}
            animate={{
              opacity: 1,
              scale: 1,
              y: previewTop,
              height: contentH || "auto",
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
                  key={display.key}
                  custom={dir}
                  variants={contentVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.18, ease: EASE_OUT }}
                  className="flex flex-col gap-3 p-4"
                >
                  <div className="flex items-center gap-2">
                    <chapter.icon className="size-3.5 text-fg-muted" />
                    <span className="text-[0.8125rem] font-medium text-fg">
                      {chapter.label}
                      <span className="text-fg-muted">
                        {" · "}
                        {display.control}
                      </span>
                    </span>
                    <span className="ml-auto text-[11px] text-fg-muted">
                      Live preview
                    </span>
                  </div>
                  <PreviewBody
                    sectionId={display.sectionId}
                    control={display.control}
                    lab={lab}
                  />
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
    filter: "blur(4px)",
  }),
  center: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: (dir: number) => ({
    opacity: 0,
    y: -10 * dir,
    filter: "blur(4px)",
  }),
}

/* ------------------------------- Previews --------------------------------- */
/* One demo per registered control, reading the lab state where a single
   value carries the idea. Rows without an entry show no preview. */

function PreviewBody({
  sectionId,
  control,
  lab,
}: {
  sectionId: string
  control: string
  lab: Lab
}) {
  const Body = CONTROL_PREVIEWS[sectionId]?.[control]
  return Body ? <Body lab={lab} /> : null
}

type Preview = React.ComponentType<{ lab: Lab }>

function Caption({ children }: { children: React.ReactNode }) {
  return <span className="text-[11px] text-fg-muted">{children}</span>
}

function Panel({
  children,
  className = "gap-2.5",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`flex flex-col rounded-lg border border-border/45 bg-bg p-3 ${className}`}
    >
      {children}
    </div>
  )
}

/* --------------------------------- Color ---------------------------------- */

/** The brand color doing its real jobs: CTA, link, controls, badge. */
function BrandPreview({ lab }: { lab: Lab }) {
  const brand = lab.state.brand
  return (
    <div className="flex flex-col gap-2.5">
      <Panel>
        <span className="text-xs font-semibold text-fg">Create account</span>
        <span className="flex h-8 items-center rounded-lg border border-border bg-bg px-2.5 text-xs text-fg-muted">
          you@acme.com
        </span>
        <span
          className="flex h-8 items-center justify-center rounded-lg text-xs font-medium text-white"
          style={{ backgroundColor: brand }}
        >
          Continue
        </span>
        <span className="text-center text-[11px]" style={{ color: brand }}>
          Already have an account?
        </span>
      </Panel>
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-5 w-9 items-center rounded-full p-0.5"
          style={{ backgroundColor: brand }}
        >
          <span className="ml-auto size-4 rounded-full bg-white" />
        </span>
        <span
          className="flex size-4 items-center justify-center rounded-sm"
          style={{ backgroundColor: brand }}
        >
          <CheckIcon className="size-3 text-white" />
        </span>
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
          style={{ backgroundColor: brand }}
        >
          New
        </span>
        <span className="ml-auto font-mono text-[11px] text-fg-muted uppercase">
          {brand}
        </span>
      </div>
    </div>
  )
}

/** Gray carries the quiet 90% — surfaces, borders, secondary text. */
function GrayPreview({ lab }: { lab: Lab }) {
  return (
    <div className="flex flex-col gap-2.5">
      <Panel>
        <span className="text-xs font-medium text-fg">Primary text</span>
        <span className="text-xs text-fg-muted">
          Secondary text sits a step back.
        </span>
        <span className="flex items-center justify-between rounded-md bg-muted px-2.5 py-1.5 text-[11px] text-fg-muted">
          Muted surface
          <span className="h-3 w-10 rounded-sm border border-border" />
        </span>
      </Panel>
      <Caption>
        Seed:{" "}
        {lab.state.graySeed === ""
          ? "Auto (derived from brand)"
          : lab.state.graySeed}
      </Caption>
    </div>
  )
}

/** What "primary" points at — the neutral or the accent. */
function PrimaryPreview({ lab }: { lab: Lab }) {
  const primary = lab.state.primary
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <span
          className={`flex h-8 items-center rounded-lg px-3 text-xs font-medium ${
            primary === "neutral"
              ? "bg-neutral text-fg-on-neutral"
              : "bg-accent text-white"
          }`}
        >
          Primary action
        </span>
        <span className="flex h-8 items-center rounded-lg border border-border-field px-3 text-xs text-fg">
          Secondary
        </span>
      </div>
      <Caption>
        Primary buttons use the {primary === "neutral" ? "neutral" : "accent"}{" "}
        scale
      </Caption>
    </div>
  )
}

function ModesPreview({ lab }: { lab: Lab }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-col gap-1.5">
        {lab.state.modes.map((mode) => (
          <span
            key={mode.id}
            className="flex items-center justify-between rounded-lg border border-border/45 px-3 py-2 text-xs"
            style={{
              backgroundColor: `oklch(${mode.bg}% 0 0)`,
              color: mode.polarity === "light" ? "black" : "white",
            }}
          >
            <span className="font-medium">{mode.name}</span>
            <span className="flex items-center gap-1.5 text-[10px] opacity-70">
              {mode.contrast === "high" && <span>HC</span>}
              <span>L* {mode.bg}</span>
              {mode.id === lab.state.defaultMode && <span>· default</span>}
            </span>
          </span>
        ))}
      </div>
      <Caption>
        {lab.state.modes.length}{" "}
        {lab.state.modes.length === 1 ? "mode" : "modes"} · users land on{" "}
        {lab.state.modes.find((m) => m.id === lab.state.defaultMode)?.name ??
          "the default"}
      </Caption>
    </div>
  )
}

/** The four status colors in their natural habitat. */
function SemanticPreview({ lab }: { lab: Lab }) {
  const rows = [
    {
      label: "Payment received",
      dot: "bg-success",
      seed: lab.state.successSeed,
    },
    {
      label: "Storage almost full",
      dot: "bg-warning",
      seed: lab.state.warningSeed,
    },
    { label: "Build failed", dot: "bg-danger", seed: lab.state.dangerSeed },
    { label: "Update available", dot: "bg-info", seed: lab.state.infoSeed },
  ]
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-col gap-1.5">
        {rows.map((row) => (
          <span
            key={row.label}
            className="flex items-center gap-2 rounded-lg border border-border/45 bg-bg px-2.5 py-1.5 text-xs text-fg"
          >
            <span
              className={`size-2 rounded-full ${row.seed ? "" : row.dot}`}
              style={row.seed ? { backgroundColor: row.seed } : undefined}
            />
            {row.label}
            <span className="ml-auto font-mono text-[10px] text-fg-muted uppercase">
              {row.seed || "Auto"}
            </span>
          </span>
        ))}
      </div>
      <Caption>Auto seeds derive from the brand hue</Caption>
    </div>
  )
}

/* ------------------------------- Typography ------------------------------- */

function FontPreview({
  family,
  role,
}: {
  family: string
  role: "heading" | "body" | "mono"
}) {
  useLoadedFamilies([family])
  const stack = fontStack(family)
  return (
    <div className="flex flex-col gap-2.5">
      <Panel className="gap-1.5">
        {role === "heading" && (
          <>
            <span
              className="text-xl/tight font-semibold text-fg"
              style={{ fontFamily: stack }}
            >
              Almost before we knew it
            </span>
            <span
              className="text-sm font-medium text-fg-muted"
              style={{ fontFamily: stack }}
            >
              we had left the ground.
            </span>
          </>
        )}
        {role === "body" && (
          <span
            className="text-xs/relaxed text-fg"
            style={{ fontFamily: stack }}
          >
            Body text carries the reading load: it has to stay comfortable at
            small sizes, through long paragraphs, in both modes.
          </span>
        )}
        {role === "mono" && (
          <span
            className="text-[11px]/relaxed whitespace-pre text-fg"
            style={{ fontFamily: stack }}
          >
            {"const theme = createTheme({\n  radius: 10,\n})"}
          </span>
        )}
      </Panel>
      <Caption>{family}</Caption>
    </div>
  )
}

/* --------------------------------- Icons ---------------------------------- */

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

function IconGridPreview({ lab }: { lab: Lab }) {
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

/** Stroke reads best big — three icons at display size. */
function StrokePreview({ lab }: { lab: Lab }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-1.5">
        {[HeartIcon, BellIcon, SettingsIcon].map((Icon, index) => (
          <span
            key={index}
            className="flex h-16 flex-1 items-center justify-center rounded-lg border border-border/45 bg-bg"
          >
            <Icon
              className="size-8 text-fg"
              strokeWidth={lab.state.iconStroke}
            />
          </span>
        ))}
      </div>
      <Caption>Stroke {lab.state.iconStroke}px</Caption>
    </div>
  )
}

/* --------------------------------- Shape ---------------------------------- */

const SHAPE_ROLE_DEMOS = [
  { label: "Control", ratio: 0.75 },
  { label: "Surface", ratio: 1 },
  { label: "Panel", ratio: 1.5 },
]

/* corner-shape is progressive enhancement — unsupported browsers render round. */
const cornerShapeStyle = (shape: string): React.CSSProperties =>
  shape === "round" ? {} : ({ cornerShape: shape } as React.CSSProperties)

function RadiusPreview({ lab }: { lab: Lab }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-1.5">
        {SHAPE_ROLE_DEMOS.map((role) => (
          <div key={role.label} className="flex flex-1 flex-col gap-1">
            <span
              className="flex h-14 items-center justify-center border border-border bg-bg font-mono text-[10px] text-fg-muted"
              style={{
                borderRadius: lab.state.radiusPx * role.ratio,
                ...cornerShapeStyle(lab.state.cornerShape),
              }}
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

const rungRatio = (id: string) =>
  SHAPE_RUNGS.find((rung) => rung.id === id)?.ratio ?? 1

/** The role vector nested the way it ships: panel > surface > control. */
function RolesPreview({ lab }: { lab: Lab }) {
  const { radiusPx, rolePanel, roleSurface, roleControl } = lab.state
  const px = (role: string) => {
    const ratio = rungRatio(role)
    return ratio === Infinity ? 999 : radiusPx * ratio
  }
  const label = (name: string, role: string) =>
    `${name} · ${rungRatio(role) === Infinity ? "pill" : `${Math.round(px(role))}px`}`
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="flex flex-col gap-2 border border-border bg-bg p-3"
        style={{ borderRadius: px(rolePanel) }}
      >
        <span className="text-[10px] text-fg-muted">
          {label("Panel", rolePanel)}
        </span>
        <div
          className="flex flex-col gap-2 border border-border/60 bg-card p-2.5"
          style={{ borderRadius: px(roleSurface) }}
        >
          <span className="text-[10px] text-fg-muted">
            {label("Surface", roleSurface)}
          </span>
          <span
            className="flex h-7 items-center justify-center bg-primary text-[11px] font-medium text-fg-on-primary"
            style={{ borderRadius: px(roleControl) }}
          >
            {label("Control", roleControl)}
          </span>
        </div>
      </div>
      <Caption>
        Items:{" "}
        {lab.state.roleItem === "auto"
          ? "auto (one rung below surfaces)"
          : lab.state.roleItem}
      </Caption>
    </div>
  )
}

function CornersPreview({ lab }: { lab: Lab }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-1.5">
        {["round", "squircle", "bevel"].map((shape) => (
          <div key={shape} className="flex flex-1 flex-col gap-1">
            <span
              className={`h-14 border bg-bg ${
                shape === lab.state.cornerShape
                  ? "border-accent"
                  : "border-border"
              }`}
              style={{
                borderRadius: Math.max(lab.state.radiusPx * 1.5, 8),
                ...cornerShapeStyle(shape),
              }}
            />
            <span className="text-center text-[10px] text-fg-muted">
              {shape}
            </span>
          </div>
        ))}
      </div>
      <Caption>corner-shape: {lab.state.cornerShape}</Caption>
    </div>
  )
}

/* --------------------------------- Space ---------------------------------- */

const DENSITY_PADDING: Record<string, string> = {
  compact: "py-1",
  default: "py-1.5",
  comfortable: "py-2.5",
}

function DensityPreview({ lab }: { lab: Lab }) {
  const padding = DENSITY_PADDING[lab.state.density] ?? DENSITY_PADDING.default
  const rows = [
    { icon: MousePointerClickIcon, label: "Select all" },
    { icon: SendIcon, label: "Share…" },
    { icon: SettingsIcon, label: "Preferences" },
    { icon: TrashIcon, label: "Delete" },
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

/* -------------------------------- Details --------------------------------- */

const SHADOW_DEMOS = [
  { label: "Card", className: "shadow-sm" },
  { label: "Popover", className: "shadow-md" },
  { label: "Modal", className: "shadow-xl" },
]

function ShadowsPreview({ lab }: { lab: Lab }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-2 rounded-lg bg-bg p-3">
        {SHADOW_DEMOS.map((demo) => (
          <span
            key={demo.label}
            className={`flex h-12 flex-1 items-center justify-center rounded-lg border border-border/45 bg-card text-[10px] text-fg-muted ${lab.state.shadows === "none" ? "" : demo.className}`}
          >
            {demo.label}
          </span>
        ))}
      </div>
      <Caption>Shadows: {lab.state.shadows}</Caption>
    </div>
  )
}

function CursorPreview({ lab }: { lab: Lab }) {
  return (
    <div className="flex flex-col gap-2.5">
      <Panel className="gap-1.5">
        <span className="flex items-center justify-between text-xs text-fg">
          Buttons, links, menu items
          <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] text-fg-muted">
            cursor: {lab.state.cursorInteractive}
          </span>
        </span>
        <span className="flex items-center justify-between text-xs text-fg-muted">
          Disabled controls
          <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] text-fg-muted">
            cursor: {lab.state.cursorDisabled}
          </span>
        </span>
      </Panel>
      <Caption>Hover the real panel controls to feel it</Caption>
    </div>
  )
}

/* ------------------------------- Components ------------------------------- */

const BUTTON_STYLE_CLASSES: Record<string, string> = {
  solid: "bg-primary text-fg-on-primary",
  soft: "bg-neutral text-fg-on-neutral",
  outline: "border border-border-field text-fg",
  quiet: "text-fg",
}

function buttonRadius(lab: Lab): number {
  const { buttonRadius: r, radiusPx } = lab.state
  if (r === "sharp") return 0
  if (r === "pill") return 999
  if (r === "round") return Math.max(radiusPx, 8)
  return radiusPx * 0.75
}

function ButtonPreview({ lab }: { lab: Lab }) {
  const cls =
    BUTTON_STYLE_CLASSES[lab.state.buttonStyle] ?? BUTTON_STYLE_CLASSES.solid
  const radius = buttonRadius(lab)
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <span
          className={`flex h-8 items-center px-3 text-xs font-medium ${cls}`}
          style={{ borderRadius: radius }}
        >
          Confirm
        </span>
        <span
          className="flex h-8 items-center border border-border-field px-3 text-xs text-fg"
          style={{ borderRadius: radius }}
        >
          Cancel
        </span>
        <span
          className="flex h-8 items-center px-3 text-xs text-fg-muted"
          style={{ borderRadius: radius }}
        >
          Skip
        </span>
      </div>
      <Caption>
        {lab.state.buttonStyle} · radius {lab.state.buttonRadius} · hover{" "}
        {lab.state.buttonHover}
      </Caption>
    </div>
  )
}

const INPUT_STYLE_CLASSES: Record<string, string> = {
  outline: "rounded-lg border border-border-field bg-bg",
  line: "border-b border-border-field",
  "filled-line-bottom": "rounded-t-lg border-b border-border-field bg-neutral",
  filled: "rounded-lg bg-neutral",
}

function InputPreview({ lab }: { lab: Lab }) {
  const cls =
    INPUT_STYLE_CLASSES[lab.state.inputStyle] ?? INPUT_STYLE_CLASSES.outline
  return (
    <div className="flex flex-col gap-2.5">
      <label className="flex flex-col gap-1">
        <span className="text-[11px] font-medium text-fg">Email</span>
        <span
          className={`flex h-8 items-center px-2.5 text-xs text-fg-muted ${cls}`}
        >
          you@acme.com
        </span>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-[11px] font-medium text-fg">Focused</span>
        <span
          className={`flex h-8 items-center px-2.5 text-xs text-fg ring-2 ring-accent ${cls}`}
        >
          Acme Inc.
        </span>
      </label>
      <Caption>Style: {lab.state.inputStyle}</Caption>
    </div>
  )
}

const TOKEN_RADIUS_RATIO: Record<string, number> = {
  sharp: 0,
  sm: 0.5,
  md: 0.75,
  lg: 1,
}

function tokenRadius(lab: Lab, key: string): number {
  return lab.state.radiusPx * (TOKEN_RADIUS_RATIO[key] ?? 0.75)
}

function CheckboxPreview({ lab }: { lab: Lab }) {
  const radius = Math.min(tokenRadius(lab, lab.state.checkboxRadius), 8)
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-col gap-1.5">
        {[
          { label: "Email me product updates", checked: true },
          { label: "Share usage analytics", checked: false },
        ].map((row) => (
          <span
            key={row.label}
            className="flex items-center gap-2 text-xs text-fg"
          >
            <span
              className={`flex size-4 items-center justify-center ${
                row.checked
                  ? "bg-primary text-fg-on-primary"
                  : "border border-border-field"
              }`}
              style={{ borderRadius: radius }}
            >
              {row.checked && <CheckIcon className="size-3" />}
            </span>
            {row.label}
          </span>
        ))}
      </div>
      <Caption>Radius: {lab.state.checkboxRadius}</Caption>
    </div>
  )
}

function CardPreview({ lab }: { lab: Lab }) {
  const tasnim = lab.state.cardStyle === "tasnim"
  return (
    <div className="flex flex-col gap-2.5">
      <div
        className={`flex flex-col gap-1 p-3 ${
          tasnim
            ? "bg-muted shadow-[0_6px_16px_rgb(0_0_0/0.45)]"
            : "border border-border bg-card"
        }`}
        style={{ borderRadius: lab.state.radiusPx }}
      >
        <span className="text-xs font-medium text-fg">Usage this month</span>
        <span className="text-lg/none font-semibold text-fg">12,403</span>
        <span className="text-[11px] text-fg-muted">+18% vs last month</span>
      </div>
      <Caption>Style: {lab.state.cardStyle}</Caption>
    </div>
  )
}

function BadgePreview({ lab }: { lab: Lab }) {
  const radius = Math.min(tokenRadius(lab, lab.state.badgeRadius), 10)
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-1.5">
        <span
          className="bg-neutral px-2 py-0.5 text-[10px] font-medium text-fg-on-neutral"
          style={{ borderRadius: radius }}
        >
          Draft
        </span>
        <span
          className="bg-success px-2 py-0.5 text-[10px] font-medium text-white"
          style={{ borderRadius: radius }}
        >
          Live
        </span>
        <span
          className="bg-danger px-2 py-0.5 text-[10px] font-medium text-white"
          style={{ borderRadius: radius }}
        >
          Failed
        </span>
      </div>
      <Caption>Radius: {lab.state.badgeRadius}</Caption>
    </div>
  )
}

const MODAL_BLUR: Record<string, string> = {
  none: "",
  sm: "backdrop-blur-[2px]",
  md: "backdrop-blur-[6px]",
}

function ModalPreview({ lab }: { lab: Lab }) {
  const { modalBackdrop, modalBlur, modalRadius, modalStyle } = lab.state
  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative h-44 overflow-hidden rounded-lg border border-border/45 bg-bg">
        {/* A fake page for the backdrop to obscure. */}
        <div className="flex flex-col gap-1.5 p-3">
          <span className="h-2 w-1/2 rounded-sm bg-muted" />
          <span className="h-2 w-3/4 rounded-sm bg-muted" />
          <span className="h-2 w-2/3 rounded-sm bg-muted" />
        </div>
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black ${MODAL_BLUR[modalBlur] ?? ""}`}
          style={{
            backgroundColor: `rgb(0 0 0 / ${Number(modalBackdrop) / 100})`,
          }}
        >
          <div
            className="flex w-4/5 flex-col gap-2 border border-border/45 bg-card p-3 shadow-xl"
            style={{ borderRadius: tokenRadius(lab, modalRadius) * 1.5 }}
          >
            <span className="text-xs font-medium text-fg">Delete project?</span>
            <span className="text-[11px] text-fg-muted">
              This can't be undone.
            </span>
            <div
              className={`-m-3 mt-0 flex justify-end gap-1.5 p-2 ${
                modalStyle === "muted" ? "bg-muted" : ""
              }`}
            >
              <span className="rounded-md px-2 py-1 text-[10px] text-fg">
                Cancel
              </span>
              <span className="rounded-md bg-danger px-2 py-1 text-[10px] font-medium text-white">
                Delete
              </span>
            </div>
          </div>
        </div>
      </div>
      <Caption>
        backdrop {modalBackdrop}% · blur {modalBlur} · footer {modalStyle}
      </Caption>
    </div>
  )
}

function TooltipPreview({ lab }: { lab: Lab }) {
  const translucid = lab.state.tooltipSurface === "translucid"
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex h-24 flex-col items-center justify-center gap-1.5 rounded-lg border border-border/45 bg-bg">
        <span
          className={`px-2 py-1 text-[10px] font-medium ${
            translucid ? "bg-fg/75 text-bg backdrop-blur-sm" : "bg-fg text-bg"
          }`}
          style={{
            borderRadius: Math.min(
              tokenRadius(lab, lab.state.tooltipRadius),
              8,
            ),
          }}
        >
          Copy to clipboard
        </span>
        <span className="flex h-7 items-center rounded-lg border border-border-field px-2.5 text-[11px] text-fg">
          Copy
        </span>
      </div>
      <Caption>
        {lab.state.tooltipSurface} · radius {lab.state.tooltipRadius}
      </Caption>
    </div>
  )
}

function MenuPreview({ lab }: { lab: Lab }) {
  const accent = lab.state.menuHighlight === "accent"
  const rows = ["Rename", "Duplicate", "Move to…", "Delete"]
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-col rounded-lg border border-border/45 bg-bg p-1">
        {rows.map((row, index) => (
          <span
            key={row}
            className={`rounded-md px-2 py-1.5 text-xs ${
              index === 1
                ? accent
                  ? "bg-primary text-fg-on-primary"
                  : "bg-muted text-fg"
                : "text-fg"
            }`}
          >
            {row}
          </span>
        ))}
      </div>
      <Caption>Highlight: {lab.state.menuHighlight}</Caption>
    </div>
  )
}

function LoaderPreview({ lab }: { lab: Lab }) {
  const Icon = lab.state.loaderStyle === "ring" ? LoaderCircleIcon : LoaderIcon
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex h-16 items-center justify-center gap-3 rounded-lg border border-border/45 bg-bg">
        <Icon className="size-5 animate-spin text-fg-muted" />
        <span className="text-xs text-fg-muted">Loading workspace…</span>
      </div>
      <Caption>Style: {lab.state.loaderStyle}</Caption>
    </div>
  )
}

/* ------------------------------- Registry --------------------------------- */

/* Keyed by the row's visible label (or aria-label) — what resolveTarget
   reads from the DOM. Rows not listed show no preview. */
const CONTROL_PREVIEWS: Record<string, Record<string, Preview>> = {
  color: {
    Brand: BrandPreview,
    Gray: GrayPreview,
    Primary: PrimaryPreview,
    Modes: ModesPreview,
    "Semantic colors": SemanticPreview,
  },
  typography: {
    Heading: ({ lab }) => (
      <FontPreview family={lab.state.headingFont} role="heading" />
    ),
    Body: ({ lab }) => <FontPreview family={lab.state.bodyFont} role="body" />,
    Mono: ({ lab }) => <FontPreview family={lab.state.monoFont} role="mono" />,
  },
  icons: {
    Library: IconGridPreview,
    Stroke: StrokePreview,
    Weight: IconGridPreview,
  },
  shape: {
    Radius: RadiusPreview,
    Character: RolesPreview,
    Roles: RolesPreview,
    Corners: CornersPreview,
  },
  space: {
    Density: DensityPreview,
  },
  details: {
    Shadows: ShadowsPreview,
    Cursor: CursorPreview,
    "Disabled cursor": CursorPreview,
  },
  components: {
    Button: ButtonPreview,
    Input: InputPreview,
    Checkbox: CheckboxPreview,
    Card: CardPreview,
    Badge: BadgePreview,
    Modal: ModalPreview,
    Tooltip: TooltipPreview,
    Menu: MenuPreview,
    Loader: LoaderPreview,
  },
}
