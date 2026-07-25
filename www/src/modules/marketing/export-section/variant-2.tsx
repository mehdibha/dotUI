import { cn } from '@/registry/lib/utils'
import { LinkButton } from '@/registry/ui/button'
import { BoltIcon } from '@/components/icons/bolt'
import { ClaudeIcon } from '@/components/icons/claude'
import { LovableIcon } from '@/components/icons/lovable'
import { ShadcnIcon } from '@/components/icons/shadcn'
import { V0Icon } from '@/components/icons/v0'

const rowStyles =
  'group/row relative flex items-start gap-3 px-5 py-4 transition-colors duration-200 hover:bg-muted/50 motion-reduce:transition-none sm:gap-4 sm:px-6'

const markStyles =
  'shrink-0 opacity-70 transition-opacity duration-200 group-hover/row:opacity-100 motion-reduce:transition-none'

function Trunk({ last }: { last?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        'absolute left-5 w-px bg-border sm:left-6',
        // The last segment stops at its branch: py-4 plus half the name line.
        last ? 'top-0 h-[1.625rem]' : 'inset-y-0',
      )}
    />
  )
}

function Branch({ dashed }: { dashed?: boolean }) {
  return (
    <span aria-hidden className="flex h-5 shrink-0 items-center">
      <span
        className={cn(
          'relative block w-5 border-t border-border sm:w-6',
          dashed && 'border-dashed',
        )}
      >
        <span
          className={cn(
            'absolute inset-x-0 -top-px origin-left scale-x-0 border-t transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/row:scale-x-100 motion-reduce:transition-none',
            dashed ? 'border-dashed border-fg-muted' : 'border-fg',
          )}
        />
      </span>
    </span>
  )
}

function Status({ available }: { available?: boolean }) {
  return (
    <span className="flex h-5 shrink-0 items-center gap-1.5 text-xs text-fg-muted">
      <span
        aria-hidden
        className={cn(
          'size-1.5 rounded-full',
          available ? 'bg-success' : 'border border-border',
        )}
      />
      {available ? 'Available' : 'Planned'}
    </span>
  )
}

export function ExportSectionVariant2() {
  return (
    <section className="mx-auto mt-24 w-full max-w-[calc(1500px+16rem)] px-4 sm:px-6 md:mt-32 lg:px-32">
      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16">
        <div className="flex flex-col items-start gap-4 lg:order-2">
          <h2 className="font-mono text-sm tracking-wide text-fg-muted">
            Export
          </h2>
          <p className="text-3xl font-semibold tracking-tighter text-balance sm:text-4xl">
            Design once.
            <br />
            <span className="text-fg-muted">Export everywhere.</span>
          </p>
          <p className="text-base text-fg-muted lg:max-w-md">
            You get the source — React components and CSS tokens, committed to
            your repo. No runtime dependency, nothing to upgrade around.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <LinkButton href="/create" variant="primary">
              Start building
            </LinkButton>
            <LinkButton href="/docs/installation" variant="default">
              Installation
            </LinkButton>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border bg-card shadow-xs lg:order-1">
          <div className="flex items-center gap-3 border-b px-5 py-4 sm:px-6">
            <span aria-hidden className="flex items-center gap-1">
              <span className="size-3 rounded-xs bg-primary" />
              <span className="size-3 rounded-xs bg-accent" />
              <span className="size-3 rounded-xs bg-success" />
              <span className="size-3 rounded-xs bg-muted" />
            </span>
            <span className="text-sm font-medium">Your design system</span>
            <span className="ml-auto font-mono text-xs text-fg-muted max-sm:hidden">
              React · Tailwind
            </span>
          </div>

          <ul>
            <li className={rowStyles}>
              <Trunk />
              <Branch />
              <div className="min-w-0 flex-1">
                <span className="flex h-5 items-center gap-1.5 text-sm font-medium">
                  <ShadcnIcon className={cn('size-4', markStyles)} />
                  shadcn CLI
                </span>
                <p className="mt-1 text-sm text-fg-muted">
                  Adds the source files straight to your project.
                </p>
              </div>
              <Status available />
            </li>

            <li className={rowStyles}>
              <Trunk />
              <Branch />
              <div className="min-w-0 flex-1">
                <span className="flex h-5 items-center text-sm font-medium">
                  <V0Icon className={cn('h-3 w-auto', markStyles)} />
                  <span className="sr-only">v0</span>
                </span>
                <p className="mt-1 text-sm text-fg-muted">
                  Opens fully themed, ready to prompt.
                </p>
              </div>
              <Status available />
            </li>

            <li className={rowStyles}>
              <Trunk last />
              <Branch dashed />
              <ul className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-5">
                <li className="flex h-5 items-center gap-1.5 text-sm font-medium opacity-60 transition-opacity duration-200 hover:opacity-100 motion-reduce:transition-none">
                  <ClaudeIcon className="size-4 shrink-0" />
                  Claude
                </li>
                <li className="flex h-5 items-center opacity-60 transition-opacity duration-200 hover:opacity-100 motion-reduce:transition-none">
                  <LovableIcon className="h-3 w-auto shrink-0 sm:h-3.5" />
                  <span className="sr-only">Lovable</span>
                </li>
                <li className="flex h-5 items-center opacity-60 transition-opacity duration-200 hover:opacity-100 motion-reduce:transition-none">
                  <BoltIcon className="h-3 w-auto shrink-0 sm:h-3.5" />
                  <span className="sr-only">Bolt</span>
                </li>
              </ul>
              <Status />
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
