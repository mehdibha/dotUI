'use client'

/* Panel Lab sections — each schema section rendered in the grouped-row
   language, composed by the frames in variants/. The Color section lives in
   color-ideal.tsx (engine-true, its own state slice). */

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
  ControlGroup,
  FontPickerRow,
  GroupCaption,
  SelectRow,
  SliderRow,
  StyleGridRow,
} from '@/modules/control-lab/rows'

import {
  CLUSTERS,
  CURSOR_OPTIONS,
  DENSITY_OPTIONS,
  ICON_LIBRARY_OPTIONS,
  ICON_WEIGHT_OPTIONS,
  SHADOW_OPTIONS,
} from './data'
import type { Lab } from './data'
import {
  ClusterHeader,
  FilterRow,
  SegmentedControlRow,
  TypeSpecimen,
} from './patterns'

export function TypographySectionBody({ lab }: { lab: Lab }) {
  const { state, set } = lab
  // '' heading = Auto (follows body); resolve so v1 renders unchanged.
  const heading = state.headingFont || state.bodyFont
  return (
    <>
      <TypeSpecimen heading={heading} body={state.bodyFont} />
      <ControlGroup>
        <FontPickerRow
          label="Heading"
          categories={['sans-serif', 'serif', 'display', 'handwriting']}
          selectedKey={heading}
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
        <SegmentedControlRow
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
