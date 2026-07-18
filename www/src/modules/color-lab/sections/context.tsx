import type { ReactNode } from 'react'

import type { CvdType } from '../color'
import { referenceSystems, ENGINE_SLOT } from '../data'
import type { Mode } from '../page'
import { SystemPreview } from '../preview'

export function ContextSection({
  mode,
  cvd,
}: {
  mode: Mode
  cvd: CvdType | null
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <Labeled name={ENGINE_SLOT.name}>
        <SystemPreview system={ENGINE_SLOT} mode={mode} cvd={cvd} />
      </Labeled>
      {referenceSystems.map((system) => (
        <Labeled key={system.id} name={system.name}>
          <SystemPreview system={system} mode={mode} cvd={cvd} />
        </Labeled>
      ))}
    </div>
  )
}

function Labeled({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[13px] font-medium">{name}</p>
      {children}
    </div>
  )
}
