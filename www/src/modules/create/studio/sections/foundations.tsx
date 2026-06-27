'use client'

import { ExternalLinkIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { Switch } from '@/registry/ui/switch'

import { CodeOptionsControls } from '../../code-options/controls'
import {
  CURSOR_DISABLED_VAR,
  CURSOR_INTERACTIVE_VAR,
  DEFAULT_CURSOR_DISABLED,
  DEFAULT_CURSOR_INTERACTIVE,
} from '../../cursor'
import { DEFAULT_RADIUS_FACTOR, RADIUS_FACTOR_VAR } from '../../layout'
import { useDesignSystem } from '../../preset'
import { useStudio } from '../context'
import { STUB } from '../data'
import {
  Field,
  Segmented,
  SelectField,
  SectionShell,
  Subgroup,
  ValueSlider,
  useToken,
} from '../primitives'

/* ----------------------------- Typography ------------------------------- */

const UI_FONTS = [
  'Geist',
  'Inter',
  'Satoshi',
  'IBM Plex Sans',
  'Söhne',
  'General Sans',
  'System UI',
  'Mono',
]

function FontField({ label, varName }: { label: string; varName: string }) {
  const [value, set] = useToken(varName, 'Geist')
  return (
    <Field label={label} live={false}>
      <SelectField
        ariaLabel={label}
        value={value}
        onChange={set}
        options={UI_FONTS.map((f) => ({ id: f, label: f }))}
      />
    </Field>
  )
}

export function TypographySection() {
  const [scale, setScale] = useToken(STUB.typeScale, '1.25')
  const [base, setBase] = useToken(STUB.typeBase, '16')
  const [tracking, setTracking] = useToken(STUB.letterSpacing, '0')
  const { mode } = useStudio()
  return (
    <SectionShell
      title="Typography"
      blurb="Type families and the rhythm between sizes."
    >
      <Subgroup title="Families">
        <FontField label="Display font" varName={STUB.fontHeading} />
        <FontField label="Body font" varName={STUB.fontBody} />
      </Subgroup>
      <Subgroup title="Scale">
        <Field label="Scale ratio" live={false} hint="Step between type sizes.">
          <ValueSlider
            ariaLabel="Scale ratio"
            value={Number.parseFloat(scale) || 1.25}
            min={1.1}
            max={1.5}
            step={0.01}
            format={(v) => v.toFixed(3)}
            onChange={(v) => setScale(String(v))}
          />
        </Field>
        <Field label="Base size" live={false}>
          <ValueSlider
            ariaLabel="Base size"
            value={Number.parseFloat(base) || 16}
            min={13}
            max={18}
            step={1}
            format={(v) => `${v}px`}
            onChange={(v) => setBase(String(v))}
          />
        </Field>
        {mode === 'pro' && (
          <Field label="Letter spacing" live={false}>
            <ValueSlider
              ariaLabel="Letter spacing"
              value={Number.parseFloat(tracking) || 0}
              min={-3}
              max={3}
              step={0.5}
              format={(v) => `${v}%`}
              onChange={(v) => setTracking(String(v))}
            />
          </Field>
        )}
      </Subgroup>
    </SectionShell>
  )
}

/* -------------------------------- Icons --------------------------------- */

const ICON_LIBS = [
  { id: 'lucide', label: 'Lucide' },
  { id: 'remix', label: 'Remix' },
  { id: 'tabler', label: 'Tabler' },
  { id: 'hugeicons', label: 'Huge Icons' },
]

export function IconsSection() {
  const [lib, setLib] = useToken('--ds-icon-library', 'lucide')
  const [stroke, setStroke] = useToken(STUB.iconStroke, '2')
  return (
    <SectionShell
      title="Icons"
      blurb="The icon set and how heavy its strokes read."
    >
      <Field label="Icon library" live={false}>
        <SelectField
          ariaLabel="Icon library"
          value={lib}
          onChange={setLib}
          options={ICON_LIBS.map((l) => ({ id: l.id, label: l.label }))}
        />
      </Field>
      <Field label="Stroke width" live={false}>
        <ValueSlider
          ariaLabel="Stroke width"
          value={Number.parseFloat(stroke) || 2}
          min={1}
          max={2.5}
          step={0.25}
          format={(v) => `${v}px`}
          onChange={(v) => setStroke(String(v))}
        />
      </Field>
    </SectionShell>
  )
}

/* -------------------------------- Shape --------------------------------- */

export function ShapeSection() {
  const [radius, setRadius] = useToken(RADIUS_FACTOR_VAR, DEFAULT_RADIUS_FACTOR)
  const [border, setBorder] = useToken(STUB.borderWidth, '1')
  const radiusNum = Number.parseFloat(radius) || 1
  return (
    <SectionShell
      title="Shape"
      blurb="Corner radius and border weight set the whole personality."
    >
      <Field label="Radius" hint="Scales every corner at once.">
        <div className="flex items-center gap-3">
          <ValueSlider
            ariaLabel="Radius factor"
            value={radiusNum}
            min={0}
            max={2}
            step={0.05}
            format={(v) => `${v.toFixed(2)}×`}
            onChange={(v) => setRadius(String(v))}
          />
        </div>
        <div className="mt-3 flex items-end gap-2">
          {[0, 0.5, 1, 1.5, 2].map((preset) => (
            <Button
              key={preset}
              size="xs"
              variant={radiusNum === preset ? 'primary' : 'default'}
              onPress={() => setRadius(String(preset))}
              className="flex-1"
            >
              {preset}×
            </Button>
          ))}
        </div>
      </Field>
      <Field label="Border width" live={false}>
        <Segmented
          ariaLabel="Border width"
          value={border}
          onChange={setBorder}
          options={[
            { value: '0', label: 'None' },
            { value: '1', label: '1px' },
            { value: '1.5', label: '1.5px' },
            { value: '2', label: '2px' },
          ]}
        />
      </Field>
    </SectionShell>
  )
}

/* ------------------------------- Density -------------------------------- */

export function DensitySection() {
  const { designSystem, setDensity } = useDesignSystem()
  const [spacing, setSpacing] = useToken(STUB.spacingScale, '1')
  return (
    <SectionShell
      title="Density"
      blurb="How tight or roomy controls, gaps and padding feel."
    >
      <Field label="Density">
        <Segmented
          ariaLabel="Density"
          value={designSystem.density}
          onChange={setDensity}
          options={[
            { value: 'compact', label: 'Compact' },
            { value: 'default', label: 'Default' },
            { value: 'comfortable', label: 'Cozy' },
          ]}
        />
      </Field>
      <Field
        label="Spacing scale"
        live={false}
        hint="Multiplies the spacing rhythm."
      >
        <ValueSlider
          ariaLabel="Spacing scale"
          value={Number.parseFloat(spacing) || 1}
          min={0.75}
          max={1.5}
          step={0.05}
          format={(v) => `${v.toFixed(2)}×`}
          onChange={(v) => setSpacing(String(v))}
        />
      </Field>
    </SectionShell>
  )
}

/* ------------------------------- Surface -------------------------------- */

export function SurfaceSection() {
  const [family, setFamily] = useToken(STUB.styleFamily, 'soft')
  const [shadow, setShadow] = useToken(STUB.shadowIntensity, '0.5')
  const [blur, setBlur] = useToken(STUB.backdropBlur, '0')
  return (
    <SectionShell
      title="Surface & depth"
      blurb="The big re-skin: how flat, soft, raised or glassy everything reads."
    >
      <Field label="Style family" live={false} hint="A one-switch aesthetic.">
        <Segmented
          ariaLabel="Style family"
          value={family}
          onChange={setFamily}
          options={[
            { value: 'flat', label: 'Flat' },
            { value: 'soft', label: 'Soft' },
            { value: 'raised', label: 'Raised' },
            { value: 'glass', label: 'Glass' },
          ]}
        />
      </Field>
      <Field label="Shadow intensity" live={false}>
        <ValueSlider
          ariaLabel="Shadow intensity"
          value={Number.parseFloat(shadow) || 0.5}
          min={0}
          max={1}
          step={0.05}
          format={(v) => `${Math.round(v * 100)}%`}
          onChange={(v) => setShadow(String(v))}
        />
      </Field>
      <Field
        label="Backdrop blur"
        live={false}
        hint="Frost behind menus and overlays."
      >
        <ValueSlider
          ariaLabel="Backdrop blur"
          value={Number.parseFloat(blur) || 0}
          min={0}
          max={24}
          step={1}
          format={(v) => `${v}px`}
          onChange={(v) => setBlur(String(v))}
        />
      </Field>
    </SectionShell>
  )
}

/* -------------------------------- Motion -------------------------------- */

const CURSORS = [
  { id: 'default', label: 'Default' },
  { id: 'pointer', label: 'Pointer' },
  { id: 'not-allowed', label: 'Not allowed' },
  { id: 'wait', label: 'Wait' },
  { id: 'progress', label: 'Progress' },
  { id: 'text', label: 'Text' },
  { id: 'grab', label: 'Grab' },
]

export function MotionSection() {
  const { mode } = useStudio()
  const [duration, setDuration] = useToken(STUB.motionDuration, '150')
  const [easing, setEasing] = useToken(STUB.motionEasing, 'smooth')
  const [enabled, setEnabled] = useToken(STUB.motionEnabled, 'true')
  const [focus, setFocus] = useToken(STUB.focusRingWidth, '2')
  const [interactive, setInteractive] = useToken(
    CURSOR_INTERACTIVE_VAR,
    DEFAULT_CURSOR_INTERACTIVE,
  )
  const [disabled, setDisabled] = useToken(
    CURSOR_DISABLED_VAR,
    DEFAULT_CURSOR_DISABLED,
  )
  return (
    <SectionShell
      title="Motion & feel"
      blurb="Transition speed, easing and how the cursor responds."
    >
      <Subgroup title="Motion">
        <Field label="Duration" live={false} hint="Baseline transition speed.">
          <ValueSlider
            ariaLabel="Duration"
            value={Number.parseFloat(duration) || 150}
            min={0}
            max={400}
            step={10}
            format={(v) => `${v}ms`}
            onChange={(v) => setDuration(String(v))}
          />
        </Field>
        <Field label="Easing" live={false}>
          <Segmented
            ariaLabel="Easing"
            value={easing}
            onChange={setEasing}
            options={[
              { value: 'smooth', label: 'Smooth' },
              { value: 'snappy', label: 'Snappy' },
              { value: 'bouncy', label: 'Bouncy' },
              { value: 'linear', label: 'Linear' },
            ]}
          />
        </Field>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[13px] font-medium text-fg">Animations</span>
          <Switch
            isSelected={enabled === 'true'}
            onChange={(s) => setEnabled(String(s))}
            aria-label="Animations"
          />
        </div>
      </Subgroup>

      <Subgroup title="Interaction">
        <Field label="Interactive cursor">
          <SelectField
            ariaLabel="Interactive cursor"
            value={interactive}
            onChange={setInteractive}
            options={CURSORS}
          />
        </Field>
        <Field label="Disabled cursor">
          <SelectField
            ariaLabel="Disabled cursor"
            value={disabled}
            onChange={setDisabled}
            options={CURSORS}
          />
        </Field>
        {mode === 'pro' && (
          <Field label="Focus ring width" live={false}>
            <ValueSlider
              ariaLabel="Focus ring width"
              value={Number.parseFloat(focus) || 2}
              min={0}
              max={4}
              step={1}
              format={(v) => `${v}px`}
              onChange={(v) => setFocus(String(v))}
            />
          </Field>
        )}
      </Subgroup>
    </SectionShell>
  )
}

/* --------------------------------- Code --------------------------------- */

export function CodeSection() {
  const [defaultMode, setDefaultMode] = useToken(STUB.defaultMode, 'system')
  return (
    <SectionShell
      title="Code & export"
      blurb="Shape the exported code to read like your codebase, then take it anywhere."
    >
      <Field
        label="Boots in"
        live={false}
        hint="Which mode the exported system starts in."
      >
        <Segmented
          ariaLabel="Default mode"
          value={defaultMode}
          onChange={setDefaultMode}
          options={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'system', label: 'Auto' },
          ]}
        />
      </Field>

      <Subgroup title="Code style">
        <CodeOptionsControls />
      </Subgroup>

      <Subgroup title="Export">
        <p className="text-xs leading-snug text-fg-muted">
          Your system is portable. Copy the shadcn install command or open it
          straight in v0 from the export bar below — Bolt, Lovable, Claude and
          Figma are on the way.
        </p>
        <a
          href="https://ui.shadcn.com/docs/cli"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs text-fg-muted hover:text-fg"
        >
          About the shadcn registry
          <ExternalLinkIcon className="size-3" />
        </a>
      </Subgroup>
    </SectionShell>
  )
}
