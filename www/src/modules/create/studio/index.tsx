'use client'

import { cn } from '@/registry/lib/utils'

import { StudioFooter } from './footer'
import { StudioRail } from './rail'
import { ActiveWorkspace } from './workspaces'

export { CommandPalette } from './command-palette'
export { StudioProvider } from './context'
export { StudioTopBar } from './top-bar'

/**
 * The builder's control surface — a rail of workspaces (Start, Color, Type,
 * Shape, …, Components) over a live, URL-encoded design system. Replaces the
 * old drill-down customizer; every control writes the same `?preset=` channel
 * the live preview reads, so edits are instant and shareable.
 *
 * The page-level chrome (system name, undo, re-roll, ⌘K) lives in the
 * full-width `StudioTopBar` that replaces the site nav on `/create`; the
 * provider and command palette are hoisted to the page so the bar shares them.
 */
export function StudioPanel({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex w-full flex-1 flex-col overflow-hidden rounded-xl border bg-card lg:w-[360px] lg:flex-none lg:shrink-0',
        className,
      )}
    >
      <div className="flex min-h-0 flex-1">
        <StudioRail />
        <div className="min-w-0 flex-1 overflow-y-auto overscroll-contain">
          <ActiveWorkspace />
        </div>
      </div>
      <StudioFooter />
    </div>
  )
}
