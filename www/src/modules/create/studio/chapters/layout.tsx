'use client'

import { useDesignSystem } from '../../preset'
import type { Density } from '../../preset'
import {
  ChapterIntro,
  Field,
  OptionGrid,
  Section,
  SliderField,
} from '../controls'
import {
  BORDER_WIDTH_VAR,
  DEFAULT_RADIUS_FACTOR,
  RADIUS_FACTOR_VAR,
  SPACING_SCALE_VAR,
} from '../data'
import { useToken } from '../hooks'
import { useReveals } from '../store'

const DENSITIES: Array<{ value: Density; label: string; gap: number }> = [
  { value: 'compact', label: 'Compact', gap: 3 },
  { value: 'default', label: 'Default', gap: 5 },
  { value: 'comfortable', label: 'Cozy', gap: 8 },
]

export function LayoutChapter() {
  const { designSystem, setDensity } = useDesignSystem()
  const [radius, setRadius] = useToken(RADIUS_FACTOR_VAR, DEFAULT_RADIUS_FACTOR)
  const [border, setBorder] = useToken(BORDER_WIDTH_VAR, '1')
  const [spacing, setSpacing] = useToken(SPACING_SCALE_VAR, '1')
  const micro = useReveals('micro')

  const radiusNum = Number.parseFloat(radius) || 1

  return (
    <div className="flex flex-col gap-7">
      <ChapterIntro
        title="Shape & density"
        blurb="How round, how bordered, how tight. These set the silhouette of every component."
      />

      <Section label="Shape">
        <Field label="Corner radius" value={`${radiusNum.toFixed(2)}×`} live>
          <div className="mb-2 flex items-center gap-1.5">
            {[6, 10, 16].map((base) => (
              <div
                key={base}
                className="h-8 flex-1 border bg-neutral"
                style={{ borderRadius: `calc(${base}px * ${radiusNum})` }}
              />
            ))}
          </div>
          <SliderField
            label="Corner radius"
            value={radiusNum}
            min={0}
            max={2}
            step={0.05}
            format={(v) => `${v.toFixed(2)}×`}
            onChange={(v) => setRadius(String(v))}
          />
        </Field>
        {micro && (
          <SliderField
            label="Border width"
            value={Number.parseFloat(border) || 1}
            min={0}
            max={3}
            step={0.5}
            format={(v) => `${v}px`}
            onChange={(v) => setBorder(String(v))}
          />
        )}
      </Section>

      <Section label="Density">
        <OptionGrid
          value={designSystem.density}
          columns={3}
          onChange={(v) => setDensity(v as Density)}
          options={DENSITIES.map((d) => ({
            value: d.value,
            label: d.label,
            preview: (
              <div className="flex flex-col" style={{ gap: d.gap }}>
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-[3px] w-8 rounded-full bg-fg-muted/60"
                  />
                ))}
              </div>
            ),
          }))}
        />
        {micro && (
          <SliderField
            label="Spacing scale"
            value={Number.parseFloat(spacing) || 1}
            min={0.75}
            max={1.5}
            step={0.05}
            format={(v) => `${v.toFixed(2)}×`}
            onChange={(v) => setSpacing(String(v))}
            hint="Multiplies gaps and padding on top of density."
          />
        )}
      </Section>
    </div>
  )
}
