/* Color Lab — the benchmark bench for the engine rewrite. Self-contained on
   purpose: no registry components, no @dotui/colors, plain Tailwind palette.
   The page carries its own light/dark mode via data-mode so the comparison is
   independent of the site theme. */

import { useState, type ReactNode } from 'react'

import type { CvdType } from './color'
import { referenceSystems, type ScaleRole } from './data'
import { ContextSection } from './sections/context'
import { ContrastSection } from './sections/contrast'
import { CurvesSection } from './sections/curves'
import { LineupSection } from './sections/lineup'
import { RampsSection } from './sections/ramps'
import { ScorecardSection } from './sections/scorecard'

export type Mode = 'light' | 'dark'

const SECTIONS = [
  { id: 'lineup', title: 'The lineup' },
  { id: 'ramps', title: 'Side by side' },
  { id: 'curves', title: 'Anatomy' },
  { id: 'contrast', title: 'Contrast' },
  { id: 'context', title: 'In context' },
  { id: 'scorecard', title: 'Scorecard' },
] as const

const FAMILIES: { id: ScaleRole; label: string }[] = [
  { id: 'neutral', label: 'Neutral' },
  { id: 'accent', label: 'Accent' },
  { id: 'danger', label: 'Danger' },
  { id: 'success', label: 'Success' },
  { id: 'warning', label: 'Warning' },
]

const CVD_OPTIONS: { id: CvdType | 'none'; label: string }[] = [
  { id: 'none', label: 'Normal vision' },
  { id: 'deuteranopia', label: 'Deuteranopia' },
  { id: 'protanopia', label: 'Protanopia' },
  { id: 'tritanopia', label: 'Tritanopia' },
]

export function ColorLab() {
  const [mode, setMode] = useState<Mode>('light')
  const [cvdRaw, setCvd] = useState<CvdType | 'none'>('none')
  const [family, setFamily] = useState<ScaleRole>('neutral')
  const [squint, setSquint] = useState(false)
  const cvd = cvdRaw === 'none' ? null : cvdRaw

  return (
    // Outer node only carries data-mode: the dark variant matches descendants
    // of [data-mode], so visual classes must live one level below to follow
    // the lab's own toggle instead of the site theme.
    <div data-mode={mode}>
      <div className="min-h-screen bg-white font-sans text-neutral-900 antialiased transition-colors duration-300 dark:bg-neutral-950 dark:text-neutral-100">
        <header className="mx-auto max-w-6xl px-6 pt-16 pb-10">
          <p className="font-mono text-[11px] tracking-widest text-neutral-400 uppercase dark:text-neutral-500">
            internal / color-lab
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Color Lab
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
            The bench for the engine rewrite. Eight reference systems, extracted
            from their canonical sources, compared on the axes that make a scale
            good — with an empty seat waiting for the dotUI engine.
          </p>
        </header>

        <nav className="sticky top-0 z-40 border-y border-neutral-200 bg-white/85 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/85">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-6 py-2.5">
            <div className="flex items-center gap-1 text-xs">
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="rounded-md px-2 py-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-100"
                >
                  {s.title}
                </a>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-3">
              <Segmented
                value={family}
                onChange={setFamily}
                options={FAMILIES.map((f) => ({ id: f.id, label: f.label }))}
              />
              <select
                value={cvdRaw}
                onChange={(e) => setCvd(e.target.value as CvdType | 'none')}
                aria-label="Color vision simulation"
                className="h-7 rounded-md border border-neutral-200 bg-transparent px-1.5 text-xs text-neutral-600 dark:border-neutral-800 dark:text-neutral-300"
              >
                {CVD_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
              <Segmented
                value={mode}
                onChange={setMode}
                options={[
                  { id: 'light' as const, label: 'Light' },
                  { id: 'dark' as const, label: 'Dark' },
                ]}
              />
              <button
                type="button"
                onClick={() => setSquint((s) => !s)}
                title="The squint test: blur everything so only value structure survives."
                className={`h-7 rounded-md border px-2 text-xs ${
                  squint
                    ? 'border-neutral-900 bg-neutral-900 font-medium text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900'
                    : 'border-neutral-200 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400'
                }`}
              >
                Squint
              </button>
            </div>
          </div>
        </nav>

        <main
          style={squint ? { filter: 'blur(6px)' } : undefined}
          className="mx-auto max-w-6xl space-y-24 px-6 py-16 transition-[filter] duration-200"
        >
          {referenceSystems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-300 p-16 text-center text-sm text-neutral-400 dark:border-neutral-700">
              No reference data yet — the extraction workflow writes
              <code className="mx-1 font-mono text-xs">data/*.json</code>
              files this page picks up automatically.
            </div>
          ) : (
            <>
              <Section id="lineup" index={1} title="The lineup">
                <LineupSection mode={mode} cvd={cvd} />
              </Section>
              <Section
                id="ramps"
                index={2}
                title="Side by side"
                hint="Hover a step to line it up across systems. True-spacing mode positions every chip at its actual lightness — even spacing is craft, gaps are drift."
              >
                <RampsSection mode={mode} cvd={cvd} family={family} />
              </Section>
              <Section
                id="curves"
                index={3}
                title="Anatomy"
                hint="The three OKLCH components of every scale. A good scale is a smooth lightness ramp, a deliberate chroma arc, and a hue that barely moves."
              >
                <CurvesSection mode={mode} family={family} />
              </Section>
              <Section
                id="contrast"
                index={4}
                title="Contrast"
                hint="Does each system keep its own promises? Text roles against background roles, solids against their foregrounds — WCAG 2 and APCA."
              >
                <ContrastSection mode={mode} family={family} />
              </Section>
              <Section
                id="context"
                index={5}
                title="In context"
                hint="The same product UI rendered through every system's documented role mapping. Colors are judged where they'll live — on components."
              >
                <ContextSection mode={mode} cvd={cvd} />
              </Section>
              <Section
                id="scorecard"
                index={6}
                title="Scorecard"
                hint="Everything measurable, measured. When the engine plugs in, this table is the finish line."
              >
                <ScorecardSection mode={mode} />
              </Section>
            </>
          )}
        </main>

        <footer className="border-t border-neutral-200 py-10 text-center text-xs text-neutral-400 dark:border-neutral-800 dark:text-neutral-600">
          Values extracted verbatim from each system's published source — see
          the lineup cards for provenance.
        </footer>
      </div>
    </div>
  )
}

function Section({
  id,
  index,
  title,
  hint,
  children,
}: {
  id: string
  index: number
  title: string
  hint?: string
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="mb-6 flex items-baseline gap-3">
        <span className="font-mono text-xs text-neutral-300 tabular-nums dark:text-neutral-600">
          {String(index).padStart(2, '0')}
        </span>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      </div>
      {hint && (
        <p className="-mt-3 mb-6 max-w-2xl text-[13px] leading-relaxed text-neutral-400 dark:text-neutral-500">
          {hint}
        </p>
      )}
      {children}
    </section>
  )
}

function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T
  onChange: (value: T) => void
  options: { id: T; label: string }[]
}) {
  return (
    <div className="flex h-7 items-center rounded-md border border-neutral-200 p-0.5 dark:border-neutral-800">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`h-full rounded-[5px] px-2 text-xs transition-colors ${
            value === o.id
              ? 'bg-neutral-900 font-medium text-white dark:bg-neutral-100 dark:text-neutral-900'
              : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
