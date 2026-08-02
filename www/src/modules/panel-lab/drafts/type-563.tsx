'use client'

/* The ideal Type section — three layers of commitment: pairings apply a
   curated heading+body in one tap, the face rows pick each role (heading can
   follow the body, '' = Auto like the color seeds), and two detail rows expose
   the heading voice and the size ramp. Everything renders live in the
   specimen, including fonts merely hovered in a picker. */

import { useRef, useState } from 'react'
import {
  ChevronsUpDownIcon,
  RefreshCcwIcon,
  SearchIcon,
  XIcon,
} from 'lucide-react'
import {
  Button as RacButton,
  ToggleButton as RacToggleButton,
  ToggleButtonGroup as RacToggleButtonGroup,
} from 'react-aria-components'

import { ensureFontStylesheets, FONT_CATALOG, fontStack } from '@/lib/fonts'
import type { FontCategory } from '@/lib/fonts'
import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { Command } from '@/registry/ui/command'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'
import { SearchField } from '@/registry/ui/search-field'
import { Select } from '@/registry/ui/select'
import {
  ControlGroup,
  GroupCaption,
  MiniSegmented,
  ParamRow,
  ROW_LABEL,
  ROW_TRIGGER,
  ROW_VALUE,
} from '@/modules/control-lab/rows'
import {
  useLazyFontPreviews,
  useLoadedFamilies,
} from '@/modules/create/typography'

import type { Lab } from '../data'
import { DetailRow } from '../patterns'

/* --------------------------------- Options --------------------------------- */

const CATEGORY_LABELS: Record<FontCategory, string> = {
  'sans-serif': 'Sans serif',
  serif: 'Serif',
  display: 'Display',
  handwriting: 'Handwriting',
  mono: 'Monospace',
}

const WEIGHT_OPTIONS = ['400', '500', '600', '700'].map((w) => ({
  value: w,
  label: w,
}))

const WEIGHT_LABELS: Record<string, string> = {
  '400': 'Regular',
  '500': 'Medium',
  '600': 'Semibold',
  '700': 'Bold',
}

const TRACKING_OPTIONS = [
  { value: 'tight', label: 'Tight' },
  { value: 'normal', label: 'Normal' },
  { value: 'wide', label: 'Wide' },
]

const TRACKING_EM: Record<string, string> = {
  tight: '-0.02em',
  normal: '0em',
  wide: '0.04em',
}

const BASE_OPTIONS = ['14', '15', '16', '17', '18'].map((s) => ({
  value: s,
  label: s,
}))

const RATIO_OPTIONS = ['1.125', '1.2', '1.25', '1.333'].map((r) => ({
  value: r,
  label: r,
}))

/* Sample texts the specimen cycles through — different voices to judge a face. */
const SAMPLES = [
  {
    heading: 'Almost before we knew it',
    body: 'We had left the ground and the city fell away beneath us.',
    code: 'npx shadcn add button',
  },
  {
    heading: 'A design system in an afternoon',
    body: 'Colors, type and components — exported as code you own.',
    code: 'pnpm dlx dotui init',
  },
  {
    heading: 'Sphinx of black quartz',
    body: 'Judge my vow: 26 letters, 10 digits & a fistful of glyphs.',
    code: 'const ratio = 1.25',
  },
]

/* Curated heading+body pairings — '' heading means it follows the body. */
const PAIRINGS = [
  { id: 'geist', name: 'Geist', heading: '', body: 'Geist' },
  { id: 'grotesk', name: 'Grotesk', heading: 'Space Grotesk', body: 'Inter' },
  {
    id: 'editorial',
    name: 'Editorial',
    heading: 'Playfair Display',
    body: 'Source Sans 3',
  },
  { id: 'warm', name: 'Warm', heading: 'Fraunces', body: 'Nunito Sans' },
  { id: 'plex', name: 'Plex', heading: '', body: 'IBM Plex Sans' },
  {
    id: 'display',
    name: 'Display',
    heading: 'Bricolage Grotesque',
    body: 'Figtree',
  },
]

/* --------------------------------- Specimen -------------------------------- */

