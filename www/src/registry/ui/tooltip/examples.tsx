import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import Arrow from "./demos/arrow";
import ContainerPadding from "./demos/container-padding";
import Default from "./demos/default";
import Delay from "./demos/delay";
import Flip from "./demos/flip";
import Offset from "./demos/offset";
import Placement from "./demos/placement";
import Variant from "./demos/variant";
import WithArrow from "./demos/with-arrow";

export default function TooltipExamples() {
	return (
		<Examples>
			<Example title="arrow">
				<Arrow />
			</Example>
			<Example title="container padding">
				<ContainerPadding />
			</Example>
			<Example title="default">
				<Default />
			</Example>
			<Example title="delay">
				<Delay />
			</Example>
			<Example title="flip">
				<Flip />
			</Example>
			<Example title="offset">
				<Offset />
			</Example>
			<Example title="placement">
				<Placement />
			</Example>
			<Example title="variant">
				<Variant />
			</Example>
			<Example title="with arrow">
				<WithArrow />
			</Example>
		</Examples>
	);
}
