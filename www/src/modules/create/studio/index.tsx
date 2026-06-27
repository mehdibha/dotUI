'use client'

import { cn } from '@/registry/lib/utils'

import { CommandPalette } from './command-palette'
import { StudioProvider } from './context'
import { StudioFooter } from './footer'
import { StudioHeader } from './header'
import { StudioRail } from './rail'
import { ActiveWorkspace } from './workspaces'

/**
 * The builder's control surface — a rail of workspaces (Start, Color, Type,
 * Shape, …, Components) over a live, URL-encoded design system. Replaces the
 * old drill-down customizer; every control writes the same `?preset=` channel
 * the live preview reads, so edits are instant and shareable.
 */
export function StudioPanel({ className }: { className?: string }) {
  return (
    <StudioProvider>
      <div
        className={cn(
          'flex w-full flex-1 flex-col overflow-hidden rounded-xl border bg-card lg:w-[360px] lg:flex-none lg:shrink-0',
          className,
        )}
      >
        <StudioHeader />
        <div className="flex min-h-0 flex-1">
          <StudioRail />
          <div className="min-w-0 flex-1 overflow-y-auto overscroll-contain">
            <ActiveWorkspace />
          </div>
        </div>
        <StudioFooter />
        <CommandPalette />
      </div>
    </StudioProvider>
  )
}
