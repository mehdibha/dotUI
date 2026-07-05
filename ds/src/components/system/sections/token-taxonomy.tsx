'use client'

import { useState } from 'react'

import type { CatalogEntry, SystemWithColors } from '@/data/schema'

import {
  Block,
  CodeBlock,
  Choice,
  Mono,
  Note,
  Section,
  SpecList,
} from '../primitives'

const DTCG_SNIPPET = `{
  "color-black": {
    "$type": "color",
    "$value": "#000000"
  }
}`

const SPECTRUM_SNIPPET = `{
  "black": {
    "$schema": ".../token-types/color.json",
    "value": "rgb(0, 0, 0)",
    "uuid": "28dea8b0-…",
    "private": true
  }
}`

type TokenTypeKey =
  | 'color'
  | 'color-set'
  | 'dimension'
  | 'multiplier'
  | 'drop-shadow'
  | 'alias'

const TYPE_EXAMPLES: Record<
  TokenTypeKey,
  { description: string; code: string }
> = {
  color: {
    description:
      'A raw primitive value. No aliasing, no modes — just a color string.',
    code: `{
  "black": {
    "$schema": ".../token-types/color.json",
    "value": "rgb(0, 0, 0)",
    "uuid": "28dea8b0-…",
    "private": true
  }
}`,
  },
  'color-set': {
    description:
      'An alias that resolves differently per mode. Each mode entry is itself a nested alias token with its own $schema.',
    code: `{
  "accent-background-color-default": {
    "$schema": ".../color-set.json",
    "uuid": "e05251ac-…",
    "sets": {
      "light": { "$schema": ".../alias.json", "value": "{accent-color-900}" },
      "dark": { "$schema": ".../alias.json", "value": "{accent-color-800}" },
      "wireframe": { "$schema": ".../alias.json", "value": "{accent-color-900}" }
    }
  }
}`,
  },
  dimension: {
    description:
      'A scale-set: the same token resolves to a different length per platform scale (desktop vs. mobile/dp).',
    code: `{
  "base-padding-horizontal-2x-large": {
    "$schema": ".../scale-set.json",
    "uuid": "3eb3e963-…",
    "sets": {
      "desktop": { "$schema": ".../dimension.json", "value": "18px" },
      "mobile": { "$schema": ".../dimension.json", "value": "14px" }
    }
  }
}`,
  },
  multiplier: {
    description:
      'A bare numeric factor — used for things like corner-radius ratios, not a length or a color.',
    code: `{
  "corner-radius-full": {
    "$schema": ".../token-types/multiplier.json",
    "value": 0.5
  }
}`,
  },
  'drop-shadow': {
    description:
      'A composite array of shadow layers, each with its own offset, blur, spread and an aliased color. This is the only shadow primitive — there is no separate "shadow" type.',
    code: `{
  "drop-shadow-emphasized": {
    "$schema": ".../token-types/drop-shadow.json",
    "value": [
      {
        "x": "0px",
        "y": "2px",
        "blur": "8px",
        "spread": "0px",
        "color": "{drop-shadow-ambient-color}"
      }
    ]
  }
}`,
  },
  alias: {
    description:
      'A reference to another token by name, in {curly-brace} syntax. Resolved at build/consume time, not baked in.',
    code: `{
  "value": "{accent-color-900}",
  "$schema": ".../token-types/alias.json"
}`,
  },
}

const TYPE_OPTIONS: { value: TokenTypeKey; label: string }[] = [
  { value: 'color', label: 'color' },
  { value: 'color-set', label: 'color-set' },
  { value: 'dimension', label: 'dimension' },
  { value: 'multiplier', label: 'multiplier' },
  { value: 'drop-shadow', label: 'drop-shadow' },
  { value: 'alias', label: 'alias' },
]

const SCHEMA_ROWS: { name: string; note?: string; composite?: boolean }[] = [
  { name: 'alias' },
  { name: 'alignment' },
  { name: 'color' },
  { name: 'color-set' },
  { name: 'dimension' },
  {
    name: 'drop-shadow',
    note: 'the only shadow primitive — composite array of {x, y, blur, spread, color}',
    composite: true,
  },
  { name: 'font-family' },
  { name: 'font-size' },
  { name: 'font-style' },
  { name: 'font-weight' },
  { name: 'gradient-stop' },
  { name: 'multiplier' },
  { name: 'opacity' },
  { name: 'scale-set' },
  { name: 'set' },
  { name: 'system-set' },
  { name: 'text-transform' },
  { name: 'typography' },
  { name: 'token' },
]

