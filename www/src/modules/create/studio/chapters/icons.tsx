'use client'

import {
  CalendarIcon,
  CheckIcon,
  HeartIcon,
  SearchIcon,
  SettingsIcon,
  StarIcon,
} from 'lucide-react'

import { ChapterIntro, OptionGrid, Section, SliderField } from '../controls'
import { ICON_LIBRARIES, ICON_LIBRARY_VAR, ICON_STROKE_VAR } from '../data'
import { useToken } from '../hooks'
import { useReveals } from '../store'

const SAMPLE = [
  SearchIcon,
  HeartIcon,
  StarIcon,
  CheckIcon,
  SettingsIcon,
  CalendarIcon,
]

export function IconsChapter() {
  const [library, setLibrary] = useToken(ICON_LIBRARY_VAR, 'lucide')
  const [stroke, setStroke] = useToken(ICON_STROKE_VAR, '2')
  const micro = useReveals('micro')
  const strokeNum = Number.parseFloat(stroke) || 2

  return (
    <div className="flex flex-col gap-7">
      <ChapterIntro
        title="Icons"
        blurb="The icon set the system ships with, plus its weight and size."
      />

      {/* Live sample row at the current stroke. */}
      <div className="flex items-center justify-between gap-2 rounded-xl border bg-card px-4 py-3 text-fg-muted">
        {SAMPLE.map((Icon, i) => (
          <Icon key={i} className="size-5" strokeWidth={strokeNum} />
        ))}
      </div>

      <Section label="Library">
        <OptionGrid
          value={library}
          columns={2}
          onChange={setLibrary}
          options={ICON_LIBRARIES.map((lib) => ({
            value: lib.value,
            label: lib.label,
            hint: lib.hint,
            preview: (
              <div className="flex items-center gap-1.5 text-fg-muted">
                <StarIcon className="size-4" strokeWidth={strokeNum} />
                <HeartIcon className="size-4" strokeWidth={strokeNum} />
                <CheckIcon className="size-4" strokeWidth={strokeNum} />
              </div>
            ),
          }))}
        />
      </Section>

      {micro && (
        <Section label="Weight">
          <SliderField
            label="Stroke width"
            value={strokeNum}
            min={1}
            max={2.5}
            step={0.25}
            format={(v) => `${v}px`}
            onChange={(v) => setStroke(String(v))}
          />
        </Section>
      )}
    </div>
  )
}
