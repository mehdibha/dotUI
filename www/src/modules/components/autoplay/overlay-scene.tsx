'use client'

import {
  type ReactNode,
  type RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import { cn } from '@/registry/lib/utils'

import type { ScenePhase } from './use-autoplay'

/**
 * The cinematic for overlay triggers. A trigger sits centered and the surface
 * unfolds beside it — at rest the overlay is OPEN so the card previews it, and on
 * hover the timeline loops it open/closed (see `useOpenAutoplay`).
 *
 * Everything is presentational: the trigger is a real component and the surface
 * uses the real token classes, but the open state is faked so nothing portals out
 * of the card or touches real focus. Animations are CSS transitions (the previews
 * are `inert`, where script-driven animation libraries don't run): surfaces stay
 * mounted and toggle their visual state, so they animate in and out, and the
 * anchored layout uses the grid-rows `0fr → 1fr` trick to reflow the column
 * height — which carries the trigger up as the surface opens.
 *
 * The open composition is measured and scaled down (`useFitScale`) so the surface
 * always fits inside the small preview — whatever the card width or the surface's
 * intrinsic size — instead of cropping against the card edge.
 */

export type SurfaceVariant = 'popover' | 'menu' | 'modal' | 'drawer' | 'tooltip'

interface OverlaySceneProps {
  phase: ScenePhase
  variant: SurfaceVariant
  /** Which side of the trigger the surface unfolds (anchored variants only). */
  side?: 'top' | 'bottom'
  /** The real trigger (a Button, icon button, input group…). */
  trigger: React.ReactNode
  /** The surface contents — real sub-components (DialogHeader, ListBox…). */
  children: React.ReactNode
  /** Upper bound on the fit scale — the surface never renders larger than this. */
  openScale?: number
  /** Field-style trigger: fill the width so it matches the stretched field demos
   *  (combobox, select, date-picker) instead of sizing to content. */
  fluid?: boolean
  /** Extra classes for the surface frame. */
  surfaceClassName?: string
}

const SURFACE_FRAME: Record<SurfaceVariant, string> = {
  popover:
    'rounded-(--popover-radius) border bg-popover p-2.5 text-xs/relaxed shadow-md',
  menu: 'rounded-(--popover-radius) border bg-popover p-1 shadow-md',
  modal:
    'rounded-(--modal-radius,var(--radius-lg)) border bg-bg p-4 text-sm shadow-lg',
  drawer: 'rounded-t-(--radius-xl) border-t bg-bg p-4 text-sm shadow-lg',
  tooltip:
    'rounded-(--tooltip-radius) bg-tooltip px-3 py-1.5 text-center text-xs text-fg-on-tooltip shadow-md',
}

// The ancestor data attribute the real Dialog* sub-components key their
// in-context padding on (`in-data-popover:` / `in-data-modal:`).
const SURFACE_DATA: Partial<Record<SurfaceVariant, Record<string, string>>> = {
  popover: { 'data-popover': '' },
  menu: { 'data-popover': '' },
  modal: { 'data-modal': '' },
}

const SCENE_ROOT =
  'relative flex h-full w-full items-center justify-center overflow-hidden'
const EASE = 'cubic-bezier(0.32,0.72,0,1)'
// How much of the card the open composition may occupy before it's scaled down.
const FIT_MARGIN = 0.86

const useIsoLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

/**
 * Scale factor that keeps the open composition inside the preview card. Measures
 * the surface (and, when stacked, the trigger) against the scene and returns the
 * largest scale ≤ `maxScale` that still fits with a margin. `offset*` sizes are
 * layout sizes, immune to the grid clip and our own scale transform, so the
 * measurement is stable in any phase.
 */
function useFitScale({
  sceneRef,
  surfaceRef,
  triggerRef,
  stacked,
  gap = 0,
  maxScale = 1,
}: {
  sceneRef: RefObject<HTMLDivElement | null>
  surfaceRef: RefObject<HTMLDivElement | null>
  triggerRef: RefObject<HTMLDivElement | null>
  stacked: boolean
  gap?: number
  maxScale?: number
}): number {
  const [scale, setScale] = useState(maxScale)

  useIsoLayoutEffect(() => {
    const scene = sceneRef.current
    const surface = surfaceRef.current
    if (!scene || !surface) return

    const compute = () => {
      const availW = scene.clientWidth
      const availH = scene.clientHeight
      if (!availW || !availH) return
      const trigger = stacked ? triggerRef.current : null
      const natW = Math.max(surface.offsetWidth, trigger?.offsetWidth ?? 0)
      const natH =
        surface.offsetHeight + (trigger ? trigger.offsetHeight + gap : 0)
      if (!natW || !natH) return
      setScale(
        Math.min(
          maxScale,
          (availW * FIT_MARGIN) / natW,
          (availH * FIT_MARGIN) / natH,
        ),
      )
    }

    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(scene)
    ro.observe(surface)
    if (triggerRef.current) ro.observe(triggerRef.current)
    return () => ro.disconnect()
  }, [stacked, gap, maxScale])

  return scale
}

// The trigger is a real component in its default state. When an overlay opens it
// can dim back (a depth cue for modal/drawer), but it never resizes on its own —
// the only scaling is the scene "camera" on the anchored column.
function Trigger({
  triggerRef,
  dim,
  fluid,
  children,
}: {
  triggerRef: RefObject<HTMLDivElement | null>
  dim?: boolean
  fluid?: boolean
  children: ReactNode
}) {
  return (
    <div
      ref={triggerRef}
      // `fluid` field triggers fill the column so their width matches the
      // stretched field demos; icon-button triggers stay content-sized.
      className={cn('relative', fluid && 'w-full')}
      style={{ opacity: dim ? 0.55 : 1, transition: 'opacity 300ms ease' }}
    >
      {children}
    </div>
  )
}

/** A surface that grows in/out of the column flow (driving the trigger's ride).
 *  `fluid` stretches it to the full column width so field dropdowns (select,
 *  combobox) match their trigger instead of shrinking to their content. */
function AnchoredSurface({
  open,
  side,
  fluid,
  children,
}: {
  open: boolean
  side: 'top' | 'bottom'
  fluid?: boolean
  children: ReactNode
}) {
  return (
    <div
      className={cn('grid overflow-hidden', fluid && 'w-full grid-cols-1')}
      style={{
        gridTemplateRows: open ? '1fr' : '0fr',
        transition: `grid-template-rows 360ms ${EASE}`,
      }}
    >
      <div className="min-h-0">
        <div
          className={cn(side === 'bottom' ? 'pt-2' : 'pb-2', fluid && 'w-full')}
          style={{
            opacity: open ? 1 : 0,
            transform: open
              ? 'none'
              : `translateY(${side === 'bottom' ? '-4px' : '4px'}) scale(0.96)`,
            transition: `opacity 240ms ease, transform 300ms ${EASE}`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export function OverlayScene({
  phase,
  variant,
  side = 'bottom',
  trigger,
  children,
  openScale,
  fluid = false,
  surfaceClassName,
}: OverlaySceneProps) {
  const open = phase === 'open'
  const sceneRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const surfaceRef = useRef<HTMLDivElement>(null)

  // Anchored variants stack trigger + surface and scale as one; overlay variants
  // (modal/drawer) float the surface over the trigger.
  const anchored = variant !== 'modal' && variant !== 'drawer'
  const fitScale = useFitScale({
    sceneRef,
    surfaceRef,
    triggerRef,
    stacked: anchored,
    gap: 8,
    maxScale: openScale ?? 1,
  })

  const surface = (
    <div
      ref={surfaceRef}
      {...SURFACE_DATA[variant]}
      className={cn(SURFACE_FRAME[variant], surfaceClassName)}
    >
      {children}
    </div>
  )

  // Modal: centered panel over a dimming backdrop; the trigger dims behind it.
  if (variant === 'modal') {
    return (
      <div ref={sceneRef} className={SCENE_ROOT}>
        <Trigger triggerRef={triggerRef} dim={open}>
          {trigger}
        </Trigger>
        <div
          aria-hidden
          className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
          style={{ opacity: open ? 1 : 0, transition: 'opacity 250ms ease' }}
        />
        <div className="absolute inset-0 flex items-center justify-center p-3">
          <div
            className="w-full max-w-[13rem]"
            style={{
              opacity: open ? 1 : 0,
              transform: open
                ? `scale(${fitScale})`
                : 'translateY(6px) scale(0.9)',
              transformOrigin: 'center',
              transition: `opacity 250ms ease, transform 300ms ${EASE}`,
            }}
          >
            {surface}
          </div>
        </div>
      </div>
    )
  }

  // Drawer: bottom sheet slides up over a dimming backdrop.
  if (variant === 'drawer') {
    return (
      <div ref={sceneRef} className={SCENE_ROOT}>
        <Trigger triggerRef={triggerRef} dim={open}>
          {trigger}
        </Trigger>
        <div
          aria-hidden
          className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
          style={{ opacity: open ? 1 : 0, transition: 'opacity 250ms ease' }}
        />
        <div
          className="absolute inset-x-2 bottom-0"
          style={{
            transform: open ? 'translateY(0)' : 'translateY(100%)',
            transition: `transform 360ms ${EASE}`,
          }}
        >
          {surface}
        </div>
      </div>
    )
  }

  // Anchored (popover / menu / tooltip): the trigger + surface share a column
  // that scales down when open so both fit — the "zoom out" the trigger rides.
  return (
    <div ref={sceneRef} className={SCENE_ROOT}>
      <div
        // `fluid` makes field-style triggers (combobox, select, date-picker) fill
        // the width + horizontal inset so they match the stretched field demos;
        // icon-button triggers stay content-sized and centered.
        className={cn('flex flex-col items-center', fluid && 'w-full px-4')}
        style={{
          transform: `scale(${open ? fitScale : 1})`,
          transformOrigin: 'center',
          transition: `transform 400ms ${EASE}`,
        }}
      >
        {side === 'top' && (
          <AnchoredSurface open={open} side="top" fluid={fluid}>
            {surface}
          </AnchoredSurface>
        )}
        <Trigger triggerRef={triggerRef} fluid={fluid}>
          {trigger}
        </Trigger>
        {side === 'bottom' && (
          <AnchoredSurface open={open} side="bottom" fluid={fluid}>
            {surface}
          </AnchoredSurface>
        )}
      </div>
    </div>
  )
}
