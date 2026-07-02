'use client'

import { DEFAULT_RADIUS_FACTOR, RADIUS_FACTOR_VAR } from '../../layout'
import { Field, Section, ValueSlider } from '../primitives'
import { useNumberToken } from '../tokens'

const RADIUS_PREVIEW = [
  { label: 'sm', scale: 0.5 },
  { label: 'md', scale: 1 },
  { label: 'lg', scale: 1.5 },
  { label: 'xl', scale: 2.5 },
]

export function ShapeInspector() {
  const [factor, setFactor] = useNumberToken(
    RADIUS_FACTOR_VAR,
    Number.parseFloat(DEFAULT_RADIUS_FACTOR),
  )
  const [border, setBorder] = useNumberToken('--ds-border-width', 1)

  return (
    <div className="flex flex-col gap-7">
      <Section title="Corner radius">
        <Field
          label="Radius factor"
          live
          value={`${factor.toFixed(2)}×`}
          hint="Scales the whole corner-radius ramp at once."
        >
          <ValueSlider
            ariaLabel="Radius factor"
            value={factor}
            min={0}
            max={2}
            step={0.05}
            onChange={setFactor}
          />
        </Field>
        {/* Live specimen — each tile multiplies the base radius by the factor. */}
        <div className="flex items-end justify-between gap-2 rounded-lg border bg-card p-3">
          {RADIUS_PREVIEW.map((r) => (
            <div key={r.label} className="flex flex-col items-center gap-1.5">
              <div
                className="size-11 border-2 border-primary/40 bg-primary/10"
                style={{
                  borderRadius: `calc(0.5rem * ${r.scale} * ${factor})`,
                }}
              />
              <span className="font-mono text-[10px] text-fg-muted">
                {r.label}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Borders">
        <Field label="Border width" value={`${border}px`}>
          <ValueSlider
            ariaLabel="Border width"
            value={border}
            min={0}
            max={3}
            step={0.5}
            onChange={setBorder}
          />
        </Field>
      </Section>
    </div>
  )
}
