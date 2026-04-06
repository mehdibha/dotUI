import { Example } from "@/modules/create/preview/example";

import Controlled from "./demos/controlled";
import Default from "./demos/default";
import Disabled from "./demos/disabled";
import Shapes from "./demos/shapes";
import Sizes from "./demos/sizes";
import Uncontrolled from "./demos/uncontrolled";
import Variants from "./demos/variants";

export default function Examples() {
	return (
		<>
			<Example title="controlled">
				<Controlled />
			</Example>
			<Example title="default">
				<Default />
			</Example>
			<Example title="disabled">
				<Disabled />
			</Example>
			<Example title="shapes">
				<Shapes />
			</Example>
			<Example title="sizes">
				<Sizes />
			</Example>
			<Example title="uncontrolled">
				<Uncontrolled />
			</Example>
			<Example title="variants">
				<Variants />
			</Example>
		</>
	);
}
