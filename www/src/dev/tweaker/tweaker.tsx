'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import {
  CheckIcon,
  CopyIcon,
  RotateCcwIcon,
  SlidersHorizontalIcon,
  XIcon,
} from 'lucide-react'

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { Kbd } from '@/registry/ui/kbd'

import { ControlRow } from './controls'
import {
  getControls,
  getServerControls,
  getServerUiState,
  getUiState,
  getValue,
  resetAll,
  setUiState,
  subscribe,
} from './store'
import type { RegisteredControl } from './types'

const TRIGGER_SIZE = 40 // px (size-10)
const EDGE_GAP = 12 // px between the trigger and the screen edge
const PANEL_OFFSET = EDGE_GAP + TRIGGER_SIZE + 8 // edge → panel's near side

const noopSubscribe = () => () => {}

/** SSR-safe "are we on the client yet?" — false on the server + first paint, true after. */
function useMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )
}

function useControls(): RegisteredControl[] {
  return useSyncExternalStore(subscribe, getControls, getServerControls)
}

function useUiState() {
  return useSyncExternalStore(subscribe, getUiState, getServerUiState)
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(Math.max(n, lo), hi)
}

/** A compact summary of the current selections the user can paste back to the agent. */
function buildCopyText(): string {
  const lines = getControls().map((c) => {
    const raw = getValue(c.id)
    const chosen = raw === undefined ? c.config.default : raw
    const prefix = c.group === 'default' ? '' : `${c.group} / `
    return `- ${prefix}${c.label} (${c.config.type}): ${JSON.stringify(chosen)}  [default ${JSON.stringify(c.config.default)}]`
  })
  return `Tweaker selections:\n${lines.join('\n') || '(none)'}`
}

