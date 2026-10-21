/* Customize: the picked direction's identity, decided by eye and saved from
   here — no round trip through the chat. Fullscreen when the host has it. */

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react"
import { parseColor } from "react-aria-components/ColorArea"
import type { Color } from "react-aria-components/ColorArea"
import { Radio, RadioGroup } from "react-aria-components/RadioGroup"

import { toHex, toOklch } from "@dotui/colors"

import { ensureFontStylesheets } from "@/lib/fonts"
import { Button } from "@/registry/ui/button"
import { ColorArea } from "@/registry/ui/color-area"
import { ColorField } from "@/registry/ui/color-field"
import { ColorSlider, ColorSliderControl } from "@/registry/ui/color-slider"
import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from "@/registry/ui/color-swatch-picker"
import { Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import { Slider, SliderControl, SliderOutput } from "@/registry/ui/slider"
import { Controls } from "@/components/showcase/controls"
import { DEFAULTS, salvageState } from "@/modules/studio/axes"
import { SHAPES, shapeOf } from "@/modules/studio/axes/shape"
import type { ShapeId } from "@/modules/studio/axes/shape"

import type { Direction, MintedDesignSystem } from "../design"
import { ContrastChips, useContrast } from "./contrast"
import { CardHeader, saveDesign, Themed, useCard, useSystem } from "./shell"
import { Specimen, TypeSpecimen } from "./specimen"

const SHAPE_LABELS: Record<ShapeId, string> = {
  square: "Square",
  sharp: "Sharp",
  standard: "Standard",
  soft: "Soft",
  round: "Round",
}
const DENSITY_LABELS = {
  compact: "Compact",
  default: "Default",
  comfortable: "Comfortable",
} as const
type DensityId = keyof typeof DENSITY_LABELS
type ButtonColor = "accent" | "neutral"

// The pickers speak hex; the brand axis takes any CSS color.
const hexOf = (color: string) => {
  try {
    return toHex(toOklch(color))
  } catch {
    return DEFAULTS.brand
  }
}

const nameOf = ({ name, heading, body }: Direction["pairings"][number]) =>
  name ?? (heading === body ? heading : `${heading} + ${body}`)

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-2.5">
      <h3 className="text-xs font-medium text-fg-muted">{title}</h3>
      {children}
    </section>
  )
}

