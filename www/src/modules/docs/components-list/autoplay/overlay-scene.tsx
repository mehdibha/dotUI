'use client'

import type * as React from 'react'

import { cn } from '@/registry/lib/utils'

import { FakeCursor } from './cursor'
import { DemoPress } from './interaction'
import type { ScenePhase } from './use-autoplay'

/**
 * The cinematic for overlay triggers. A trigger sits centered; a cursor moves in,
 * hovers and clicks; then the overlay opens and the whole scene "zooms out" — the
 * trigger rides up and shrinks as the surface unfolds, so the entire interaction
 * stays framed inside the small preview.
 *
 * Everything is presentational: the trigger is a real component, the surface uses
 * the real token classes, but the open state is faked so nothing portals out of
 * the card or touches real focus. Animations are CSS transitions (the previews
 * are `inert`, where script-driven animation libraries don't run): surfaces stay
 * mounted and toggle their visual state, so they animate in and out, and the
 * anchored layout uses the grid-rows `0fr → 1fr` trick to reflow the column
 * height — which is what carries the trigger up.
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
  /** Scale of the trigger+surface stack when open (anchored variants). */
  openScale?: number
  /** Field-style trigger: fill the width so it matches the stretched field demos
   *  (combobox, select, date-picker) instead of sizing to content. */
  fluid?: boolean
  /** Extra classes for the surface frame. */
  surfaceClassName?: string
  /** Position the cursor over the trigger (defaults to the bottom-right corner). */
  cursorClassName?: string
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

// The trigger is a real component; it only ever shows real hover/pressed styles
// (via DemoPress → real RAC state attributes), never a synthetic scale. When an
// overlay opens it can dim back (a depth cue), but it does not resize — the only
// scaling is the scene "camera" on the anchored column below.
function Trigger({
  phase,
  dim,
  fluid,
  cursorClassName,
  children,
}: {
  phase: ScenePhase
  dim?: boolean
  fluid?: boolean
  cursorClassName?: string
  children: React.ReactNode
}) {
  return (
    <div
      // `fluid` field triggers fill the column so their width matches the
      // stretched field demos; the cursor still anchors to the field's corner.
      className={cn('relative', fluid && 'w-full')}
      style={{
        opacity: dim ? 0.55 : 1,
        transition: 'opacity 300ms ease',
      }}
    >
      <DemoPress phase={phase}>{children}</DemoPress>
      <FakeCursor
        phase={phase}
        className={cn(
          'right-0 bottom-0 translate-x-1 translate-y-1',
          cursorClassName,
        )}
      />
    </div>
  )
}

/** A surface that grows in/out of the column flow (driving the trigger's ride). */
function AnchoredSurface({
  open,
  side,
  children,
}: {
  open: boolean
  side: 'top' | 'bottom'
  children: React.ReactNode
}) {
  return (
    <div
      className="grid overflow-hidden"
      style={{
        gridTemplateRows: open ? '1fr' : '0fr',
        transition: `grid-template-rows 360ms ${EASE}`,
      }}
    >
      <div className="min-h-0">
        <div
          className={side === 'bottom' ? 'pt-2' : 'pb-2'}
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
  cursorClassName,
}: OverlaySceneProps) {
  const open = phase === 'open'
  const surface = (
    <div
      {...SURFACE_DATA[variant]}
      className={cn(SURFACE_FRAME[variant], surfaceClassName)}
    >
      {children}
    </div>
  )

  // Modal: centered panel over a dimming backdrop; the trigger dims behind it.
  if (variant === 'modal') {
    return (
      <div className={SCENE_ROOT}>
        <Trigger phase={phase} dim={open} cursorClassName={cursorClassName}>
          {trigger}
        </Trigger>
        <div
          aria-hidden
          className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
          style={{ opacity: open ? 1 : 0, transition: 'opacity 250ms ease' }}
        />
        <div
          className="absolute w-[78%] max-w-[15rem]"
          style={{
            opacity: open ? 1 : 0,
            transform: open ? 'none' : 'translateY(6px) scale(0.95)',
            transition: `opacity 250ms ease, transform 300ms ${EASE}`,
          }}
        >
          {surface}
        </div>
      </div>
    )
  }

  // Drawer: bottom sheet slides up over a dimming backdrop.
  if (variant === 'drawer') {
    return (
      <div className={SCENE_ROOT}>
        <Trigger phase={phase} dim={open} cursorClassName={cursorClassName}>
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
  const resolvedScale = openScale ?? (variant === 'tooltip' ? 0.95 : 0.82)

  return (
    <div className={SCENE_ROOT}>
      <div
        // `fluid` makes field-style triggers (combobox, select, date-picker) fill
        // the width + horizontal inset so they match the stretched field demos;
        // icon-button triggers stay content-sized and centered.
        className={cn('flex flex-col items-center', fluid && 'w-full px-4')}
        style={{
          transform: `scale(${open ? resolvedScale : 1})`,
          transformOrigin: 'center',
          transition: `transform 400ms ${EASE}`,
        }}
      >
        {side === 'top' && (
          <AnchoredSurface open={open} side="top">
            {surface}
          </AnchoredSurface>
        )}
        <Trigger phase={phase} fluid={fluid} cursorClassName={cursorClassName}>
          {trigger}
        </Trigger>
        {side === 'bottom' && (
          <AnchoredSurface open={open} side="bottom">
            {surface}
          </AnchoredSurface>
        )}
      </div>
    </div>
  )
}
