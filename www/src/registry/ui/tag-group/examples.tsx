import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import Basic from "./demos/basic";
import Disabled from "./demos/disabled";
import Empty from "./demos/empty";
import Links from "./demos/links";
import MultipleSelection from "./demos/multiple-selection";
import Removable from "./demos/removable";
import SingleSelection from "./demos/single-selection";
import Sizes from "./demos/sizes";
import WithCombobox from "./demos/with-combobox";
import WithCombobox2 from "./demos/with-combobox-2";
import WithIcon from "./demos/with-icon";

export default function TagGroupExamples() {
	return (
		<Examples className="md:grid-cols-2">
			<Example title="Basic">
				<Basic />
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
			<Example title="With combobox">
				<WithCombobox />
			</Example>
			<Example title="With combobox 2">
				<WithCombobox2 />
			</Example>
		</Examples>
	);
}
