'use client'

import { useState } from 'react'

import type { RosterEntry, SystemWithColors } from '@/data/schema'

import {
  Block,
  Choice,
  Mono,
  Note,
  Playground,
  Section,
  TokenLegend,
  TokenName,
  type TokenSegmentRole,
} from '../primitives'

type Concept =
  | 'accent'
  | 'neutral'
  | 'negative'
  | 'positive'
  | 'informative'
  | 'notice'
type Property = 'background' | 'content' | 'border' | 'visual'
type State =
  | 'default'
  | 'hover'
  | 'down'
  | 'key-focus'
  | 'disabled'
  | 'selected'

const CONCEPTS: { value: Concept; label: string }[] = [
  { value: 'accent', label: 'accent' },
  { value: 'neutral', label: 'neutral' },
  { value: 'negative', label: 'negative' },
  { value: 'positive', label: 'positive' },
  { value: 'informative', label: 'informative' },
  { value: 'notice', label: 'notice' },
]

const PROPERTIES: { value: Property; label: string }[] = [
  { value: 'background', label: 'background' },
  { value: 'content', label: 'content' },
  { value: 'border', label: 'border' },
  { value: 'visual', label: 'visual' },
]

const STATES: { value: State; label: string }[] = [
  { value: 'default', label: 'default' },
  { value: 'hover', label: 'hover' },
  { value: 'down', label: 'down' },
  { value: 'key-focus', label: 'key-focus' },
  { value: 'disabled', label: 'disabled' },
  { value: 'selected', label: 'selected' },
]

const REAL_ASSEMBLIES = new Set([
  'accent-background-color-default',
  'positive-background-color-hover',
])

const LEGEND: { role: TokenSegmentRole; label: string }[] = [
  { role: 'concept', label: 'concept' },
  { role: 'property', label: 'property' },
  { role: 'literal', label: 'literal "color"' },
  { role: 'state', label: 'state' },
]

const DECOMPOSED: { parts: { text: string; role?: TokenSegmentRole }[] }[] = [
  {
    parts: [
      { text: 'accent', role: 'concept' },
      { text: 'background', role: 'property' },
      { text: 'color', role: 'literal' },
      { text: 'default', role: 'state' },
    ],
  },
  {
    parts: [
      { text: 'neutral', role: 'concept' },
      { text: 'subdued', role: 'modifier' },
      { text: 'content', role: 'property' },
      { text: 'color', role: 'literal' },
      { text: 'key-focus', role: 'state' },
    ],
  },
  {
    parts: [
      { text: 'negative', role: 'concept' },
      { text: 'border', role: 'property' },
      { text: 'color', role: 'literal' },
      { text: 'focus-hover', role: 'state' },
    ],
  },
  {
    parts: [
      { text: 'blue', role: 'concept' },
      { text: 'subtle', role: 'modifier' },
      { text: 'background', role: 'property' },
      { text: 'color', role: 'literal' },
      { text: 'default', role: 'state' },
    ],
  },
]

const SEMANTIC_CONCEPTS = [
  'accent',
  'neutral',
  'negative',
  'positive',
  'informative',
  'notice',
]
const HUE_CONCEPTS = [
  'blue',
  'brown',
  'celery',
  'chartreuse',
  'cinnamon',
  'cyan',
  'fuchsia',
  'gray',
  'green',
  'indigo',
  'magenta',
  'orange',
  'pink',
  'purple',
  'red',
  'seafoam',
  'silver',
  'turquoise',
  'yellow',
]
const MODIFIERS = ['subdued', 'subtle', 'static-black', 'static-white']
const PROPERTY_VOCAB = [
  'background',
  'content',
  'border',
  'visual',
  'focus-indicator',
]
const STATE_VOCAB = [
  'default',
  'hover',
  'down',
  'focus',
  'key-focus',
  'focus-hover',
  'selected',
  'disabled',
]
const STATE_COMPOUNDS = [
  'selected-default',
  'selected-down',
  'selected-hover',
  'selected-key-focus',
]

