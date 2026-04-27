import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import Default from "./demos/basic";
import ChannelSliders from "./demos/channel-sliders";
import Controlled from "./demos/controlled";
import Swatches from "./demos/swatches";
import Uncontrolled from "./demos/uncontrolled";

export default function ColorPickerExamples() {
	return (
		<Examples>
			<Example title="channel sliders">
				<ChannelSliders />
			</Example>
			<Example title="controlled">
				<Controlled />
			</Example>
			<Example title="default">
				<Default />
			</Example>
			<Example title="swatches">
				<Swatches />
			</Example>
			<Example title="uncontrolled">
				<Uncontrolled />
			</Example>
		</Examples>
	);
}
