'use client'

import { Canvas } from './canvas'
import { Copilot, CopilotRail } from './copilot'
import { Dock } from './dock'
import { Inspector } from './inspector'
import { StatusBar } from './status-bar'
import { StudioProvider, useStudio } from './store'
import { TopBar } from './top-bar'

/* ----------------------------------------------------------------------------
 * Studio — the `/create?studio` experiment: a canvas-first, AI-native rethink
 * of the builder.
 *
 *   ┌───────────────────────── top bar · identity · ⌘K AI · export ─────────┐
 *   │ dock │   inspector   │            canvas (hero, live)        │ copilot │
 *   └───────────────────────────── status bar · health ────────────────────┘
 *
 * The design-system state and the live preview are the *existing* ones, so
 * every control and AI action is genuinely wired; only the shell + the AI layer
 * are new. Gated behind a flag so the shipped builder and the panel lab are
 * untouched.
 * -------------------------------------------------------------------------- */

export function StudioExperience() {
  return (
    <StudioProvider>
      <StudioShell />
    </StudioProvider>
  )
}

function StudioShell() {
  const { copilotOpen } = useStudio()
  return (
    <div className="flex h-[calc(100svh-var(--header-height))] min-h-0 flex-col bg-bg">
      <TopBar />
      <div className="relative flex min-h-0 flex-1">
        <Dock />
        <Inspector />
        <Canvas />
        {copilotOpen ? <Copilot /> : <CopilotRail />}
      </div>
      <StatusBar />
    </div>
  )
}
