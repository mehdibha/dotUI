import ColorAreaDemo from "@/registry/ui/color-area/demos/default"
import ColorSliderDemo from "@/registry/ui/color-slider/demos/default"
import SliderDemo from "@/registry/ui/slider/demos/default"
import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

export default function SlidersGroupExamples() {
  return (
    <Examples>
      <Example title="Slider">
        <SliderDemo />
      </Example>
      <Example title="Color Slider">
        <ColorSliderDemo />
      </Example>
      <Example title="Color Area">
        <ColorAreaDemo />
      </Example>
    </Examples>
  )
}
