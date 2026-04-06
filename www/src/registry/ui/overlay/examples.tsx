import { Example } from "@/modules/create/preview/example";

import Basic from "./demos/basic";
import Type from "./demos/type";

export default function Examples() {
	return (
		<>
			<Example title="basic">
				<Basic />
			</Example>
			<Example title="type">
				<Type />
			</Example>
		</>
	);
}
