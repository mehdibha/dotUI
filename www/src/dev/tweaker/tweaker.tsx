'use client'

import { useEffect, useSyncExternalStore } from 'react'
import {
  CheckIcon,
  CopyIcon,
  MinusIcon,
  RotateCcwIcon,
  SlidersHorizontalIcon,
  XIcon,
} from 'lucide-react'

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
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

  // ⌘. / Ctrl+. toggles the panel (and un-collapses when bringing it back).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '.') {
        e.preventDefault()
        const next = !getUiState().hidden
        setUiState({ hidden: next, collapsed: next ? true : false })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!mounted || ui.hidden) return null

  const count = controls.length

  // z-40: above page content, but below the popover layer (z-50) so the panel's own
  // Select/ColorField dropdowns render above it, and below modals (z-100).
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      {ui.collapsed ? (
        <button
          type="button"
          onClick={() => setUiState({ collapsed: false })}
          className="hover:bg-bg-muted pointer-events-auto flex items-center gap-2 rounded-full border border-border bg-bg/95 px-3 py-2 text-fg shadow-lg backdrop-blur-sm transition-colors"
        >
          <SlidersHorizontalIcon className="size-4 text-fg-muted" />
          <span className="text-xs font-medium">Tweaker</span>
          {count > 0 && (
            <span className="flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-fg-on-primary">
              {count}
            </span>
          )}
        </button>
      ) : (
        <div className="pointer-events-auto flex max-h-[70vh] w-75 flex-col overflow-hidden rounded-xl border border-border bg-bg shadow-2xl">
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
                aria-label="Minimize"
                onPress={() => setUiState({ collapsed: true })}
              >
                <MinusIcon />
              </Button>
              <Button
                size="sm"
                variant="quiet"
                isIconOnly
                aria-label="Hide (⌘.)"
                onPress={() => setUiState({ hidden: true })}
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
              <Kbd>⌘ .</Kbd> to hide
            </span>
          </div>
        </div>
      )}
    </div>
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
