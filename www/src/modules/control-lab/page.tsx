'use client'

/* Control Lab — the catalog of the row language: every primitive in rows.tsx
   on its own, with the variants that matter, read top to bottom. The panel
   itself lives in panel-lab; this is the vocabulary it's assembled from, so
   each entry is the control alone rather than a composed panel.

   Each demo owns its state (local in, callback out) and sits in a
   panel-width card, because that's the only context these rows are designed
   for — a 360px column. */

import { useState } from 'react'
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  MonitorIcon,
  MoonIcon,
  SunIcon,
} from 'lucide-react'

import { DEFAULT_BODY_FAMILY } from '@/lib/fonts'
import { TOCItems, TOCProvider } from '@/modules/docs/toc'
import type { TOCItemType } from '@/modules/docs/toc'
import { InternalHeader } from '@/modules/internal/shell'

import {
  ActionRow,
  ColorPickerRow,
  ComponentRow,
  ControlGroup,
  DrillInRow,
  FontPickerRow,
  GroupCaption,
  MiniSegmented,
  MiniSwitch,
  ParamRow,
  SectionHeader,
  SegmentedRow,
  SelectRow,
  SliderRow,
  StepperRow,
  StyleGridRow,
  SwitchRow,
} from './rows'
import type { SegmentedRowOption, StyleGridOption } from './rows'

/* ------------------------------ Mini specimens ----------------------------- */

function MiniButton({ className }: { className: string }) {
  return (
    <span
      className={`flex h-7 items-center rounded-full px-3.5 text-xs font-medium ${className}`}
    >
      Button
    </span>
  )
}

function MiniInput({ className }: { className: string }) {
  return (
    <span
      className={`flex h-7 w-24 items-center px-2.5 text-xs text-fg-muted ${className}`}
    >
      Value
    </span>
  )
}

const BUTTON_STYLES: StyleGridOption[] = [
  {
    id: 'solid',
    label: 'Solid',
    preview: <MiniButton className="bg-primary text-fg-on-primary" />,
  },
  {
    id: 'soft',
    label: 'Soft',
    preview: <MiniButton className="bg-neutral text-fg-on-neutral" />,
  },
  {
    id: 'outline',
    label: 'Outline',
    preview: <MiniButton className="border border-border-field text-fg" />,
  },
  { id: 'quiet', label: 'Quiet', preview: <MiniButton className="text-fg" /> },
]

const INPUT_STYLES: StyleGridOption[] = [
  {
    id: 'outline',
    label: 'Outline',
    preview: <MiniInput className="rounded-lg border border-border-field" />,
  },
  {
    id: 'line',
    label: 'Line',
    preview: <MiniInput className="border-b border-border-field" />,
  },
  {
    id: 'filled',
    label: 'Filled',
    preview: <MiniInput className="rounded-lg bg-neutral" />,
  },
  {
    id: 'filled-line',
    label: 'Filled line',
    preview: (
      <MiniInput className="rounded-t-lg border-b border-border-field bg-neutral" />
    ),
  },
]

const RADIUS_OPTIONS: SegmentedRowOption[] = [
  { value: 'sharp', label: 'Sharp' },
  { value: 'md', label: 'Md' },
  { value: 'pill', label: 'Pill' },
]

const ALIGN_OPTIONS: SegmentedRowOption[] = [
  { value: 'left', label: <AlignLeftIcon />, ariaLabel: 'Align left' },
  { value: 'center', label: <AlignCenterIcon />, ariaLabel: 'Align center' },
  { value: 'right', label: <AlignRightIcon />, ariaLabel: 'Align right' },
]

const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: <SunIcon /> },
  { value: 'dark', label: 'Dark', icon: <MoonIcon /> },
  { value: 'system', label: 'System', icon: <MonitorIcon /> },
]

const CURSOR_OPTIONS = ['default', 'pointer', 'grab', 'text'].map((c) => ({
  value: c,
  label: c,
}))

/* --------------------------------- Catalog --------------------------------- */

interface Entry {
  id: string
  name: string
  description: string
  variants: { label: string; render: React.ReactNode }[]
}

/** A demo's frame: panel width, panel surface — the only context rows are
 *  designed for. */
function Stage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-[360px] shrink-0 flex-col gap-1.5 rounded-xl border border-border/45 bg-card p-3">
      {children}
    </div>
  )
}

