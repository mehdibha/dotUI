'use client'

/* The ideal Type section — engine-true. Heading mirrors the real
   --font-heading contract ('' = Auto, follows body); the hero is a live
   specimen of every text role (heading, body, UI, code) with tap-to-inspect;
   Pairings offers curated combinations picked by look; Scale and Fine-tune
   expose the rhythm axes (ratio, base size, weight, tracking, leading). */

import { useEffect, useState } from 'react'
import { ChevronsUpDownIcon, RotateCcwIcon } from 'lucide-react'

import { fontStack, loadFontPreview } from '@/lib/fonts'
import type { FontCategory } from '@/lib/fonts'
import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { Select } from '@/registry/ui/select'
import {
  ControlGroup,
  FontListPopover,
  FontPickerRow,
  GroupCaption,
  MiniSegmented,
  ParamRow,
  ROW,
  ROW_LABEL,
  ROW_VALUE,
} from '@/modules/control-lab/rows'
import { useLoadedFamilies } from '@/modules/create/typography'

import { DEFAULTS } from './data'
import type { Lab, LabState } from './data'
import { DetailRow, MiniSliderRow } from './patterns'

/* ---------------------------------- Scale ---------------------------------- */

/** Modular scale: body = base, each heading step one ratio up. */
function stepPx(state: LabState, step: number): number {
  return (
    Math.round(state.typeBase * parseFloat(state.typeRatio) ** step * 10) / 10
  )
}

const RATIO_OPTIONS = [
  { value: '1.125', label: '1.125' },
  { value: '1.2', label: '1.20' },
  { value: '1.25', label: '1.25' },
  { value: '1.333', label: '1.33' },
]

const WEIGHT_OPTIONS = ['400', '500', '600', '700'].map((w) => ({
  value: w,
  label: w,
}))

/* ---------------------------------- Hero ----------------------------------- */

type ProbeId = 'heading' | 'body' | 'ui' | 'code'

/** A specimen line as a tappable probe — tap to read the role's recipe. */
function Probe({
  id,
  probe,
  onProbe,
  className,
  children,
}: {
  id: ProbeId
  probe: ProbeId | null
  onProbe: (id: ProbeId | null) => void
  className?: string
  children: React.ReactNode
}) {
  const selected = probe === id
  return (
    <button
      type="button"
      aria-label={`Inspect ${id}`}
      aria-pressed={selected}
      onClick={() => onProbe(selected ? null : id)}
      className={cn(
        '-mx-1 cursor-interactive rounded-md px-1 text-left focus-reset transition-colors focus-visible:focus-ring',
        selected && 'bg-bg/50',
        className,
      )}
    >
      {children}
    </button>
  )
}

/**
 * Every text role the system ships, live and in one glance: heading, body,
 * UI labels and code, all driven by the section's axes. Tap any line to read
 * its recipe — family, size, weight — the type analog of inspecting a ramp
 * step in the Color hero.
 */
