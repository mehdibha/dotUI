'use client'

import { PreviewPanel } from '../preview/preview-panel'
import { CommandBar } from './ai/command-bar'
import { Inspector } from './inspector'
import { Rail } from './rail'
import { StudioProvider } from './studio-context'
import { StudioHeader } from './studio-header'

/**
 * The `/create?studio` experience — an AI-native rethink of the builder.
 *
 * One opinionated three-zone layout: an icon rail of sections, a rich
 * inspector, and a big live canvas with a persistent AI copilot docked over it.
 * Everything writes the same DesignSystem state the shipped page does, so live
 * axes genuinely drive the reused preview and the export stays intact.
 */
export function StudioExperience() {
  return (
    <StudioProvider>
      {/* The Studio owns the whole viewport: the global site Header is skipped
          on /create?studio (see _app/route.tsx), so StudioHeader is the only
          top bar and the shell fills 100svh rather than subtracting it. */}
      <div className="flex h-svh min-h-0 flex-col overflow-hidden">
        <StudioHeader />
        <div className="flex min-h-0 flex-1">
          <Rail />
          <Inspector />
          <div className="relative flex min-w-0 flex-1 flex-col bg-bg p-3">
            <PreviewPanel />
            <CommandBar />
          </div>
        </div>
      </div>
    </StudioProvider>
  )
}
