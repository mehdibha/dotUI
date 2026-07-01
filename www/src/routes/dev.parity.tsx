/**
 * Dev-only visual parity check for the Tailwind ↔ StyleX backends (`/dev/parity`).
 *
 * Renders, for each Button variant × state, two raw buttons side by side in the
 * same theme: LEFT carries the real Tailwind classes the component ships; RIGHT
 * carries a class whose CSS is generated from the StyleX translation of those
 * SAME classes. Because both resolve to the same declarations, they should be
 * pixel-identical — eyeball them, or diff `getComputedStyle` (see the panel).
 * Not linked anywhere; dev aid for verifying the translator.
 */

import { createFileRoute, notFound } from '@tanstack/react-router'

import { buildButtonMatrix } from '@/dev/parity/harness'

export const Route = createFileRoute('/dev/parity')({
  // Dev-only scaffolding — 404 in production builds.
  beforeLoad: () => {
    if (!import.meta.env.DEV) throw notFound()
  },
  component: ParityPage,
})

const VARIANTS = ['default', 'primary', 'quiet', 'link', 'warning', 'danger']

// Forced RAC render-states (no real interaction needed). `hover` also depends on
// `@media (hover: hover)`, so it only matches on a hover-capable device.
const STATES: { label: string; attrs: Record<string, string> }[] = [
  { label: 'idle', attrs: {} },
  { label: 'hover', attrs: { 'data-hovered': '' } },
  { label: 'pressed', attrs: { 'data-pressed': '' } },
  { label: 'disabled', attrs: { 'data-disabled': '' } },
  { label: 'focus-visible', attrs: { 'data-focus-visible': '' } },
]

function ParityPage() {
  const { cells, css } = buildButtonMatrix(VARIANTS)

  return (
    <div className="min-h-screen bg-bg p-8 font-sans text-fg">
      <style>{css}</style>
      <h1 className="text-lg font-semibold">Tailwind ↔ StyleX parity</h1>
      <p className="mb-6 text-sm text-fg-muted">
        Left = Tailwind classes · Right = StyleX-derived CSS · same source, same
        theme. They should be identical.
      </p>

      <div className="flex flex-col gap-8">
        {STATES.map((state) => (
          <section key={state.label}>
            <h2 className="mb-2 font-mono text-xs text-fg-muted uppercase">
              {state.label}
            </h2>
            <div className="flex flex-col gap-2">
              {cells.map((cell) => (
                <div key={cell.variant} className="flex items-center gap-3">
                  <span className="w-16 shrink-0 font-mono text-xs text-fg-muted">
                    {cell.variant}
                  </span>
                  <button
                    data-button=""
                    data-rac=""
                    {...state.attrs}
                    data-parity="tw"
                    data-cell={`${state.label}-${cell.variant}`}
                    className={cell.tw}
                  >
                    Button
                  </button>
                  <button
                    data-button=""
                    data-rac=""
                    {...state.attrs}
                    data-parity="sx"
                    data-cell={`${state.label}-${cell.variant}`}
                    className={`${cell.sxClass} ${cell.passthrough}`}
                  >
                    Button
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
