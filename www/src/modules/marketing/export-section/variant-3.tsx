import { LinkButton } from '@/registry/ui/button'
import { BoltIcon } from '@/components/icons/bolt'
import { ClaudeIcon } from '@/components/icons/claude'
import { LovableIcon } from '@/components/icons/lovable'
import { ShadcnIcon } from '@/components/icons/shadcn'
import { V0Icon } from '@/components/icons/v0'

export function ExportSectionVariant3() {
  return (
    <section className="mx-auto mt-24 w-full max-w-[calc(1500px+16rem)] px-4 sm:px-6 md:mt-32 lg:px-32">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <div className="flex flex-col items-start gap-4">
          <h2 className="font-mono text-sm tracking-wide text-fg-muted">
            Export
          </h2>
          <p className="text-3xl font-semibold tracking-tighter text-balance sm:text-4xl">
            Design once.
            <br />
            <span className="text-fg-muted">Export everywhere.</span>
          </p>
          <p className="max-w-xl text-base text-fg-muted">
            Everything you configure compiles to plain React and Tailwind —
            components, tokens and styles as files in your repo. No runtime, no
            dependency on dotUI, nothing to eject from later.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <LinkButton href="/create" variant="primary">
            Open the editor
          </LinkButton>
          <LinkButton href="/docs/installation" variant="default">
            Installation docs
          </LinkButton>
        </div>
      </div>

      <h3 className="mt-14 font-mono text-xs tracking-wide text-fg-muted md:mt-20">
        Available today
      </h3>
      <div className="relative mt-4 grid border-t sm:grid-cols-2">
        <EdgeTicks />
        {available.map(({ name, mark, description, hideName, className }) => (
          <div
            key={name}
            className={`group relative py-8 sm:py-10 ${className}`}
          >
            <span
              aria-hidden
              className="absolute -top-px left-0 h-px w-full origin-left scale-x-0 bg-fg transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-x-100 motion-reduce:transition-none"
            />
            <div className="flex h-5 items-center gap-2.5">
              {mark}
              <h4
                className={
                  hideName ? 'sr-only' : 'text-base leading-none font-medium'
                }
              >
                {name}
              </h4>
            </div>
            <p className="mt-3.5 max-w-sm text-sm text-fg-muted transition-colors duration-200 group-hover:text-fg">
              {description}
            </p>
          </div>
        ))}
      </div>

      <h3 className="mt-14 font-mono text-xs tracking-wide text-fg-muted md:mt-20">
        On the way
      </h3>
      <div className="relative mt-4 flex flex-col gap-6 border-t pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
        <EdgeTicks />
        <p className="text-sm text-fg-muted">Same export, more destinations.</p>
        <ul className="flex flex-wrap items-center gap-x-10 gap-y-5">
          {planned.map(({ name, mark, hideName }) => (
            <li
              key={name}
              className="flex items-center gap-2 text-fg-muted opacity-55 grayscale transition-[opacity,filter,color] duration-300 hover:text-fg hover:opacity-100 hover:grayscale-0"
            >
              {mark}
              <span className={hideName ? 'sr-only' : 'text-sm'}>{name}</span>
            </li>
          ))}
        </ul>
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

const available = [
  {
    name: 'shadcn CLI',
    mark: <ShadcnIcon className="size-4" />,
    description:
      'One command drops the components, tokens and styles into your codebase as ordinary files. Edit them like anything else you wrote.',
    hideName: false,
    className: 'sm:pr-10 lg:pr-16',
  },
  {
    name: 'v0',
    mark: <V0Icon className="h-4 w-auto" />,
    description:
      'Open your system in v0 already themed, then prompt against your own components instead of generic ones.',
    hideName: true,
    className: 'border-t sm:border-t-0 sm:border-l sm:pl-10 lg:pl-16',
  },
]

const planned = [
  { name: 'Claude', mark: <ClaudeIcon className="size-4" />, hideName: false },
  {
    name: 'Lovable',
    mark: <LovableIcon className="h-3.5 w-auto" />,
    hideName: true,
  },
  { name: 'Bolt', mark: <BoltIcon className="h-3.5 w-auto" />, hideName: true },
]