export function TokenNamingSection(_props: {
  system: SystemWithColors
  rosterEntry?: RosterEntry
}) {
  const [concept, setConcept] = useState<Concept>('accent')
  const [property, setProperty] = useState<Property>('background')
  const [state, setState] = useState<State>('default')

  const assembled = `${concept}-${property}-color-${state}`
  const isReal = REAL_ASSEMBLIES.has(assembled)

  return (
    <Section
      title="Naming Convention & Grammar"
      kicker="Design Tokens"
      intro="Alias tokens follow a fixed grammar — concept, optional modifier, property, the literal word color, then state — so a name can be parsed before it's looked up. Component tokens follow a shorter grammar of their own: component, property, optional state."
    >
      <Block
        title="Token builder"
        description="Pick a concept, property, and state to assemble a valid-shaped alias name. Not every combination below is a real token — the grammar is generative, but the actual token set is curated."
      >
        <Playground
          center={false}
          controls={
            <div className="flex flex-wrap items-center gap-2">
              <Choice
                label="Concept"
                options={CONCEPTS}
                value={concept}
                onChange={setConcept}
              />
              <Choice
                label="Property"
                options={PROPERTIES}
                value={property}
                onChange={setProperty}
              />
              <Choice
                label="State"
                options={STATES}
                value={state}
                onChange={setState}
              />
            </div>
          }
          footer={
            isReal
              ? `${assembled} is a real token in color-aliases.json.`
              : 'This is a plausible assembly, not a confirmed real token — Spectrum only defines a subset of the grammar’s combinations.'
          }
        >
          <div className="flex flex-col items-center gap-4">
            <TokenName
              parts={[
                { text: concept, role: 'concept' },
                { text: property, role: 'property' },
                { text: 'color', role: 'literal' },
                { text: state, role: 'state' },
              ]}
            />
            <TokenLegend items={LEGEND} />
          </div>
        </Playground>
        <div className="mt-3 flex items-center gap-2 text-sm">
          <span className="text-xs font-medium tracking-wide text-fg-muted uppercase">
            Assembled
          </span>
          <Mono>{assembled}</Mono>
        </div>
      </Block>

      <Block
        title="Decomposing real tokens"
        description="The same grammar, run in reverse — each segment maps back to a controlled vocabulary. Modifiers, when present, slot in right after the concept."
      >
        <div className="flex flex-col gap-3">
          {DECOMPOSED.map((entry) => (
            <div
              key={entry.parts.map((p) => p.text).join('-')}
              className="rounded-xl border p-4"
            >
              <TokenName parts={entry.parts} />
            </div>
          ))}
        </div>
        <Note>
          neutral-subdued-content-color-key-focus carries a modifier (subdued)
          between concept and property — the grammar accommodates it as an
          optional segment, not a special case.
        </Note>
      </Block>

      <Block
        title="Controlled vocabularies"
        description="Every segment is drawn from a fixed list, not free text. Concepts split into six semantic intents plus every hue name treated as a first-class concept in its own right."
      >
        <div className="flex flex-col gap-5">
          <div>
            <div className="mb-2 text-xs font-medium tracking-wide text-fg-muted uppercase">
              Concepts — semantic (6)
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SEMANTIC_CONCEPTS.map((c) => (
                <span
                  key={c}
                  className="rounded bg-accent-muted px-1.5 py-0.5 font-mono text-xs text-fg-accent"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 text-xs font-medium tracking-wide text-fg-muted uppercase">
              Concepts — hue ({HUE_CONCEPTS.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {HUE_CONCEPTS.map((c) => (
                <span
                  key={c}
                  className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-fg-muted"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 text-xs font-medium tracking-wide text-fg-muted uppercase">
              Modifiers
            </div>
            <div className="flex flex-wrap gap-1.5">
              {MODIFIERS.map((m) => (
                <span
                  key={m}
                  className="rounded bg-warning-muted px-1.5 py-0.5 font-mono text-xs text-fg-warning"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 text-xs font-medium tracking-wide text-fg-muted uppercase">
              Properties
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PROPERTY_VOCAB.map((p) => (
                <span
                  key={p}
                  className="rounded bg-success-muted px-1.5 py-0.5 font-mono text-xs text-fg-success"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 text-xs font-medium tracking-wide text-fg-muted uppercase">
              States
            </div>
            <div className="flex flex-wrap gap-1.5">
              {STATE_VOCAB.map((s) => (
                <span
                  key={s}
                  className="rounded bg-info-muted px-1.5 py-0.5 font-mono text-xs text-fg-info"
                >
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {STATE_COMPOUNDS.map((s) => (
                <span
                  key={s}
                  className="rounded border px-1.5 py-0.5 font-mono text-xs text-fg-muted"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
        <Note>
          down and key-focus are Spectrum-specific choices, not the more common
          industry terms — down replaces pressed/active, key-focus replaces
          focus-visible. A naming-exceptions.json allowlist covers tokens that
          deviate from this grammar; a draft RFC (#714/#806) proposes a more
          formal three-layer grammar — taxonomy, then vocabulary, then
          formatting — as a future revision.
        </Note>
      </Block>

      <Note>
        Source: spectrum-design-data/packages/tokens/src/color-aliases.json.
      </Note>
    </Section>
  )
}