const ABSENT_TYPES = ['duration', 'cubic-bezier', 'easing']

export function TokenTaxonomySection(_props: {
  system: SystemWithColors
  catalogEntry?: CatalogEntry
}) {
  const [activeType, setActiveType] = useState<TokenTypeKey>('color')
  const active = TYPE_EXAMPLES[activeType]

  return (
    <Section
      title="Token Type Taxonomy & Format"
      kicker="Design Tokens"
      intro="Spectrum tokens are not DTCG/W3C tokens. They predate that spec and use Adobe's own JSON shape: value instead of $value, no $type, and a $schema URL that names the type instead. About 19 token-type schemas cover every kind of value the system needs."
    >
      <Block
        title="Format, not spec-compliant"
        description="The two formats look similar at a glance but disagree on almost every field name. Only description is deliberately kept DTCG-adjacent."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-medium tracking-wide text-fg-muted uppercase">
              DTCG / W3C
            </p>
            <CodeBlock code={DTCG_SNIPPET} />
          </div>
          <div>
            <p className="mb-2 text-xs font-medium tracking-wide text-fg-muted uppercase">
              Spectrum
            </p>
            <CodeBlock code={SPECTRUM_SNIPPET} />
          </div>
        </div>
        <Note className="mt-3">
          <Mono>value</Mono> replaces <Mono>$value</Mono>, and there is no{' '}
          <Mono>$type</Mono> — <Mono>$schema</Mono> names the type instead. Of
          Spectrum's extra fields ($schema, uuid, component, private,
          deprecated, deprecated_comment, renamed, replaced_by, plannedRemoval,
          description, sets), only <Mono>description</Mono> is called out by
          Adobe as aligning with DTCG's <Mono>$description</Mono>.
        </Note>
      </Block>

      <Block
        title="Token types, by shape"
        description="Every token's $schema points at one of ~19 type definitions. Pick a type to see a verbatim example."
        aside={
          <Choice
            label="Token type"
            options={TYPE_OPTIONS}
            value={activeType}
            onChange={setActiveType}
          />
        }
      >
        <p className="mb-3 text-sm text-fg-muted">{active.description}</p>
        <CodeBlock code={active.code} />
      </Block>

      <Block
        title="All token-type schemas"
        description="schemas/token-types/ defines ~19 value shapes. Two absences are structural, not oversights: there is no duration, cubic-bezier, or easing type — which is why motion has no dedicated tokens today."
      >
        <SpecList
          rows={SCHEMA_ROWS.map((row) => ({
            label: <Mono>{row.name}</Mono>,
            value: row.composite ? 'composite array' : 'schema',
            note: row.note,
          }))}
        />
        <div className="mt-4 rounded-xl border border-dashed p-4">
          <p className="text-xs font-medium tracking-wide text-fg-muted uppercase">
            Notably absent
          </p>
          <p className="mt-1.5 text-sm text-fg-muted">
            {ABSENT_TYPES.map((name) => (
              <Mono key={name} className="mr-2">
                {name}
              </Mono>
            ))}
            — no motion-timing schema exists at all, so easing curves and
            durations aren't tokenized anywhere in this system.
          </p>
        </div>
      </Block>

      <Block
        title="Identity is per-value, not per-token"
        description="Every token, and every per-mode or per-scale value inside a color-set or scale-set, carries its own uuid. That's what makes renames safe: the schema tracks renamed and replaced_by fields against a stable id rather than a string name."
      >
        <SpecList
          rows={[
            {
              label: <Mono>color</Mono>,
              value: 'string pattern',
              note: 'rgb() / rgba()',
            },
            {
              label: <Mono>dimension</Mono>,
              value: 'string pattern',
              note: 'px | rem | em | % | dp (dp is Android-only)',
            },
            {
              label: <Mono>uuid</Mono>,
              value: 'present on every token and every set entry',
              note: 'rename-safe identity, independent of the token name',
            },
          ]}
        />
      </Block>

      <Note>
        Source: spectrum-design-data/packages/tokens/schemas/token-types,
        spectrum-design-data/packages/tokens/src/*.json
      </Note>
    </Section>
  )
}
