import type { ReactNode } from 'react'

import { LinkButton } from '@/registry/ui/button'
import { BoltIcon } from '@/components/icons/bolt'
import { ClaudeIcon } from '@/components/icons/claude'
import { LovableIcon } from '@/components/icons/lovable'
import { ShadcnIcon } from '@/components/icons/shadcn'
import { V0Icon } from '@/components/icons/v0'

interface ExportTarget {
  name: string
  /** Brand mark, tinted by `currentColor`; sized per-mark. */
  mark: ReactNode
  /** Shown next to the mark when the mark is a glyph, not a wordmark. */
  showName?: boolean
  live?: boolean
}

const TARGETS: ExportTarget[] = [
  {
    name: 'shadcn CLI',
    mark: <ShadcnIcon className="size-4" />,
    showName: true,
    live: true,
  },
  { name: 'v0', mark: <V0Icon className="h-3 w-auto" />, live: true },
  {
    name: 'Claude',
    mark: <ClaudeIcon className="size-4" />,
    showName: true,
  },
  { name: 'Lovable', mark: <LovableIcon className="h-3.5 w-auto" /> },
  { name: 'Bolt', mark: <BoltIcon className="h-3.5 w-auto" /> },
]

// Beam geometry: the target list is 5 rows of h-11 (2.75rem) with gap-3, so
// its height is fixed at 268px and each row's center is known. The SVG spans
// the gap column at exactly that height with `preserveAspectRatio="none"`, so
// only the x-axis stretches; `non-scaling-stroke` keeps lines hairline.
const LIST_HEIGHT = 5 * 44 + 4 * 12
const rowCenter = (i: number) => i * (44 + 12) + 22
const beamPath = (i: number) =>
  `M 0 ${LIST_HEIGHT / 2} C 50 ${LIST_HEIGHT / 2} 50 ${rowCenter(i)} 100 ${rowCenter(i)}`

export function ExportSection() {
  return (
    // Width mirrors the composition section: 1500px grid + 8rem rail gutters.
    <section className="mx-auto mt-24 w-full max-w-[calc(1500px+16rem)] px-4 sm:px-6 md:mt-32 lg:px-32">
      <style>{`
        @keyframes export-beam {
          from { stroke-dashoffset: 100; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
      {/* Visual left, copy right on lg — mirrored from the composition section. */}
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        {/* Copy */}
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
            Your design system ships as code you own. Install it in your
            codebase with the shadcn CLI, or open it in v0 fully themed and
            ready to prompt — with Claude, Lovable, and Bolt on the way.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <LinkButton href="/create" variant="primary">
              Start building
            </LinkButton>
            <LinkButton href="/docs/installation" variant="default">
              Installation guide
            </LinkButton>
          </div>
        </div>

        {/* One system flowing out to every destination. */}
        <div className="relative overflow-hidden rounded-xl border bg-card p-6 shadow-xs sm:p-10 lg:order-1">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_50%,black,transparent)] bg-[size:14px_14px]"
          />
          <div className="relative mx-auto grid w-full max-w-xl grid-cols-[auto_minmax(2rem,1fr)_minmax(9.5rem,15rem)] items-center">
            {/* Source node */}
            <div className="relative">
              <div className="flex size-14 items-center justify-center rounded-2xl border bg-bg shadow-xs">
                {/* dotUI mark (mirrors components/layout/logo.tsx). */}
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 100"
                  className="size-6"
                >
                  <rect
                    width="100"
                    height="100"
                    rx="12"
                    ry="12"
                    className="fill-[#381e1e] dark:fill-white"
                  />
                  <circle
                    cx="75"
                    cy="75"
                    r="11"
                    className="fill-white dark:fill-[#381e1e]"
                  />
                </svg>
              </div>
              <span className="absolute top-full left-1/2 mt-2 -translate-x-1/2 font-mono text-[0.625rem] tracking-wide whitespace-nowrap text-fg-muted uppercase">
                Your system
              </span>
            </div>

            {/* Beams */}
            <svg
              aria-hidden="true"
              viewBox={`0 0 100 ${LIST_HEIGHT}`}
              preserveAspectRatio="none"
              className="w-full"
              style={{ height: LIST_HEIGHT }}
            >
              {TARGETS.map((target, i) => (
                <g key={target.name}>
                  <path
                    d={beamPath(i)}
                    fill="none"
                    strokeWidth={1}
                    vectorEffect="non-scaling-stroke"
                    className="stroke-border"
                  />
                  <path
                    d={beamPath(i)}
                    fill="none"
                    pathLength={100}
                    strokeWidth={1.25}
                    strokeLinecap="round"
                    strokeDasharray="10 90"
                    vectorEffect="non-scaling-stroke"
                    className="stroke-fg/60 motion-reduce:hidden"
                    style={{
                      animation: 'export-beam 3s linear infinite',
                      animationDelay: `${i * -0.6}s`,
                    }}
                  />
                </g>
              ))}
            </svg>

            {/* Destinations */}
            <ul className="flex flex-col gap-3">
              {TARGETS.map((target) => (
                <li
                  key={target.name}
                  className="flex h-11 items-center gap-2.5 rounded-lg border bg-bg px-3.5 shadow-xs"
                >
                  {target.mark}
                  {target.showName ? (
                    <span className="truncate text-sm font-medium">
                      {target.name}
                    </span>
                  ) : (
                    <span className="sr-only">{target.name}</span>
                  )}
                  {target.live ? (
                    <>
                      <span
                        aria-hidden
                        className="ml-auto size-1.5 rounded-full bg-success"
                      />
                      <span className="sr-only">Available now</span>
                    </>
                  ) : (
                    <span className="ml-auto rounded-full border px-1.5 py-px font-mono text-[0.625rem] tracking-wide text-fg-muted uppercase">
                      Soon
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
