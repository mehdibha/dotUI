'use client'

import { useDesignSystem } from '../../preset'
import { Field, Section, Segmented, ValueSlider } from '../primitives'
import { SPACING_SCALE_VAR, useNumberToken } from '../tokens'

const DENSITY_GAP: Record<string, number> = {
  compact: 4,
  default: 7,
  comfortable: 11,
}

export function SpacingInspector() {
  const { designSystem, setDensity } = useDesignSystem()
  const density = designSystem.density
  const [scale, setScale] = useNumberToken(SPACING_SCALE_VAR, 1)
  const gap = DENSITY_GAP[density] ?? 7

  return (
    <div className="flex flex-col gap-7">
      <Section title="Density">
        <Field
          label="Density"
          live
          hint="Global control heights, gaps and padding."
        >
          <Segmented
            ariaLabel="Density"
            value={density}
            onChange={setDensity}
            options={[
              { value: 'compact', label: 'Compact' },
              { value: 'default', label: 'Default' },
              { value: 'comfortable', label: 'Cozy' },
            ]}
          />
        </Field>
        {/* Live specimen — stacked bars whose gap tracks the chosen density. */}
        <div
          className="flex flex-col rounded-lg border bg-card p-3"
          style={{ gap: `${gap}px` }}
        >
          {[0.9, 0.6, 0.75].map((w, i) => (
            <div
              key={i}
              className="h-2.5 rounded-full bg-fg-muted/25"
              style={{ width: `${w * 100}%` }}
            />
          ))}
        </div>
      </Section>

      <Section title="Spacing scale">
        <Field
          label="Scale multiplier"
          value={`${scale.toFixed(2)}×`}
          hint="Stretch or tighten every spacing token together."
        >
          <ValueSlider
            ariaLabel="Spacing scale"
            value={scale}
            min={0.75}
            max={1.5}
            step={0.05}
            onChange={setScale}
          />
        </Field>
      </Section>
    </div>
  )
}
