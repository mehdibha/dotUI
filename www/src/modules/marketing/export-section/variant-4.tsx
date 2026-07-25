import { useEffect, useRef, useState } from 'react'
import { ArrowRightIcon, CheckIcon, CopyIcon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import { LinkButton } from '@/registry/ui/button'
import { BoltIcon } from '@/components/icons/bolt'
import { ClaudeIcon } from '@/components/icons/claude'
import { LovableIcon } from '@/components/icons/lovable'
import { ShadcnIcon } from '@/components/icons/shadcn'
import { V0Icon } from '@/components/icons/v0'

const installCommand = 'npx shadcn@latest add @dotui/button'

export function ExportSectionVariant4() {
  const [copied, setCopied] = useState(false)
  const resetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (resetTimeout.current) clearTimeout(resetTimeout.current)
    },
    [],
  )

  const copyCommand = () => {
    navigator.clipboard
      .writeText(installCommand)
      .then(() => {
        setCopied(true)
        if (resetTimeout.current) clearTimeout(resetTimeout.current)
        resetTimeout.current = setTimeout(() => setCopied(false), 1800)
      })
      .catch(console.error)
  }

  return (
    <section className="mx-auto mt-24 w-full max-w-[calc(1500px+16rem)] px-4 sm:px-6 md:mt-32 lg:px-32">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <div className="flex max-w-xl flex-col items-start gap-4">
          <p className="font-mono text-sm tracking-wide text-fg-muted">
            Export
          </p>
          <h2 className="text-3xl font-semibold tracking-tighter text-balance sm:text-4xl">
            Design once.
            <br />
            <span className="text-fg-muted">Export everywhere.</span>
          </h2>
          <p className="text-base text-fg-muted">
            What you build in the editor leaves as code — plain{' '}
            <span className="font-mono text-[0.9em]">.tsx</span> components and
            CSS tokens that live in your repo. No dotUI package, nothing to keep
            in sync.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <LinkButton href="/create" variant="primary">
            Open the editor
          </LinkButton>
          <LinkButton href="/docs/installation" variant="default">
            Installation guide
          </LinkButton>
        </div>
      </div>

      <div className="mt-10 overflow-hidden rounded-xl border bg-card shadow-xs md:mt-14">
        <div className="flex flex-col gap-1.5 border-b px-5 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-6">
          <span className="text-sm">Your design system</span>
          <span aria-hidden className="hidden flex-1 items-center sm:flex">
            <span className="h-px flex-1 bg-border" />
            {/* Lucide arrows carry ~3px of inset at this size; pull the head onto the rule. */}
            <ArrowRightIcon className="-ml-0.5 size-3.5 text-fg-muted" />
          </span>
          <span className="font-mono text-xs text-fg-muted">
            components/ui/*.tsx · theme.css
          </span>
        </div>

        <div className="grid md:grid-cols-2">
          <div className="group/cell relative flex flex-col gap-4 p-5 transition-colors duration-200 ease-out hover:bg-muted/40 sm:p-6">
            <CellRule />
            <span className="flex h-5 items-center gap-2">
              <ShadcnIcon aria-hidden className="size-4" />
              <span className="text-sm font-medium">shadcn CLI</span>
              <StatusDot />
            </span>
            <p className="text-sm text-fg-muted">
              Install straight into your codebase. Every component lands as a
              file you can read, diff and rewrite.
            </p>
            <button
              type="button"
              onClick={copyCommand}
              aria-label={`Copy: ${installCommand}`}
              className="mt-auto flex h-9 w-full cursor-pointer items-center gap-2 rounded-md border bg-bg px-3 text-left font-mono text-xs focus-reset transition-[background-color,border-color,transform] duration-150 ease-out no-highlight hover:border-border-hover hover:bg-muted focus-visible:focus-ring active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100"
            >
              <span className="min-w-0 truncate">
                <span className="text-fg-muted">npx shadcn@latest add </span>
                <span>@dotui/button</span>
              </span>
              <span
                aria-hidden
                className="relative ml-auto size-3.5 shrink-0 text-fg-muted"
              >
                <CopyIcon
                  className={cn(
                    'absolute inset-0 size-3.5 transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none',
                    copied ? 'scale-90 opacity-0' : 'scale-100 opacity-100',
                  )}
                />
                <CheckIcon
                  className={cn(
                    'absolute inset-0 size-3.5 text-fg-success transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none',
                    copied ? 'scale-100 opacity-100' : 'scale-90 opacity-0',
                  )}
                />
              </span>
            </button>
            <span aria-live="polite" className="sr-only">
              {copied ? 'Command copied to clipboard' : ''}
            </span>
          </div>

          <div className="group/cell relative flex flex-col gap-4 border-t p-5 transition-colors duration-200 ease-out hover:bg-muted/40 sm:p-6 md:border-t-0 md:border-l">
            <CellRule />
            <span className="flex h-5 items-center">
              <V0Icon aria-hidden className="h-3 w-auto" />
              <span className="sr-only">v0</span>
              <StatusDot />
            </span>
            <p className="text-sm text-fg-muted">
              Opens a v0 project with every component and a demo screen, already
              themed to your system and ready to prompt.
            </p>
            <span className="mt-auto flex h-9 items-center font-mono text-xs text-fg-muted/70">
              v0.dev/chat/api/open
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t px-5 py-4 sm:px-6">
          <span className="font-mono text-xs tracking-wide text-fg-muted">
            On the way
          </span>
          {upcoming.map(({ name, mark, showName }) => (
            <span
              key={name}
              className="flex items-center gap-1.5 opacity-55 grayscale transition-[opacity,filter] duration-200 ease-out hover:opacity-100 hover:grayscale-0"
            >
              {mark}
              <span className={showName ? 'text-sm' : 'sr-only'}>{name}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// The card's one motion idiom: a hairline draws itself along whatever you attend to.
function CellRule() {
  return (
    <span
      aria-hidden
      className="absolute inset-x-0 -top-px h-px origin-left scale-x-0 bg-fg transition-transform duration-300 ease-out group-focus-within/cell:scale-x-100 group-hover/cell:scale-x-100 motion-reduce:transition-none"
    />
  )
}

function StatusDot() {
  return (
    <span className="ml-auto flex items-center gap-1.5 font-mono text-xs text-fg-muted">
      <span aria-hidden className="size-1.5 rounded-full bg-success" />
      Available now
    </span>
  )
}

const upcoming = [
  {
    name: 'Claude',
    mark: <ClaudeIcon aria-hidden className="size-3.5" />,
    showName: true,
  },
  {
    name: 'Lovable',
    mark: <LovableIcon aria-hidden className="h-3.5 w-auto" />,
    showName: false,
  },
  {
    name: 'Bolt',
    mark: <BoltIcon aria-hidden className="h-3.5 w-auto" />,
    showName: false,
  },
]
