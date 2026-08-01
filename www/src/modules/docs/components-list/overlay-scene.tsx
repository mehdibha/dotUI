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

/**
 * A static preview of an overlay component: the real trigger with its surface
 * already open beside it.
 *
 * Everything is presentational — the trigger is a real component and the surface
 * uses the real token classes, but the open state is faked so nothing portals out
 * of the card or touches real focus. The composition is measured and scaled down
 * (`useFitScale`) so the surface always fits inside the small preview, whatever
 * the card width or the surface's intrinsic size.
 */

export type SurfaceVariant = 'popover' | 'menu' | 'modal' | 'drawer' | 'tooltip'

interface OverlaySceneProps {
  variant: SurfaceVariant
  /** Which side of the trigger the surface sits on (anchored variants only). */
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
// How much of the card the composition may occupy before it's scaled down.
const FIT_MARGIN = 0.86

const useIsoLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

/**
 * Scale factor that keeps the composition inside the preview card. Measures the
 * surface (and, when stacked, the trigger) against the scene and returns the
 * largest scale ≤ `maxScale` that still fits with a margin.
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

// The trigger is a real component in its default state; it dims back behind the
// modal/drawer surfaces as a depth cue.
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
      // `fluid` field triggers fill the column so their width matches the
      // stretched field demos; icon-button triggers stay content-sized.
      className={cn('relative', fluid && 'w-full')}
      ref={triggerRef}
      style={{ opacity: dim ? 0.55 : 1 }}
    >
      {children}
    </div>
  )
}

export function OverlayScene({
  variant,
  side = 'bottom',
  trigger,
  children,
  openScale,
  fluid = false,
  surfaceClassName,
}: OverlaySceneProps) {
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

  // Modal: centered panel over a dimming backdrop.
  if (variant === 'modal') {
    return (
      <div ref={sceneRef} className={SCENE_ROOT}>
        <Trigger triggerRef={triggerRef} dim>
          {trigger}
        </Trigger>
        <div
          aria-hidden
          className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        />
        <div className="absolute inset-0 flex items-center justify-center p-3">
          <div
            className="w-full max-w-[13rem]"
            style={{
              transform: `scale(${fitScale})`,
              transformOrigin: 'center',
            }}
          >
            {surface}
          </div>
        </div>
      </div>
    )
  }

  // Drawer: bottom sheet over a dimming backdrop.
  if (variant === 'drawer') {
    return (
      <div ref={sceneRef} className={SCENE_ROOT}>
        <Trigger triggerRef={triggerRef} dim>
          {trigger}
        </Trigger>
        <div
          aria-hidden
          className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        />
        <div className="absolute inset-x-2 bottom-0">{surface}</div>
      </div>
    )
  }

  // Anchored (popover / menu / tooltip): the trigger + surface share a column
  // that scales down so both fit.
  return (
    <div ref={sceneRef} className={SCENE_ROOT}>
      <div
        className={cn('flex flex-col items-center', fluid && 'w-full px-4')}
        style={{ transform: `scale(${fitScale})`, transformOrigin: 'center' }}
      >
        {side === 'top' && (
          <div className={cn('pb-2', fluid && 'w-full')}>{surface}</div>
        )}
        <Trigger triggerRef={triggerRef} fluid={fluid}>
          {trigger}
        </Trigger>
        {side === 'bottom' && (
          <div className={cn('pt-2', fluid && 'w-full')}>{surface}</div>
        )}
      </div>
    </div>
  )
}
