import { ColorSwatch } from "@/registry/ui/color-swatch"

const SWATCHES = ["#0ea5e9", "#10b981", "#f59e0b", "#f43f5e"]

export function ColorSwatchDemo() {
  return (
    <div className="flex gap-3">
      {SWATCHES.map((color) => (
        <ColorSwatch key={color} color={color} className="size-10" />
      ))}
    </div>
  )
}
