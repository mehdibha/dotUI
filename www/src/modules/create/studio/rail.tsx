'use client'

import { SparklesIcon } from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'

import { STUDIO_SECTIONS } from './sections'
import { useStudio } from './studio-context'

/* The left rail — one opinionated, ordered set of sections. "Generate" leads
 * (the AI front door) and is visually distinct; the rest are the design axes. */

export function Rail() {
  const { activeSection, setActiveSection } = useStudio()

  return (
    <nav
      aria-label="Sections"
      className="scrollbar-none flex w-16 shrink-0 flex-col items-stretch gap-1 overflow-y-auto border-r bg-card p-2"
    >
      <RailItem
        id="generate"
        label="Generate"
        active={activeSection === 'generate'}
        onPress={() => setActiveSection('generate')}
        accent
        icon={<SparklesIcon className="size-[18px]" />}
      />
      <div className="my-1 h-px bg-border" />
      {STUDIO_SECTIONS.map((section) => {
        const Icon = section.icon
        return (
          <RailItem
            key={section.id}
            id={section.id}
            label={section.label}
            active={activeSection === section.id}
            onPress={() => setActiveSection(section.id)}
            icon={<Icon className="size-[18px]" />}
          />
        )
      })}
    </nav>
  )
}

function RailItem({
  label,
  active,
  onPress,
  icon,
  accent,
}: {
  id: string
  label: string
  active: boolean
  onPress: () => void
  icon: React.ReactNode
  accent?: boolean
}) {
  return (
    <ButtonPrimitives.Button
      onPress={onPress}
      aria-current={active ? 'true' : undefined}
      className={cn(
        'group flex flex-col items-center gap-1 rounded-lg py-2 text-[10px] font-medium focus-reset transition-colors focus-visible:focus-ring',
        active
          ? accent
            ? 'bg-accent-muted text-fg-accent'
            : 'bg-neutral text-fg'
          : cn(
              'text-fg-muted hover:bg-neutral/60 hover:text-fg',
              accent && 'text-fg-accent',
            ),
      )}
    >
      <span
        className={cn(
          'flex size-8 items-center justify-center rounded-md transition-colors',
          accent && !active && 'bg-accent-muted/60',
          accent && active && 'bg-accent text-fg-on-accent',
        )}
      >
        {icon}
      </span>
      <span className="w-full truncate text-center leading-none">{label}</span>
    </ButtonPrimitives.Button>
  )
}
