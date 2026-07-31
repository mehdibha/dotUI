'use client'

/* Inspector — a Figma/IDE-style dense property inspector: hairline-separated
   collapsible sections, 12px labels, tiny right-aligned controls, no pills or
   cards. The question: how much density can the schema take before it stops
   being approachable? */

import { useState } from 'react'
import {
  ChevronDownIcon,
  ChevronsUpDownIcon,
  RotateCcwIcon,
} from 'lucide-react'
import { Button as RacButton } from 'react-aria-components'

import { FONT_CATALOG } from '@/lib/fonts'
import type { FontCategory } from '@/lib/fonts'
import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'
import { Select, SelectValue } from '@/registry/ui/select'
import { Slider, SliderControl } from '@/registry/ui/slider'
import { MiniSegmented, ParamRow } from '@/modules/control-lab/rows'
import type { StyleGridOption } from '@/modules/control-lab/rows'

import {
  BACKDROP_OPTIONS,
  BLUR_OPTIONS,
  BUTTON_STYLES,
  CARD_STYLES,
  CHROMA_OPTIONS,
  COLOR_KEYS,
  COMPONENT_KEYS,
  CONTRAST_OPTIONS,
  CURSOR_OPTIONS,
  DENSITY_OPTIONS,
  EFFECT_KEYS,
  GRAY_TINT_OPTIONS,
  HOVER_PARAM_OPTIONS,
  ICON_KEYS,
  ICON_LIBRARY_OPTIONS,
  ICON_WEIGHT_OPTIONS,
  INPUT_STYLES,
  LOADER_STYLES,
  PRIMARY_OPTIONS,
  RADIUS_PARAM_OPTIONS,
  SHADOW_OPTIONS,
  SHAPE_KEYS,
  TOKEN_RADIUS_OPTIONS,
  TYPE_KEYS,
} from '../data'
import type { Lab, LabState } from '../data'
import { MiniColorRow } from '../patterns'

/* --------------------------------- Options --------------------------------- */

/** Style-grid enums flattened to name-only options — the inspector picks by
 *  word, not specimen. */
const styleOptions = (options: StyleGridOption[]) =>
  options.map(({ id, label }) => ({ value: id, label }))

const BUTTON_STYLE_OPTIONS = styleOptions(BUTTON_STYLES)
const INPUT_STYLE_OPTIONS = styleOptions(INPUT_STYLES)
const CARD_STYLE_OPTIONS = styleOptions(CARD_STYLES)
const LOADER_STYLE_OPTIONS = styleOptions(LOADER_STYLES)
const SHADOW_STYLE_OPTIONS = styleOptions(SHADOW_OPTIONS)

const MODAL_STYLE_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'muted-footer', label: 'Muted footer' },
]
const TOOLTIP_SURFACE_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'translucid', label: 'Translucid' },
]
const MENU_HIGHLIGHT_OPTIONS = [
  { value: 'subtle', label: 'Subtle' },
  { value: 'accent', label: 'Accent' },
]

/* Component clusters as inspector sections, each with its own modified/reset. */
const BUTTON_KEYS: (keyof LabState)[] = [
  'buttonStyle',
  'buttonRadius',
  'buttonHover',
]
const FORM_KEYS: (keyof LabState)[] = ['inputStyle', 'checkboxRadius']
const SURFACE_KEYS: (keyof LabState)[] = ['cardStyle', 'badgeRadius']
const OVERLAY_KEYS: (keyof LabState)[] = [
  'modalStyle',
  'modalBlur',
  'modalBackdrop',
  'modalRadius',
  'tooltipSurface',
  'tooltipRadius',
]
const MENU_KEYS: (keyof LabState)[] = ['menuHighlight']
const FEEDBACK_KEYS: (keyof LabState)[] = ['loaderStyle']

const ALL_KEYS: (keyof LabState)[] = [
  ...COLOR_KEYS,
  ...TYPE_KEYS,
  ...ICON_KEYS,
  ...SHAPE_KEYS,
  ...EFFECT_KEYS,
  ...COMPONENT_KEYS,
]

/* --------------------------------- Section --------------------------------- */

/** A collapsible inspector section: chevron + label + modified dot + reset,
 *  hairline-separated from its neighbors by the parent's divide-y. */
