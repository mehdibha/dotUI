'use client'

/* Panel Lab sections — the baseline rendering of each schema section in the
   grouped-row language. Panel explorations may compose these directly or
   rebuild a section from data.tsx when their design calls for it. */

import { useState } from 'react'
import {
  BellIcon,
  CalendarIcon,
  CameraIcon,
  CloudIcon,
  FolderIcon,
  HeartIcon,
  HomeIcon,
  LockIcon,
  MailIcon,
  SearchIcon,
  SettingsIcon,
  StarIcon,
  UserIcon,
} from 'lucide-react'
import { DisclosureGroup } from 'react-aria-components'

import {
  ColorPickerRow,
  ControlGroup,
  FontPickerRow,
  GroupCaption,
  MiniSegmented,
  ParamRow,
  SectionHeader,
  SegmentedRow,
  SelectRow,
  SliderRow,
  StyleGridRow,
} from '@/modules/control-lab/rows'

import {
  CHROMA_OPTIONS,
  CLUSTERS,
  COLOR_KEYS,
  COMPONENT_KEYS,
  CONTRAST_OPTIONS,
  CURSOR_OPTIONS,
  DEFAULTS,
  DENSITY_OPTIONS,
  EFFECT_KEYS,
  GRAY_TINT_OPTIONS,
  ICON_KEYS,
  ICON_LIBRARY_OPTIONS,
  ICON_WEIGHT_OPTIONS,
  PRIMARY_OPTIONS,
  SHADOW_OPTIONS,
  SHAPE_KEYS,
  TYPE_KEYS,
} from './data'
import type { Lab } from './data'
import {
  ClusterHeader,
  DetailRow,
  FilterRow,
  MiniColorRow,
  RampStrip,
  SwatchDots,
  TypeSpecimen,
} from './patterns'

export function ColorSectionBody({ lab }: { lab: Lab }) {
  const { state, set } = lab
  const semanticModified = (
    ['success', 'warning', 'danger', 'info', 'selection'] as const
  ).some((k) => state[k] !== DEFAULTS[k])
  const engineModified =
    state.contrast !== DEFAULTS.contrast || state.chroma !== DEFAULTS.chroma
  return (
    <>
      <RampStrip seeds={[state.brand, state.gray]} />
      <ControlGroup>
        <ColorPickerRow
          label="Brand"
          value={state.brand}
          onChange={set('brand')}
        />
        <ColorPickerRow
          label="Gray"
          value={state.gray}
          onChange={set('gray')}
        />
        <SegmentedRow
          label="Gray tint"
          value={state.grayTint}
          onChange={set('grayTint')}
          options={GRAY_TINT_OPTIONS}
        />
        <SegmentedRow
          label="Primary"
          value={state.primary}
          onChange={set('primary')}
          options={PRIMARY_OPTIONS}
        />
      </ControlGroup>
      <GroupCaption>
        Two seeds generate every ramp. Primary picks which one solid buttons
        wear.
      </GroupCaption>
      <DetailRow
        label="Semantic colors"
        summary={
          <SwatchDots
            colors={[state.success, state.warning, state.danger, state.info]}
          />
        }
      >
        <MiniColorRow
          label="Success"
          value={state.success}
          onChange={set('success')}
        />
        <MiniColorRow
          label="Warning"
          value={state.warning}
          onChange={set('warning')}
        />
        <MiniColorRow
          label="Danger"
          value={state.danger}
          onChange={set('danger')}
        />
        <MiniColorRow label="Info" value={state.info} onChange={set('info')} />
        <MiniColorRow
          label="Selection"
          value={state.selection}
          onChange={set('selection')}
        />
      </DetailRow>
      <DetailRow
        label="Fine-tune"
        summary={engineModified || semanticModified ? 'Custom' : 'Default'}
      >
        <ParamRow label="Contrast">
          <MiniSegmented
            ariaLabel="Contrast"
            value={state.contrast}
            onChange={set('contrast')}
            options={CONTRAST_OPTIONS}
          />
        </ParamRow>
        <ParamRow label="Chroma">
          <MiniSegmented
            ariaLabel="Chroma"
            value={state.chroma}
            onChange={set('chroma')}
            options={CHROMA_OPTIONS}
          />
        </ParamRow>
        <div className="px-2 pt-1.5 pb-2">
          <RampStrip
            seeds={[
              state.brand,
              state.gray,
              state.success,
              state.warning,
              state.danger,
              state.info,
            ]}
          />
        </div>
      </DetailRow>
    </>
  )
}

export function TypographySectionBody({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <>
      <TypeSpecimen heading={state.headingFont} body={state.bodyFont} />
      <ControlGroup>
        <FontPickerRow
          label="Heading"
          categories={['sans-serif', 'serif', 'display', 'handwriting']}
          selectedKey={state.headingFont}
          onChange={set('headingFont')}
        />
        <FontPickerRow
          label="Body"
          categories={['sans-serif', 'serif']}
          selectedKey={state.bodyFont}
          onChange={set('bodyFont')}
        />
        <FontPickerRow
          label="Mono"
          categories={['mono']}
          selectedKey={state.monoFont}
          onChange={set('monoFont')}
        />
      </ControlGroup>
    </>
  )
}

const STRIP_ICONS = [
  HomeIcon,
  SearchIcon,
  HeartIcon,
  StarIcon,
  BellIcon,
  MailIcon,
  CalendarIcon,
  SettingsIcon,
  UserIcon,
  FolderIcon,
  CameraIcon,
  CloudIcon,
  LockIcon,
]

