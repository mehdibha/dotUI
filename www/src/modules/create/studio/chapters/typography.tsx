'use client'

import {
  ChapterIntro,
  OptionGrid,
  Section,
  SelectField,
  SliderField,
} from '../controls'
import {
  FONT_BODY_VAR,
  FONT_HEADING_VAR,
  FONT_PAIRINGS,
  HEADING_WEIGHT_VAR,
  LETTER_SPACING_VAR,
  CURATED_FONTS,
  TYPE_BASE_VAR,
  TYPE_SCALE_VAR,
} from '../data'
import { useToken } from '../hooks'
import { useReveals } from '../store'

export function TypographyChapter() {
  const [heading, setHeading] = useToken(FONT_HEADING_VAR, 'Geist')
  const [body, setBody] = useToken(FONT_BODY_VAR, 'Geist')
  const [scale, setScale] = useToken(TYPE_SCALE_VAR, '1.25')
  const [base, setBase] = useToken(TYPE_BASE_VAR, '16')
  const [weight, setWeight] = useToken(HEADING_WEIGHT_VAR, '600')
  const [tracking, setTracking] = useToken(LETTER_SPACING_VAR, '0')
  const micro = useReveals('micro')

  const activePairing = FONT_PAIRINGS.find(
    (p) => p.heading === heading && p.body === body,
  )?.id

  const fontOptions = CURATED_FONTS.map((f) => ({
    value: f,
    label: <span style={{ fontFamily: `'${f}', system-ui` }}>{f}</span>,
  }))

  return (
    <div className="flex flex-col gap-7">
      <ChapterIntro
        title="Typography"
        blurb="A typeface pairing and a rhythm. The fast path is a curated pairing; tune the rest below."
      />

      {/* Live specimen. */}
      <div className="flex flex-col gap-1.5 rounded-xl border bg-card p-4">
        <span className="text-[10px] font-semibold tracking-[0.12em] text-fg-muted uppercase">
          Specimen
        </span>
        <p
          className="leading-tight tracking-tight"
          style={{
            fontFamily: `'${heading}', system-ui`,
            fontSize: `${Number(base) * Number(scale) * 1.6}px`,
            fontWeight: Number(weight),
            letterSpacing: `${tracking}em`,
          }}
        >
          The quick brown fox
        </p>
        <p
          className="text-fg-muted"
          style={{ fontFamily: `'${body}', system-ui`, fontSize: `${base}px` }}
        >
          Jumps over the lazy dog — a complete component library, generated from
          your brand and yours to own.
        </p>
      </div>

      <Section label="Pairing">
        <OptionGrid
          value={activePairing ?? ''}
          columns={3}
          onChange={(id) => {
            const pairing = FONT_PAIRINGS.find((p) => p.id === id)
            if (pairing) {
              setHeading(pairing.heading)
              setBody(pairing.body)
            }
          }}
          options={FONT_PAIRINGS.map((p) => ({
            value: p.id,
            label: p.label,
            preview: (
              <span
                className="text-lg"
                style={{ fontFamily: `'${p.heading}', system-ui` }}
              >
                Ag
              </span>
            ),
          }))}
        />
      </Section>

      <Section label="Faces">
        <SelectField
          label="Display font"
          live
          value={heading}
          onChange={setHeading}
          options={fontOptions}
        />
        <SelectField
          label="Body font"
          live
          value={body}
          onChange={setBody}
          options={fontOptions}
        />
      </Section>

      {micro && (
        <Section label="Rhythm">
          <SliderField
            label="Scale ratio"
            value={Number(scale)}
            min={1.1}
            max={1.5}
            step={0.01}
            format={(v) => v.toFixed(3)}
            onChange={(v) => setScale(String(v))}
            hint="Modular scale between type steps."
          />
          <SliderField
            label="Base size"
            value={Number(base)}
            min={13}
            max={18}
            step={1}
            format={(v) => `${v}px`}
            onChange={(v) => setBase(String(v))}
          />
          <SliderField
            label="Heading weight"
            value={Number(weight)}
            min={400}
            max={800}
            step={100}
            format={(v) => String(v)}
            onChange={(v) => setWeight(String(v))}
          />
          <SliderField
            label="Heading tracking"
            value={Number(tracking)}
            min={-0.04}
            max={0.04}
            step={0.005}
            format={(v) => `${v > 0 ? '+' : ''}${v.toFixed(3)}em`}
            onChange={(v) => setTracking(String(v))}
          />
        </Section>
      )}
    </div>
  )
}