function Section({
  label,
  modified,
  onReset,
  children,
}: {
  label: string
  modified: boolean
  onReset: () => void
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(true)
  return (
    <section className="px-1.5 py-1">
      <div className="flex items-center gap-0.5">
        <RacButton
          onPress={() => setOpen((o) => !o)}
          className="flex h-7 min-w-0 flex-1 cursor-interactive items-center gap-1.5 rounded-md px-1.5 text-left focus-reset transition-colors hover:bg-muted/60 focus-visible:focus-ring"
        >
          <ChevronDownIcon
            className={cn(
              'size-3 shrink-0 text-fg-muted transition-transform duration-200',
              !open && '-rotate-90',
            )}
          />
          <span className="truncate text-xs font-semibold text-fg">
            {label}
          </span>
          {modified && (
            <span
              aria-label="Modified"
              className="size-1 shrink-0 rounded-full bg-accent"
            />
          )}
        </RacButton>
        {modified && (
          <Button
            size="xs"
            variant="quiet"
            isIconOnly
            aria-label={`Reset ${label.toLowerCase()}`}
            onPress={onReset}
            className="shrink-0 text-fg-muted"
          >
            <RotateCcwIcon />
          </Button>
        )}
      </div>
      {open && <div className="flex flex-col pb-1">{children}</div>}
    </section>
  )
}

/** A micro-header grouping a run of rows inside a section (Input, Modal…). */
function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2 pt-2 pb-0.5 text-[10px] font-medium tracking-wider text-fg-muted/80 uppercase">
      {children}
    </span>
  )
}

/* --------------------------------- Controls -------------------------------- */

const TRIGGER =
  'h-7 min-w-0 gap-1 rounded-md px-1.5 text-xs font-normal text-fg-muted hover:text-fg'

