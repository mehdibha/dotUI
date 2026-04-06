import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import Basic from "./demos/basic";
import Placement from "./demos/placement";

export default function DrawerExamples() {
	return (
		<Examples>
			<Example title="basic">
				<Basic />
			</Example>
			<Example title="placement">
				<Placement />
			</Example>
		</Examples>
	);
}
