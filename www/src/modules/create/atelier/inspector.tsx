'use client'

import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

import { CodeOptionsDialog } from '../code-options'
import { ExportFooter } from '../export'
import { BindingDot } from '../panel/primitives'
import { STUDIO_DOMAINS, type StudioControl, type StudioDomain } from './schema'
import { useStudio } from './store'

/* ----------------------------------------------------------------------------
 * The inspector — the edit surface. A slim domain rail (every axis family) plus
 * the active domain's controls, rendered wider than the shipped 288px panel so
 * rich controls (color ramps, status grids, component anatomy) have room.
 * -------------------------------------------------------------------------- */

export function Inspector({ className }: { className?: string }) {
  const { activeDomain, setActiveDomain } = useStudio()
  const domain =
    STUDIO_DOMAINS.find((d) => d.id === activeDomain) ?? STUDIO_DOMAINS[0]
  if (!domain) return null

  return (
    <aside
      className={cn(
        'flex shrink-0 overflow-hidden rounded-xl border bg-card',
        className,
      )}
    >
      <DomainRail active={domain.id} onSelect={setActiveDomain} />
      <div className="flex min-w-0 flex-1 flex-col">
        <DomainHeader domain={domain} />
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="flex flex-col gap-6 p-4">
            {domain.groups.map((group, i) => (
              <section key={group.label ?? i} className="flex flex-col gap-3">
                {group.label && (
                  <span className="text-[10px] font-semibold tracking-widest text-fg-muted uppercase">
                    {group.label}
                  </span>
                )}
                <div className="flex flex-col gap-4">
                  {group.controls.map((control) => (
                    <ControlRow key={control.id} control={control} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 border-t p-3">
          <CodeOptionsDialog />
          <ExportFooter />
        </div>
      </div>
    </aside>
  )
}

function DomainRail({
  active,
  onSelect,
}: {
  active: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-1 border-r bg-neutral/30 p-1.5">
      {STUDIO_DOMAINS.map((d) => {
        const isActive = d.id === active
        return (
          <Tooltip key={d.id} delay={250}>
            <ButtonPrimitives.Button
              onPress={() => onSelect(d.id)}
              aria-label={d.label}
              className={cn(
                'flex size-10 items-center justify-center rounded-lg focus-reset transition-colors focus-visible:focus-ring',
                isActive
                  ? 'bg-card text-fg shadow-sm ring-1 ring-border'
                  : 'text-fg-muted hover:bg-card/60 hover:text-fg',
              )}
            >
              <d.icon className="size-[18px]" />
            </ButtonPrimitives.Button>
            <TooltipContent placement="right">{d.label}</TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}

function DomainHeader({ domain }: { domain: StudioDomain }) {
  return (
    <div className="flex items-center gap-2.5 border-b px-4 py-3">
      <div className="flex size-8 items-center justify-center rounded-lg bg-neutral text-fg">
        <domain.icon className="size-4" />
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-semibold">{domain.label}</span>
        <span className="truncate text-xs text-fg-muted">{domain.tagline}</span>
      </div>
    </div>
  )
}

function ControlRow({ control }: { control: StudioControl }) {
  if (control.block) {
    return (
      <div className="flex flex-col gap-2" data-control={control.id}>
        <LabelLine control={control} />
        {control.description && <Help>{control.description}</Help>}
        <control.Widget />
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-1.5" data-control={control.id}>
      <LabelLine control={control} />
      {control.description && <Help>{control.description}</Help>}
      <control.Widget />
    </div>
  )
}

function LabelLine({ control }: { control: StudioControl }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="truncate text-[13px] font-medium text-fg">
        {control.label}
      </span>
      <BindingDot binding={control.binding} />
    </div>
  )
}

function Help({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs leading-snug text-balance text-fg-muted">
      {children}
    </p>
  )
}
