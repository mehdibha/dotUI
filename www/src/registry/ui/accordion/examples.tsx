import { Example } from "@/registry/ui/example";

import AllowsMultiple from "./demos/allows-multiple";
import Basic from "./demos/basic";
import DefaultExpanded from "./demos/default-expanded";
import Disabled from "./demos/disabled";

export default function Examples() {
	return (
		<>
			<Example title="Basic" >
				<Basic />
			</Example>
			<Example title="Multiple">
				<AllowsMultiple />
			</Example>
			<Example title="default expanded">
				<DefaultExpanded />
			</Example>
			<Example title="disabled">
				<Disabled />
			</Example>
		</>
	);
}
