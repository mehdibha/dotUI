import type { ReactNode } from 'react'

import { cn } from '@/registry/lib/utils'
import { BoltIcon } from '@/components/icons/bolt'
import { ClaudeIcon } from '@/components/icons/claude'
import { LovableIcon } from '@/components/icons/lovable'
import { ShadcnIcon } from '@/components/icons/shadcn'
import { V0Icon } from '@/components/icons/v0'

export function ExportSection() {
  return (
    <section className="mx-auto mt-24 w-full max-w-[calc(1500px+16rem)] px-4 sm:px-6 md:mt-32 lg:px-32">
      <div className="flex flex-col items-start gap-4">
        <h2 className="font-mono text-sm tracking-wide text-fg-muted">
          Export
        </h2>
        <p className="text-3xl font-semibold tracking-tighter text-balance sm:text-4xl">
          Design once.
          <br />
          <span className="text-fg-muted">Export everywhere.</span>
        </p>
        <p className="max-w-xl text-base text-balance text-fg-muted">
          Everything you configure compiles to plain React and Tailwind —
          components, tokens and styles as files in your repo. No runtime, no
          dependency on dotUI, nothing to eject from later.
        </p>
      </div>

      <div className="relative mt-14 border-t md:mt-20 lg:grid lg:grid-cols-5">
        <EdgeTicks />
        {destinations.map(({ name, mark, detail, hideName, live }, index) => (
          <div
            key={name}
            className={cn(
              'group relative py-6 lg:px-7 lg:py-8',
              index > 0 && 'border-t lg:border-t-0 lg:border-l',
              index === 0 && 'lg:pl-0',
              index === destinations.length - 1 && 'lg:pr-0',
            )}
          >
            <span
              aria-hidden
              className="absolute -top-px left-0 h-px w-full origin-left scale-x-0 bg-fg transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-x-100 motion-reduce:transition-none"
            />
            <div
              className={cn(
                'flex h-5 items-center gap-2.5 transition-[opacity,filter] duration-300 motion-reduce:transition-none',
                !live &&
                  'opacity-55 grayscale group-hover:opacity-100 group-hover:grayscale-0',
              )}
            >
              {mark}
              <h3
                className={
                  hideName ? 'sr-only' : 'text-base leading-none font-medium'
                }
              >
                {name}
              </h3>
            </div>
            <p className="mt-3.5 text-sm text-fg-muted transition-colors duration-200 group-hover:text-fg motion-reduce:transition-none">
              {detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

// The rules read as a measured span rather than a plain divider.
function EdgeTicks() {
  return (
    <>
      <span
        aria-hidden
        className="absolute top-0 left-0 h-1.5 w-px bg-border"
      />
      <span
        aria-hidden
        className="absolute top-0 right-0 h-1.5 w-px bg-border"
      />
    </>
  )
}

interface Destination {
  name: string
  mark: ReactNode
  detail: string
  /** Set when the mark is a wordmark that already reads as the name. */
  hideName?: boolean
  live?: boolean
}

const destinations: Destination[] = [
  {
    name: 'shadcn CLI',
    mark: <ShadcnIcon className="size-4 shrink-0" />,
    detail: 'Installs into your codebase as ordinary files.',
    live: true,
  },
  {
    name: 'v0',
    mark: <V0Icon className="h-4 w-auto shrink-0" />,
    detail: 'Opens fully themed, ready to prompt.',
    hideName: true,
    live: true,
  },
  {
    name: 'Claude',
    mark: <ClaudeIcon className="size-4 shrink-0" />,
    detail: 'Coming soon.',
  },
  {
    name: 'Lovable',
    mark: <LovableIcon className="h-3.5 w-auto shrink-0" />,
    detail: 'Coming soon.',
    hideName: true,
  },
  {
    name: 'Bolt',
    mark: <BoltIcon className="h-3.5 w-auto shrink-0" />,
    detail: 'Coming soon.',
    hideName: true,
  },
]