function SelectDemo({ withIcons }: { withIcons?: boolean }) {
  const [value, setValue] = useState(withIcons ? 'system' : 'pointer')
  return (
    <SelectRow
      label={withIcons ? 'Theme' : 'Cursor'}
      value={value}
      onChange={setValue}
      options={withIcons ? THEME_OPTIONS : CURSOR_OPTIONS}
    />
  )
}

function ColorDemo() {
  const [value, setValue] = useState('#635BFF')
  return <ColorPickerRow label="Brand" value={value} onChange={setValue} />
}

function FontDemo({ mono }: { mono?: boolean }) {
  const [value, setValue] = useState(mono ? 'Geist Mono' : DEFAULT_BODY_FAMILY)
  return (
    <FontPickerRow
      label={mono ? 'Mono' : 'Body'}
      categories={mono ? ['mono'] : ['sans-serif', 'serif']}
      selectedKey={value}
      onChange={setValue}
    />
  )
}

function SliderDemo({ selfDemo }: { selfDemo?: boolean }) {
  const [value, setValue] = useState(selfDemo ? 1 : 0.5)
  return selfDemo ? (
    <SliderRow
      label="Radius"
      value={value}
      onChange={setValue}
      minValue={0}
      maxValue={2}
      step={0.05}
      format={(v) => `${v.toFixed(2)}×`}
      trackStyle={{ borderRadius: `${4 + value * 10}px` }}
    />
  ) : (
    <SliderRow label="Opacity" value={value} onChange={setValue} />
  )
}

function SwitchDemo() {
  const [value, setValue] = useState(true)
  return (
    <SwitchRow label="Translucent menus" value={value} onChange={setValue} />
  )
}

function SegmentedDemo({ icons }: { icons?: boolean }) {
  const [value, setValue] = useState(icons ? 'center' : 'md')
  return (
    <SegmentedRow
      label={icons ? 'Align' : 'Radius'}
      value={value}
      onChange={setValue}
      options={icons ? ALIGN_OPTIONS : RADIUS_OPTIONS}
    />
  )
}

function StepperDemo() {
  const [value, setValue] = useState(16)
  return (
    <StepperRow
      label="Base size"
      value={value}
      onChange={setValue}
      minValue={10}
      maxValue={24}
      unit="px"
    />
  )
}

function StyleGridDemo({ columns }: { columns: number }) {
  const [value, setValue] = useState(columns === 4 ? 'solid' : 'outline')
  return (
    <StyleGridRow
      label={columns === 4 ? 'Button' : 'Input'}
      value={value}
      onChange={setValue}
      options={columns === 4 ? BUTTON_STYLES : INPUT_STYLES}
      columns={columns}
    />
  )
}

function ComponentRowDemo({ withParams }: { withParams?: boolean }) {
  const [style, setStyle] = useState('solid')
  const [radius, setRadius] = useState('md')
  const [lift, setLift] = useState(true)
  return (
    // No DisclosureGroup: the group owns expansion state, so `defaultExpanded`
    // on a child is ignored inside one. The panel wraps these in a group so
    // only one opens at a time; a lone demo doesn't need that.
    <>
      <ComponentRow
        name="Button"
        value={style}
        onChange={setStyle}
        options={BUTTON_STYLES}
        columns={4}
        defaultExpanded={withParams}
      >
        {withParams && (
          <>
            <ParamRow label="Radius">
              <MiniSegmented
                ariaLabel="Button radius"
                value={radius}
                onChange={setRadius}
                options={RADIUS_OPTIONS}
              />
            </ParamRow>
            <ParamRow label="Lift on hover">
              <MiniSwitch
                ariaLabel="Lift on hover"
                value={lift}
                onChange={setLift}
              />
            </ParamRow>
          </>
        )}
      </ComponentRow>
    </>
  )
}

function GroupDemo({ caption }: { caption?: boolean }) {
  const [brand, setBrand] = useState('#635BFF')
  const [radius, setRadius] = useState('md')
  const [translucent, setTranslucent] = useState(false)
  return (
    <>
      <ControlGroup>
        <ColorPickerRow label="Brand" value={brand} onChange={setBrand} />
        <SegmentedRow
          label="Radius"
          value={radius}
          onChange={setRadius}
          options={RADIUS_OPTIONS}
        />
        <SwitchRow
          label="Translucent"
          value={translucent}
          onChange={setTranslucent}
        />
      </ControlGroup>
      {caption && (
        <GroupCaption>
          One family sets the card, control and overlay shadows together.
        </GroupCaption>
      )}
    </>
  )
}

