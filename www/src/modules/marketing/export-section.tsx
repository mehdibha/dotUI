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
        <p className="text-base text-fg-muted">
          Everything you configure compiles to plain React and Tailwind —
          components, tokens and styles as files in your repo. No runtime, no
          dependency on dotUI, nothing to eject from later.
        </p>
      </div>

      <h3 className="mt-14 font-mono text-xs tracking-wide text-fg-muted md:mt-20">
        Available today
      </h3>
      <div className="relative mt-4 border-t">
        <EdgeTicks />
        {available.map((destination, index) => (
          <DestinationRow
            key={destination.name}
            destination={destination}
            first={index === 0}
          />
        ))}
      </div>

      <h3 className="mt-14 font-mono text-xs tracking-wide text-fg-muted md:mt-20">
        On the way
      </h3>
      <p className="mt-2 text-sm text-fg-muted">
        Same export, more destinations.
      </p>
      <div className="relative mt-4 border-t">
        <EdgeTicks />
        {planned.map((destination, index) => (
          <DestinationRow
            key={destination.name}
            destination={destination}
            first={index === 0}
            dim
          />
        ))}
      </div>
    </section>
  )
}

function DestinationRow({
  destination: { name, mark, description, hideName },
  first,
  dim,
}: {
  destination: Destination
  first: boolean
  dim?: boolean
}) {
  return (
    <div
      className={cn(
        'group relative grid gap-x-10 gap-y-3 py-6 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:py-7',
        !first && 'border-t',
      )}
    >
      <span
        aria-hidden
        className="absolute -top-px left-0 h-px w-full origin-left scale-x-0 bg-fg transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-x-100 motion-reduce:transition-none"
      />
      <div
        className={cn(
          'flex h-5 items-center gap-2.5 transition-[opacity,filter] duration-300 motion-reduce:transition-none',
          dim &&
            'opacity-55 grayscale group-hover:opacity-100 group-hover:grayscale-0',
        )}
      >
        {mark}
        <h4
          className={
            hideName ? 'sr-only' : 'text-base leading-none font-medium'
          }
        >
          {name}
        </h4>
      </div>
      {description && (
        <p className="text-sm text-fg-muted transition-colors duration-200 group-hover:text-fg motion-reduce:transition-none">
          {description}
        </p>
      )}
    </div>
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
  description?: string
  /** Set when the mark is a wordmark that already reads as the name. */
  hideName?: boolean
}

const available: Destination[] = [
  {
    name: 'shadcn CLI',
    mark: <ShadcnIcon className="size-4 shrink-0" />,
    description:
      'One command drops the components, tokens and styles into your codebase as ordinary files. Edit them like anything else you wrote.',
  },
  {
    name: 'v0',
    mark: <V0Icon className="h-4 w-auto shrink-0" />,
    description:
      'Open your system in v0 already themed, then prompt against your own components instead of generic ones.',
    hideName: true,
  },
]

const planned: Destination[] = [
  { name: 'Claude', mark: <ClaudeIcon className="size-4 shrink-0" /> },
  {
    name: 'Lovable',
    mark: <LovableIcon className="h-3.5 w-auto shrink-0" />,
    hideName: true,
  },
  {
    name: 'Bolt',
    mark: <BoltIcon className="h-3.5 w-auto shrink-0" />,
    hideName: true,
  },
]
