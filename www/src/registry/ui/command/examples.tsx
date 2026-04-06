import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import Basic from "./demos/basic";
import Dialog from "./demos/dialog";

export default function CommandExamples() {
	return (
		<Examples>
			<Example title="basic">
				<Basic />
			</Example>
			<Example title="dialog">
				<Dialog />
			</Example>
		</Examples>
	);
}