/** The section's hero: the chosen faces at the real ramp, sample cycleable. */
function Specimen({
  heading,
  body,
  mono,
  weight,
  tracking,
  base,
  ratio,
  trying,
}: {
  heading: string
  body: string
  mono: string
  weight: string
  tracking: string
  base: number
  ratio: number
  trying: boolean
}) {
  useLoadedFamilies([heading, body, mono])
  const [index, setIndex] = useState(0)
  const sample = SAMPLES[index % SAMPLES.length]!
  return (
    <div
      className={cn(
        'group relative flex flex-col gap-2.5 rounded-xl bg-muted px-4 pt-4 pb-3.5',
        trying && 'inset-ring-1 inset-ring-accent/40',
      )}
    >
      <RacButton
        aria-label="Try another sample text"
        onPress={() => setIndex((i) => i + 1)}
        className="absolute top-2 right-2 flex size-6 cursor-interactive items-center justify-center rounded-md text-fg-muted opacity-0 focus-reset transition-opacity group-hover:opacity-100 hover:bg-highlight hover:text-fg focus-visible:opacity-100 focus-visible:focus-ring"
      >
        <RefreshCcwIcon className="size-3" />
      </RacButton>
      <span
        className="text-balance text-fg transition-[font-size,letter-spacing,font-weight] duration-200"
        style={{
          fontFamily: fontStack(heading),
          fontWeight: Number(weight),
          letterSpacing: TRACKING_EM[tracking],
          fontSize: Math.round(base * ratio * ratio),
          lineHeight: 1.15,
        }}
      >
        {sample.heading}
      </span>
      <span
        className="text-pretty text-fg-muted transition-[font-size] duration-200"
        style={{ fontFamily: fontStack(body), fontSize: base, lineHeight: 1.5 }}
      >
        {sample.body}
      </span>
      <code
        className="self-start rounded-md bg-bg/50 px-2 py-1 text-fg-muted"
        style={{
          fontFamily: fontStack(mono),
          fontSize: Math.round(base * 0.8125),
        }}
      >
        {sample.code}
      </code>
    </div>
  )
}

/* --------------------------------- Pairings -------------------------------- */

/** Pick a heading+body by look — each tile is its own mini specimen. */
function PairingRow({
  lab,
  onPreview,
}: {
  lab: Lab
  onPreview: (patch: { heading: string; body: string } | null) => void
}) {
  const { state, set } = lab
  useLoadedFamilies(PAIRINGS.flatMap((p) => [p.heading || p.body, p.body]))
  const active = PAIRINGS.find(
    (p) => p.heading === state.headingFont && p.body === state.bodyFont,
  )
  return (
    <div className="w-full rounded-xl bg-muted p-2">
      <div className="flex h-8 items-center justify-between px-2">
        <span className={ROW_LABEL}>Pairing</span>
        <span className={ROW_VALUE}>{active?.name ?? 'Custom'}</span>
      </div>
      <RacToggleButtonGroup
        aria-label="Font pairing"
        selectionMode="single"
        selectedKeys={active ? [active.id] : []}
        onSelectionChange={(keys) => {
          const next = keys.values().next().value
          const pairing = PAIRINGS.find((p) => p.id === next)
          if (pairing) {
            set('headingFont')(pairing.heading)
            set('bodyFont')(pairing.body)
          }
        }}
        className="grid grid-cols-3 gap-1.5"
      >
        {PAIRINGS.map((pairing) => (
          <RacToggleButton
            key={pairing.id}
            id={pairing.id}
            onHoverStart={() =>
              onPreview({
                heading: pairing.heading || pairing.body,
                body: pairing.body,
              })
            }
            onHoverEnd={() => onPreview(null)}
            className="flex h-14 cursor-interactive flex-col items-center justify-center gap-1 rounded-lg bg-bg/50 focus-reset transition-[background-color,transform] hover:bg-bg/75 focus-visible:focus-ring motion-safe:pressed:scale-[0.97] selected:bg-bg selected:inset-ring-2 selected:inset-ring-accent"
          >
            <span
              className="text-base/none text-fg"
              style={{
                fontFamily: fontStack(pairing.heading || pairing.body),
                fontWeight: 600,
              }}
            >
              Ag
            </span>
            <span
              className="text-[10px]/none text-fg-muted"
              style={{ fontFamily: fontStack(pairing.body) }}
            >
              {pairing.name}
            </span>
          </RacToggleButton>
        ))}
      </RacToggleButtonGroup>
    </div>
  )
}

