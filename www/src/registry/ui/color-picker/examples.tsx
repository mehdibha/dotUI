import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import Basic from "./demos/basic";
import ChannelSliders from "./demos/channel-sliders";
import Controlled from "./demos/controlled";
import Presets from "./demos/swatches";
import Uncontrolled from "./demos/uncontrolled";

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
	);
}
