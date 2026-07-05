'use client'

import { useState } from 'react'

import type { RosterEntry, SystemWithColors } from '@/data/schema'

import {
  Block,
  CodeBlock,
  Choice,
  Note,
  Playground,
  Section,
  Stat,
  StatGrid,
} from '../primitives'

type ComponentToken = {
  token: string
  resolved: string
}

type ComponentEntry = {
  id: string
  label: string
  tokens: ComponentToken[]
}

const COMPONENTS: ComponentEntry[] = [
  {
    id: 'avatar',
    label: 'avatar',
    tokens: [
      {
        token: 'avatar-border-color',
        resolved: 'light {gray-900} / dark {gray-25}',
      },
      {
        token: 'avatar-opacity-disabled',
        resolved: '{opacity-disabled} — 0.3',
      },
    ],
  },
  {
    id: 'card',
    label: 'card',
    tokens: [
      {
        token: 'card-selection-background-color',
        resolved: 'light {gray-75} / dark {gray-200}',
      },
    ],
  },
  {
    id: 'menu-item',
    label: 'menu-item',
    tokens: [
      {
        token: 'menu-item-background-color-hover',
        resolved: 'light {gray-75} / dark {gray-200}',
      },
      {
        token: 'menu-item-background-color-keyboard-focus',
        resolved: 'light {gray-100} / dark {gray-300}',
      },
    ],
  },
  {
    id: 'popover',
    label: 'popover',
    tokens: [
      {
        token: 'popover-border-color',
        resolved: 'light {gray-300} / dark {gray-300}',
      },
    ],
  },
  {
    id: 'table',
    label: 'table',
    tokens: [
      {
        token: 'table-selected-row-background-color',
        resolved: 'light {gray-100} / dark {gray-300}',
      },
    ],
  },
  {
    id: 'tree-view',
    label: 'tree-view',
    tokens: [
      {
        token: 'tree-view-selected-row-background-hover',
        resolved: 'light {gray-200} / dark {gray-400}',
      },
    ],
  },
  {
    id: 'drop-zone',
    label: 'drop-zone',
    tokens: [
      {
        token: 'drop-zone-border-color',
        resolved: 'component-scoped — see color-component.json',
      },
    ],
  },
  {
    id: 'action-bar',
    label: 'action-bar',
    tokens: [
      {
        token: 'action-bar-border-color',
        resolved: 'light {transparent-white-25} / dark {gray-400}',
      },
    ],
  },
]

const OVERRIDE_CODE = `.my-scope {
  --spectrum-avatar-border-color: var(--spectrum-red-900);
}`

export function TokenComponentsSection(_props: {
  system: SystemWithColors
  rosterEntry?: RosterEntry
}) {
  const [selected, setSelected] = useState(COMPONENTS[0]!.id)
  const active = COMPONENTS.find((c) => c.id === selected) ?? COMPONENTS[0]!

  return (
    <Section
      title="Component-Token Coverage"
      kicker="Design Tokens"
      intro="Below the semantic layer sits a third tier: component tokens, scoped to a single component and named for exactly what they do — menu-item-background-color-hover, not a borrowed alias. Coverage is deliberately uneven: some components get a full bespoke set, others compose entirely from tokens they don't own."
    >
      <Block title="Token volume by file">
        <StatGrid>
          <Stat value="73" label="color-component.json" sub="color tokens" />
          <Stat
            value="1,010"
            label="layout-component.json"
            sub="439 active / 571 deprecated"
          />
          <Stat value="79" label="icons.json" sub="icon tokens" />
          <Stat
            value="24"
            label="components"
            sub="with dedicated color tokens"
          />
        </StatGrid>
        <Note>
          layout-component.json carries a long deprecated tail — more than half
          its entries are renamed-and-retired rather than in active use.
        </Note>
      </Block>

      <Block
        title="Component token inspector"
        description="Pick a component to see the example tokens it owns and what they resolve to."
      >
        <Playground
          center={false}
          controls={
            <Choice
              options={COMPONENTS.map((c) => ({ value: c.id, label: c.label }))}
              value={selected}
              onChange={setSelected}
            />
          }
        >
          <div className="flex w-full flex-col gap-2">
            <div className="text-xs font-medium tracking-wide text-fg-muted uppercase">
              {active.label} — {active.tokens.length} example token
              {active.tokens.length > 1 ? 's' : ''}
            </div>
            <div className="flex flex-col divide-y divide-border rounded-lg border">
              {active.tokens.map((t) => (
                <div
                  key={t.token}
                  className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <code className="font-mono text-sm text-fg">{t.token}</code>
                  <code className="font-mono text-xs text-fg-muted tabular-nums">
                    {'-> '}
                    {t.resolved}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </Playground>
        <Note>
          Components with dedicated color tokens: action-bar, avatar, bar-panel,
          card, coach-indicator, coach-mark, color-area, color-handle,
          color-loupe, color-slider, color-wheel, drop-zone,
          floating-action-button, menu-item, opacity-checkerboard, popover,
          select-box, stack-item, standard-panel, swatch, swatch-group, table,
          thumbnail, tree-view.
        </Note>
      </Block>

      <Block
        title="Coverage is selective, not universal"
        description="Badge has zero entries in color-component.json — every visual state comes from semantic and alias tokens it shares with the rest of the system."
      >
        <div className="rounded-xl border bg-muted/30 p-5">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-3xl font-semibold text-fg-accent tabular-nums">
              0
            </span>
            <span className="text-sm text-fg-muted">
              component tokens for badge
            </span>
          </div>
          <p className="mt-2 text-sm text-fg-muted">
            No badge-* token appears in color-component.json. Its background,
            border, and text colors resolve entirely through semantic tokens —
            the same ones other components reference — rather than a bespoke
            badge-background-color. Bespoke tokens exist where a component needs
            a rule the semantic layer doesn't express (a hover state, a
            selection background); where semantic tokens already suffice, no
            component layer is added.
          </p>
        </div>
      </Block>

      <Block
        title="The override contract"
        description="This repository is the data layer — it defines and resolves the custom properties. The API surface it hands to consumers is the resolved custom property itself, redefinable in a scoped selector."
      >
        <CodeBlock code={OVERRIDE_CODE} />
        <Note>
          Redefining --spectrum-avatar-border-color inside a scoped selector is
          the component's public override surface — there is no separate theming
          API in this package; the consuming library's theming API is what
          exposes this cascade point to end users.
        </Note>
      </Block>

      <Block
        title="Deprecation contract"
        description="Retired component tokens don't disappear — they carry a pointer to their replacement."
      >
        <CodeBlock
          code={`{
  "deprecated": true,
  "renamed": "new-token-name"
}`}
        />
        <Note>
          Applies across layout-component.json's 571 deprecated entries: each
          sets deprecated: true and points forward via renamed, rather than
          being deleted outright.
        </Note>
      </Block>

      <Note>
        Source: spectrum-design-data/packages/tokens/src/color-component.json,
        layout-component.json.
      </Note>
    </Section>
  )
}