/* --------------------------------- Face row -------------------------------- */

const AUTO_KEY = '__auto__'

/**
 * A font row that browses live: hovering a family in the list previews it in
 * the specimen before committing. With `autoFamily`, a pinned "Match body"
 * item maps to '' — the heading following the body font.
 */
function FaceRow({
  label,
  categories,
  value,
  autoFamily,
  onChange,
  onPreview,
}: {
  label: string
  categories: FontCategory[]
  /** '' = Auto (follow `autoFamily`). */
  value: string
  autoFamily?: string
  onChange: (family: string) => void
  onPreview: (family: string | null) => void
}) {
  const listRef = useLazyFontPreviews()
  const isAuto = autoFamily !== undefined && value === ''
  const family = value || autoFamily || ''
  useLoadedFamilies([family])
  return (
    <Select
      className="w-full"
      selectedKey={isAuto ? AUTO_KEY : value}
      onSelectionChange={(key) => {
        onPreview(null)
        onChange(key === AUTO_KEY ? '' : (key as string))
      }}
      onOpenChange={(open) => {
        if (!open) onPreview(null)
      }}
      aria-label={label}
    >
      <Button variant="quiet" data-row="" className={ROW_TRIGGER}>
        <span className={ROW_LABEL}>{label}</span>
        <span className="flex min-w-0 items-center gap-1.5">
          {isAuto && (
            <span className="shrink-0 rounded-sm bg-bg/60 px-1 py-0.5 text-[10px]/none font-medium text-fg-muted">
              Auto
            </span>
          )}
          <span
            className={cn(ROW_VALUE, 'text-right')}
            style={{ fontFamily: fontStack(family) }}
          >
            {family}
          </span>
          <ChevronsUpDownIcon className="size-3.5 shrink-0 text-fg-muted" />
        </span>
      </Button>
      <Popover
        className="w-(--trigger-width) outline-hidden"
        placement="right top"
      >
        <Command>
          <SearchField autoFocus aria-label="Search fonts">
            <InputGroup>
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <Input placeholder="Search fonts..." />
              <InputGroupAddon className="[--addon-button-inset:--spacing(1.5)]">
                <Button variant="quiet" isIconOnly>
                  <XIcon aria-hidden="true" />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </SearchField>
          <div ref={listRef} className="contents">
            <ListBox className="max-h-64 overflow-y-auto! overscroll-contain">
              {autoFamily !== undefined && (
                <ListBoxItem
                  id={AUTO_KEY}
                  textValue="Match body"
                  onHoverStart={() => onPreview(autoFamily)}
                  onHoverEnd={() => onPreview(null)}
                >
                  <span>
                    Match body
                    <span className="text-fg-muted"> · {autoFamily}</span>
                  </span>
                </ListBoxItem>
              )}
              {categories.map((category) => (
                <ListBoxSection key={category}>
                  <ListBoxSectionHeader>
                    {CATEGORY_LABELS[category]}
                  </ListBoxSectionHeader>
                  {FONT_CATALOG.filter(
                    (font) => font.category === category,
                  ).map((font) => (
                    <ListBoxItem
                      key={font.family}
                      id={font.family}
                      textValue={font.family}
                      onHoverStart={() => onPreview(font.family)}
                      onHoverEnd={() => onPreview(null)}
                    >
                      <span
                        data-preview-family={font.family}
                        style={{ fontFamily: fontStack(font.family) }}
                      >
                        {font.family}
                      </span>
                    </ListBoxItem>
                  ))}
                </ListBoxSection>
              ))}
            </ListBox>
          </div>
        </Command>
      </Popover>
    </Select>
  )
}

/* ---------------------------------- Ramp ----------------------------------- */

