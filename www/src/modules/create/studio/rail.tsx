'use client'

import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

import { useDesignSystem } from '../preset'
import { useStudio } from './context'
import { isWorkspaceDirty } from './divergence'
import { WORKSPACES } from './workspaces'

/** The vertical workspace switcher down the left edge of the panel. */
export function StudioRail() {
  const { workspace, goTo } = useStudio()
  const { designSystem } = useDesignSystem()
  return (
    <nav
      aria-label="Workspaces"
      className="scrollbar-none flex shrink-0 flex-col items-center gap-1 overflow-y-auto border-r p-2"
    >
      {WORKSPACES.map((ws) => {
        const active = ws.id === workspace
        const dirty = isWorkspaceDirty(designSystem, ws.id)
        return (
          <div key={ws.id} className="contents">
            {ws.groupStart && <span className="my-1 h-px w-5 bg-border" />}
            <Tooltip delay={300}>
              <ButtonPrimitives.Button
                onPress={() => goTo(ws.id)}
                aria-label={ws.label}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative flex size-9 items-center justify-center rounded-lg focus-reset transition-colors focus-visible:focus-ring',
                  active
                    ? 'text-primary-fg bg-primary'
                    : 'text-fg-muted hover:bg-neutral hover:text-fg',
                )}
              >
                <ws.icon className="size-[18px]" />
                {dirty && (
                  <span
                    className={cn(
                      'absolute top-1 right-1 size-1.5 rounded-full',
                      active ? 'bg-primary-fg' : 'bg-primary',
                    )}
                    aria-hidden
                  />
                )}
              </ButtonPrimitives.Button>
              <TooltipContent placement="right">
                {ws.label}
                {dirty ? ' · modified' : ''}
              </TooltipContent>
            </Tooltip>
          </div>
        )
      })}
    </nav>
  )
}
