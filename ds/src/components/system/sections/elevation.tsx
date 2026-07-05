'use client'

import { useState } from 'react'

import type { CatalogEntry, SystemWithColors } from '@/data/schema'

import {
  Block,
  Choice,
  CodeBlock,
  Frame,
  Note,
  Playground,
  Section,
  SpecList,
} from '../primitives'

type Mode = 'light' | 'dark'
type Level = 'emphasized' | 'emphasized-hover' | 'elevated' | 'dragged'

const LEVELS: { value: Level; label: string }[] = [
  { value: 'emphasized', label: 'Emphasized' },
  { value: 'emphasized-hover', label: 'Emphasized hover' },
  { value: 'elevated', label: 'Elevated' },
  { value: 'dragged', label: 'Dragged' },
]

const SHADOW: Record<Mode, Record<Level, string>> = {
  light: {
    emphasized:
      '0px 2px 8px 0px rgba(0,0,0,0.08), 0px 1px 4px 0px rgba(0,0,0,0.04), 0px 0px 1px 0px rgba(0,0,0,0.08)',
    'emphasized-hover':
      '0px 4px 12px 0px rgba(0,0,0,0.08), 0px 2px 6px 0px rgba(0,0,0,0.04), 0px 0px 2px 0px rgba(0,0,0,0.12)',
    elevated:
      '0px 4px 12px 0px rgba(0,0,0,0.08), 0px 2px 6px 0px rgba(0,0,0,0.04), 0px 0px 2px 0px rgba(0,0,0,0.12)',
    dragged:
      '0px 12px 16px 0px rgba(0,0,0,0.08), 0px 6px 8px 0px rgba(0,0,0,0.04), 0px 0px 6px 0px rgba(0,0,0,0.16)',
  },
  dark: {
    emphasized:
      '0px 2px 8px 0px rgba(0,0,0,0.24), 0px 1px 4px 0px rgba(0,0,0,0.12), 0px 0px 1px 0px rgba(0,0,0,0.24)',
    'emphasized-hover':
      '0px 4px 12px 0px rgba(0,0,0,0.24), 0px 2px 6px 0px rgba(0,0,0,0.12), 0px 0px 2px 0px rgba(0,0,0,0.36)',
    elevated:
      '0px 4px 12px 0px rgba(0,0,0,0.24), 0px 2px 6px 0px rgba(0,0,0,0.12), 0px 0px 2px 0px rgba(0,0,0,0.36)',
    dragged:
      '0px 12px 16px 0px rgba(0,0,0,0.24), 0px 6px 8px 0px rgba(0,0,0,0.12), 0px 0px 6px 0px rgba(0,0,0,0.48)',
  },
}

const LEVEL_NOTE: Record<Level, string> = {
  emphasized: 'Resting cards — the default surface elevation.',
  'emphasized-hover': 'Card on hover/focus — one notch up from resting.',
  elevated: 'Popovers, menus, dropdowns — same geometry as emphasized-hover.',
  dragged: 'Highest level — an item being dragged, or a picked-up card.',
}

function shadowCss(mode: Mode, level: Level) {
  return `box-shadow: ${SHADOW[mode][level]};`
}

const MODE_OPTIONS = [
  { value: 'light' as const, label: 'Light' },
  { value: 'dark' as const, label: 'Dark' },
]

const STACK = [
  { label: 'base', desc: 'page background / app shell' },
  { label: 'content', desc: 'resting cards — emphasized' },
  { label: 'overlay / popover', desc: 'menus, tooltips, popovers — elevated' },
  { label: 'modal', desc: 'dialog + scrim beneath it' },
  { label: 'toast', desc: 'transient notifications — topmost' },
]

