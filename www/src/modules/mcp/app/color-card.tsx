import { useDeferredValue, useMemo, useRef, useState } from "react"
import { parseColor } from "react-aria-components/ColorArea"
import type { Color } from "react-aria-components/ColorArea"

import { toHex, toOklch } from "@dotui/colors"

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
import { DEFAULTS } from "@/modules/studio/axes"

import type { Diff, Swatch } from "../design"
import { ContrastChips, useContrast } from "./contrast"
import type { Mode } from "./shell"
import {
  CardActions,
  CardHeader,
  sendPick,
  Themed,
  useCard,
  useSystem,
} from "./shell"
import { Specimen } from "./specimen"

export interface ColorPayload {
  card: "color"
  product: string
  design: Diff
  candidates: Swatch[]
}

// The pickers speak hex; the brand axis takes any CSS color.
const hexOf = (color: string) => {
  try {
    return toHex(toOklch(color))
  } catch {
    return DEFAULTS.brand
  }
}

const BUTTON_LABELS = { accent: "Brand", neutral: "Ink" } as const
type ButtonColor = keyof typeof BUTTON_LABELS

export function ColorCard({ product, design, candidates }: ColorPayload) {
  const { app } = useCard()
  const swatches = useMemo(
    () => candidates.map((c) => ({ ...c, hex: hexOf(c.color) })),
    [candidates],
  )
  const [color, setColor] = useState<Color>(() =>
    parseColor(
      swatches[0]?.hex ?? hexOf(String(design.brand ?? DEFAULTS.brand)),
    ).toFormat("hsl"),
  )
  const [buttons, setButtons] = useState<ButtonColor>(
    design.buttonColor === "neutral" ? "neutral" : "accent",
  )
  const [tint, setTint] = useState(
    typeof design.neutralTint === "number" ? design.neutralTint : 1,
  )
  const [sent, setSent] = useState(false)

  const hex = color.toString("hex").toLowerCase()
  // Dragging the area re-themes two previews: let them trail the thumb.
  const live = useDeferredValue({ hex, buttons, tint })
  const axes = useMemo(
    () => ({
      brand: live.hex,
      buttonColor: live.buttons,
      neutralTint: live.tint,
    }),
    [live],
  )
  const system = useSystem(
    useMemo(() => ({ ...design, ...axes }), [design, axes]),
  )
  const named = swatches.find((s) => s.hex === hex)?.label

  async function confirm() {
    await sendPick(
      app,
      `Use ${hex} with ${BUTTON_LABELS[buttons].toLowerCase()} buttons.`,
      { axes },
    )
    setSent(true)
  }

  return (
    <div className="flex flex-col gap-4">
      <CardHeader title={`Brand color for ${product}`} modeSwitch={false} />
      <div className="grid gap-4 sm:grid-cols-[13rem_1fr]">
        <div className="flex flex-col gap-2">
          <ColorArea
            value={color}
            onChange={setColor}
            xChannel="saturation"
            yChannel="lightness"
            aria-label="Brand color"
            className="aspect-[4/3] h-auto w-full"
            isDisabled={sent}
          />
          <ColorSlider
            value={color}
            onChange={setColor}
            channel="hue"
            aria-label="Hue"
            isDisabled={sent}
          >
            <ColorSliderControl />
          </ColorSlider>
        </div>
        <div className="flex flex-col gap-4">
          {swatches.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-fg-muted">
                Suggested{named ? ` · ${named}` : ""}
              </span>
              <ColorSwatchPicker
                aria-label="Suggested colors"
                value={color}
                onChange={(next) => setColor(next.toFormat("hsl"))}
              >
                {swatches.map((swatch) => (
                  <ColorSwatchPickerItem key={swatch.hex} color={swatch.hex} />
                ))}
              </ColorSwatchPicker>
            </div>
          )}
          <ColorField
            value={color}
            onChange={(next) => next && setColor(next.toFormat("hsl"))}
            isDisabled={sent}
            className="max-w-40"
          >
            <Label>Hex</Label>
            <Input />
          </ColorField>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-fg-muted">Primary buttons</span>
            <SegmentedControl
              aria-label="Primary buttons"
              selectedKeys={[buttons]}
              onSelectionChange={(keys) => {
                const next = [...keys][0]
                if (next === "accent" || next === "neutral") setButtons(next)
              }}
              isDisabled={sent}
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
            isDisabled={sent}
          >
            <div className="flex items-center justify-between">
              <Label>Neutral tint</Label>
              <SliderOutput />
            </div>
            <SliderControl />
          </Slider>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Preview system={system} mode="light" product={product} />
        <Preview system={system} mode="dark" product={product} />
      </div>
      <CardActions>
        <Button variant="primary" isDisabled={sent} onPress={confirm}>
          {sent ? `Picked ${hex}` : `Continue with ${hex}`}
        </Button>
      </CardActions>
    </div>
  )
}

function Preview({
  system,
  mode,
  product,
}: {
  system: ReturnType<typeof useSystem>
  mode: Mode
  product: string
}) {
  const root = useRef<HTMLDivElement>(null)
  const checks = useContrast(root, system)
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-fg-muted capitalize">{mode}</span>
      <Themed system={system} mode={mode}>
        <div ref={root}>
          <Specimen product={product} />
        </div>
      </Themed>
      <ContrastChips checks={checks} />
    </div>
  )
}
