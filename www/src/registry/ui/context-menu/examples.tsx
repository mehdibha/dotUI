import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import Basic from "./demos/basic";

export default function ContextMenuExamples() {
	return (
		<Examples>
			<Example title="Basic">
				<Basic />
			</Example>
		</Examples>
	);
}