/** The scale made visible: display → heading → body → caption steps. */
function Ramp({
  base,
  ratio,
  family,
}: {
  base: number
  ratio: number
  family: string
}) {
  const steps = [
    Math.round(base * ratio * ratio),
    Math.round(base * ratio),
    base,
    Math.round(base * 0.8125),
  ]
  return (
    <div
      className="flex items-end gap-5 px-2 pt-1.5 pb-2.5"
      style={{ fontFamily: fontStack(family) }}
    >
      {steps.map((px, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5">
          <span className="text-fg" style={{ fontSize: px, lineHeight: 1 }}>
            Ag
          </span>
          <span className="text-[9px]/none text-fg-muted tabular-nums">
            {px}px
          </span>
        </div>
      ))}
    </div>
  )
}

/* --------------------------------- Section --------------------------------- */

type TryOn = { heading?: string; body?: string; mono?: string }

export function IdealTypeSectionBody({ lab }: { lab: Lab }) {
  const { state, set } = lab
  const [tryOn, setTryOn] = useState<TryOn | null>(null)
  const clearTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  )

  /* Debounced clear so sweeping across list items never flickers. */
  const preview = (patch: TryOn | null) => {
    clearTimeout(clearTimer.current)
    if (patch) {
      ensureFontStylesheets(
        document,
        Object.values(patch).filter((f): f is string => !!f),
      )
      setTryOn(patch)
    } else {
      clearTimer.current = setTimeout(() => setTryOn(null), 150)
    }
  }

  const body = tryOn?.body ?? state.bodyFont
  const heading = tryOn?.heading ?? (state.headingFont || body)
  const mono = tryOn?.mono ?? state.monoFont

  return (
    <>
      <Specimen
        heading={heading}
        body={body}
        mono={mono}
        weight={state.headingWeight}
        tracking={state.headingTracking}
        base={state.baseSize}
        ratio={Number(state.typeScale)}
        trying={tryOn !== null}
      />
      <PairingRow lab={lab} onPreview={preview} />
      <ControlGroup>
        <FaceRow
          label="Heading"
          categories={['sans-serif', 'serif', 'display', 'handwriting']}
          value={state.headingFont}
          autoFamily={state.bodyFont}
          onChange={(f) => set('headingFont')(f === state.bodyFont ? '' : f)}
          onPreview={(f) => preview(f ? { heading: f } : null)}
        />
        <FaceRow
          label="Body"
          categories={['sans-serif', 'serif']}
          value={state.bodyFont}
          onChange={set('bodyFont')}
          onPreview={(f) => preview(f ? { body: f } : null)}
        />
        <FaceRow
          label="Mono"
          categories={['mono']}
          value={state.monoFont}
          onChange={set('monoFont')}
          onPreview={(f) => preview(f ? { mono: f } : null)}
        />
      </ControlGroup>
      {state.headingFont === '' && (
        <GroupCaption>
          Headings follow the body font — pick a heading face to split them.
        </GroupCaption>
      )}
      <DetailRow
        id="headings"
        label="Headings"
        summary={
          WEIGHT_LABELS[state.headingWeight] +
          (state.headingTracking === 'normal'
            ? ''
            : ` · ${state.headingTracking === 'tight' ? 'Tight' : 'Wide'}`)
        }
      >
        <ParamRow label="Weight">
          <MiniSegmented
            ariaLabel="Heading weight"
            value={state.headingWeight}
            onChange={set('headingWeight')}
            options={WEIGHT_OPTIONS}
          />
        </ParamRow>
        <ParamRow label="Tracking">
          <MiniSegmented
            ariaLabel="Heading tracking"
            value={state.headingTracking}
            onChange={set('headingTracking')}
            options={TRACKING_OPTIONS}
          />
        </ParamRow>
      </DetailRow>
      <DetailRow
        id="scale"
        label="Scale"
        summary={`${state.baseSize}px · ${state.typeScale}`}
      >
        <ParamRow label="Base size">
          <MiniSegmented
            ariaLabel="Base size"
            value={String(state.baseSize)}
            onChange={(v) => set('baseSize')(Number(v))}
            options={BASE_OPTIONS}
          />
        </ParamRow>
        <ParamRow label="Ratio">
          <MiniSegmented
            ariaLabel="Scale ratio"
            value={state.typeScale}
            onChange={set('typeScale')}
            options={RATIO_OPTIONS}
          />
        </ParamRow>
        <Ramp
          base={state.baseSize}
          ratio={Number(state.typeScale)}
          family={body}
        />
      </DetailRow>
    </>
  )
}
