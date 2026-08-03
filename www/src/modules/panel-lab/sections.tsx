'use client'

/* Panel Lab sections — each schema section rendered in the grouped-row
   language, composed by the frames in variants/. The Color section lives in
   color-ideal.tsx (engine-true, its own state slice). */

import { useState } from 'react'
import type { CSSProperties } from 'react'
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

import { cn } from '@/registry/lib/utils'
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
  CORNER_SHAPE_OPTIONS,
  CURSOR_OPTIONS,
  DENSITY_OPTIONS,
  ICON_LIBRARY_OPTIONS,
  ICON_WEIGHT_OPTIONS,
  SHADOW_OPTIONS,
  SHAPE_CHARACTERS,
  SHAPE_ROLES,
  SHAPE_RUNGS,
} from './data'
import type { Lab, ShapeRoleKey } from './data'
import {
  ClusterHeader,
  DetailRow,
  FilterRow,
  SegmentedControlRow,
  TypeSpecimen,
} from './patterns'

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

/* corner-shape is progressive enhancement — unsupported browsers render round. */
const cornerShapeStyle = (shape: string): CSSProperties =>
  shape === 'round' ? {} : ({ cornerShape: shape } as CSSProperties)

/* --- Shape roles (the shadcn-study model: base scales, roles shape) --- */

const rungIndex = (id: string) => SHAPE_RUNGS.findIndex((r) => r.id === id)

/** A role's ratio of the base. Items on 'auto' ride one rung below Surfaces —
 *  the invariant every rounded shadcn style follows. */
function roleRatio(state: Lab['state'], key: ShapeRoleKey): number {
  const id = state[key]
  if (id === 'auto') {
    const below = Math.max(0, rungIndex(state.roleSurface) - 1)
    return SHAPE_RUNGS[below]?.ratio ?? 0
  }
  return SHAPE_RUNGS[rungIndex(id)]?.ratio ?? 1
}

function rolePxLabel(px: number, ratio: number): string {
  if (ratio === Infinity) return 'pill'
  return `${Math.round(px * ratio * 10) / 10}px`
}

/* Preview geometry per role: nested arcs sharing one origin, controls boldest. */
const ROLE_ARCS: Record<
  ShapeRoleKey,
  { size: number; arc: string; dot: string }
> = {
  rolePanel: { size: 64, arc: 'border-fg/25', dot: 'bg-fg/25' },
  roleSurface: { size: 50, arc: 'border-fg/40', dot: 'bg-fg/40' },
  roleControl: { size: 36, arc: 'border-fg/80', dot: 'bg-fg/80' },
  roleItem: { size: 22, arc: 'border-fg/55', dot: 'bg-fg/55' },
}

