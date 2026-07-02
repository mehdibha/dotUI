'use client'

import * as icons from '@/registry/__generated__/icons'

import { Field, OptionGrid, Section, ValueSlider } from '../primitives'
import {
  ICON_LIBRARY_VAR,
  ICON_STROKE_VAR,
  useNumberToken,
  useToken,
} from '../tokens'

const LIBRARIES = [
  { value: 'lucide', label: 'Lucide', description: 'Default — 1400+ icons' },
  { value: 'tabler', label: 'Tabler', description: 'Crisp, consistent' },
  { value: 'hugeicons', label: 'Hugeicons', description: 'Large, expressive' },
  { value: 'remix', label: 'Remix', description: 'Filled + outline' },
] as const

const PREVIEW = Object.entries(icons)
  .sort(([a], [b]) => a.localeCompare(b))
  .slice(0, 24)

export function IconsInspector() {
  const [library, setLibrary] = useToken(ICON_LIBRARY_VAR, 'lucide')
  const [stroke, setStroke] = useNumberToken(ICON_STROKE_VAR, 2)

  return (
    <div className="flex flex-col gap-7">
      <Section title="Library">
        <OptionGrid value={library} onChange={setLibrary} options={LIBRARIES} />
      </Section>

      <Section title="Stroke">
        <Field label="Stroke width" value={`${stroke}px`}>
          <ValueSlider
            ariaLabel="Icon stroke"
            value={stroke}
            min={1}
            max={2.5}
            step={0.25}
            onChange={setStroke}
          />
        </Field>
      </Section>

      <Section title="Preview">
        <div className="grid grid-cols-8 gap-2 rounded-lg border bg-card p-3 text-fg [&_svg]:size-5">
          {PREVIEW.map(([name, Icon]) => (
            <div
              key={name}
              className="flex items-center justify-center text-fg-muted"
            >
              <Icon strokeWidth={stroke} />
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
