'use client'

import { motion } from 'motion/react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

import { type Axis, AXES } from './axes'
import { useStudio } from './store'

const GROUPS: Array<{ key: string; items: Axis[] }> = [
  { key: 'start', items: AXES.filter((a) => a.group === 'start') },
  { key: 'foundations', items: AXES.filter((a) => a.group === 'foundations') },
  { key: 'surface', items: AXES.filter((a) => a.group === 'surface') },
]

export function Navigator({ className }: { className?: string }) {
  const { axis, setAxis } = useStudio()

  return (
    <nav
      className={cn(
        'flex shrink-0 flex-col items-center gap-1 rounded-xl border bg-card p-2',
        className,
      )}
      aria-label="Design system axes"
    >
      {GROUPS.map((group, i) => (
        <div key={group.key} className="flex flex-col items-center gap-1">
          {i > 0 && <div className="my-1 h-px w-7 bg-border" />}
          {group.items.map((item) => {
            const active = axis === item.id
            return (
              <Tooltip key={item.id} delay={250}>
                <ButtonPrimitives.Button
                  onPress={() => setAxis(item.id)}
                  data-active={active || undefined}
                  className={cn(
                    'group/nav relative flex w-[60px] flex-col items-center gap-1 rounded-lg py-2 focus-reset transition-colors focus-visible:focus-ring',
                    active
                      ? 'text-primary'
                      : 'text-fg-muted hover:bg-neutral hover:text-fg',
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 40,
                      }}
                      className="absolute inset-0 -z-10 rounded-lg bg-primary/10 ring-1 ring-primary/25"
                    />
                  )}
                  <item.icon className="size-4.5" />
                  <span className="text-[10px] leading-none font-medium">
                    {item.label}
                  </span>
                </ButtonPrimitives.Button>
                <TooltipContent placement="right">
                  {item.tagline}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      ))}
    </nav>
  )
}
