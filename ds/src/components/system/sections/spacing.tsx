'use client'

import { useState } from 'react'

import type { CatalogEntry, SystemWithColors } from '@/data/schema'

import {
  Block,
  Choice,
  Mono,
  Note,
  Playground,
  ScaleTrack,
  Section,
  SpecList,
} from '../primitives'

const spacingLadder = [
  { token: 'spacing-25', value: 1 },
  { token: 'spacing-50', value: 2 },
  { token: 'spacing-75', value: 4 },
  { token: 'spacing-85', value: 6 },
  { token: 'spacing-100', value: 8 },
  { token: 'spacing-200', value: 12 },
  { token: 'spacing-300', value: 16 },
  { token: 'spacing-350', value: 20 },
  { token: 'spacing-400', value: 24 },
  { token: 'spacing-500', value: 32 },
  { token: 'spacing-600', value: 40 },
  { token: 'spacing-700', value: 48 },
  { token: 'spacing-800', value: 64 },
  { token: 'spacing-900', value: 80 },
  { token: 'spacing-1000', value: 96 },
]

type ScaleMode = 'desktop' | 'mobile'

const scaleFactor: Record<ScaleMode, number> = { desktop: 1, mobile: 1.25 }
const baseFont: Record<ScaleMode, number> = { desktop: 14, mobile: 17 }

const componentHeights = [
  { token: 'component-height-50', desktop: 20, mobile: 26 },
  { token: 'component-height-75', desktop: 24, mobile: 30 },
  { token: 'component-height-100', desktop: 32, mobile: 40 },
  { token: 'component-height-200', desktop: 40, mobile: 50 },
  { token: 'component-height-300', desktop: 48, mobile: 60 },
  { token: 'component-height-400', desktop: 56, mobile: 70 },
  { token: 'component-height-500', desktop: 64, mobile: 80 },
  { token: 'checkbox-control-size (medium)', desktop: 16, mobile: 20 },
]

export function SpacingSection(_props: {
  system: SystemWithColors
  catalogEntry?: CatalogEntry
}) {
  const [scale, setScale] = useState<ScaleMode>('desktop')

  const buttonHeight = scale === 'desktop' ? 32 : 40
  const checkboxSize = scale === 'desktop' ? 16 : 20
  const font = baseFont[scale]
  const factor = scaleFactor[scale]

  return (
    <Section
      title="Spacing & Density"
      kicker="Foundations"
      intro="Spectrum 2's spacing ladder is unchanged from Spectrum 1 — the same 15 tokens, none redefined. What's new is a single scale variable, --s2-scale, that grows every spacing and sizing token by 1.25× on touch devices. There is no manual density switch and no compact/regular/spacious system anymore."
    >
      <Block
        title="Spacing scale"
        description="A flat token ladder in px — not a strict 8px grid, and not split by desktop/mobile. The scale variable below is what changes per platform, not the ladder itself."
      >
        <ScaleTrack items={spacingLadder} max={96} />
        <Note className="mt-3">
          15 tokens, spacing-25 through spacing-1000, each a fixed px value
          expressed as rem.
        </Note>
      </Block>

      <Block
        title="The --s2-scale variable"
        description="size(px) = calc(pxToRem(px) * var(--s2-scale)). Desktop/cursor devices get a scale of 1 (base font 14px); mobile/touch devices get 1.25 (base font 17px). Toggle below to see it applied to a live mini toolbar."
        aside={
          <Choice
            label="Scale"
            value={scale}
            onChange={setScale}
            options={[
              { value: 'desktop', label: 'Desktop 1×' },
              { value: 'mobile', label: 'Mobile 1.25×' },
            ]}
          />
        }
      >
        <Playground
          label="Toolbar"
          hint={`--s2-scale: ${factor}`}
          center={false}
          surface="muted"
          footer={`component-height-100 = ${buttonHeight}px · checkbox-control-size = ${checkboxSize}px · base font = ${font}px`}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-md bg-accent px-4 text-fg-accent transition-[height,padding,font-size] duration-200"
              style={{ height: buttonHeight, fontSize: font * 0.8 }}
            >
              Button
            </div>
            <div
              className="flex items-center rounded-md border bg-bg px-3 text-fg-muted transition-[height,padding,font-size] duration-200"
              style={{ height: buttonHeight, fontSize: font * 0.8, width: 140 }}
            >
              Input text
            </div>
            <div
              className="shrink-0 rounded-[4px] border-2 border-fg-muted transition-[width,height] duration-200"
              style={{ width: checkboxSize, height: checkboxSize }}
            />
          </div>
        </Playground>
        <Note className="mt-3">
          In production this switch is automatic: the media query is{' '}
          <Mono>not ((hover: hover) and (pointer: fine))</Mono>. There is no
          user- or developer-facing toggle — the toggle above is illustrative
          only, standing in for what the media query would otherwise drive.
        </Note>
      </Block>

      <Block
        title="Component heights"
        description="The same desktop → mobile relationship, tabulated across the component-height ramp used for controls like Button medium (component-height-100)."
      >
        <SpecList
          rows={componentHeights.map((row) => ({
            label: <Mono>{row.token}</Mono>,
            value: `${row.desktop}px → ${row.mobile}px`,
            note:
              row.token === 'component-height-100' ? 'Button "M"' : undefined,
          }))}
        />
      </Block>

      <Block
        title="No compact / regular / spacious"
        description="Spectrum 1 exposed a system-wide density axis. S2 removed it: 114 of the 126 density-suffixed tokens are deprecated, and only Table row-height and Tab height still branch on it."
      >
        <Note>
          What S2 calls &ldquo;density&rdquo; now is a spacing and layout choice
          made per surface (spacious ↔ dense), not a token axis every component
          inherits — and the spacing ladder itself is the same one Spectrum 1
          shipped.
        </Note>
      </Block>

      <Note>
        Source: spectrum-design-data/packages/tokens/src/layout.json ·
        react-spectrum s2 page.macro.ts
      </Note>
    </Section>
  )
}
