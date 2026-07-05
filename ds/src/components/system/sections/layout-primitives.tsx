'use client'

import { type ReactNode, useState } from 'react'

import { cn } from '@/lib/utils'
import type { CatalogEntry, SystemWithColors } from '@/data/schema'

import {
  Block,
  Choice,
  CodeBlock,
  Note,
  Playground,
  Section,
} from '../primitives'

const GAPS = [
  { token: 'size-100', px: 8 },
  { token: 'size-200', px: 12 },
  { token: 'size-300', px: 16 },
  { token: 'size-400', px: 24 },
  { token: 'size-500', px: 32 },
]

const gapOptions = GAPS.map((gap) => ({
  value: String(gap.px),
  label: gap.token,
}))
const tokenFor = (px: number) =>
  GAPS.find((gap) => gap.px === px)?.token ?? `${px}px`

function Tile({
  children,
  className,
}: {
  children?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-md bg-accent-muted px-3 py-2 text-xs font-medium text-fg-accent',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function LayoutPrimitivesSection(_props: {
  system: SystemWithColors
  catalogEntry?: CatalogEntry
}) {
  const [stackGap, setStackGap] = useState('16')
  const [clusterGap, setClusterGap] = useState('12')
  const [gridGap, setGridGap] = useState('16')
  const [gridCols, setGridCols] = useState('3')
  const [pad, setPad] = useState('24')

  return (
    <Section
      title="Layout Primitives"
      kicker="Components & Patterns"
      intro="React Spectrum ships layout as real components — Flex, Grid, and View. They map to the Stack / Cluster / Grid / Box mental model, and every gap and pad is a dimension token from the spacing scale, which is what keeps layouts consistent across an app."
    >
      <Block
        title="Stack — vertical rhythm"
        description="Flex with direction=column. Children flow top-to-bottom; the gap is a dimension token, never a magic number."
      >
        <Playground
          center={false}
          label="Flex direction=column"
          controls={
            <Choice
              label="gap"
              options={gapOptions}
              value={stackGap}
              onChange={setStackGap}
            />
          }
        >
          <div className="flex w-56 flex-col" style={{ gap: Number(stackGap) }}>
            {['Header', 'Body', 'Footer', 'Actions'].map((label) => (
              <Tile key={label}>{label}</Tile>
            ))}
          </div>
        </Playground>
        <CodeBlock
          className="mt-3"
          code={`<Flex direction="column" gap="${tokenFor(Number(stackGap))}">`}
        />
      </Block>

      <Block
        title="Cluster — wrapping row"
        description="Flex with direction=row and wrap. A horizontal group that reflows onto multiple lines; the same token drives row and column gaps."
      >
        <Playground
          center={false}
          label="Flex direction=row wrap"
          controls={
            <Choice
              label="gap"
              options={gapOptions}
              value={clusterGap}
              onChange={setClusterGap}
            />
          }
        >
          <div
            className="flex max-w-md flex-wrap"
            style={{ gap: Number(clusterGap) }}
          >
            {[
              'All',
              'Photos',
              'Videos',
              'Docs',
              'Audio',
              'Archives',
              'Shared',
              'Trash',
            ].map((label) => (
              <Tile key={label}>{label}</Tile>
            ))}
          </div>
        </Playground>
        <CodeBlock
          className="mt-3"
          code={`<Flex direction="row" wrap gap="${tokenFor(Number(clusterGap))}">`}
        />
      </Block>

      <Block
        title="Grid — two-dimensional"
        description="Grid lays children on named areas or explicit tracks. Column count and gap are set with tokens and adapt per breakpoint via the responsive object syntax."
      >
        <Playground
          center={false}
          label="Grid columns"
          controls={
            <div className="flex flex-wrap items-center gap-2">
              <Choice
                label="cols"
                options={[
                  { value: '2', label: '2' },
                  { value: '3', label: '3' },
                  { value: '4', label: '4' },
                ]}
                value={gridCols}
                onChange={setGridCols}
              />
              <Choice
                label="gap"
                options={gapOptions}
                value={gridGap}
                onChange={setGridGap}
              />
            </div>
          }
        >
          <div
            className="grid w-full"
            style={{
              gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
              gap: Number(gridGap),
            }}
          >
            {Array.from({ length: Number(gridCols) * 2 }, (_, i) => (
              <Tile key={i} className="py-4">
                {i + 1}
              </Tile>
            ))}
          </div>
        </Playground>
        <CodeBlock
          className="mt-3"
          code={`<Grid columns={${gridCols}} gap="${tokenFor(Number(gridGap))}">`}
        />
        <Note className="mt-3">
          Named areas are the other Grid mode — a template like{' '}
          <span className="font-mono">
            ['header header', 'sidebar content']
          </span>{' '}
          where children opt in with their own{' '}
          <span className="font-mono">gridArea</span>.
        </Note>
      </Block>

      <Block
        title="Box — the styled container"
        description="View is the base primitive Flex and Grid extend. Its padding, margin, background, and border all accept dimension and color tokens."
      >
        <Playground
          center={false}
          label="View padding"
          controls={
            <Choice
              label="padding"
              options={gapOptions}
              value={pad}
              onChange={setPad}
            />
          }
        >
          <div
            className="rounded-lg border border-dashed border-border-hover bg-muted/30"
            style={{ padding: Number(pad) }}
          >
            <Tile className="bg-accent text-fg-on-accent">content</Tile>
          </div>
        </Playground>
        <CodeBlock
          className="mt-3"
          code={`<View padding="${tokenFor(Number(pad))}" backgroundColor="gray-100" borderWidth="thin">`}
        />
      </Block>

      <Note>
        Stack = Flex direction=column · Cluster = Flex direction=row wrap · Grid
        = Grid · Box = View. Source: react-spectrum.adobe.com (Flex, Grid,
        View).
      </Note>
    </Section>
  )
}
