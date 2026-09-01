import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from "@/registry/ui/color-swatch-picker"

const SWATCHES = [
  "#FF6B6B",
  "#FFA07A",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#A29BFE",
]

export function ColorSwatchPickerDemo() {
  return (
    <ColorSwatchPicker defaultValue="#4D96FF">
      {SWATCHES.map((color) => (
        <ColorSwatchPickerItem key={color} color={color} />
      ))}
    </ColorSwatchPicker>
  )
}
