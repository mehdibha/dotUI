'use client'

import { cn } from '@/registry/lib/utils'

import { PreviewPanel } from '../preview/preview-panel'
import { PanelConfigProvider, usePanelConfig } from './config'
import { ControlPanel } from './control-panel'
import { PanelLab } from './lab'

/**
 * The `/create?lab` experience: the new data-driven control panel + the reused
 * live preview + the floating panel lab, all under a PanelConfig provider so the
 * lab can restructure the panel in real time.
 */
export function LabExperience() {
  return (
    <PanelConfigProvider>
      <LabLayout />
    </PanelConfigProvider>
  )
}

function LabLayout() {
  const { config } = usePanelConfig()
  return (
    <div
      className={cn(
        'flex h-[calc(100svh-var(--header-height))] min-h-0 flex-1 gap-6 p-6 pt-2',
        config.dockSide === 'right' && 'flex-row-reverse',
      )}
    >
      <ControlPanel />
      <PreviewPanel />
      <PanelLab />
    </div>
  )
}
