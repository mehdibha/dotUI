'use client'

import { cn } from '@/registry/lib/utils'

import { CodeOptionsDialog } from '../code-options'
import { ExportFooter } from '../export'
import { BindingDot } from '../panel/primitives'

/** Export targets on the roadmap — shown so the destination story reads complete. */
const PLANNED = ['Bolt', 'Lovable', 'Figma', 'Claude']

export function BuilderFooter() {
  return (
    <div className="shrink-0 border-t">
      <div className="flex flex-col gap-2 p-3">
        <span className="px-0.5 text-[10px] font-semibold tracking-wider text-fg-muted/80 uppercase">
          Take it anywhere
        </span>
        <CodeOptionsDialog />
        <ExportFooter />
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          {PLANNED.map((t) => (
            <span
              key={t}
              className={cn(
                'inline-flex items-center gap-1 rounded-full border border-dashed px-2 py-0.5',
                'text-[11px] text-fg-muted/70',
              )}
            >
              {t}
              <span className="text-[9px] tracking-wide text-fg-muted/50 uppercase">
                soon
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 border-t px-3 py-2 text-[11px] text-fg-muted/80">
        <span className="flex items-center gap-1.5">
          <BindingDot binding="live" />
          Live in preview
        </span>
        <span className="flex items-center gap-1.5">
          <BindingDot binding="stub" />
          Preview-only (UI)
        </span>
      </div>
    </div>
  )
}