/** Live strip of the icon set at the chosen stroke — the section's specimen. */
export function IconStrip({ stroke }: { stroke: number }) {
  return (
    <div
      data-row=""
      className="flex h-11 w-full items-center gap-3 overflow-hidden rounded-xl bg-muted [mask-image:linear-gradient(to_right,black_75%,transparent)] px-4 text-fg-muted"
    >
      {STRIP_ICONS.map((Icon, i) => (
        <Icon key={i} className="size-4 shrink-0" strokeWidth={stroke} />
      ))}
    </div>
  )
}

export function IconsSectionBody({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <>
      <ControlGroup>
        <IconStrip stroke={state.iconStroke} />
        <SelectRow
          label="Library"
          value={state.iconLibrary}
          onChange={set('iconLibrary')}
          options={ICON_LIBRARY_OPTIONS}
        />
        <SliderRow
          label="Stroke"
          value={state.iconStroke}
          onChange={set('iconStroke')}
          minValue={1}
          maxValue={3}
          step={0.25}
          format={(v) => v.toFixed(2)}
        />
        {state.iconLibrary === 'phosphor' && (
          <SelectRow
            label="Weight"
            value={state.iconWeight}
            onChange={set('iconWeight')}
            options={ICON_WEIGHT_OPTIONS}
          />
        )}
      </ControlGroup>
    </>
  )
}

export function ShapeSectionBody({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <>
      <div className="flex flex-col gap-1.5">
        {/* Self-demo: the row's own corners round with the value. */}
        <SliderRow
          label="Radius"
          value={state.radius}
          onChange={set('radius')}
          minValue={0}
          maxValue={2}
          step={0.05}
          format={(v) => `${v.toFixed(2)}×`}
          trackStyle={{ borderRadius: `${4 + state.radius * 10}px` }}
        />
        <SegmentedRow
          label="Density"
          value={state.density}
          onChange={set('density')}
          options={DENSITY_OPTIONS}
        />
      </div>
    </>
  )
}

export function EffectsSectionBody({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <>
      <StyleGridRow
        label="Shadows"
        value={state.shadows}
        onChange={set('shadows')}
        options={SHADOW_OPTIONS}
        columns={4}
      />
      <GroupCaption>
        One family sets the card, control and overlay shadows together.
      </GroupCaption>
      <ControlGroup>
        <SelectRow
          label="Cursor"
          value={state.cursorInteractive}
          onChange={set('cursorInteractive')}
          options={CURSOR_OPTIONS}
        />
        <SelectRow
          label="Disabled cursor"
          value={state.cursorDisabled}
          onChange={set('cursorDisabled')}
          options={CURSOR_OPTIONS}
        />
      </ControlGroup>
    </>
  )
}

export function ComponentsSectionBody({ lab }: { lab: Lab }) {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const clusters = CLUSTERS.map((cluster) => ({
    ...cluster,
    items: cluster.items.filter((item) => item.name.toLowerCase().includes(q)),
  })).filter((cluster) => cluster.items.length > 0)

  return (
    <>
      <FilterRow
        value={query}
        onChange={setQuery}
        placeholder="Filter components..."
      />
      <DisclosureGroup className="flex flex-col gap-1.5">
        {clusters.map((cluster) => (
          <div key={cluster.label} className="flex flex-col gap-1.5">
            <ClusterHeader label={cluster.label} />
            {cluster.items.map((item) => (
              <div key={item.name}>{item.render(lab)}</div>
            ))}
            {cluster.caption && <GroupCaption>{cluster.caption}</GroupCaption>}
          </div>
        ))}
        {clusters.length === 0 && (
          <p className="px-4 py-6 text-center text-xs text-fg-muted">
            No components match “{query}”.
          </p>
        )}
      </DisclosureGroup>
      <GroupCaption>
        A representative slice — the real panel lists every component with
        styles, in these clusters.
      </GroupCaption>
    </>
  )
}

/* Composed sections: baseline header + body. Frames that bring their own
   chapter chrome (e.g. the current-/create cards frame) use the bodies. */

export function ColorSection({ lab }: { lab: Lab }) {
  return (
    <>
      <SectionHeader label="Color" {...lab.section(COLOR_KEYS)} />
      <ColorSectionBody lab={lab} />
    </>
  )
}

export function TypographySection({ lab }: { lab: Lab }) {
  return (
    <>
      <SectionHeader label="Typography" {...lab.section(TYPE_KEYS)} />
      <TypographySectionBody lab={lab} />
    </>
  )
}

export function IconsSection({ lab }: { lab: Lab }) {
  return (
    <>
      <SectionHeader label="Icons" {...lab.section(ICON_KEYS)} />
      <IconsSectionBody lab={lab} />
    </>
  )
}

export function ShapeSection({ lab }: { lab: Lab }) {
  return (
    <>
      <SectionHeader label="Shape" {...lab.section(SHAPE_KEYS)} />
      <ShapeSectionBody lab={lab} />
    </>
  )
}

export function EffectsSection({ lab }: { lab: Lab }) {
  return (
    <>
      <SectionHeader label="Effects" {...lab.section(EFFECT_KEYS)} />
      <EffectsSectionBody lab={lab} />
    </>
  )
}

export function ComponentsSection({ lab }: { lab: Lab }) {
  return (
    <>
      <SectionHeader label="Components" {...lab.section(COMPONENT_KEYS)} />
      <ComponentsSectionBody lab={lab} />
    </>
  )
}
