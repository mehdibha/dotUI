import type { ReactNode } from 'react'

import { cn } from '@/registry/lib/utils'
import { LinkButton } from '@/registry/ui/button'
import { BoltIcon } from '@/components/icons/bolt'
import { ClaudeIcon } from '@/components/icons/claude'
import { LovableIcon } from '@/components/icons/lovable'
import { ShadcnIcon } from '@/components/icons/shadcn'
import { V0Icon } from '@/components/icons/v0'

export function ExportSectionVariant1() {
  return (
    <section className="mx-auto mt-24 w-full max-w-[calc(1500px+16rem)] px-4 sm:px-6 md:mt-32 lg:px-32">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="order-2 w-full lg:order-1 lg:max-w-2xl">
          <div className="rounded-xl border bg-card p-4 shadow-xs sm:p-6">
            <div className="relative flex h-8 items-center gap-4">
              <span
                aria-hidden
                className="absolute top-1/2 bottom-0 left-2 w-px bg-border"
              />
              <span aria-hidden className="flex w-4 shrink-0 justify-center">
                <span className="size-1.5 rounded-full bg-fg" />
              </span>
              <span className="text-sm font-medium">Your design system</span>
              <span className="ml-auto font-mono text-xs text-fg-muted max-sm:hidden">
                dotui.org/create
              </span>
            </div>

            <ul className="relative ml-2">
              {destinations.map((destination, index) => (
                <li key={destination.name} className="group relative pl-6">
                  <span
                    aria-hidden
                    className={cn(
                      'absolute top-0 left-0 h-1/2 w-4 rounded-bl-md border-b border-l transition-colors duration-150 ease-out motion-reduce:transition-none',
                      destination.live
                        ? 'group-hover:border-border-hover'
                        : 'border-dashed',
                    )}
                  />
                  {index < destinations.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute inset-y-0 left-0 w-px bg-border"
                    />
                  )}
                  {destination.live && (
                    // -1px: sits on the elbow's bottom border, not below it.
                    <span
                      aria-hidden
                      className="absolute top-[calc(50%-1px)] left-4 h-px w-2 origin-left scale-x-0 bg-border-hover transition-transform duration-200 ease-fluid-out group-hover:scale-x-100 motion-reduce:transition-none"
                    />
                  )}

                  <div className="flex h-11 items-center gap-2.5">
                    <span
                      className={cn(
                        'flex items-center gap-2.5 transition-opacity duration-150 ease-out motion-reduce:transition-none',
                        !destination.live &&
                          'text-fg-muted opacity-60 group-hover:opacity-100',
                      )}
                    >
                      {destination.mark}
                      {destination.label ? (
                        <span
                          className={cn(
                            'text-sm',
                            destination.live && 'font-medium',
                          )}
                        >
                          {destination.label}
                        </span>
                      ) : (
                        <span className="sr-only">{destination.name}</span>
                      )}
                    </span>

                    <span className="ml-auto flex items-center gap-2.5">
                      {destination.live ? (
                        <>
                          <span className="hidden text-xs text-fg-muted transition-colors duration-150 ease-out group-hover:text-fg motion-reduce:transition-none sm:inline">
                            {destination.detail}
                          </span>
                          <span className="sr-only">Available now</span>
                          <span
                            aria-hidden
                            className="size-1.5 shrink-0 rounded-full bg-success"
                          />
                        </>
                      ) : (
                        <>
                          <span className="text-xs text-fg-muted">Planned</span>
                          <span
                            aria-hidden
                            className="size-1.5 shrink-0 rounded-full border"
                          />
                        </>
                      )}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="order-1 flex flex-col items-start gap-4 lg:order-2 lg:max-w-lg">
          <p className="font-mono text-sm tracking-wide text-fg-muted">
            Export
          </p>
          <h2 className="text-3xl font-semibold tracking-tighter text-balance sm:text-4xl">
            Design once.
            <br />
            <span className="text-fg-muted">Export everywhere.</span>
          </h2>
          <p className="text-base text-fg-muted">
            Everything you configure compiles to plain React and CSS variables —
            files that land in your repo and stay yours. Install them with the
            shadcn CLI, or open the whole system in v0, themed and ready to
            prompt.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <LinkButton href="/create" variant="primary">
              Open the editor
            </LinkButton>
            <LinkButton href="/docs/installation" variant="default">
              Installation docs
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  )
}

const destinations: {
  name: string
  mark: ReactNode
  /** Omitted when the mark is a wordmark that already reads as the name. */
  label?: string
  detail?: string
  live?: boolean
}[] = [
  {
    name: 'shadcn CLI',
    mark: <ShadcnIcon className="size-4 shrink-0" />,
    label: 'shadcn CLI',
    detail: 'Installs into your codebase',
    live: true,
  },
  {
    name: 'v0',
    // h-3, not h-3.5: V0Icon's viewBox is cropped to the glyph, so it renders
    // optically larger than the padded wordmarks beside it.
    mark: <V0Icon className="h-3 w-auto shrink-0" />,
    detail: 'Opens themed, ready to prompt',
    live: true,
  },
  {
    name: 'Claude',
    mark: <ClaudeIcon className="size-4 shrink-0" />,
    label: 'Claude',
  },
  { name: 'Lovable', mark: <LovableIcon className="h-3.5 w-auto shrink-0" /> },
  { name: 'Bolt', mark: <BoltIcon className="h-3.5 w-auto shrink-0" /> },
]
