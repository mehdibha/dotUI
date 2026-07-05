'use client'

import { useState } from 'react'
import {
  CircleIcon,
  CloudIcon,
  DownloadIcon,
  HomeIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  ShareIcon,
  StarIcon,
  TrashIcon,
} from 'lucide-react'

import type { CatalogEntry, SystemWithColors } from '@/data/schema'

import {
  Block,
  Choice,
  Note,
  Playground,
  Range,
  Section,
  Stat,
  StatGrid,
} from '../primitives'

const componentSizes = [
  { px: 14, label: 'XS' },
  { px: 16, label: 'S' },
  { px: 20, label: 'M · default' },
  { px: 22, label: 'L' },
  { px: 26, label: 'XL' },
] as const

const docScales = [
  { value: 'desktop', label: 'Desktop · 18px' },
  { value: 'mobile', label: 'Mobile · 22px' },
] as const

type DocScale = (typeof docScales)[number]['value']

const representativeIcons = [
  { Icon: HomeIcon, name: 'home' },
  { Icon: SearchIcon, name: 'search' },
  { Icon: SettingsIcon, name: 'settings' },
  { Icon: StarIcon, name: 'star' },
  { Icon: ShareIcon, name: 'share' },
  { Icon: DownloadIcon, name: 'download' },
  { Icon: TrashIcon, name: 'delete' },
  { Icon: PlusIcon, name: 'add' },
  { Icon: CloudIcon, name: 'cloud' },
  { Icon: CircleIcon, name: 'status' },
]

