import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

import Basic from "./demos/basic"
import Presets from "./demos/swatches"

export default function ColorPickerExamples() {
  return (
    <Examples className="md:grid-cols-2">
      <Example title="Basic">
        <Basic />
      </Example>
      <Example title="With presets">
        <Presets />
      </Example>

      {/* <Example title="channel sliders">
				<ChannelSliders />
			</Example>
			<Example title="controlled">
				<Controlled />
			</Example>
			<Example title="swatches">
				<Swatches />
			</Example>
			<Example title="uncontrolled">
				<Uncontrolled />
			</Example> */}
    </Examples>
  )
}
