import { Example } from "@/modules/create/preview/example";

import Basic from "./demos/basic";
import Placement from "./demos/placement";

export default function Examples() {
	return (
		<>
			<Example title="basic">
				<Basic />
			</Example>
			<Example title="placement">
				<Placement />
			</Example>
		</>
	);
}
