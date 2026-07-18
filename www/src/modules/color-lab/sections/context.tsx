import type { ReactNode } from 'react'

import type { CvdType } from '../color'
import type { ColorSystem } from '../data'
import type { Mode } from '../page'
import { SystemPreview } from '../preview'

export function ContextSection({
  systems,
  mode,
  cvd,
}: {
  systems: ColorSystem[]
  mode: Mode
  cvd: CvdType | null
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {systems.map((system) => (
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
