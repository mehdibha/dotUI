'use client'

import { cn } from '@/registry/lib/utils'

import {
  ChapterIntro,
  OptionGrid,
  Section,
  SliderField,
  SwitchField,
} from '../controls'
import {
  BLUR_VAR,
  SHADOW_VAR,
  STYLE_FAMILIES,
  STYLE_FAMILY_VAR,
  type StyleFamily,
  SURFACE_VAR,
  TRANSLUCENT_VAR,
} from '../data'
import { useToken } from '../hooks'
import { useReveals } from '../store'

/** Mini surface that visualizes each style family. */
function FamilyPreview({ family }: { family: StyleFamily }) {
  return (
    <div
      className={cn(
        'size-7 rounded-md bg-card',
        family === 'flat' && 'border',
        family === 'soft' && 'border shadow-sm',
        family === 'elevated' && 'border shadow-md',
        family === 'glass' &&
          'border border-white/20 bg-white/10 shadow-sm backdrop-blur-sm',
      )}
    />
  )
}

export function MaterialChapter() {
  const [family, setFamily] = useToken(STYLE_FAMILY_VAR, 'soft')
  const [shadow, setShadow] = useToken(SHADOW_VAR, '0.5')
  const [blur, setBlur] = useToken(BLUR_VAR, '0')
  const [surface, setSurface] = useToken(SURFACE_VAR, '0.5')
  const [translucent, setTranslucent] = useToken(TRANSLUCENT_VAR, 'false')
  const micro = useReveals('micro')

  return (
    <div className="flex flex-col gap-7">
      <ChapterIntro
        title="Material"
        blurb="One switch re-skins every surface — borders, shadows, and translucency move together."
      />

      <Section label="Style family">
        <OptionGrid
          value={family}
          columns={2}
          onChange={setFamily}
          options={STYLE_FAMILIES.map((f) => ({
            value: f.value,
            label: f.label,
            hint: f.hint,
            preview: <FamilyPreview family={f.value} />,
          }))}
        />
      </Section>

      {micro && (
        <Section label="Depth">
          <SliderField
            label="Shadow intensity"
            value={Number.parseFloat(shadow) || 0.5}
            min={0}
            max={1}
            step={0.05}
            format={(v) => `${Math.round(v * 100)}%`}
            onChange={(v) => setShadow(String(v))}
          />
          <SliderField
            label="Surface contrast"
            value={Number.parseFloat(surface) || 0.5}
            min={0}
            max={1}
            step={0.05}
            format={(v) => `${Math.round(v * 100)}%`}
            onChange={(v) => setSurface(String(v))}
            hint="How much cards separate from the page behind them."
          />
        </Section>
      )}

      <Section label="Translucency">
        <SwitchField
          label="Translucent menus & popovers"
          hint="Frost overlays so the content behind shows through — the grouped 'glassy chrome' switch."
          value={translucent === 'true'}
          onChange={(v) => setTranslucent(String(v))}
        />
        {micro && translucent === 'true' && (
          <SliderField
            label="Backdrop blur"
            value={Number.parseFloat(blur) || 0}
            min={0}
            max={24}
            step={1}
            format={(v) => `${v}px`}
            onChange={(v) => setBlur(String(v))}
          />
        )}
      </Section>
    </div>
  )
}
