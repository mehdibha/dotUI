import { useEffect, useState } from 'react'
import { converter, formatHex, parse } from 'culori'

import { Playground } from '@/components/playground'
import { Input } from '@/ui/input'
import { Slider, SliderControl } from '@/ui/slider'
import { TextField } from '@/ui/text-field'

const toRgb = converter('rgb')
const toHsl = converter('hsl')
const toOklch = converter('oklch')

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

type Rgb = { r: number; g: number; b: number }

export function OneColorFourNames() {
  const [rgb, setRgbState] = useState<Rgb>(() => {
    const c = toRgb({ mode: 'oklch', l: 0.62, c: 0.13, h: 250 })
    return { r: clamp01(c.r), g: clamp01(c.g), b: clamp01(c.b) }
  })

  const setRgb = (next: Rgb) =>
    setRgbState({ r: clamp01(next.r), g: clamp01(next.g), b: clamp01(next.b) })

  const hex = formatHex({ mode: 'rgb', ...rgb })
  const hsl = toHsl({ mode: 'rgb', ...rgb })
  const oklch = toOklch({ mode: 'rgb', ...rgb })

  const h255 = (n: number) => Math.round(n * 255)
  const hue = Math.round(hsl.h ?? 0)
  const sat = Math.round((hsl.s ?? 0) * 100)
  const lig = Math.round((hsl.l ?? 0) * 100)
  const okL = oklch.l ?? 0
  const okC = oklch.c ?? 0
  const okH = Math.round(oklch.h ?? 0)

  const setFromHsl = (next: { h: number; s: number; l: number }) =>
    setRgb(toRgb({ mode: 'hsl', h: next.h, s: next.s / 100, l: next.l / 100 }))

  const setFromOklch = (next: { l: number; c: number; h: number }) =>
    setRgb(toRgb({ mode: 'oklch', l: next.l, c: next.c, h: next.h }))

  const [hexInput, setHexInput] = useState(hex)
  useEffect(() => setHexInput(hex), [hex])

  const onHexChange = (value: string) => {
    setHexInput(value)
    const parsed = parse(value)
    if (parsed) {
      const c = toRgb(parsed)
      setRgb({ r: c.r, g: c.g, b: c.b })
    }
  }

  return (
    <Playground question="Different colors, or different names for one color?">
      <div className="flex flex-col gap-5 sm:flex-row">
        <div
          className="h-32 shrink-0 rounded-lg border sm:h-auto sm:w-32"
          style={{ backgroundColor: hex }}
        />

        <div className="grid flex-1 gap-5 sm:grid-cols-2">
          <Panel tag="HEX">
            <TextField
              aria-label="HEX"
              value={hexInput}
              onChange={onHexChange}
              className="w-full"
            >
              <Input className="font-mono" />
            </TextField>
          </Panel>

          <Panel tag="RGB">
            <Channel
              label="R"
              value={h255(rgb.r)}
              min={0}
              max={255}
              step={1}
              onChange={(v) => setRgb({ ...rgb, r: v / 255 })}
            />
            <Channel
              label="G"
              value={h255(rgb.g)}
              min={0}
              max={255}
              step={1}
              onChange={(v) => setRgb({ ...rgb, g: v / 255 })}
            />
            <Channel
              label="B"
              value={h255(rgb.b)}
              min={0}
              max={255}
              step={1}
              onChange={(v) => setRgb({ ...rgb, b: v / 255 })}
            />
          </Panel>

          <Panel tag="HSL">
            <Channel
              label="H"
              value={hue}
              min={0}
              max={360}
              step={1}
              onChange={(v) => setFromHsl({ h: v, s: sat, l: lig })}
            />
            <Channel
              label="S"
              value={sat}
              min={0}
              max={100}
              step={1}
              onChange={(v) => setFromHsl({ h: hue, s: v, l: lig })}
            />
            <Channel
              label="L"
              value={lig}
              min={0}
              max={100}
              step={1}
              onChange={(v) => setFromHsl({ h: hue, s: sat, l: v })}
            />
          </Panel>

          <Panel tag="OKLCH">
            <Channel
              label="L"
              value={okL}
              display={okL.toFixed(2)}
              min={0}
              max={1}
              step={0.01}
              onChange={(v) => setFromOklch({ l: v, c: okC, h: okH })}
            />
            <Channel
              label="C"
              value={okC}
              display={okC.toFixed(3)}
              min={0}
              max={0.4}
              step={0.005}
              onChange={(v) => setFromOklch({ l: okL, c: v, h: okH })}
            />
            <Channel
              label="H"
              value={okH}
              min={0}
              max={360}
              step={1}
              onChange={(v) => setFromOklch({ l: okL, c: okC, h: v })}
            />
          </Panel>
        </div>
      </div>
    </Playground>
  )
}

function Panel({ tag, children }: { tag: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border p-3">
      <span className="font-mono text-[0.7rem] tracking-wider text-fg-muted uppercase">
        {tag}
      </span>
      {children}
    </div>
  )
}

function Channel({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string
  value: number
  display?: string
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-4 shrink-0 font-mono text-xs text-fg-muted">
        {label}
      </span>
      <Slider
        aria-label={label}
        value={value}
        onChange={(v) => onChange(v as number)}
        minValue={min}
        maxValue={max}
        step={step}
        className="flex-1"
      >
        <SliderControl />
      </Slider>
      <span className="w-10 shrink-0 text-right font-mono text-xs text-fg-muted tabular-nums">
        {display ?? value}
      </span>
    </div>
  )
}
