'use client'

import { CodeOptionsDialog } from '../code-options'
import { ExportFooter } from '../export'
import { GroupLabel } from './ui'

/** The export dock — ship the system anywhere, and shape the emitted code. */
export function StudioFooter() {
  return (
    <div className="flex flex-col gap-2 border-t p-3">
      <GroupLabel className="px-0.5">Export</GroupLabel>
      <ExportFooter />
      <CodeOptionsDialog />
    </div>
  )
}
