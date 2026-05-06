import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import BasicDemo from "./demos/basic";
import CardDemo from "./demos/card";
import ControlledDemo from "./demos/controlled";
import DescriptionDemo from "./demos/description";
import DisabledDemo from "./demos/disabled";
import ReadOnlyDemo from "./demos/read-only";
import SizesDemo from "./demos/sizes";
import StandaloneDemo from "./demos/standalone";

export default function SwitchExamples() {
	return (
		<Examples className="**:data-example-preview:justify-center lg:grid-cols-2">
			<Example title="Standalone">
				<StandaloneDemo />
			</Example>
			<Example title="Basic">
				<BasicDemo />
			</Example>
			<Example title="With description">
				<DescriptionDemo />
			</Example>
			<Example title="Disabled">
				<DisabledDemo />
			</Example>
			<Example title="Read only">
				<ReadOnlyDemo />
			</Example>
			<Example title="Sizes">
				<SizesDemo />
			</Example>
			<Example title="Controlled">
				<ControlledDemo />
			</Example>
			<Example title="Card">
				<CardDemo />
			</Example>
		</Examples>
	);
}
