'use client'

import { useState } from 'react'

import type { CatalogEntry, SystemWithColors } from '@/data/schema'

import {
  Block,
  CodeBlock,
  Choice,
  Note,
  Playground,
  Section,
  SpecList,
} from '../primitives'

type Stage = 'source' | 'resolved' | 'downstream'

const stages: { value: Stage; label: string }[] = [
  { value: 'source', label: 'Source (flat src)' },
  { value: 'resolved', label: 'Resolved (variables.json)' },
  { value: 'downstream', label: 'Downstream CSS' },
]

const sourceCode = `// tokens/src/color.json (flat, generated from design-data/tokens/*.tokens.json)
{
  "accent-background-color": {
    "sets": {
      "default": { "value": "{blue-900}" },
      "hover": { "value": "{blue-1000}" },
      "down": { "value": "{blue-1100}" }
    }
  }
}`

const resolvedCode = `// dist/json/variables.json (JsonSetsFormatter, outputReferences: true)
{
  "accent-background-color-default": {
    "value": "{blue.900.value}",
    "resolvedValue": "#0d66d0",
    "attributes": { "set": "default" }
  },
  "accent-background-color-hover": {
    "value": "{blue.1000.value}",
    "resolvedValue": "#0b5cc1",
    "attributes": { "set": "hover" }
  }
}`

const downstreamCode = `/* illustrative — as consumed downstream (spectrum-css / spectrum-web-components) */
/* NOT produced by this repo's build — no CSS platform is configured here */
:root {
  --spectrum-accent-background-color-default: #0d66d0;
  --spectrum-accent-background-color-hover: #0b5cc1;
}`

const codeByStage: Record<Stage, { code: string; caption: string }> = {
  source: {
    code: sourceCode,
    caption:
      'Flat src JSON, generated from the cascade source. The "sets" object is the state-variant construct that style-dictionary-sets understands.',
  },
  resolved: {
    code: resolvedCode,
    caption:
      'Style Dictionary output for the "JSON" platform: one flattened key per set, with outputReferences left as aliases plus a resolved value.',
  },
  downstream: {
    code: downstreamCode,
    caption:
      'Not part of this build — CSS custom properties are authored by spectrum-css / spectrum-web-components, which consume variables.json as their own input.',
  },
}

const toolchainRows = [
  {
    label: 'Build engine',
    value: 'Style Dictionary v3',
    note: 'style-dictionary ^3.9.2',
  },
  {
    label: 'Sets plugin',
    value: 'style-dictionary-sets ^2.3.0',
    note: 'understands the "sets" construct (default/hover/down…)',
  },
  {
    label: 'Custom transforms',
    value: 'AttributeSetsTransform, NameKebabTransfom',
    note: 'registered in tasks/buildSpectrumTokens.js',
  },
  {
    label: 'Custom formatters',
    value: 'JsonSetsFormatter, DroverJsonFormatter',
    note: 'both emit JSON — no CSS/iOS/Android formatter exists',
  },
  {
    label: 'Platforms configured',
    value: '2 — "JSON" and "Drover"',
    note: 'dist/json/variables.json + dist/json/drover.json — JSON only',
  },
  {
    label: 'Validation',
    value: 'Rust CLI — design-data validate',
    note: 'JSON-Schema (layer 1) + catalog rules (layer 2); not Style Dictionary',
  },
  { label: 'Task orchestration', value: 'moon (moonrepo)', note: 'moon.yml' },
  {
    label: 'Release',
    value: 'SemVer + Conventional Commits',
    note: 'changesets + semantic-release, auto npm publish on merge to main',
  },
]

export function TokenPipelineSection(_props: {
  system: SystemWithColors
  catalogEntry?: CatalogEntry
}) {
  const [stage, setStage] = useState<Stage>('source')
  const active = codeByStage[stage]

  return (
    <Section
      title="Platform Transform & Output"
      kicker="Design Tokens"
      intro="Spectrum's token source is now a structured “cascade” format that generates the flat JSON Style Dictionary actually builds from. That build is JSON-only today — no CSS, iOS, or Android platform is configured in this repo; those forms are produced by downstream consumers."
    >
      <Block
        title="Pipeline"
        description="Two source layers feed one Style Dictionary build, gated by a separate Rust validator, emitting two JSON platforms."
      >
        <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
          <PipelineNode
            title="Cascade source"
            detail="design-data/tokens/*.tokens.json"
            sub="structured name objects — canonical"
          />
          <PipelineArrow label="generates" />
          <PipelineNode
            title="Flat src"
            detail="packages/tokens/src/*.json"
            sub="8 source files → manifest.json"
          />
          <PipelineArrow label="Style Dictionary" />
          <PipelineNode
            title="Outputs"
            detail="variables.json · drover.json"
            sub="2,469 keys — both JSON"
            accent
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border bg-muted/20 px-4 py-3">
          <span className="text-xs font-medium tracking-wide text-fg-warning uppercase">
            Gate
          </span>
          <p className="text-sm text-fg-muted">
            A roundtrip CI check confirms flat src regenerates identically from
            the cascade source, and a Rust <Code>design-data validate</Code> CLI
            enforces JSON-Schema (layer 1) plus catalog rules (layer 2) —
            independent of the Style Dictionary build itself.
          </p>
        </div>

        <Note className="mt-3">
          No CSS custom property, iOS, or Android platform exists in this build
          config — only "JSON" (variables.json) and "Drover" (drover.json), both
          JSON formatters.
        </Note>
      </Block>

      <Block
        title="One token, every representation"
        description={`Follow accent-background-color through the pipeline stage by stage.`}
        aside={
          <Choice
            options={stages}
            value={stage}
            onChange={setStage}
            label="Pipeline stage"
          />
        }
      >
        <Playground
          label={stages.find((s) => s.value === stage)?.label}
          center={false}
          footer={active.caption}
        >
          <CodeBlock code={active.code} />
        </Playground>
      </Block>

      <Block
        title="Toolchain"
        description="The facts of the current build, independent of any visual token value."
      >
        <SpecList rows={toolchainRows} />
      </Block>

      <Note>
        Source:
        spectrum-design-data/packages/tokens/tasks/buildSpectrumTokens.js,
        package.json, moon.yml
      </Note>
    </Section>
  )
}

function Code({ children }: { children: string }) {
  return (
    <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.8125rem] text-fg">
      {children}
    </code>
  )
}

function PipelineNode({
  title,
  detail,
  sub,
  accent = false,
}: {
  title: string
  detail: string
  sub: string
  accent?: boolean
}) {
  return (
    <div
      className={`flex-1 rounded-xl border p-4 ${accent ? 'bg-accent-muted' : 'bg-card'}`}
    >
      <p className="text-xs font-medium tracking-wide text-fg-muted uppercase">
        {title}
      </p>
      <p className="mt-1.5 font-mono text-sm text-fg">{detail}</p>
      <p className="mt-1 text-xs text-fg-muted">{sub}</p>
    </div>
  )
}

function PipelineArrow({ label }: { label: string }) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-1 py-1 md:py-0">
      <span className="text-[11px] font-medium tracking-wide text-fg-muted uppercase">
        {label}
      </span>
      <svg
        className="size-4 rotate-90 text-fg-muted md:rotate-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14" />
        <path d="M13 6l6 6-6 6" />
      </svg>
    </div>
  )
}
