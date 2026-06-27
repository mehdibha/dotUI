'use client'

import { ChevronDownIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'
import { Select, SelectValue } from '@/registry/ui/select'

import { Field, OptionGrid, Section, ValueSlider } from '../primitives'
import {
  FONT_BODY_VAR,
  FONT_HEADING_VAR,
  LETTER_SPACING_VAR,
  TYPE_BASE_VAR,
  TYPE_SCALE_VAR,
  useNumberToken,
  useToken,
} from '../tokens'

const FONTS = [
  'Geist',
  'Inter',
  'Satoshi',
  'General Sans',
  'IBM Plex Sans',
  'Söhne',
  'Instrument Serif',
  'JetBrains Mono',
]

const PAIRINGS: ReadonlyArray<{
  value: string
  label: string
  description: string
}> = [
  { value: 'Geist', label: 'Geist', description: 'Neutral & modern' },
  { value: 'Inter', label: 'Inter', description: 'Workhorse UI' },
  {
    value: 'Instrument Serif',
    label: 'Editorial',
    description: 'Serif display',
  },
  { value: 'IBM Plex Sans', label: 'Technical', description: 'Plex family' },
]

function FontSelect({
  value,
  onChange,
  ariaLabel,
}: {
  value: string
  onChange: (v: string) => void
  ariaLabel: string
}) {
  return (
    <Select
      className="w-full"
      selectedKey={value}
      onSelectionChange={(k) => onChange(k as string)}
      aria-label={ariaLabel}
    >
      <Button size="sm" className="w-full justify-between">
        <SelectValue className="truncate" />
        <ChevronDownIcon data-icon-end="" />
      </Button>
      <Popover>
        <ListBox>
          {FONTS.map((f) => (
            <ListBoxItem key={f} id={f}>
              {f}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  )
}

export function TypographyInspector() {
  const [heading, setHeading] = useToken(FONT_HEADING_VAR, 'Geist')
  const [body, setBody] = useToken(FONT_BODY_VAR, 'Geist')
  const [scale, setScale] = useNumberToken(TYPE_SCALE_VAR, 1.25)
  const [base, setBase] = useNumberToken(TYPE_BASE_VAR, 16)
  const [tracking, setTracking] = useNumberToken(LETTER_SPACING_VAR, 0)

  return (
    <div className="flex flex-col gap-7">
      {/* Live specimen. */}
      <div className="flex flex-col gap-2 rounded-lg border bg-card p-4">
        <span
          className="leading-none font-semibold"
          style={{
            fontFamily: heading,
            fontSize: base * scale * scale,
            letterSpacing: `${tracking}em`,
          }}
        >
          The quick brown fox
        </span>
        <p
          className="text-fg-muted"
          style={{
            fontFamily: body,
            fontSize: base,
            letterSpacing: `${tracking}em`,
          }}
        >
          Jumps over the lazy dog — a complete component library, generated from
          your brand and ready to ship anywhere.
        </p>
      </div>

      <Section title="Quick pairings">
        <OptionGrid
          value={PAIRINGS.some((p) => p.value === heading) ? heading : ''}
          onChange={(v) => {
            setHeading(v)
            setBody(v)
          }}
          options={PAIRINGS}
        />
      </Section>

      <Section title="Fonts">
        <Field label="Display / headings">
          <FontSelect
            ariaLabel="Heading font"
            value={heading}
            onChange={setHeading}
          />
        </Field>
        <Field label="Body / UI">
          <FontSelect ariaLabel="Body font" value={body} onChange={setBody} />
        </Field>
      </Section>

      <Section title="Rhythm">
        <Field
          label="Scale ratio"
          value={scale.toFixed(3)}
          hint="Modular ratio between steps."
        >
          <ValueSlider
            ariaLabel="Type scale ratio"
            value={scale}
            min={1.1}
            max={1.5}
            step={0.005}
            onChange={setScale}
          />
        </Field>
        <Field label="Base size" value={`${base}px`}>
          <ValueSlider
            ariaLabel="Base size"
            value={base}
            min={13}
            max={18}
            step={1}
            onChange={setBase}
          />
        </Field>
        <Field label="Letter spacing" value={`${tracking.toFixed(3)}em`}>
          <ValueSlider
            ariaLabel="Letter spacing"
            value={tracking}
            min={-0.03}
            max={0.05}
            step={0.005}
            onChange={setTracking}
          />
        </Field>
      </Section>
    </div>
  )
}