export function Customize({
  product,
  directions,
  start,
  onBack,
  onSaved,
}: {
  product: string
  directions: Direction[]
  start: number
  onBack: () => void
  onSaved: (saved: MintedDesignSystem) => void
}) {
  const { app, host, mode } = useCard()
  const [index, setIndex] = useState(start)
  const direction = useMemo<Direction>(
    () =>
      directions[index] ??
      directions[0] ?? {
        name: product,
        summary: "",
        diff: {},
        colors: [],
        pairings: [],
      },
    [directions, index, product],
  )
  const [color, setColor] = useState<Color>(() =>
    parseColor(hexOf(direction.colors[0]?.color ?? DEFAULTS.brand)).toFormat(
      "hsl",
    ),
  )
  const [buttons, setButtons] = useState<ButtonColor>("accent")
  const [tint, setTint] = useState(1)
  const [pairing, setPairing] = useState(0)
  const [shape, setShape] = useState<ShapeId>()
  const [density, setDensity] = useState<DensityId>()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string>()

  // A new base direction starts from what it was designed with.
  useEffect(() => {
    const { diff, colors } = direction
    setColor(
      parseColor(hexOf(colors[0]?.color ?? DEFAULTS.brand)).toFormat("hsl"),
    )
    setButtons(diff.buttonColor === "neutral" ? "neutral" : "accent")
    setTint(typeof diff.neutralTint === "number" ? diff.neutralTint : 1)
    setPairing(0)
    // Show the design's own corners and density as picked; a custom mix
    // shows none until the user picks one.
    const own = salvageState(diff)
    setShape(shapeOf(own))
    setDensity(
      own.density in DENSITY_LABELS ? (own.density as DensityId) : undefined,
    )
  }, [direction])

  // Pairing names render in their own heading face.
  useEffect(() => {
    ensureFontStylesheets(document, [
      ...new Set(direction.pairings.flatMap((p) => [p.heading, p.body])),
    ])
  }, [direction])

  const hex = color.toString("hex").toLowerCase()
  const live = useDeferredValue({ hex, buttons, tint })
  const diff = useMemo(
    () => ({
      ...direction.diff,
      brand: live.hex,
      buttonColor: live.buttons,
      neutralTint: live.tint,
      ...direction.pairings[pairing]?.axes,
      ...(shape ? SHAPES[shape] : {}),
      ...(density ? { density } : {}),
    }),
    [direction, live, pairing, shape, density],
  )
  const system = useSystem(diff)
  const preview = useRef<HTMLDivElement>(null)
  const measured = useMemo(() => ({ system, mode }), [system, mode])
  const checks = useContrast(preview, measured)

  async function save() {
    setSaving(true)
    setError(undefined)
    try {
      onSaved(await saveDesign(app, product, diff))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
      setSaving(false)
    }
  }

  const fullscreen = host.displayMode === "fullscreen"
  // Claude's composer floats over the bottom edge in fullscreen.
  const bottom = Math.max(host.safeAreaInsets?.bottom ?? 0, 88) + 16

  const controls = (
    <div className="flex flex-col gap-6">
      {directions.length > 1 && (
        <Section title="Direction">
          <SegmentedControl
            aria-label="Direction"
            selectedKeys={[String(index)]}
            onSelectionChange={(keys) => setIndex(Number([...keys][0] ?? 0))}
          >
            {directions.map((d, i) => (
              <SegmentedControlItem key={d.name} id={String(i)}>
                {d.name}
              </SegmentedControlItem>
            ))}
          </SegmentedControl>
        </Section>
      )}
      <Section title="Color">
        <ColorSwatchPicker
          aria-label="Suggested colors"
          value={color}
          onChange={(next) => setColor(next.toFormat("hsl"))}
        >
          {direction.colors.map((swatch) => (
            <ColorSwatchPickerItem
              key={swatch.color}
              color={hexOf(swatch.color)}
            />
          ))}
        </ColorSwatchPicker>
        <ColorArea
          value={color}
          onChange={setColor}
          xChannel="saturation"
          yChannel="lightness"
          aria-label="Brand color"
          className="aspect-[2/1] h-auto w-full"
        />
        <ColorSlider
          value={color}
          onChange={setColor}
          channel="hue"
          aria-label="Hue"
        >
          <ColorSliderControl />
        </ColorSlider>
        <div className="flex items-end gap-3">
          <ColorField
            value={color}
            onChange={(next) => next && setColor(next.toFormat("hsl"))}
            className="w-28"
          >
            <Label>Hex</Label>
            <Input />
          </ColorField>
          <SegmentedControl
            aria-label="Primary buttons"
            selectedKeys={[buttons]}
            onSelectionChange={(keys) => {
              const next = [...keys][0]
              if (next === "accent" || next === "neutral") setButtons(next)
            }}
          >
            <SegmentedControlItem id="accent">Brand</SegmentedControlItem>
            <SegmentedControlItem id="neutral">Ink</SegmentedControlItem>
          </SegmentedControl>
        </div>
        <Slider
          value={tint}
          onChange={(next) =>
            setTint(Array.isArray(next) ? (next[0] ?? 1) : next)
          }
          minValue={0}
          maxValue={2}
          step={0.05}
        >
          <div className="flex items-center justify-between">
            <Label>Neutral tint</Label>
            <SliderOutput />
          </div>
          <SliderControl />
        </Slider>
      </Section>
      <Section title="Type">
        <RadioGroup
          aria-label="Type pairing"
          value={String(pairing)}
          onChange={(next) => setPairing(Number(next))}
          className="flex flex-col gap-1.5"
        >
          {direction.pairings.map((p, i) => (
            <Radio
              key={nameOf(p)}
              value={String(i)}
              className="flex cursor-pointer items-baseline justify-between gap-3 rounded-lg border px-3 py-2 outline-none data-focus-visible:ring-2 data-focus-visible:ring-primary data-selected:border-primary data-selected:ring-1 data-selected:ring-primary"
            >
              <span
                className="truncate text-base"
                style={{ fontFamily: `"${p.heading}"` }}
              >
                {nameOf(p)}
              </span>
              <span className="shrink-0 text-xs text-fg-muted">
                {p.heading === p.body ? p.body : `${p.heading} / ${p.body}`}
              </span>
            </Radio>
          ))}
        </RadioGroup>
      </Section>
      <Section title="Corners">
        <SegmentedControl
          aria-label="Corners"
          selectedKeys={shape ? [shape] : []}
          onSelectionChange={(keys) => setShape([...keys][0] as ShapeId)}
        >
          {(Object.keys(SHAPE_LABELS) as ShapeId[]).map((id) => (
            <SegmentedControlItem key={id} id={id}>
              {SHAPE_LABELS[id]}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
      </Section>
      <Section title="Density">
        <SegmentedControl
          aria-label="Density"
          selectedKeys={density ? [density] : []}
          onSelectionChange={(keys) => setDensity([...keys][0] as DensityId)}
        >
          {(Object.keys(DENSITY_LABELS) as DensityId[]).map((id) => (
            <SegmentedControlItem key={id} id={id}>
              {DENSITY_LABELS[id]}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
      </Section>
    </div>
  )

  const stage = (
    <div className="flex flex-col gap-3">
      <Themed system={system}>
        <div ref={preview} className="flex flex-col gap-3 rounded-xl bg-bg p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_1.4fr]">
            <Specimen product={product} />
            <Controls />
          </div>
          <TypeSpecimen product={product} large />
        </div>
      </Themed>
      <ContrastChips checks={checks} />
    </div>
  )

  const actions = (
    <div className="flex items-center gap-2">
      {error && <span className="text-xs text-fg-danger">{error}</span>}
      <Button variant="quiet" onPress={onBack} isDisabled={saving}>
        Back
      </Button>
      <Button variant="primary" onPress={save} isPending={saving}>
        Save {product}
      </Button>
    </div>
  )

  if (!fullscreen)
    return (
      <div className="flex flex-col gap-4">
        <CardHeader title={`Customize ${direction.name}`} />
        {controls}
        {stage}
        <div className="flex justify-end">{actions}</div>
      </div>
    )

  // Each column scrolls under a fixed head, so Save never scrolls away.
  return (
    <div className="grid h-dvh grid-cols-[24rem_1fr]">
      <aside className="flex min-h-0 flex-col border-e">
        <p className="shrink-0 px-5 pt-5 pb-4 text-sm font-medium">{product}</p>
        <div
          className="min-h-0 flex-1 overflow-y-auto px-5"
          style={{ paddingBottom: bottom }}
        >
          {controls}
        </div>
      </aside>
      <main className="flex min-h-0 flex-col">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 px-5 pt-5 pb-4">
          <CardHeader title={direction.name} />
          {actions}
        </div>
        <div
          className="min-h-0 flex-1 overflow-y-auto px-5"
          style={{ paddingBottom: bottom }}
        >
          {stage}
        </div>
      </main>
    </div>
  )
}
