'use client'

import { useState } from 'react'

import type { RosterEntry, SystemWithColors } from '@/data/schema'

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

type Scheme = 'light' | 'dark' | 'wireframe'
type Scale = 'desktop' | 'mobile'

const ACCENT_RGB: Record<Scheme, string> = {
  light: 'rgb(59, 99, 251)',
  dark: 'rgb(64, 105, 253)',
  wireframe: 'rgb(74, 111, 195)',
}

const ACCENT_ALIAS: Record<Scheme, string> = {
  light: '{accent-color-900}',
  dark: '{accent-color-800}',
  wireframe: '{accent-color-900}',
}

const COMPONENT_HEIGHT_100: Record<Scale, number> = {
  desktop: 32,
  mobile: 40,
}

const PADDING_HORIZONTAL: Record<Scale, number> = {
  desktop: 18,
  mobile: 14,
}

const SCHEME_OPTIONS = [
  { value: 'light' as const, label: 'Light' },
  { value: 'dark' as const, label: 'Dark' },
  { value: 'wireframe' as const, label: 'Wireframe' },
]

const SCALE_OPTIONS = [
  { value: 'desktop' as const, label: 'Desktop' },
  { value: 'mobile' as const, label: 'Mobile' },
]

const COLOR_SET_JSON = `"accent-background-color-default": {
  "sets": {
    "light": { "value": "{accent-color-900}" },
    "dark": { "value": "{accent-color-800}" },
    "wireframe": { "value": "{accent-color-900}" }
  }
}`

const DIMENSION_SET_JSON = `"base-padding-horizontal-2x-large": {
  "sets": {
    "desktop": "18px",
    "mobile": "14px"
  }
}`

export function TokenModesSection(_props: {
  system: SystemWithColors
  rosterEntry?: RosterEntry
}) {
  const [scheme, setScheme] = useState<Scheme>('light')
  const [scale, setScale] = useState<Scale>('desktop')

  const height = COMPONENT_HEIGHT_100[scale]
  const paddingX = PADDING_HORIZONTAL[scale]

  return (
    <Section
      title="Multi-Brand · Theme · Mode"
      kicker="Design Tokens"
      intro="Spectrum tokens resolve along two orthogonal axes: a color scheme (light, dark, or the lo-fi wireframe mode) and a platform scale (desktop or mobile). A token can carry a set for either axis, both, or neither — the two never interact."
    >
      <Block
        title="Axes matrix"
        description="Flip scheme and scale independently. Color changes only with scheme; size changes only with scale — proof the two sets are unrelated dimensions of the same token graph."
        aside={
          <div className="flex flex-wrap items-center gap-2">
            <Choice
              label="Color scheme"
              options={SCHEME_OPTIONS}
              value={scheme}
              onChange={setScheme}
            />
            <Choice
              label="Platform scale"
              options={SCALE_OPTIONS}
              value={scale}
              onChange={setScale}
            />
          </div>
        }
      >
        <Playground
          label="accent-background-color-default × component-height-100"
          hint={`${scheme} / ${scale}`}
          surface="grid"
          footer="Background = resolved accent for the active scheme. Height and horizontal padding = resolved dimensions for the active scale. Text stays white in every scheme."
        >
          <Frame mode={scheme === 'dark' ? 'dark' : 'light'}>
            <button
              type="button"
              style={{
                backgroundColor: ACCENT_RGB[scheme],
                height: `${height}px`,
                paddingLeft: `${paddingX}px`,
                paddingRight: `${paddingX}px`,
                color: 'white',
              }}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium"
            >
              Continue
            </button>
          </Frame>
        </Playground>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <SpecList
            rows={[
              {
                label: 'accent-background-color-default',
                value: ACCENT_RGB[scheme],
                note: `set: ${scheme} → ${ACCENT_ALIAS[scheme]}`,
              },
            ]}
          />
          <SpecList
            rows={[
              {
                label: 'component-height-100',
                value: `${height}px`,
                note: `set: ${scale}`,
              },
              {
                label: 'base-padding-horizontal (repr.)',
                value: `${paddingX}px`,
                note: `set: ${scale}`,
              },
            ]}
          />
        </div>
      </Block>

      <Block
        title="Two independent set axes"
        description="A token's sets object is a generic wrapper reused for any value type — color aliases key it by scheme, layout tokens key it by scale. Nothing forces a token to define both; most define at most one."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="overflow-hidden rounded-xl border">
            <div className="border-b bg-muted/20 px-4 py-2.5 text-xs font-medium text-fg">
              Color scheme axis — 98 / 170 alias tokens
            </div>
            <div className="grid grid-cols-3 divide-x">
              {SCHEME_OPTIONS.map((opt) => (
                <div
                  key={opt.value}
                  className="flex flex-col items-center gap-2 p-3"
                >
                  <span
                    className="size-6 rounded-full border"
                    style={{ backgroundColor: ACCENT_RGB[opt.value] }}
                  />
                  <span className="text-[11px] text-fg-muted">{opt.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border">
            <div className="border-b bg-muted/20 px-4 py-2.5 text-xs font-medium text-fg">
              Platform scale axis — 159 layout tokens
            </div>
            <div className="grid grid-cols-2 divide-x">
              {SCALE_OPTIONS.map((opt) => (
                <div
                  key={opt.value}
                  className="flex flex-col items-center gap-2 p-3"
                >
                  <span
                    className="rounded-sm border bg-accent/60"
                    style={{
                      height: `${COMPONENT_HEIGHT_100[opt.value] / 2}px`,
                      width: `${COMPONENT_HEIGHT_100[opt.value]}px`,
                    }}
                  />
                  <span className="text-[11px] text-fg-muted">{opt.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <CodeBlock code={COLOR_SET_JSON} />
          <CodeBlock code={DIMENSION_SET_JSON} />
        </div>
      </Block>

      <Block
        title="Myth-buster"
        description="Reading the token package's set keys, a few common assumptions don't hold up."
      >
        <SpecList
          rows={[
            {
              label: 'Spectrum 1 vs 2 set',
              value: 'Does not exist',
              note: 'There is no colorScheme-like set keyed by spectrum version. Spectrum 1 lives on a separate branch / older npm major — a repo axis, not a token set.',
            },
            {
              label: '"Express" brand',
              value: 'Not in this package',
              note: 'src is exactly 8 files; none define an Express set. Brand is a release/branch decision upstream of these tokens, not a runtime axis a component reads.',
            },
            {
              label: 'Wireframe scheme',
              value: 'Real, and a genuine 3rd mode',
              note: 'wireframe sits alongside light and dark in the same sets object — a low-fidelity greyscale scheme, not a placeholder.',
            },
          ]}
        />
      </Block>

      <Note>
        Source: spectrum-design-data/packages/tokens/src/color-aliases.json,
        spectrum-design-data/packages/tokens/src/layout.json
      </Note>
    </Section>
  )
}