function CornerPreview({ lab }: { lab: Lab }) {
  const { state } = lab
  return (
    <div className="flex items-center gap-5 px-4 py-1.5">
      <div className="relative size-16 shrink-0">
        {SHAPE_ROLES.map(({ key }) => {
          const { size, arc } = ROLE_ARCS[key]
          const ratio = roleRatio(state, key)
          const radius =
            ratio === Infinity ? size : Math.min(state.radiusPx * ratio, size)
          return (
            <div
              key={key}
              className={cn('absolute top-0 left-0 border-t-2 border-l-2', arc)}
              style={{
                width: size,
                height: size,
                borderTopLeftRadius: radius,
                ...cornerShapeStyle(state.cornerShape),
              }}
            />
          )
        })}
      </div>
      <div className="flex flex-1 flex-col gap-1 text-xs text-fg-muted">
        {SHAPE_ROLES.map(({ key, label, example }) => (
          <span key={key} className="flex items-baseline gap-2">
            <span
              className={cn(
                'size-1.5 shrink-0 self-center rounded-full',
                ROLE_ARCS[key].dot,
              )}
            />
            <span>{label}</span>
            <span className="flex-1 truncate text-[10px] text-fg-muted/70">
              {example}
            </span>
            <span className="font-mono text-fg tabular-nums">
              {rolePxLabel(state.radiusPx, roleRatio(state, key))}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

/** Mini specimen for a character card: its surface + control corners nested,
 *  echoing the section's corner preview. */
function CharacterGlyph({ vector }: { vector: Record<ShapeRoleKey, string> }) {
  const arc = (id: string, size: number) => {
    const ratio = SHAPE_RUNGS[rungIndex(id)]?.ratio ?? 1
    return ratio === Infinity ? size : Math.min(ratio * 8, size)
  }
  return (
    <div className="relative size-6">
      <div
        className="absolute top-0 left-0 size-6 border-t-2 border-l-2 border-fg/40"
        style={{ borderTopLeftRadius: arc(vector.roleSurface, 24) }}
      />
      <div
        className="absolute top-0 left-0 size-3.5 border-t-2 border-l-2 border-fg/80"
        style={{ borderTopLeftRadius: arc(vector.roleControl, 14) }}
      />
    </div>
  )
}

const CHARACTER_OPTIONS = SHAPE_CHARACTERS.map((character) => ({
  id: character.id,
  label: character.label,
  preview: <CharacterGlyph vector={character.vector} />,
}))

/** The character whose vector matches the current roles, if any. */
function activeCharacter(state: Lab['state']): string {
  const match = SHAPE_CHARACTERS.find((character) =>
    SHAPE_ROLES.every(({ key }) => character.vector[key] === state[key]),
  )
  return match?.id ?? ''
}

/* v2: both radius levers from the shadcn study. The base slider scales the
   whole system (--radius); Character retargets the four radius roles — the
   rung vector where a style's identity actually lives. Fine-tune exposes the
   roles directly; corner shape is its own axis. Density lives in Space. */
export function ShapeSectionBodyV2({ lab }: { lab: Lab }) {
  const { state, set } = lab
  const autoRatio =
    SHAPE_RUNGS[Math.max(0, rungIndex(state.roleSurface) - 1)]?.ratio ?? 0
  const rungOptions = (allowAuto: boolean) => [
    ...(allowAuto
      ? [
          {
            value: 'auto',
            label: `Auto · ${rolePxLabel(state.radiusPx, autoRatio)}`,
          },
        ]
      : []),
    ...SHAPE_RUNGS.map(({ id, label, ratio }) => ({
      value: id,
      label: `${label} · ${rolePxLabel(state.radiusPx, ratio)}`,
    })),
  ]
  return (
    <>
      <CornerPreview lab={lab} />
      <div className="flex flex-col gap-1.5">
        {/* Self-demo: the row's own corners wear the value, 1:1. */}
        <SliderRow
          label="Radius"
          value={state.radiusPx}
          onChange={set('radiusPx')}
          minValue={0}
          maxValue={16}
          step={0.5}
          ticks={[4, 8, 10, 12]}
          format={(v) => `${v}px`}
          trackStyle={{
            borderRadius: `${state.radiusPx}px`,
            ...cornerShapeStyle(state.cornerShape),
          }}
        />
        <StyleGridRow
          label="Character"
          value={activeCharacter(state)}
          onChange={(id) => {
            const character = SHAPE_CHARACTERS.find((c) => c.id === id)
            if (!character) return
            for (const { key } of SHAPE_ROLES) set(key)(character.vector[key])
          }}
          options={CHARACTER_OPTIONS}
          columns={3}
        />
        <DetailRow
          label="Roles"
          summary={SHAPE_ROLES.map(({ key }) =>
            rolePxLabel(state.radiusPx, roleRatio(state, key)),
          ).join(' · ')}
        >
          {SHAPE_ROLES.map(({ key, label }) => (
            <SelectRow
              key={key}
              label={label}
              value={state[key]}
              onChange={set(key)}
              options={rungOptions(key === 'roleItem')}
            />
          ))}
        </DetailRow>
        <SegmentedControlRow
          label="Corners"
          value={state.cornerShape}
          onChange={set('cornerShape')}
          options={CORNER_SHAPE_OPTIONS}
        />
      </div>
    </>
  )
}

export function SpaceSectionBody({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <SegmentedControlRow
        label="Density"
        value={state.density}
        onChange={set('density')}
        options={DENSITY_OPTIONS}
      />
    </ControlGroup>
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