export function ElevationSection(_props: {
  system: SystemWithColors
  catalogEntry?: CatalogEntry
}) {
  const [galleryMode, setGalleryMode] = useState<Mode>('light')
  const [level, setLevel] = useState<Level>('elevated')
  const [pickerMode, setPickerMode] = useState<Mode>('light')

  return (
    <Section
      title="Elevation & Layering"
      kicker="Foundations"
      intro="Spectrum has no z-index scale. Elevation is four named composite shadows — each a 3-layer stack of pure-black-at-alpha (ambient, transition, key) — and layering is handled by mount order, not by a numeric token."
    >
      <Block
        title="The four levels"
        description="Every level stacks the same three shadow layers at different offsets and blurs. Dark mode reuses the exact geometry and roughly triples every alpha."
        aside={
          <Choice
            label="Mode"
            options={MODE_OPTIONS}
            value={galleryMode}
            onChange={setGalleryMode}
          />
        }
      >
        <Playground
          label="Elevation gallery"
          hint={galleryMode}
          surface="grid"
          center={false}
          footer="Cards sit directly on the frame background so each composite shadow reads at full strength."
        >
          <Frame mode={galleryMode}>
            <div className="grid grid-cols-2 gap-8 bg-bg p-6 sm:grid-cols-4">
              {LEVELS.map((l) => (
                <div key={l.value} className="flex flex-col items-center gap-3">
                  <div
                    className="flex h-20 w-full items-center justify-center rounded-lg bg-card text-xs text-fg-muted"
                    style={{ boxShadow: SHADOW[galleryMode][l.value] }}
                  >
                    {l.label}
                  </div>
                  <span className="font-mono text-[11px] text-fg-muted">
                    {l.value}
                  </span>
                </div>
              ))}
            </div>
          </Frame>
        </Playground>
      </Block>

      <Block
        title="Inspect a level"
        description="Pick a level and mode to see the lifted card and its exact CSS. Elevated shares emphasized-hover's geometry — both sit one notch above resting."
        aside={
          <Choice
            label="Mode"
            options={MODE_OPTIONS}
            value={pickerMode}
            onChange={setPickerMode}
          />
        }
      >
        <Playground
          label="box-shadow"
          controls={
            <Choice options={LEVELS} value={level} onChange={setLevel} />
          }
          surface="grid"
          footer={LEVEL_NOTE[level]}
        >
          <Frame mode={pickerMode}>
            <div className="bg-bg p-10">
              <div
                className="flex h-24 w-56 items-center justify-center rounded-xl bg-card text-sm font-medium text-fg"
                style={{ boxShadow: SHADOW[pickerMode][level] }}
              >
                {level}
              </div>
            </div>
          </Frame>
        </Playground>
        <CodeBlock code={shadowCss(pickerMode, level)} className="mt-4" />
      </Block>

      <Block
        title="Opacity tokens"
        description="Elevation isn't only shadows — a handful of flat opacity tokens cover disabled content, modal scrims, and interactive state layers."
      >
        <SpecList
          rows={[
            {
              label: 'opacity-disabled',
              value: '0.3',
              note: 'Applied to disabled content overall.',
            },
            {
              label: 'overlay scrim (light)',
              value: '0.4',
              note: 'Black scrim behind a modal in light mode.',
            },
            {
              label: 'overlay scrim (dark)',
              value: '0.6',
              note: 'Same scrim, darker mode — deeper black to keep the modal readable.',
            },
            {
              label: 'state-layer hover / down / key-focus',
              value: '0.1',
              note: 'Same background opacity for all three interaction states; default state is 0 (no layer).',
            },
          ]}
        />
      </Block>

      <Block
        title="Layering without z-index"
        description="There is no numeric z-scale in the token data. Stacking order comes from where an element mounts in the DOM — React Aria overlays portal to the end of body — plus the modal scrim visually separating layers."
      >
        <div className="overflow-hidden rounded-xl border">
          {STACK.map((s, i) => (
            <div
              key={s.label}
              className="flex items-center justify-between gap-4 border-b px-4 py-3 last:border-b-0"
              style={{ paddingLeft: `${1 + i * 0.75}rem` }}
            >
              <span className="font-mono text-xs text-fg">{s.label}</span>
              <span className="text-xs text-fg-muted">{s.desc}</span>
            </div>
          ))}
        </div>
        <Note className="mt-3">
          No z-index tokens exist in the data. Layering is portal / mount-order
          (React Aria overlays render last) plus the scrim, not a numeric scale.
        </Note>
      </Block>

      <Note>
        Shadows are pure black at alpha — never a colored or tinted surface tint
        — and dark mode reuses the same geometry at roughly 3× the alpha.
        Source: spectrum-design-data/packages/tokens/src/{'{'}
        color-aliases,layout{'}'}.json
      </Note>
    </Section>
  )
}
