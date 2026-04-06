import { Example } from "@/modules/create/preview/example";

import Basic from "./demos/basic";
import ReactAria from "./demos/react-aria";

export default function Examples() {
	return (
		<>
			<Example title="basic">
				<Basic />
			</Example>
			<Example title="react aria">
				<ReactAria />
			</Example>
		</>
	);
}
