import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import Default from "./demos/animated";

export default function ProgressBarExamples() {
	return (
		<Examples>
			<Example title="default">
				<Default />
			</Example>
		</Examples>
	);
}
