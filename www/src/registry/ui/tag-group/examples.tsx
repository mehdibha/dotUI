import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import Default from "./demos/default";
import Disabled from "./demos/disabled";
import Empty from "./demos/empty";
import Links from "./demos/links";
import MultipleSelection from "./demos/multiple-selection";
import Removable from "./demos/removable";
import SingleSelection from "./demos/single-selection";
import Sizes from "./demos/sizes";
import WithIcon from "./demos/with-icon";

export default function TagGroupExamples() {
	return (
		<Examples>
			<Example title="Default">
				<Default />
			</Example>
			<Example title="Removable">
				<Removable />
			</Example>
			<Example title="Single selection">
				<SingleSelection />
			</Example>
			<Example title="Multiple selection">
				<MultipleSelection />
			</Example>
			<Example title="Disabled">
				<Disabled />
			</Example>
			<Example title="Sizes">
				<Sizes />
			</Example>
			<Example title="With icon">
				<WithIcon />
			</Example>
			<Example title="Links">
				<Links />
			</Example>
			<Example title="Empty state">
				<Empty />
			</Example>
		</Examples>
	);
}
