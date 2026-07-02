'use client'

import { BoxIcon, GlassWaterIcon, LayersIcon, SquareIcon } from 'lucide-react'

import { Field, OptionGrid, Section, ValueSlider } from '../primitives'
import {
  BACKDROP_BLUR_VAR,
  ELEVATION_STYLE_VAR,
  SHADOW_INTENSITY_VAR,
  useNumberToken,
  useToken,
} from '../tokens'

const STYLES = [
  {
    value: 'flat',
    label: 'Flat',
    description: 'No shadow, hairline borders',
    icon: SquareIcon,
  },
  {
    value: 'soft',
    label: 'Soft',
    description: 'Subtle ambient shadow',
    icon: LayersIcon,
  },
  {
    value: 'depth',
    label: '3D',
    description: 'Pronounced layered depth',
    icon: BoxIcon,
  },
  {
    value: 'glass',
    label: 'Glass',
    description: 'Frosted, translucent',
    icon: GlassWaterIcon,
  },
] as const

export function ElevationInspector() {
  const [style, setStyle] = useToken(ELEVATION_STYLE_VAR, 'soft')
  const [intensity, setIntensity] = useNumberToken(SHADOW_INTENSITY_VAR, 0.5)
  const [blur, setBlur] = useNumberToken(BACKDROP_BLUR_VAR, 0)

  // A specimen card whose shadow tracks the chosen intensity + style.
  const shadow =
    style === 'flat'
      ? 'none'
      : style === 'glass'
        ? `0 8px 32px rgba(0,0,0,${0.12 * intensity})`
        : style === 'depth'
          ? `0 1px 2px rgba(0,0,0,${0.2 * intensity}), 0 12px 24px -6px rgba(0,0,0,${0.35 * intensity})`
          : `0 1px 3px rgba(0,0,0,${0.18 * intensity})`

  return (
    <div className="flex flex-col gap-7">
      <Section title="Surface style">
        <OptionGrid value={style} onChange={setStyle} options={STYLES} />
        {/* Specimen */}
        <div className="flex items-center justify-center rounded-lg border bg-neutral p-6">
          <div
            className="flex h-20 w-32 items-center justify-center rounded-lg border bg-card text-xs text-fg-muted"
            style={{
              boxShadow: shadow,
              backdropFilter: blur ? `blur(${blur}px)` : undefined,
            }}
          >
            Card
          </div>
        </div>
      </Section>

      <Section title="Shadow">
        <Field label="Intensity" value={`${Math.round(intensity * 100)}%`}>
          <ValueSlider
            ariaLabel="Shadow intensity"
            value={intensity}
            min={0}
            max={1}
            step={0.05}
            onChange={setIntensity}
          />
        </Field>
        <Field
          label="Backdrop blur"
          value={`${blur}px`}
          hint="Frost behind overlays, menus and popovers."
        >
          <ValueSlider
            ariaLabel="Backdrop blur"
            value={blur}
            min={0}
            max={24}
            step={1}
            onChange={setBlur}
          />
        </Field>
      </Section>
    </div>
  )
}
