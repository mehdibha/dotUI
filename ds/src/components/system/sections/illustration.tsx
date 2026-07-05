'use client'

import { useState } from 'react'

import type { RosterEntry, SystemWithColors } from '@/data/schema'
import { Button } from '@/ui/button'

import {
  Block,
  Choice,
  Note,
  Playground,
  Section,
  SpecList,
  Stat,
  StatGrid,
} from '../primitives'

type Style = 'gradient' | 'linear'

const styleOptions: { value: Style; label: string }[] = [
  { value: 'gradient', label: 'Gradient (filled)' },
  { value: 'linear', label: 'Linear (outline)' },
]

const taxonomyRows = [
  {
    label: 'gradient / generic1',
    value: '162 illustrations',
    note: 'color-filled set',
  },
  {
    label: 'gradient / generic2',
    value: '162 illustrations',
    note: 'color-filled set',
  },
  { label: 'linear', value: '194 illustrations', note: 'line-art set' },
  {
    label: 'Asset sizes',
    value: '48 / 96 / 160 px',
    note: 'own square SVGs, not one scaled file',
  },
  {
    label: 'Fill model',
    value: 'Flattened fills',
    note: 'even linear line-art is filled outline geometry, not stroked',
  },
]

const guidanceRows = [
  {
    label: 'Illustration',
    value: '48–160 px',
    note: 'messaging / context — empty states, onboarding, errors',
  },
  {
    label: 'Icon',
    value: '14–26 px',
    note: 'compact UI affordance — buttons, inline actions',
  },
]

function GradientBox({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="box-fill"
          x1="24"
          y1="30"
          x2="136"
          y2="140"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="currentColor" stopOpacity="0.55" />
          <stop offset="1" stopColor="currentColor" stopOpacity="1" />
        </linearGradient>
        <linearGradient
          id="box-lid"
          x1="24"
          y1="30"
          x2="136"
          y2="66"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="currentColor" stopOpacity="0.85" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <path
        d="M24 66 L80 92 L136 66 L136 132 Q136 138 130 140 L84 156 Q80 158 76 156 L30 140 Q24 138 24 132 Z"
        fill="url(#box-fill)"
      />
      <path d="M24 66 L80 44 L136 66 L80 92 Z" fill="url(#box-lid)" />
      <path
        d="M80 92 L80 156"
        stroke="var(--color-bg, #fff)"
        strokeOpacity="0.35"
        strokeWidth="2"
      />
      <circle
        cx="118"
        cy="34"
        r="14"
        fill="currentColor"
        className="text-fg-accent"
        opacity="0.9"
      />
      <path
        d="M112 34 L117 39 L126 28"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

function LinearBox({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 66 L80 92 L136 66 M24 66 L80 44 L136 66 M24 66 L24 132 Q24 138 30 140 L76 156 Q80 158 84 156 L130 140 Q136 138 136 132 L136 66 M80 92 L80 156"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle
        cx="118"
        cy="34"
        r="13"
        stroke="currentColor"
        className="text-fg-accent"
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M112 34 L117 39 L126 28"
        stroke="currentColor"
        className="text-fg-accent"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

function RepresentativeIllustration({
  style,
  size,
}: {
  style: Style
  size: number
}) {
  return (
    <div className="text-fg" style={{ width: size, height: size }}>
      {style === 'gradient' ? (
        <GradientBox size={size} />
      ) : (
        <LinearBox size={size} />
      )}
    </div>
  )
}

export function IllustrationSection(_props: {
  system: SystemWithColors
  rosterEntry?: RosterEntry
}) {
  const [style, setStyle] = useState<Style>('gradient')

  return (
    <Section
      title="Illustration & Imagery"
      kicker="Foundations"
      intro="Spectrum ships two illustration styles for messaging and context — Filled, editorial and expressive for onboarding and attention, and Outline, informational and directive for empty states and errors — always at illustration scale (48–160px), never icon scale."
    >
      <Block
        title="Two styles, one subject"
        description="Filled uses color-filled shapes with a moderate accent gradient; Outline uses line geometry in grays with an occasional accent — both flattened fills, not live strokes."
        aside={
          <Choice
            options={styleOptions}
            value={style}
            onChange={setStyle}
            label="Style"
          />
        }
      >
        <Playground
          label={
            style === 'gradient' ? 'Filled (gradient)' : 'Outline (linear)'
          }
          hint={
            style === 'gradient'
              ? 'Color-filled shapes, moderate lines/textures — editorial and expressive.'
              : 'Lines and grays with an occasional accent — informational and directive.'
          }
        >
          <RepresentativeIllustration style={style} size={160} />
        </Playground>
      </Block>

      <Block
        title="Size comparison"
        description="Illustrations are authored as their own square SVGs at each size — not one asset scaled — so detail is tuned per size."
      >
        <Playground center={false} surface="grid">
          <div className="flex flex-wrap items-end gap-10">
            {[48, 96, 160].map((size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <RepresentativeIllustration style={style} size={size} />
                <span className="font-mono text-xs text-fg-muted tabular-nums">
                  {size}px
                </span>
              </div>
            ))}
          </div>
        </Playground>
      </Block>

      <Block
        title="IllustratedMessage anatomy"
        description="The empty/error pattern: Illustration + Heading + Content + optional ButtonGroup, size S | M | L (default M), orientation horizontal | vertical (default vertical)."
      >
        <Playground center surface="muted">
          <div className="flex max-w-xs flex-col items-center gap-4 text-center">
            <div className="relative">
              <RepresentativeIllustration style={style} size={96} />
              <span className="absolute -top-2 -right-3 rounded-sm bg-accent px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-fg-accent uppercase">
                Illustration
              </span>
            </div>
            <div className="relative">
              <p className="text-base font-semibold text-fg">
                No results found
              </p>
              <span className="absolute top-0 -right-16 text-[10px] font-medium tracking-wide text-fg-muted uppercase">
                Heading
              </span>
            </div>
            <div className="relative">
              <p className="text-sm text-fg-muted">
                Try adjusting your search or filters to find what you're looking
                for.
              </p>
              <span className="absolute top-0 -right-14 text-[10px] font-medium tracking-wide text-fg-muted uppercase">
                Content
              </span>
            </div>
            <div className="relative">
              <Button variant="primary" size="sm">
                Clear filters
              </Button>
              <span className="absolute top-1 -right-20 text-[10px] font-medium tracking-wide text-fg-muted uppercase">
                ButtonGroup
              </span>
            </div>
          </div>
        </Playground>
        <Note>
          Orientation defaults to vertical; horizontal places the illustration
          beside the text/button stack instead of above it.
        </Note>
      </Block>

      <Block
        title="Library taxonomy"
        description="Real Spectrum illustrations ship as two implementation families."
      >
        <StatGrid>
          <Stat value="162" label="gradient / generic1" />
          <Stat value="162" label="gradient / generic2" />
          <Stat value="194" label="linear" />
        </StatGrid>
        <div className="mt-5">
          <SpecList rows={taxonomyRows} />
        </div>
      </Block>

      <Block
        title="Illustration vs. icon"
        description="Same visual language, different job — scale signals the intent."
      >
        <SpecList rows={guidanceRows} />
      </Block>

      <Note>
        Source: spectrum.adobe.com/page/illustration · @react-spectrum/s2
        illustrations. The two SVGs above are representative art built to match
        the documented styles — the real library (gradient generic1/generic2 +
        linear, 518 illustrations total) is not bundled here.
      </Note>
    </Section>
  )
}
