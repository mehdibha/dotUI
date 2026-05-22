import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import Basic from "./demos/basic";

export default function LoaderExamples() {
	return (
		<Examples>
			<Example title="basic">
				<Basic />
			</Example>
		</Examples>
	);
}
