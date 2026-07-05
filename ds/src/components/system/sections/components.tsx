'use client'

import { useState } from 'react'

import type { CatalogEntry, SystemWithColors } from '@/data/schema'
import { Badge } from '@/ui/badge'
import { Button } from '@/ui/button'

import { Choice } from '../primitives/controls'
import { Playground } from '../primitives/playground'
import { Note, Section, Block } from '../primitives/section'
import { SpecList } from '../primitives/spec'

const catalog: { group: string; items: string[] }[] = [
  {
    group: 'Actions',
    items: [
      'Button',
      'ActionButton',
      'ToggleButton',
      'ToggleButtonGroup',
      'ActionButtonGroup',
      'ActionMenu',
      'ButtonGroup',
      'LinkButton',
    ],
  },
  {
    group: 'Forms',
    items: [
      'TextField',
      'TextArea',
      'NumberField',
      'SearchField',
      'Checkbox',
      'CheckboxGroup',
      'RadioGroup',
      'Switch',
      'Slider',
      'RangeSlider',
      'Picker',
      'ComboBox',
      'DateField',
      'DatePicker',
      'DateRangePicker',
      'TimeField',
      'SegmentedControl',
      'Form',
    ],
  },
  {
    group: 'Collections',
    items: [
      'TableView',
      'ListView',
      'CardView',
      'Card',
      'Menu',
      'Tabs',
      'TreeView',
      'TagGroup',
      'Accordion',
      'Disclosure',
    ],
  },
  {
    group: 'Navigation',
    items: ['Breadcrumbs', 'Link', 'LinkButton'],
  },
  {
    group: 'Status',
    items: [
      'Badge',
      'ProgressBar',
      'ProgressCircle',
      'Meter',
      'StatusLight',
      'InlineAlert',
      'Toast',
      'Skeleton',
    ],
  },
  {
    group: 'Overlays',
    items: ['Dialog', 'Popover', 'Tooltip', 'ContextualHelp', 'ActionBar'],
  },
  {
    group: 'Content & Media',
    items: [
      'Avatar',
      'AvatarGroup',
      'Image',
      'IllustratedMessage',
      'Divider',
      'Icon',
      'Illustration',
    ],
  },
  {
    group: 'Color',
    items: [
      'ColorArea',
      'ColorField',
      'ColorSlider',
      'ColorSwatch',
      'ColorSwatchPicker',
      'ColorWheel',
    ],
  },
  {
    group: 'Utility',
    items: ['DropZone', 'SelectBoxGroup', 'Provider'],
  },
]

const totalCount = catalog.reduce((sum, g) => sum + g.items.length, 0)

type S2Variant = 'accent' | 'primary' | 'secondary' | 'negative'
type S2Size = 'S' | 'M' | 'L' | 'XL'
type Treatment = 'fill' | 'outline'

const variantOptions: { value: S2Variant; label: string }[] = [
  { value: 'accent', label: 'Accent' },
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'negative', label: 'Negative' },
]

const sizeOptions: { value: S2Size; label: string }[] = [
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
]

const dsVariantMap: Record<
  S2Variant,
  'primary' | 'default' | 'quiet' | 'danger'
> = {
  accent: 'primary',
  primary: 'default',
  secondary: 'quiet',
  negative: 'danger',
}

const dsSizeMap: Record<S2Size, 'xs' | 'sm' | 'md' | 'lg'> = {
  S: 'xs',
  M: 'sm',
  L: 'md',
  XL: 'lg',
}