function HeaderDemo({ modified }: { modified?: boolean }) {
  const [isModified, setModified] = useState(Boolean(modified))
  const [value, setValue] = useState(modified ? 'pill' : 'md')
  return (
    <>
      <SectionHeader
        label="Shape"
        modified={isModified}
        onReset={() => {
          setModified(false)
          setValue('md')
        }}
      />
      <SegmentedRow
        label="Radius"
        value={value}
        onChange={(next) => {
          setValue(next)
          setModified(true)
        }}
        options={RADIUS_OPTIONS}
      />
    </>
  )
}

function ParamRowDemo() {
  const [radius, setRadius] = useState('md')
  const [on, setOn] = useState(true)
  return (
    <div className="rounded-xl bg-muted py-1">
      <ParamRow label="Radius">
        <MiniSegmented
          ariaLabel="Radius"
          value={radius}
          onChange={setRadius}
          options={RADIUS_OPTIONS}
        />
      </ParamRow>
      <ParamRow label="Shadow">
        <MiniSwitch ariaLabel="Shadow" value={on} onChange={setOn} />
      </ParamRow>
    </div>
  )
}

const ENTRIES: Entry[] = [
  {
    id: 'control-group',
    name: 'ControlGroup',
    description:
      'Fuses adjacent rows into one card: shared surface, hairline separators, only the group’s corners round. Rows opt in by carrying data-row.',
    variants: [
      { label: 'Default', render: <GroupDemo /> },
      { label: 'With caption', render: <GroupDemo caption /> },
    ],
  },
  {
    id: 'section-header',
    name: 'SectionHeader',
    description:
      'A section marker: quiet uppercase label, a dot once the section is touched, and reset on the right. Change the radius below to see it arm.',
    variants: [
      { label: 'Default', render: <HeaderDemo /> },
      { label: 'Modified', render: <HeaderDemo modified /> },
    ],
  },
  {
    id: 'select-row',
    name: 'SelectRow',
    description:
      'A listbox trigger shaped as a settings row: label left, value and chevrons right. Options may carry a glyph, shown in both trigger and list.',
    variants: [
      { label: 'Default', render: <SelectDemo /> },
      { label: 'With icons', render: <SelectDemo withIcons /> },
    ],
  },
  {
    id: 'color-picker-row',
    name: 'ColorPickerRow',
    description:
      'A color seed as a row: hex on the right beside its swatch, opening an area + hue + hex picker anchored to the trigger.',
    variants: [{ label: 'Default', render: <ColorDemo /> }],
  },
  {
    id: 'font-picker-row',
    name: 'FontPickerRow',
    description:
      'A searchable font trigger — the family is set in its own typeface on the right, so the row doubles as a specimen.',
    variants: [
      { label: 'Body', render: <FontDemo /> },
      { label: 'Mono', render: <FontDemo mono /> },
    ],
  },
  {
    id: 'slider-row',
    name: 'SliderRow',
    description:
      'A full-bleed slider: the entire pill is the drag surface, label and value float on top, and the fill reads as row progress.',
    variants: [
      { label: 'Default', render: <SliderDemo /> },
      { label: 'Self-demoing track', render: <SliderDemo selfDemo /> },
    ],
  },
  {
    id: 'switch-row',
    name: 'SwitchRow',
    description: 'A switch shaped as a row: the whole pill toggles.',
    variants: [{ label: 'Default', render: <SwitchDemo /> }],
  },
  {
    id: 'segmented-row',
    name: 'SegmentedRow',
    description:
      'Joined pills for a small, mutually exclusive set. Icon-only segments must carry an ariaLabel.',
    variants: [
      { label: 'Text', render: <SegmentedDemo /> },
      { label: 'Icons', render: <SegmentedDemo icons /> },
    ],
  },
  {
    id: 'stepper-row',
    name: 'StepperRow',
    description:
      'A numeric stepper as a row: label left, − value + right, with an optional unit.',
    variants: [{ label: 'Default', render: <StepperDemo /> }],
  },
  {
    id: 'style-grid-row',
    name: 'StyleGridRow',
    description:
      'A style picker whose body is a grid of selectable cards, each showing the style as a mini specimen — pick by look, not by name.',
    variants: [
      { label: '2 columns', render: <StyleGridDemo columns={2} /> },
      { label: '4 columns', render: <StyleGridDemo columns={4} /> },
    ],
  },
  {
    id: 'component-row',
    name: 'ComponentRow',
    description:
      'A component’s entry in the panel: a collapsed pill showing its current style, expanding in place to the grid plus its params. The answer to “inline grid vs popover” at 20+ components.',
    variants: [
      { label: 'Collapsed', render: <ComponentRowDemo /> },
      {
        label: 'Expanded, with params',
        render: <ComponentRowDemo withParams />,
      },
    ],
  },
  {
    id: 'param-row',
    name: 'ParamRow',
    description:
      'A quiet sub-row for inside an expanded component: label left, a mini control right. Pairs with MiniSegmented and MiniSwitch.',
    variants: [{ label: 'Default', render: <ParamRowDemo /> }],
  },
  {
    id: 'action-row',
    name: 'ActionRow',
    description:
      'A verb as a row: centered label, accent for actions, danger for destructive.',
    variants: [
      {
        label: 'Default',
        render: <ActionRow label="Add color" onPress={() => {}} />,
      },
      {
        label: 'Destructive',
        render: (
          <ActionRow label="Delete system" destructive onPress={() => {}} />
        ),
      },
    ],
  },
  {
    id: 'drill-in-row',
    name: 'DrillInRow',
    description:
      'A navigation row: label left, current value and chevron right, pushing a sub-panel. Depth lives here; the accordion handles breadth.',
    variants: [
      {
        label: 'Default',
        render: (
          <ControlGroup>
            <DrillInRow label="Semantic colors" value="5" onPress={() => {}} />
            <DrillInRow label="Charts" value="Default" onPress={() => {}} />
          </ControlGroup>
        ),
      },
    ],
  },
]

