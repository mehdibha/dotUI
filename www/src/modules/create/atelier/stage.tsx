'use client'

import { PreviewPanel } from '../preview/preview-panel'
import { SpecSheet } from './spec-sheet'
import { useStudio } from './store'

/* ----------------------------------------------------------------------------
 * The stage — the dominant center column. Switches between the real live
 * preview (reused wholesale, postMessage channel and all) and the spec sheet.
 * -------------------------------------------------------------------------- */

export function Stage() {
  const { stageView } = useStudio()

  if (stageView === 'spec') {
    return (
      <div className="relative flex min-w-0 flex-1 overflow-hidden rounded-xl border bg-bg">
        <SpecSheet />
      </div>
    )
  }

  return <PreviewPanel />
}
