import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import Default from "./demos/default";
import Multiple from "./demos/multiple";
import Sizes from "./demos/sizes";
import Variants from "./demos/variants";
import Vertical from "./demos/vertical";
import WithText from "./demos/with-text";

export default function ToggleButtonGroupExamples() {
	return (
		<Examples className="grid-cols-2">
			<Example title="default">
				<Default />
			</Example>
			<Example title="with text">
				<WithText />
			</Example>
			<Example title="variants">
				<Variants />
			</Example>
			<Example title="sizes">
				<Sizes />
			</Example>
			<Example title="vertical">
				<Vertical />
			</Example>
			<Example title="multiple">
				<Multiple />
			</Example>
		</Examples>
	);
}
