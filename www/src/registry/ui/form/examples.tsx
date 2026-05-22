import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import Basic from "./demos/basic";
import ReactAria from "./demos/react-aria";

export default function FormExamples() {
	return (
		<Examples>
			<Example title="basic">
				<Basic />
			</Example>
			<Example title="react aria">
				<ReactAria />
			</Example>
		</Examples>
	);
}
