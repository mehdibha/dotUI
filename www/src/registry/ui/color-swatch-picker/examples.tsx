import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import Basic from "./demos/basic";
import Controlled from "./demos/controlled";
import Disabled from "./demos/disabled";

export default function ColorSwatchPickerExamples() {
	return (
		<Examples>
			<Example title="basic">
				<Basic />
			</Example>
			<Example title="controlled">
				<Controlled />
			</Example>
			<Example title="disabled">
				<Disabled />
			</Example>
		</Examples>
	);
}