export function IconsSection(_props: {
  system: SystemWithColors
  catalogEntry?: CatalogEntry
}) {
  const [scale, setScale] = useState<DocScale>('desktop')
  const [strokeWidth, setStrokeWidth] = useState(2)

  return (
    <Section
      title="Iconography"
      kicker="Foundations"
      intro="Spectrum 2 ships two icon families on a shared 20×20 grid: ~396 workflow icons for functional and navigational metaphors, and a separate set of UI icons for component internals like chevrons and checks. Both are authored as outlines, then flattened to filled paths for shipping."
    >
      <Block
        title="Grid & construction"
        description="Custom icons are drawn on a square 20×20 viewBox, pixel-snapped to full px on desktop and half px on mobile. Outer corners on angled glyphs get a small rounding treatment; inner corners stay sharp."
      >
        <Playground
          label="Anatomy diagram"
          hint="20× 20 keyline grid, scaled up"
          surface="muted"
          footer="Rounding applies only to convex (outer) corners — concave (inner) corners are left square so shapes read crisply at small sizes."
        >
          <svg
            viewBox="0 0 200 200"
            className="h-64 w-64 sm:h-72 sm:w-72"
            aria-label="Icon construction diagram on a 20 by 20 grid"
          >
            {Array.from({ length: 11 }, (_, i) => i * 20).map((pos) => (
              <g key={pos}>
                <line
                  x1={pos}
                  y1={0}
                  x2={pos}
                  y2={200}
                  stroke="var(--color-border)"
                  strokeWidth={pos === 0 || pos === 200 ? 1.5 : 0.5}
                />
                <line
                  x1={0}
                  y1={pos}
                  x2={200}
                  y2={pos}
                  stroke="var(--color-border)"
                  strokeWidth={pos === 0 || pos === 200 ? 1.5 : 0.5}
                />
              </g>
            ))}
            <rect
              x={20}
              y={20}
              width={160}
              height={160}
              fill="none"
              stroke="var(--color-fg-accent)"
              strokeWidth={1}
              strokeDasharray="4 4"
              opacity={0.6}
            />
            <path
              d="M 88 30 L 112 30 Q 116 30 116 34 L 116 84 L 166 84 Q 170 84 170 88 L 170 112 Q 170 116 166 116 L 116 116 L 116 166 Q 116 170 112 170 L 88 170 Q 84 170 84 166 L 84 116 L 34 116 Q 30 116 30 112 L 30 88 Q 30 84 34 84 L 84 84 L 84 34 Q 84 30 88 30 Z"
              fill="var(--color-fg-accent)"
            />
            <text
              x={100}
              y={14}
              textAnchor="middle"
              className="fill-fg-muted"
              fontSize={7}
              fontFamily="var(--font-mono)"
            >
              live area
            </text>
            <text
              x={100}
              y={192}
              textAnchor="middle"
              className="fill-fg-muted"
              fontSize={7}
              fontFamily="var(--font-mono)"
            >
              20 × 20 viewBox
            </text>
          </svg>
        </Playground>
        <Note className="mt-3">
          The dashed inset marks the safe/live area glyphs are drawn inside —
          its exact padding is shown only in Adobe's construction diagrams, not
          published as a token. Outer corners on the plus shape above use a
          0.25–0.5px rounding radius; the four inner corners stay square.
        </Note>
      </Block>

      <Block
        title="Stroke weight"
        description="Desktop icons use a 1px or 2px stroke; mobile uses 1.5px or 2px. Thin strokes suit horizontal/vertical lines, thick strokes carry visual weight and balance. Icons ship as flattened fill paths, not live strokes — this outline rendering is for construction reference only."
      >
        <Playground
          label="Live stroke preview"
          hint="outline construction, not shipped form"
          controls={
            <Range
              label="Stroke width"
              value={strokeWidth}
              onChange={setStrokeWidth}
              minValue={1}
              maxValue={2}
              step={0.5}
              format={(v) => `${v}px`}
            />
          }
          footer={`Rendered at ${strokeWidth}px. Shipped icons bake this outline into a single filled path (fill: var(--iconPrimary)), so no strokeWidth exists at runtime.`}
        >
          <svg
            viewBox="0 0 20 20"
            className="h-24 w-24"
            aria-label="Home glyph outline"
          >
            <path
              d="M3 9.5 L10 3.5 L17 9.5 M5 8 V16 A1 1 0 0 0 6 17 H8.5 V12.5 H11.5 V17 H14 A1 1 0 0 0 15 16 V8"
              fill="none"
              stroke="var(--color-fg)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Playground>
      </Block>

      <Block
        title="Size scale"
        description="React Spectrum's S2 Icon component exposes five fixed sizes, M (20px) as default. Documentation separately quotes a doc-scale of 18px for desktop and 22px for mobile as the baseline drawing size."
      >
        <Playground
          label="Component sizes"
          hint="representative glyph, lucide star — not a Spectrum asset"
          surface="muted"
          center={false}
          bodyClassName="flex flex-wrap items-end justify-center gap-8"
        >
          {componentSizes.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-2">
              <StarIcon
                width={s.px}
                height={s.px}
                className="text-fg"
                strokeWidth={2}
              />
              <div className="text-center">
                <p className="font-mono text-xs text-fg tabular-nums">
                  {s.px}px
                </p>
                <p className="text-[11px] text-fg-muted">{s.label}</p>
              </div>
            </div>
          ))}
        </Playground>

        <Playground
          label="Design-doc scale"
          hint="platform baseline size"
          controls={
            <Choice options={docScales} value={scale} onChange={setScale} />
          }
          footer={
            scale === 'desktop'
              ? 'Desktop baseline: 18px, pixel-snapped to full px, 1–2px strokes.'
              : 'Mobile baseline: 22px, pixel-snapped to half px, 1.5–2px strokes.'
          }
          className="mt-4"
        >
          <StarIcon
            width={scale === 'desktop' ? 18 : 22}
            height={scale === 'desktop' ? 18 : 22}
            className="text-fg-accent"
            strokeWidth={2}
          />
        </Playground>
      </Block>

      <Block
        title="Workflow icon library"
        description="A representative sample standing in for the full workflow set — lucide glyphs, not Spectrum artwork. Real Spectrum icons follow the rounder S2 restyle described below."
      >
        <Playground
          label="Sample grid"
          hint="10 of ~396 workflow icons, representative only"
          surface="grid"
          center={false}
          bodyClassName="grid grid-cols-5 gap-4 sm:grid-cols-10"
        >
          {representativeIcons.map(({ Icon, name }) => (
            <div
              key={name}
              className="flex flex-col items-center gap-1.5 rounded-lg border bg-card p-3"
            >
              <Icon
                width={20}
                height={20}
                className="text-fg"
                strokeWidth={2}
              />
              <p className="font-mono text-[10px] text-fg-muted">{name}</p>
            </div>
          ))}
        </Playground>
      </Block>

      <Block
        title="At a glance"
        description="S2's icon restyle balances Spectrum 1's sharp rationality with Adobe Express's thicker, rounder style — tuned to pair with the Adobe Clean typeface. No exact S1→S2 pixel delta is published; the change is qualitative."
      >
        <StatGrid>
          <Stat
            value="396"
            label="Workflow icons"
            sub="spectrum-css-workflow-icons manifest"
          />
          <Stat value="~410" label="S2 icon set" sub="@react-spectrum/s2" />
          <Stat value="2" label="Categories" sub="workflow vs UI icons" />
          <Stat
            value="20×20"
            label="Base grid"
            sub="square viewBox, both categories"
          />
        </StatGrid>
      </Block>

      <Note>
        Source: spectrum.adobe.com/page/iconography ·
        github.com/adobe/spectrum-css-workflow-icons
      </Note>
    </Section>
  )
}
