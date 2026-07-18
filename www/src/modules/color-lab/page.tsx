/* Color Lab — the benchmark bench for the color engine. The dotUI seat is
   live: createTheme() output flows through the exact same views as the
   reference systems (engine.ts adapts jobs → roles 1:1). The measurement
   machinery (color math, metrics) stays engine-independent so the meters
   can't inherit the engine's assumptions. Registry theme ramps flip on the
   html `.dark` class, so the lab's mode toggle drives that class directly
   while mounted (this route is standalone) and restores it on unmount. */

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Key } from 'react-aria-components'

import { Button } from '@/registry/ui/button'
import { ColorArea } from '@/registry/ui/color-area'
import { ColorPicker } from '@/registry/ui/color-picker'
import { ColorSlider } from '@/registry/ui/color-slider'
import { ColorSwatch } from '@/registry/ui/color-swatch'
import { DialogContent } from '@/registry/ui/dialog'
import { Popover } from '@/registry/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/registry/ui/select'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'

import type { CvdType } from './color'
import { ENGINE_SLOT, referenceSystems, type ScaleRole } from './data'
import { buildEngineSystem, DEFAULT_SEED, type EngineResult } from './engine'
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
  const [seed, setSeed] = useState(DEFAULT_SEED)
  const cvd = cvdRaw === 'none' ? null : cvdRaw

  // The engine seat: live createTheme() output when the seed is valid,
  // the empty placeholder when it isn't.
  const engine = useMemo<EngineResult | null>(() => {
    try {
      return buildEngineSystem(seed)
    } catch {
      return null
    }
  }, [seed])
  const systems = useMemo(
    () => [engine?.system ?? ENGINE_SLOT, ...referenceSystems],
    [engine],
  )

  // Registry ramps and dark: utilities both key off html.dark — sync it to the
  // lab's mode while mounted, restore whatever the site had on the way out.
  useEffect(() => {
    const root = document.documentElement
    const had = root.classList.contains('dark')
    return () => {
      root.classList.toggle('dark', had)
    }
  }, [])
  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark')
  }, [mode])

  return (
    <div>
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
            good — with the dotUI engine generating live from the seed and
            judged by the exact same views.
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
              <ColorPicker
                value={seed}
                onChange={(color) => setSeed(color.toString('hex'))}
              >
                <Button size="sm" aria-label="Engine seed color">
                  <ColorSwatch className="size-4 rounded-full" />
                  <span className="font-mono text-[11px]">{seed}</span>
                </Button>
                <Popover>
                  <DialogContent className="space-y-2">
                    <ColorArea
                      aria-label="Seed color"
                      colorSpace="hsb"
                      xChannel="saturation"
                      yChannel="brightness"
                      className="w-full"
                    />
                    <ColorSlider colorSpace="hsb" channel="hue" />
                  </DialogContent>
                </Popover>
              </ColorPicker>
              <ToggleButtonGroup
                aria-label="Scale family"
                size="sm"
                selectionMode="single"
                disallowEmptySelection
                selectedKeys={[family]}
                onSelectionChange={(keys) => {
                  const key = [...keys][0]
                  if (key) setFamily(key as ScaleRole)
                }}
              >
                {FAMILIES.map((f) => (
                  <ToggleButton key={f.id} id={f.id}>
                    {f.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              <Select
                aria-label="Color vision simulation"
                value={cvdRaw}
                onChange={(key: Key | null) => {
                  if (key) setCvd(key as CvdType | 'none')
                }}
              >
                <SelectTrigger size="sm" className="w-36" />
                <SelectContent>
                  {CVD_OPTIONS.map((o) => (
                    <SelectItem key={o.id} id={o.id}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ToggleButtonGroup
                aria-label="Palette mode"
                size="sm"
                selectionMode="single"
                disallowEmptySelection
                selectedKeys={[mode]}
                onSelectionChange={(keys) => {
                  const key = [...keys][0]
                  if (key) setMode(key as Mode)
                }}
              >
                <ToggleButton id="light">Light</ToggleButton>
                <ToggleButton id="dark">Dark</ToggleButton>
              </ToggleButtonGroup>
              <ToggleButton
                size="sm"
                isSelected={squint}
                onChange={setSquint}
                aria-label="Squint test"
              >
                Squint
              </ToggleButton>
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
                <LineupSection
                  systems={systems}
                  engineReport={engine?.report ?? null}
                  mode={mode}
                  cvd={cvd}
                />
              </Section>
              <Section
                id="ramps"
                index={2}
                title="Side by side"
                hint="Hover a step to line it up across systems. True-spacing mode positions every chip at its actual lightness — even spacing is craft, gaps are drift."
              >
                <RampsSection
                  systems={systems}
                  mode={mode}
                  cvd={cvd}
                  family={family}
                />
              </Section>
              <Section
                id="curves"
                index={3}
                title="Anatomy"
                hint="The three OKLCH components of every scale. A good scale is a smooth lightness ramp, a deliberate chroma arc, and a hue that barely moves."
              >
                <CurvesSection systems={systems} mode={mode} family={family} />
              </Section>
              <Section
                id="contrast"
                index={4}
                title="Contrast"
                hint="Does each system keep its own promises? Text roles against background roles, solids against their foregrounds — WCAG 2 and APCA."
              >
                <ContrastSection
                  systems={systems}
                  mode={mode}
                  family={family}
                />
              </Section>
              <Section
                id="context"
                index={5}
                title="In context"
                hint="The same product UI rendered through every system's documented role mapping. Colors are judged where they'll live — on components."
              >
                <ContextSection systems={systems} mode={mode} cvd={cvd} />
              </Section>
              <Section
                id="scorecard"
                index={6}
                title="Scorecard"
                hint="Everything measurable, measured. When the engine plugs in, this table is the finish line."
              >
                <ScorecardSection systems={systems} mode={mode} />
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