function TypeHero({ state }: { state: LabState }) {
  const heading = state.headingFont || state.bodyFont
  const [probe, setProbe] = useState<ProbeId | null>(null)
  useLoadedFamilies([heading, state.bodyFont, state.monoFont])

  const headingPx = stepPx(state, 3)
  const probes: Record<
    ProbeId,
    { label: string; family: string; px: number; weight: number }
  > = {
    heading: {
      label: 'Heading',
      family: heading,
      px: headingPx,
      weight: Number(state.headingWeight),
    },
    body: {
      label: 'Body',
      family: state.bodyFont,
      px: state.typeBase,
      weight: 400,
    },
    ui: { label: 'UI label', family: state.bodyFont, px: 13, weight: 500 },
    code: { label: 'Code', family: state.monoFont, px: 12, weight: 400 },
  }
  const inspected = probe ? probes[probe] : null

  return (
    <div className="flex flex-col gap-2.5 rounded-xl bg-muted p-3">
      <Probe id="heading" probe={probe} onProbe={setProbe}>
        <span
          className="block text-balance text-fg"
          style={{
            fontFamily: fontStack(heading),
            fontSize: headingPx,
            fontWeight: Number(state.headingWeight),
            letterSpacing: `${state.headingTracking}em`,
            lineHeight: 1.15,
          }}
        >
          Before we knew it
        </span>
      </Probe>
      <Probe id="body" probe={probe} onProbe={setProbe}>
        <span
          className="block text-pretty text-fg-muted"
          style={{
            fontFamily: fontStack(state.bodyFont),
            fontSize: state.typeBase,
            lineHeight: state.bodyLeading,
          }}
        >
          We had left the ground, and the city lights fell away beneath us.
        </span>
      </Probe>
      <div className="flex items-center gap-2">
        <Probe id="ui" probe={probe} onProbe={setProbe} className="shrink-0">
          <span
            className="flex h-7 items-center rounded-full bg-primary px-3.5 text-fg-on-primary"
            style={{
              fontFamily: fontStack(state.bodyFont),
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            Get started
          </span>
        </Probe>
        <span
          className="flex h-7 shrink-0 items-center rounded-full border border-border-field px-3.5 text-fg"
          style={{
            fontFamily: fontStack(state.bodyFont),
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          Learn more
        </span>
        <Probe
          id="code"
          probe={probe}
          onProbe={setProbe}
          className="ml-auto shrink-0"
        >
          <span
            className="flex h-6 items-center rounded-md bg-bg/50 px-2 text-fg-muted"
            style={{ fontFamily: fontStack(state.monoFont), fontSize: 12 }}
          >
            v2.4.0
          </span>
        </Probe>
      </div>
      {inspected && (
        <div className="flex items-center justify-between gap-3 text-xs text-fg-muted">
          <span className="shrink-0">{inspected.label}</span>
          <span className="truncate font-mono tabular-nums">
            {inspected.family} · {inspected.px}px · {inspected.weight}
          </span>
        </div>
      )}
    </div>
  )
}

/* ------------------------------ Auto font row ------------------------------ */

/** A font row that reads “Auto” (showing the face it follows) until pinned —
 *  the panel face of the absent --font-heading token. Reset returns to Auto. */
function AutoFontRow({
  label,
  value,
  derived,
  categories,
  onChange,
  onReset,
}: {
  label: string
  /** '' = Auto. */
  value: string
  /** The family followed while Auto. */
  derived: string
  categories: FontCategory[]
  onChange: (family: string) => void
  onReset: () => void
}) {
  const resolved = value || derived
  useLoadedFamilies([resolved])
  return (
    <div data-row="" className={cn(ROW, 'flex items-center gap-0.5 pr-1.5')}>
      <Select
        className="h-full min-w-0 flex-1"
        selectedKey={value || null}
        onSelectionChange={(key) => onChange(key as string)}
        aria-label={label}
      >
        <Button
          variant="quiet"
          className="flex h-full w-full items-center justify-between gap-3 rounded-none px-4 font-normal"
        >
          <span className={ROW_LABEL}>{label}</span>
          <span className="flex min-w-0 items-center gap-1.5">
            {!value && <span className={ROW_VALUE}>Auto ·</span>}
            <span
              className={cn(ROW_VALUE, 'text-right')}
              style={{ fontFamily: fontStack(resolved) }}
            >
              {resolved}
            </span>
            <ChevronsUpDownIcon className="size-3.5 shrink-0 text-fg-muted" />
          </span>
        </Button>
        <FontListPopover categories={categories} />
      </Select>
      {value !== '' && (
        <Button
          size="xs"
          variant="quiet"
          isIconOnly
          aria-label={`Reset ${label} to auto`}
          onPress={onReset}
          className="shrink-0 text-fg-muted"
        >
          <RotateCcwIcon />
        </Button>
      )}
    </div>
  )
}

/* --------------------------------- Pairings -------------------------------- */

/** Curated heading + body combinations — pick a voice by look, not by name.
 *  Same-family pairs pin nothing: heading stays Auto. */
const PAIRINGS = [
  { heading: 'Geist', body: 'Geist' },
  { heading: 'Space Grotesk', body: 'Inter' },
  { heading: 'Fraunces', body: 'Inter' },
  { heading: 'Playfair Display', body: 'Lora' },
  { heading: 'Bricolage Grotesque', body: 'Figtree' },
  { heading: 'EB Garamond', body: 'Work Sans' },
]

/** Collapsed-row summary: “Aa” in the current heading and body faces. */
function PairGlyphs({ heading, body }: { heading: string; body: string }) {
  return (
    <span className="flex items-baseline gap-1.5 text-sm">
      <span className="text-fg" style={{ fontFamily: fontStack(heading) }}>
        Aa
      </span>
      <span style={{ fontFamily: fontStack(body) }}>Aa</span>
    </span>
  )
}

function PairingGrid({ lab }: { lab: Lab }) {
  const { state, set } = lab
  const heading = state.headingFont || state.bodyFont

  // Tile labels are the family names themselves — the preview subset (a font's
  // own name glyphs) is exactly enough, a couple of KB per face.
  useEffect(() => {
    for (const pair of PAIRINGS) {
      loadFontPreview(document, pair.heading)
      loadFontPreview(document, pair.body)
    }
  }, [])

  return (
    <div className="grid grid-cols-2 gap-1.5 pt-1 pb-1">
      {PAIRINGS.map((pair) => {
        const selected =
          heading === pair.heading && state.bodyFont === pair.body
        return (
          <button
            key={`${pair.heading}/${pair.body}`}
            type="button"
            aria-pressed={selected}
            onClick={() => {
              set('headingFont')(pair.heading === pair.body ? '' : pair.heading)
              set('bodyFont')(pair.body)
            }}
            className={cn(
              'flex cursor-interactive flex-col items-start gap-0.5 overflow-hidden rounded-lg bg-bg/50 p-2.5 text-left focus-reset transition-[background-color,transform] hover:bg-bg/75 focus-visible:focus-ring motion-safe:active:scale-[0.97]',
              selected && 'bg-bg inset-ring-2 inset-ring-accent hover:bg-bg',
            )}
          >
            <span
              className="w-full truncate text-[0.9375rem] text-fg"
              style={{ fontFamily: fontStack(pair.heading) }}
            >
              {pair.heading}
            </span>
            <span
              className="w-full truncate text-xs text-fg-muted"
              style={{ fontFamily: fontStack(pair.body) }}
            >
              {pair.body}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/* ------------------------------- Scale ladder ------------------------------ */

/** The scale as a glyph ramp — every step of the modular scale, live. */
function ScaleLadder({ state }: { state: LabState }) {
  const heading = state.headingFont || state.bodyFont
  return (
    <div className="flex items-baseline gap-3 overflow-hidden px-2 pt-1.5 pb-1">
      {[-1, 0, 1, 2, 3].map((step) => (
        <span
          key={step}
          className="text-fg"
          style={{
            fontFamily: fontStack(heading),
            fontSize: stepPx(state, step),
            fontWeight: Number(state.headingWeight),
            letterSpacing: `${state.headingTracking}em`,
            lineHeight: 1,
          }}
        >
          Ag
        </span>
      ))}
    </div>
  )
}

/* --------------------------------- Section --------------------------------- */

const SCALE_KEYS = ['typeRatio', 'typeBase'] as const
const FINE_KEYS = ['headingWeight', 'headingTracking', 'bodyLeading'] as const

export function IdealTypeSectionBody({ lab }: { lab: Lab }) {
  const { state, set } = lab
  const heading = state.headingFont || state.bodyFont

  const scaleModified = SCALE_KEYS.some((key) => state[key] !== DEFAULTS[key])
  const fineModified = FINE_KEYS.some((key) => state[key] !== DEFAULTS[key])

  return (
    <>
      <TypeHero state={state} />
      <ControlGroup>
        <AutoFontRow
          label="Heading"
          value={state.headingFont}
          derived={state.bodyFont}
          categories={['sans-serif', 'serif', 'display', 'handwriting']}
          onChange={set('headingFont')}
          onReset={() => set('headingFont')('')}
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
      <GroupCaption>
        Body is the one required face. Heading follows it until you pin one —
        reset back anytime.
      </GroupCaption>
      <DetailRow
        label="Pairings"
        summary={<PairGlyphs heading={heading} body={state.bodyFont} />}
      >
        <PairingGrid lab={lab} />
      </DetailRow>
      <DetailRow
        label="Scale"
        summary={
          scaleModified
            ? `${state.typeBase}px · ${
                RATIO_OPTIONS.find((o) => o.value === state.typeRatio)?.label
              }`
            : 'Default'
        }
      >
        <ScaleLadder state={state} />
        <ParamRow label="Ratio">
          <MiniSegmented
            ariaLabel="Scale ratio"
            value={state.typeRatio}
            onChange={set('typeRatio')}
            options={RATIO_OPTIONS}
          />
        </ParamRow>
        <MiniSliderRow
          label="Base size"
          value={state.typeBase}
          onChange={set('typeBase')}
          minValue={14}
          maxValue={18}
          step={1}
          format={(v) => `${v}px`}
        />
      </DetailRow>
      <DetailRow
        label="Fine-tune"
        summary={fineModified ? 'Custom' : 'Default'}
      >
        <ParamRow label="Heading weight">
          <MiniSegmented
            ariaLabel="Heading weight"
            value={state.headingWeight}
            onChange={set('headingWeight')}
            options={WEIGHT_OPTIONS}
          />
        </ParamRow>
        <MiniSliderRow
          label="Heading tracking"
          value={state.headingTracking}
          onChange={set('headingTracking')}
          minValue={-0.04}
          maxValue={0.04}
          step={0.005}
          format={(v) =>
            v === 0 ? 'Normal' : `${v > 0 ? '+' : ''}${v.toFixed(3)}em`
          }
        />
        <MiniSliderRow
          label="Body line height"
          value={state.bodyLeading}
          onChange={set('bodyLeading')}
          minValue={1.3}
          maxValue={1.9}
          step={0.05}
          format={(v) => v.toFixed(2)}
        />
      </DetailRow>
    </>
  )
}
