import { useState } from "react"
import { parseColor } from "react-aria-components/ColorPicker"

import { SparklesIcon } from "@/registry/icons"
import { Button } from "@/registry/ui/button"
import { ColorArea } from "@/registry/ui/color-area"
import { ColorField } from "@/registry/ui/color-field"
import { ColorPicker } from "@/registry/ui/color-picker"
import { ColorSlider } from "@/registry/ui/color-slider"
import { ColorSwatch } from "@/registry/ui/color-swatch"
import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from "@/registry/ui/color-swatch-picker"
import { DialogContent } from "@/registry/ui/dialog"
import { Input } from "@/registry/ui/input"
import { Popover } from "@/registry/ui/popover"

const SWATCHES = [
  "#e5484d",
  "#f76b15",
  "#ffc53d",
  "#30a46c",
  "#0090ff",
  "#6e56cf",
]

export function ColorScene() {
  const [color, setColor] = useState(() => parseColor("#6e56cf"))
  const hex = color.toString("hex")

  return (
    <div className="flex flex-col items-center gap-5">
      {/* The app icon wears the picked color live. */}
      <div
        className="flex size-20 items-center justify-center rounded-[1.375rem] text-white shadow-lg ring-1 ring-black/10 ring-inset"
        style={{
          background: `linear-gradient(160deg, ${hex}, color-mix(in oklab, ${hex}, black 35%))`,
        }}
      >
        <SparklesIcon className="size-9" />
      </div>
      <ColorPicker value={color} onChange={setColor}>
        <Button variant="secondary">
          <ColorSwatch className="size-5 rounded-full" />
          <span className="font-mono text-sm uppercase">{hex}</span>
        </Button>
        <Popover>
          <DialogContent className="gap-3">
            <ColorArea
              aria-label="Color"
              colorSpace="hsb"
              xChannel="saturation"
              yChannel="brightness"
              className="w-full"
            />
            <ColorSlider
              colorSpace="hsb"
              channel="hue"
              className="in-data-sheet:w-full"
            />
            <ColorSwatchPicker aria-label="Presets" className="justify-between">
              {SWATCHES.map((swatch) => (
                <ColorSwatchPickerItem key={swatch} color={swatch} />
              ))}
            </ColorSwatchPicker>
            <ColorField aria-label="Hex">
              <Input className="font-mono uppercase" />
            </ColorField>
          </DialogContent>
        </Popover>
      </ColorPicker>
    </div>
  )
}
