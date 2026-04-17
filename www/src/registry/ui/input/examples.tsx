import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import Default from "./demos/default";
import Disabled from "./demos/disabled";
import InputGroupDemo from "./demos/input-group";
import Sizes from "./demos/sizes";
import TextAreaDemo from "./demos/textarea";

export default function InputExamples() {
	return (
		<Examples>
			<Example title="default">
				<Default />
			</Example>
			<Example title="sizes">
				<Sizes />
			</Example>
			<Example title="disabled">
				<Disabled />
			</Example>
			<Example title="input group">
				<InputGroupDemo />
			</Example>
			<Example title="textarea">
				<TextAreaDemo />
			</Example>
		</Examples>
	);
}