export function DevTweaker() {
  const mounted = useMounted()
  const ui = useUiState()
  const controls = useControls()
  const { isCopied, copyToClipboard } = useCopyToClipboard()

  const [viewport, setViewport] = useState(() =>
    typeof window === 'undefined'
      ? { w: 1280, h: 800 }
      : { w: window.innerWidth, h: window.innerHeight },
  )
  // While dragging, the trigger follows the cursor (px); on release it snaps to a side.
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null)
  const dragStart = useRef<{ x: number; y: number } | null>(null)
  const moved = useRef(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onResize = () =>
      setViewport({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // ⌘. / Ctrl+. toggles the popover; Escape closes it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '.') {
        e.preventDefault()
        setUiState({ open: !getUiState().open })
      } else if (e.key === 'Escape' && getUiState().open) {
        setUiState({ open: false })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Dismiss the popover on an outside click (it stays anchored to the trigger otherwise).
  useEffect(() => {
    if (!ui.open) return
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (
        panelRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return
      }
      setUiState({ open: false })
    }
    window.addEventListener('pointerdown', onDown)
    return () => window.removeEventListener('pointerdown', onDown)
  }, [ui.open])

  if (!mounted) return null

  /* --------------------------- trigger drag --------------------------- */

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    // Capture so move/up keep firing if the cursor leaves the button mid-drag.
    // Can throw InvalidPointerId on stray/synthetic pointers — non-fatal.
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
    dragStart.current = { x: e.clientX, y: e.clientY }
    moved.current = false
  }

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragStart.current) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    if (!moved.current && Math.hypot(dx, dy) > 5) {
      moved.current = true
      if (getUiState().open) setUiState({ open: false }) // dragging closes the popover
    }
    if (moved.current) setDrag({ x: e.clientX, y: e.clientY })
  }

  const onPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragStart.current) return
    dragStart.current = null
    setDrag(null)
    if (moved.current) {
      // Snap to the nearest edge, keeping the vertical position it was dropped at.
      const side = e.clientX < window.innerWidth / 2 ? 'left' : 'right'
      const y = clamp(e.clientY / window.innerHeight, 0.06, 0.94)
      setUiState({ side, y })
    } else {
      setUiState({ open: !getUiState().open }) // a tap toggles the popover
    }
  }

  /* ----------------------------- geometry ----------------------------- */

  const dockedCx =
    ui.side === 'left'
      ? EDGE_GAP + TRIGGER_SIZE / 2
      : viewport.w - EDGE_GAP - TRIGGER_SIZE / 2
  const triggerStyle: React.CSSProperties = drag
    ? { left: drag.x, top: drag.y }
    : { left: dockedCx, top: ui.y * viewport.h }

  const panelSideStyle: React.CSSProperties =
    ui.side === 'left' ? { left: PANEL_OFFSET } : { right: PANEL_OFFSET }
  // Centre the panel on the trigger, but clamp so it always stays fully on screen.
  const panelTop = clamp(ui.y, 0.36, 0.64) * viewport.h

  const count = controls.length

  return (
    <>
      {/* Trigger — always visible, docked to a side, draggable (snaps to an edge). z-40 keeps
          it above page content but below the popover layer (z-50) and modals (z-100). */}
      <button
        ref={triggerRef}
        type="button"
        aria-label="Open tweaker"
        aria-expanded={ui.open}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={triggerStyle}
        className={cn(
          'hover:bg-bg-muted fixed z-40 flex size-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer touch-none items-center justify-center rounded-full border border-border bg-bg text-fg shadow-lg',
          !drag && 'transition-[left,top] duration-200 ease-out',
          ui.open && 'bg-bg-muted',
        )}
      >
        <SlidersHorizontalIcon className="size-4 text-fg-muted" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-fg-on-primary">
            {count}
          </span>
        )}
      </button>

      {/* Popover panel — anchored beside the trigger; the trigger stays visible. */}
      {ui.open && !drag && (
        <div
          ref={panelRef}
          style={{ ...panelSideStyle, top: panelTop }}
          className="fixed z-40 flex max-h-[70vh] w-75 max-w-[calc(100vw-5rem)] -translate-y-1/2 flex-col overflow-hidden rounded-xl border border-border bg-bg shadow-2xl"
        >
          <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
            <div className="flex items-center gap-2">
              <SlidersHorizontalIcon className="size-4 text-fg-muted" />
              <span className="text-sm font-medium">Tweaker</span>
              {count > 0 && (
                <span className="flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-fg-on-primary">
                  {count}
                </span>
              )}
            </div>
            <div className="flex items-center gap-0.5">
              <Button
                size="sm"
                variant="quiet"
                isIconOnly
                aria-label="Copy selections for the agent"
                onPress={() => copyToClipboard(buildCopyText())}
              >
                {isCopied ? <CheckIcon /> : <CopyIcon />}
              </Button>
              <Button
                size="sm"
                variant="quiet"
                isIconOnly
                aria-label="Reset all to defaults"
                onPress={() => resetAll()}
              >
                <RotateCcwIcon />
              </Button>
              <Button
                size="sm"
                variant="quiet"
                isIconOnly
                aria-label="Close"
                onPress={() => setUiState({ open: false })}
              >
                <XIcon />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {count === 0 ? (
              <EmptyState />
            ) : (
              <GroupedControls controls={controls} />
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border px-3 py-1.5 text-[10px] text-fg-muted">
            <span>dev only · not shipped</span>
            <span className="flex items-center gap-1">
              <Kbd>⌘ .</Kbd> to toggle
            </span>
          </div>
        </div>
      )}
    </>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-1.5 px-2 py-6 text-center">
      <SlidersHorizontalIcon className="size-5 text-fg-muted" />
      <p className="text-sm font-medium text-fg">No tweaks yet</p>
      <p className="text-xs text-balance text-fg-muted">
        Ask the agent to add tweaks for the feature you&rsquo;re exploring.
      </p>
    </div>
  )
}

function GroupedControls({ controls }: { controls: RegisteredControl[] }) {
  // `controls` arrives sorted by (group, order), so a single pass groups them.
  const groups: Array<[string, RegisteredControl[]]> = []
  for (const control of controls) {
    const last = groups[groups.length - 1]
    if (last && last[0] === control.group) last[1].push(control)
    else groups.push([control.group, [control]])
  }

  return (
    <div className="flex flex-col gap-4">
      {groups.map(([group, items]) => (
        <div key={group} className="flex flex-col gap-3">
          {group !== 'default' && (
            <div className="text-[10px] font-semibold tracking-wide text-fg-muted uppercase">
              {group}
            </div>
          )}
          {items.map((control) => (
            <ControlRow key={control.id} control={control} />
          ))}
        </div>
      ))}
    </div>
  )
}
