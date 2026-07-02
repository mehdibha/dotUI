'use client'

import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

import { EXPERIMENTAL_IDS, STUDIO_SECTIONS } from './sections'
import { useStudio } from './store'

/* ----------------------------------------------------------------------------
 * The dock — a thin, always-present rail of domain icons. Clicking one opens its
 * inspector; clicking the active one closes it. This replaces the shipped
 * builder's fixed wall of controls: the canvas stays the hero, controls are one
 * tap away. Experimental axes are drawn below a divider with a brand-dot marker.
 * -------------------------------------------------------------------------- */

export function Dock() {
  const { activeDomain, toggleDomain } = useStudio()

  const core = STUDIO_SECTIONS.filter((s) => !EXPERIMENTAL_IDS.has(s.id))
  const extra = STUDIO_SECTIONS.filter((s) => EXPERIMENTAL_IDS.has(s.id))

  return (
    <nav
      aria-label="Design system domains"
      className="z-20 scrollbar-none flex w-14 shrink-0 flex-col items-center gap-1 overflow-y-auto border-r bg-card py-2.5"
    >
      {core.map((section) => (
        <DockButton
          key={section.id}
          id={section.id}
          label={section.label}
          Icon={section.icon}
          active={activeDomain === section.id}
          onPress={() => toggleDomain(section.id)}
        />
      ))}

      <div className="my-1.5 h-px w-6 bg-border" />

      {extra.map((section) => (
        <DockButton
          key={section.id}
          id={section.id}
          label={section.label}
          Icon={section.icon}
          active={activeDomain === section.id}
          experimental
          onPress={() => toggleDomain(section.id)}
        />
      ))}
    </nav>
  )
}

function DockButton({
  id,
  label,
  Icon,
  active,
  experimental,
  onPress,
}: {
  id: string
  label: string
  Icon: React.ComponentType<{ className?: string }>
  active: boolean
  experimental?: boolean
  onPress: () => void
}) {
  return (
    <Tooltip delay={250}>
      <ButtonPrimitives.Button
        data-domain={id}
        onPress={onPress}
        aria-pressed={active}
        className={cn(
          'relative flex size-10 items-center justify-center rounded-lg focus-reset transition-colors focus-visible:focus-ring',
          active
            ? 'bg-primary text-fg-on-primary'
            : 'text-fg-muted hover:bg-neutral hover:text-fg',
        )}
      >
        <Icon className="size-[18px]" />
        {experimental && !active && (
          <span
            aria-hidden
            className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary"
          />
        )}
      </ButtonPrimitives.Button>
      <TooltipContent placement="right">
        {label}
        {experimental && <span className="ml-1.5 text-fg-muted">· new</span>}
      </TooltipContent>
    </Tooltip>
  )
}