/* ---------------------------------- Page ----------------------------------- */

const TOC_ITEMS: TOCItemType[] = ENTRIES.map((entry) => ({
  url: `#${entry.id}`,
  title: entry.name,
  depth: 2,
}))

export function ControlLab() {
  return (
    <TOCProvider toc={TOC_ITEMS}>
      <div className="flex min-h-svh flex-col gap-8 px-8 py-10">
        <InternalHeader
          crumbs={[
            { label: 'Panel Lab', href: '/internal/panel-lab' },
            { label: 'Control Lab' },
          ]}
          title="Control Lab"
          description="The row language the panel is built from — one visual grammar (compact row, label left, control right) applied to every interaction model. Each control on its own, with the variants that matter."
        />

        <div className="flex items-start gap-12">
          <div className="flex min-w-0 flex-1 flex-col gap-12 pb-16">
            {ENTRIES.map((entry) => (
              <section
                key={entry.id}
                id={entry.id}
                className="flex scroll-mt-10 flex-col gap-4"
              >
                <div className="flex max-w-lg flex-col gap-1">
                  <h2 className="font-mono text-[0.8125rem] font-medium text-fg">
                    {entry.name}
                  </h2>
                  <p className="text-xs/relaxed text-pretty text-fg-muted">
                    {entry.description}
                  </p>
                </div>
                <div className="flex flex-wrap items-start gap-5">
                  {entry.variants.map((variant) => (
                    <div key={variant.label} className="flex flex-col gap-1.5">
                      <span className="text-[11px] text-fg-muted">
                        {variant.label}
                      </span>
                      <Stage>{variant.render}</Stage>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Docs-site TOC: fumadocs' AnchorProvider tracks which section is in
            view, so the active entry highlights as you scroll. */}
          <aside className="sticky top-10 hidden h-fit w-44 shrink-0 flex-col gap-2 lg:flex">
            <span className="text-[11px] font-medium tracking-wider text-fg-muted uppercase">
              On this page
            </span>
            <TOCItems className="gap-0.5 [&_a]:rounded-md [&_a]:px-2 [&_a]:py-1 [&_a]:text-xs [&_a:hover]:bg-muted [&_a:hover]:text-fg" />
          </aside>
        </div>
      </div>
    </TOCProvider>
  )
}
