import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import Default from "./demos/default";
import Disabled from "./demos/disabled";
import Sizes from "./demos/sizes";
import Textarea from "./demos/textarea";

export default function InputExamples() {
	return (
		<Examples className="md:grid-cols-2">
			<Example title="default">
				<Default />
			</Example>
			<Example title="disabled">
				<Disabled />
			</Example>
			<Example title="sizes">
				<Sizes />
			</Example>
			<Example title="textarea">
				<Textarea />
			</Example>
		</Examples>
	);
}
