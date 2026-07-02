'use client'

import { WandSparklesIcon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

import { GeneratePanel } from './ai/generate-panel'
import { VIBES } from './ai/vibes'
import { type StudioControl, STUDIO_SECTIONS } from './sections'
import { useStudio } from './studio-context'

export function Inspector() {
  const { activeSection, applyVibe } = useStudio()

  if (activeSection === 'generate') {
    return (
      <Panel>
        <GeneratePanel />
      </Panel>
    )
  }

  const section = STUDIO_SECTIONS.find((s) => s.id === activeSection)
  if (!section) return null

  return (
    <Panel>
      <div className="flex flex-col gap-1 border-b px-4 py-3.5">
        <div className="flex items-center gap-2">
          <section.icon className="size-4 text-fg-muted" />
          <h2 className="text-sm font-semibold">{section.label}</h2>
        </div>
        <p className="text-xs text-fg-muted">{section.tagline}</p>
      </div>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
        {section.id === 'color' && (
          <Button
            variant="default"
            size="sm"
            className="w-full gap-2"
            onPress={() => {
              const vibe = VIBES[Math.floor(Math.random() * VIBES.length)]
              if (vibe) applyVibe(vibe)
            }}
          >
            <WandSparklesIcon className="size-3.5 text-fg-accent" />
            Suggest a palette
          </Button>
        )}
        {section.controls.map((control) => (
          <ControlRow key={control.id} control={control} />
        ))}
      </div>
    </Panel>
  )
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-[340px] shrink-0 flex-col overflow-hidden border-r bg-card">
      {children}
    </div>
  )
}

function ControlRow({ control }: { control: StudioControl }) {
  return (
    <div className="flex flex-col gap-2" data-control={control.id}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-fg">{control.label}</span>
            <BindingPip binding={control.binding} />
          </div>
          {control.description && (
            <p className="text-xs leading-snug text-pretty text-fg-muted">
              {control.description}
            </p>
          )}
        </div>
      </div>
      <control.Widget />
    </div>
  )
}

function BindingPip({ binding }: { binding: StudioControl['binding'] }) {
  const live = binding === 'live'
  return (
    <Tooltip delay={300}>
      <span
        className={cn(
          'inline-block size-1.5 shrink-0 rounded-full',
          live ? 'bg-success' : 'border border-warning/70',
        )}
        aria-hidden
      />
      <TooltipContent>
        {live ? 'Live — drives the preview' : 'Planned — UI only for now'}
      </TooltipContent>
    </Tooltip>
  )
}
