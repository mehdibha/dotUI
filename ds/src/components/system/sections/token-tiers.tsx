'use client'

import { useState, type ReactNode } from 'react'
import { ArrowDownIcon } from 'lucide-react'

import { LayerDiagram } from '@/components/explorer/layer-diagram'
import type { CatalogEntry, SystemWithColors } from '@/data/schema'

import {
  Block,
  Choice,
  Mono,
  Note,
  Playground,
  Section,
  Stat,
  StatGrid,
  TokenName,
} from '../primitives'

type Mode = 'light' | 'dark' | 'wireframe'

const MODES: { value: Mode; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'wireframe', label: 'Wireframe' },
]

const PRIMITIVE_BY_MODE: Record<Mode, { name: string; rgb: string }> = {
  light: { name: 'blue-900', rgb: 'rgb(59, 99, 251)' },
  dark: { name: 'blue-800', rgb: 'rgb(64, 105, 253)' },
  wireframe: { name: 'blue-900', rgb: 'rgb(74, 111, 195)' },
}

const SEMANTIC_BY_MODE: Record<Mode, string> = {
  light: 'accent-color-900',
  dark: 'accent-color-800',
  wireframe: 'accent-color-900',
}

export function TokenTiersSection({
  system,
}: {
  system: SystemWithColors
  catalogEntry?: CatalogEntry
}) {
  const [mode, setMode] = useState<Mode>('light')
  const primitive = PRIMITIVE_BY_MODE[mode]
  const semantic = SEMANTIC_BY_MODE[mode]

  return (
    <Section
      title="Token Tier Architecture"
      kicker="Design Tokens"
      intro="Spectrum's tokens resolve through four tiers, each materialized as its own file: a component token points to an alias, the alias picks a semantic value per mode, and the semantic value points at a primitive ramp color. Follow one chain end to end below."
    >
      <Block title="Token volume by tier">
        <StatGrid>
          <Stat
            value="372"
            label="Primitive"
            sub="color-palette.json, mostly private"
          />
          <Stat value="94" label="Semantic" sub="semantic-color-palette.json" />
          <Stat value="170" label="Alias" sub="color-aliases.json" />
          <Stat
            value="73 + 1,010"
            label="Component"
            sub="color + layout component.json"
          />
        </StatGrid>
      </Block>

      <Block
        title="Four files, one flow"
        description="Raw ramp values become usage-scoped concepts, which become mode-aware purpose tokens, which components consume directly."
      >
        <LayerDiagram layers={system.colors.layers} />
        <Note>
          Tiering is a file-naming convention, not an enforced depth — some
          component tokens alias straight to a palette-adjacent value and skip a
          hop, rather than always threading all four tiers.
        </Note>
      </Block>

      <Block
        title="Reference-chain tracer"
        description="stack-item-selected-background-color-emphasized, followed from component down to the raw primitive it resolves to in each mode."
        aside={
          <Choice
            options={MODES}
            value={mode}
            onChange={setMode}
            label="Mode"
          />
        }
      >
        <Playground center={false} surface="muted">
          <div className="flex flex-col items-stretch gap-0">
            <TierCard kind="component">
              <TokenName
                parts={[
                  { text: 'stack-item', role: 'concept' },
                  { text: 'selected', role: 'state' },
                  { text: 'background-color', role: 'property' },
                  { text: 'emphasized', role: 'modifier' },
                ]}
              />
              <p className="mt-1.5 text-xs text-fg-muted">
                component: "stack-item" — value points at{' '}
                <Mono>accent-background-color-default</Mono>
              </p>
            </TierCard>

            <Connector />

            <TierCard kind="alias">
              <TokenName
                parts={[
                  { text: 'accent', role: 'concept' },
                  { text: 'background-color', role: 'property' },
                  { text: 'default', role: 'state' },
                ]}
              />
              <p className="mt-1.5 text-xs text-fg-muted">
                mode-aware set — this mode picks{' '}
                <span className="rounded bg-accent-muted px-1 py-0.5 font-mono text-fg-accent">
                  {semantic}
                </span>
              </p>
            </TierCard>

            <Connector />

            <TierCard kind="semantic">
              <TokenName
                parts={[
                  { text: 'accent-color', role: 'concept' },
                  { text: mode === 'dark' ? '800' : '900', role: 'literal' },
                ]}
              />
              <p className="mt-1.5 text-xs text-fg-muted">
                maps onto primitive <Mono>{primitive.name}</Mono>
              </p>
            </TierCard>

            <Connector />

            <TierCard kind="primitive">
              <div className="flex items-center gap-3">
                <div
                  className="size-10 shrink-0 rounded-lg border"
                  style={{ backgroundColor: primitive.rgb }}
                />
                <div>
                  <TokenName
                    parts={[{ text: primitive.name, role: 'literal' }]}
                  />
                  <p className="mt-1 font-mono text-xs text-fg-muted tabular-nums">
                    {primitive.rgb}
                  </p>
                </div>
              </div>
            </TierCard>
          </div>
        </Playground>
      </Block>

      <Note>
        Source: spectrum-design-data/packages/tokens/src/color-palette.json,
        semantic-color-palette.json, color-aliases.json, color-component.json.
      </Note>
    </Section>
  )
}

const TIER_LABEL: Record<
  'component' | 'alias' | 'semantic' | 'primitive',
  string
> = {
  component: 'Component',
  alias: 'Alias / usage',
  semantic: 'Semantic',
  primitive: 'Primitive / global',
}

function TierCard({
  kind,
  children,
}: {
  kind: 'component' | 'alias' | 'semantic' | 'primitive'
  children: ReactNode
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="mb-2 text-xs font-medium tracking-wide text-fg-muted uppercase">
        {TIER_LABEL[kind]}
      </p>
      {children}
    </div>
  )
}

function Connector() {
  return (
    <div className="flex justify-center py-1">
      <ArrowDownIcon className="size-4 text-fg-muted" />
    </div>
  )
}