/** A select at inspector scale: bare value + chevron, sized for ParamRow. */
function InspectorSelect({
  ariaLabel,
  value,
  onChange,
  options,
}: {
  ariaLabel: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <Select
      selectedKey={value}
      onSelectionChange={(key) => onChange(key as string)}
      aria-label={ariaLabel}
      className="min-w-0 shrink-0"
    >
      <Button variant="quiet" className={TRIGGER}>
        <SelectValue className="truncate" />
        <ChevronsUpDownIcon className="size-3 shrink-0" />
      </Button>
      <Popover placement="bottom end">
        <ListBox>
          {options.map((opt) => (
            <ListBoxItem key={opt.value} id={opt.value} textValue={opt.label}>
              {opt.label}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  )
}

/** A font select at inspector scale — plain names in the UI font, grouped by
 *  category, no specimen: the inspector reads, it doesn't preview. */
function InspectorFontRow({
  label,
  categories,
  value,
  onChange,
}: {
  label: string
  categories: FontCategory[]
  value: string
  onChange: (family: string) => void
}) {
  return (
    <ParamRow label={label}>
      <Select
        selectedKey={value}
        onSelectionChange={(key) => onChange(key as string)}
        aria-label={label}
        className="min-w-0 shrink-0"
      >
        <Button variant="quiet" className={TRIGGER}>
          <SelectValue className="truncate" />
          <ChevronsUpDownIcon className="size-3 shrink-0" />
        </Button>
        <Popover placement="bottom end" className="w-52">
          <ListBox className="max-h-64 overflow-y-auto! overscroll-contain">
            {categories.map((category) => (
              <ListBoxSection key={category}>
                <ListBoxSectionHeader className="capitalize">
                  {category}
                </ListBoxSectionHeader>
                {FONT_CATALOG.filter((font) => font.category === category).map(
                  (font) => (
                    <ListBoxItem
                      key={font.family}
                      id={font.family}
                      textValue={font.family}
                    >
                      {font.family}
                    </ListBoxItem>
                  ),
                )}
              </ListBoxSection>
            ))}
          </ListBox>
        </Popover>
      </Select>
    </ParamRow>
  )
}

/** A slider at inspector scale: short track + mono readout, sized for ParamRow. */
function InspectorSlider({
  ariaLabel,
  value,
  onChange,
  minValue,
  maxValue,
  step,
  format,
}: {
  ariaLabel: string
  value: number
  onChange: (value: number) => void
  minValue: number
  maxValue: number
  step: number
  format: (value: number) => string
}) {
  return (
    <span className="flex shrink-0 items-center gap-2">
      <Slider
        aria-label={ariaLabel}
        value={value}
        minValue={minValue}
        maxValue={maxValue}
        step={step}
        onChange={(v) => onChange(v as number)}
        className="w-24"
      >
        <SliderControl />
      </Slider>
      <span className="w-10 text-right font-mono text-[11px] text-fg-muted tabular-nums">
        {format(value)}
      </span>
    </span>
  )
}

/* ---------------------------------- Frame ----------------------------------- */

export function InspectorFrame({ lab }: { lab: Lab }) {
  const { state, set } = lab
  const anyModified = lab.section(ALL_KEYS).modified

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex h-10 shrink-0 items-center border-b border-border/40 px-3.5">
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="truncate text-xs font-semibold text-fg">
            Acme design system
          </span>
          {anyModified && (
            <span
              aria-label="Unsaved changes"
              className="size-1.5 shrink-0 rounded-full bg-fg-muted"
            />
          )}
        </span>
      </header>

      <div className="flex min-h-0 flex-1 flex-col divide-y divide-border/40 overflow-y-auto *:shrink-0">
        <Section label="Color" {...lab.section(COLOR_KEYS)}>
          <MiniColorRow
            label="Brand"
            value={state.brand}
            onChange={set('brand')}
          />
          <MiniColorRow
            label="Gray"
            value={state.gray}
            onChange={set('gray')}
          />
          <ParamRow label="Gray tint">
            <MiniSegmented
              ariaLabel="Gray tint"
              value={state.grayTint}
              onChange={set('grayTint')}
              options={GRAY_TINT_OPTIONS}
            />
          </ParamRow>
          <ParamRow label="Primary">
            <MiniSegmented
              ariaLabel="Primary"
              value={state.primary}
              onChange={set('primary')}
              options={PRIMARY_OPTIONS}
            />
          </ParamRow>
          <SubLabel>Semantic</SubLabel>
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
          <MiniColorRow
            label="Info"
            value={state.info}
            onChange={set('info')}
          />
          <MiniColorRow
            label="Selection"
            value={state.selection}
            onChange={set('selection')}
          />
          <SubLabel>Fine-tune</SubLabel>
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
        </Section>

        <Section label="Typography" {...lab.section(TYPE_KEYS)}>
          <InspectorFontRow
            label="Heading"
            categories={['sans-serif', 'serif', 'display', 'handwriting']}
            value={state.headingFont}
            onChange={set('headingFont')}
          />
          <InspectorFontRow
            label="Body"
            categories={['sans-serif', 'serif']}
            value={state.bodyFont}
            onChange={set('bodyFont')}
          />
          <InspectorFontRow
            label="Mono"
            categories={['mono']}
            value={state.monoFont}
            onChange={set('monoFont')}
          />
        </Section>

        <Section label="Icons" {...lab.section(ICON_KEYS)}>
          <ParamRow label="Library">
            <InspectorSelect
              ariaLabel="Icon library"
              value={state.iconLibrary}
              onChange={set('iconLibrary')}
              options={ICON_LIBRARY_OPTIONS}
            />
          </ParamRow>
          <ParamRow label="Stroke">
            <InspectorSlider
              ariaLabel="Icon stroke"
              value={state.iconStroke}
              onChange={set('iconStroke')}
              minValue={1}
              maxValue={3}
              step={0.25}
              format={(v) => v.toFixed(2)}
            />
          </ParamRow>
          {state.iconLibrary === 'phosphor' && (
            <ParamRow label="Weight">
              <InspectorSelect
                ariaLabel="Icon weight"
                value={state.iconWeight}
                onChange={set('iconWeight')}
                options={ICON_WEIGHT_OPTIONS}
              />
            </ParamRow>
          )}
        </Section>

        <Section label="Shape" {...lab.section(SHAPE_KEYS)}>
          <ParamRow label="Radius">
            <InspectorSlider
              ariaLabel="Radius"
              value={state.radius}
              onChange={set('radius')}
              minValue={0}
              maxValue={2}
              step={0.05}
              format={(v) => `${v.toFixed(2)}×`}
            />
          </ParamRow>
          <ParamRow label="Density">
            <MiniSegmented
              ariaLabel="Density"
              value={state.density}
              onChange={set('density')}
              options={DENSITY_OPTIONS}
            />
          </ParamRow>
        </Section>

        <Section label="Effects" {...lab.section(EFFECT_KEYS)}>
          <ParamRow label="Shadows">
            <InspectorSelect
              ariaLabel="Shadows"
              value={state.shadows}
              onChange={set('shadows')}
              options={SHADOW_STYLE_OPTIONS}
            />
          </ParamRow>
          <ParamRow label="Cursor">
            <InspectorSelect
              ariaLabel="Cursor"
              value={state.cursorInteractive}
              onChange={set('cursorInteractive')}
              options={CURSOR_OPTIONS}
            />
          </ParamRow>
          <ParamRow label="Disabled cursor">
            <InspectorSelect
              ariaLabel="Disabled cursor"
              value={state.cursorDisabled}
              onChange={set('cursorDisabled')}
              options={CURSOR_OPTIONS}
            />
          </ParamRow>
        </Section>

        <div className="px-3 py-1.5 text-[10px] font-semibold tracking-widest text-fg-muted/70 uppercase">
          Components
        </div>

        <Section label="Buttons" {...lab.section(BUTTON_KEYS)}>
          <ParamRow label="Style">
            <MiniSegmented
              ariaLabel="Button style"
              value={state.buttonStyle}
              onChange={set('buttonStyle')}
              options={BUTTON_STYLE_OPTIONS}
            />
          </ParamRow>
          <ParamRow label="Radius">
            <MiniSegmented
              ariaLabel="Button radius"
              value={state.buttonRadius}
              onChange={set('buttonRadius')}
              options={RADIUS_PARAM_OPTIONS}
            />
          </ParamRow>
          <ParamRow label="Hover">
            <MiniSegmented
              ariaLabel="Button hover effect"
              value={state.buttonHover}
              onChange={set('buttonHover')}
              options={HOVER_PARAM_OPTIONS}
            />
          </ParamRow>
        </Section>

        <Section label="Forms" {...lab.section(FORM_KEYS)}>
          <SubLabel>Input</SubLabel>
          <ParamRow label="Style">
            <InspectorSelect
              ariaLabel="Input style"
              value={state.inputStyle}
              onChange={set('inputStyle')}
              options={INPUT_STYLE_OPTIONS}
            />
          </ParamRow>
          <SubLabel>Checkbox</SubLabel>
          <ParamRow label="Radius">
            <MiniSegmented
              ariaLabel="Checkbox radius"
              value={state.checkboxRadius}
              onChange={set('checkboxRadius')}
              options={TOKEN_RADIUS_OPTIONS}
            />
          </ParamRow>
        </Section>

        <Section label="Surfaces" {...lab.section(SURFACE_KEYS)}>
          <SubLabel>Card</SubLabel>
          <ParamRow label="Style">
            <MiniSegmented
              ariaLabel="Card style"
              value={state.cardStyle}
              onChange={set('cardStyle')}
              options={CARD_STYLE_OPTIONS}
            />
          </ParamRow>
          <SubLabel>Badge</SubLabel>
          <ParamRow label="Radius">
            <MiniSegmented
              ariaLabel="Badge radius"
              value={state.badgeRadius}
              onChange={set('badgeRadius')}
              options={TOKEN_RADIUS_OPTIONS}
            />
          </ParamRow>
        </Section>

        <Section label="Overlays" {...lab.section(OVERLAY_KEYS)}>
          <SubLabel>Modal</SubLabel>
          <ParamRow label="Style">
            <MiniSegmented
              ariaLabel="Modal style"
              value={state.modalStyle}
              onChange={set('modalStyle')}
              options={MODAL_STYLE_OPTIONS}
            />
          </ParamRow>
          <ParamRow label="Backdrop blur">
            <MiniSegmented
              ariaLabel="Modal backdrop blur"
              value={state.modalBlur}
              onChange={set('modalBlur')}
              options={BLUR_OPTIONS}
            />
          </ParamRow>
          <ParamRow label="Backdrop opacity">
            <MiniSegmented
              ariaLabel="Modal backdrop opacity"
              value={state.modalBackdrop}
              onChange={set('modalBackdrop')}
              options={BACKDROP_OPTIONS}
            />
          </ParamRow>
          <ParamRow label="Radius">
            <MiniSegmented
              ariaLabel="Modal radius"
              value={state.modalRadius}
              onChange={set('modalRadius')}
              options={TOKEN_RADIUS_OPTIONS}
            />
          </ParamRow>
          <SubLabel>Tooltip</SubLabel>
          <ParamRow label="Surface">
            <MiniSegmented
              ariaLabel="Tooltip surface"
              value={state.tooltipSurface}
              onChange={set('tooltipSurface')}
              options={TOOLTIP_SURFACE_OPTIONS}
            />
          </ParamRow>
          <ParamRow label="Radius">
            <MiniSegmented
              ariaLabel="Tooltip radius"
              value={state.tooltipRadius}
              onChange={set('tooltipRadius')}
              options={TOKEN_RADIUS_OPTIONS}
            />
          </ParamRow>
        </Section>

        <Section label="Menus & lists" {...lab.section(MENU_KEYS)}>
          <ParamRow label="Menu highlight">
            <MiniSegmented
              ariaLabel="Menu highlight"
              value={state.menuHighlight}
              onChange={set('menuHighlight')}
              options={MENU_HIGHLIGHT_OPTIONS}
            />
          </ParamRow>
        </Section>

        <Section label="Feedback" {...lab.section(FEEDBACK_KEYS)}>
          <ParamRow label="Loader">
            <MiniSegmented
              ariaLabel="Loader style"
              value={state.loaderStyle}
              onChange={set('loaderStyle')}
              options={LOADER_STYLE_OPTIONS}
            />
          </ParamRow>
        </Section>
      </div>

      <footer className="flex shrink-0 gap-2 border-t border-border/40 p-3">
        <Button size="sm" className="flex-1">
          Save
        </Button>
        <Button variant="primary" size="sm" className="flex-1">
          Export
        </Button>
      </footer>
    </div>
  )
}