export function ComponentsSection(_props: {
  system: SystemWithColors
  catalogEntry?: CatalogEntry
}) {
  const [variant, setVariant] = useState<S2Variant>('accent')
  const [size, setSize] = useState<S2Size>('M')
  const [treatment, setTreatment] = useState<Treatment>('fill')

  const outlineAvailable = variant === 'secondary'
  const effectiveTreatment = outlineAvailable ? treatment : 'fill'

  return (
    <Section
      title="Component Library & Anatomy"
      kicker="Components & Patterns"
      intro="Spectrum 2 ships as a catalog of roughly 50 components across actions, forms, collections, navigation, status, overlays, content, color and utility. Every component composes from the same primitives covered elsewhere in this system — color roles, the type ramp, the radius scale, the size families — so the anatomy rules below (Button's padding math, TextField's slot order) repeat with only the specifics changing."
    >
      <Block
        title="Full catalog"
        description={`${totalCount} components across ${catalog.length} groups, as named in the react-spectrum s2 package.`}
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.map((g) => (
            <div key={g.group} className="flex flex-col gap-2">
              <p className="text-xs font-medium tracking-wide text-fg-muted uppercase">
                {g.group}
                <span className="ml-1.5 text-fg-muted/70 normal-case">
                  ({g.items.length})
                </span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {g.items.map((name) => (
                  <Badge key={name} variant="neutral" appearance="subtle">
                    {name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Block>

      <Block
        title="Button anatomy"
        description="Label, an optional leading or trailing icon, and the container. When a Button carries only an icon, that icon's meaning becomes the accessible name — there is no visible label to fall back on. Container proportions are ratios of height, not fixed px: min-width is 2.25× the control's height, and horizontal padding on each side is half the height."
      >
        <Playground
          surface="grid"
          footer="Proportions shown at M size — the same 2.25× / 0.5× ratios hold at every size step."
        >
          <ButtonAnatomyDiagram />
        </Playground>
      </Block>

      <Block
        title="Live variant × size matrix"
        description="An interactive approximation using ds primitives — not a pixel match. Spectrum's emphasis axis (accent/primary/secondary/negative) is mapped to the closest ds Button variant, and its S/M/L/XL sizes to ds's xs/sm/md/lg."
        aside={
          <Choice
            options={[
              { value: 'fill', label: 'Fill' },
              { value: 'outline', label: 'Outline' },
            ]}
            value={effectiveTreatment}
            onChange={setTreatment}
            label="Treatment"
          />
        }
      >
        <Playground
          label={`${variant} · ${size} · ${effectiveTreatment}`}
          hint={
            !outlineAvailable ? 'outline only applies to secondary' : undefined
          }
          controls={
            <>
              <Choice
                options={variantOptions}
                value={variant}
                onChange={setVariant}
                label="Variant"
              />
              <Choice
                options={sizeOptions}
                value={size}
                onChange={setSize}
                label="Size"
              />
            </>
          }
          footer={`mapped to ds: variant="${dsVariantMap[variant]}" size="${dsSizeMap[size]}"`}
        >
          <Button
            variant={dsVariantMap[variant]}
            size={dsSizeMap[size]}
            className={
              effectiveTreatment === 'outline' ? 'bg-transparent' : undefined
            }
          >
            Continue
          </Button>
        </Playground>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[28rem] border-collapse text-sm">
            <thead>
              <tr className="border-b text-left text-xs font-medium tracking-wide text-fg-muted uppercase">
                <th className="py-2 pr-4">Variant (emphasis)</th>
                <th className="py-2 pr-4">Fill</th>
                <th className="py-2">Outline</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 pr-4 text-sm text-fg">
                  accent (essential)
                </td>
                <td className="py-2 pr-4 font-mono text-xs text-fg-muted">
                  default
                </td>
                <td className="py-2 font-mono text-xs text-fg-muted">—</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 text-sm text-fg">primary (medium)</td>
                <td className="py-2 pr-4 font-mono text-xs text-fg-muted">
                  default
                </td>
                <td className="py-2 font-mono text-xs text-fg-muted">—</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 text-sm text-fg">secondary (low)</td>
                <td className="py-2 pr-4 font-mono text-xs text-fg-muted">
                  default
                </td>
                <td className="py-2 font-mono text-xs text-fg-muted">
                  available
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-sm text-fg">
                  negative (destructive)
                </td>
                <td className="py-2 pr-4 font-mono text-xs text-fg-muted">
                  default
                </td>
                <td className="py-2 font-mono text-xs text-fg-muted">—</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Note className="mt-3">
          Treatment (fill/outline) is an axis independent of emphasis, but
          outline is only offered on secondary — the other three emphases ship
          fill only. static-color (white or black, for buttons sitting on
          colored or photographic backgrounds) is a separate override not
          modeled here.
        </Note>
      </Block>

      <Block
        title="TextField anatomy"
        description="A required label (asterisk when the field is required), the input itself, help text in either neutral or negative tone, an optional validation icon that appears once the value matches the expected format, and an optional character count once a max length is set."
      >
        <Playground
          surface="grid"
          center={false}
          bodyClassName="flex justify-center"
        >
          <TextFieldAnatomyDiagram />
        </Playground>
      </Block>

      <Note>
        Source: react-spectrum.adobe.com/s2, spectrum.adobe.com/page/button,
        spectrum.adobe.com/page/text-field
      </Note>
    </Section>
  )
}

function ButtonAnatomyDiagram() {
  const h = 40
  const minWidth = h * 2.25
  const pad = h / 2
  const containerWidth = minWidth * 2.4

  return (
    <svg
      viewBox="0 0 420 220"
      className="w-full max-w-[420px]"
      role="img"
      aria-label="Button anatomy diagram"
    >
      <rect
        x={90}
        y={70}
        width={containerWidth}
        height={h}
        rx={h / 2}
        className="fill-accent"
      />
      <circle
        cx={112}
        cy={90}
        r={7}
        className="fill-[var(--color-fg-on-accent)] opacity-90"
      />
      <text
        x={132}
        y={95}
        className="fill-[var(--color-fg-on-accent)] text-[13px] font-medium"
      >
        Continue
      </text>

      <line
        x1={90}
        y1={130}
        x2={90}
        y2={150}
        className="stroke-fg-muted"
        strokeWidth={1}
      />
      <line
        x1={90 + containerWidth}
        y1={130}
        x2={90 + containerWidth}
        y2={150}
        className="stroke-fg-muted"
        strokeWidth={1}
      />
      <line
        x1={90}
        y1={140}
        x2={90 + containerWidth}
        y2={140}
        className="stroke-fg-muted"
        strokeWidth={1}
      />
      <text
        x={90 + containerWidth / 2}
        y={158}
        textAnchor="middle"
        className="fill-fg-muted font-mono text-[10px] tabular-nums"
      >
        min-width = 2.25 × height
      </text>

      <line
        x1={90}
        y1={45}
        x2={90 + pad}
        y2={45}
        className="stroke-fg-muted"
        strokeWidth={1}
      />
      <text
        x={90 + pad / 2}
        y={38}
        textAnchor="middle"
        className="fill-fg-muted font-mono text-[10px] tabular-nums"
      >
        0.5h
      </text>

      <text x={100} y={190} className="fill-fg-muted text-[11px]">
        <tspan className="fill-accent font-medium">●</tspan> icon (optional;
        icon-only → label becomes a11y name)
      </text>
      <text x={100} y={206} className="fill-fg-muted text-[11px]">
        label — no punctuation
      </text>
    </svg>
  )
}

function TextFieldAnatomyDiagram() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-1.5 flex items-baseline gap-1">
        <span className="text-sm font-medium text-fg">Email address</span>
        <span className="text-sm text-fg-danger">*</span>
      </div>
      <div className="relative flex h-9 items-center rounded-md border bg-bg px-3">
        <span className="text-sm text-fg">jane@company.com</span>
        <svg
          viewBox="0 0 16 16"
          className="ml-auto size-4 shrink-0 text-fg-success"
          aria-hidden
        >
          <path
            d="M13.5 4.5 6.5 11.5 3 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="mt-1.5 flex items-center justify-between">
        <span className="text-xs text-fg-muted">Matches your work domain.</span>
        <span className="font-mono text-xs text-fg-muted tabular-nums">
          17/64
        </span>
      </div>
      <SpecList
        rows={[
          {
            label: 'label',
            value: 'required',
            note: 'asterisk when required',
          },
          {
            label: 'help text',
            value: 'neutral | negative',
            note: 'tone reflects validation state',
          },
          {
            label: 'validation icon',
            value: 'conditional',
            note: 'shows once input matches expected format',
          },
          {
            label: 'character count',
            value: 'conditional',
            note: 'shows only when max length is set',
          },
        ]}
        className="mt-4"
      />
    </div>
  )
}
