import { parseColor } from "react-aria-components/ColorArea"

import { ColorSlider, ColorSliderControl } from "@/registry/ui/color-slider"

export function ColorSliderDemo() {
  return (
    <ColorSlider
      aria-label="Hue"
      channel="hue"
      defaultValue={parseColor("hsl(200, 100%, 50%)")}
      className="w-44"
    >
      <ColorSliderControl />
    </ColorSlider>
  )
}
