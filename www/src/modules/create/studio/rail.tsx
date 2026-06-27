'use client'

import { Fragment } from 'react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

import { CHAPTERS } from './data'
import { useStudio } from './store'

/**
 * The spine of the studio — a thin icon rail of chapters. A stable map of the
 * whole design system that never scrolls away, replacing the old drill-down
 * navigation stack. Thin dividers separate the foundation / surface / parts
 * groups.
 */
export function Rail() {
  const { chapter, setChapter, setActiveComponent } = useStudio()

  return (
    <div className="flex shrink-0 flex-col items-center gap-1 border-r bg-card/40 p-2">
      {CHAPTERS.map((c, i) => {
        const prev = CHAPTERS[i - 1]
        const dividerBefore = prev && prev.group !== c.group
        const active = chapter === c.id
        return (
          <Fragment key={c.id}>
            {dividerBefore && <div className="my-1 h-px w-5 bg-border" />}
            <Tooltip delay={250}>
              <ButtonPrimitives.Button
                onPress={() => {
                  setChapter(c.id)
                  if (c.id !== 'components') setActiveComponent(null)
                }}
                aria-label={c.label}
                aria-pressed={active}
                className={cn(
                  'relative flex size-10 items-center justify-center rounded-lg focus-reset transition-colors focus-visible:focus-ring',
                  active
                    ? 'bg-neutral text-fg'
                    : 'text-fg-muted hover:bg-neutral/60 hover:text-fg',
                )}
              >
                {active && (
                  <span className="absolute top-1/2 -left-2 h-5 w-1 -translate-y-1/2 rounded-full bg-primary" />
                )}
                <c.icon className="size-[18px]" />
              </ButtonPrimitives.Button>
              <TooltipContent placement="right">
                <div className="flex flex-col">
                  <span className="font-medium">{c.label}</span>
                  <span className="text-xs text-fg-muted">{c.blurb}</span>
                </div>
              </TooltipContent>
            </Tooltip>
          </Fragment>
        )
      })}
    </div>
  )
}
