import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import Composition from "./demos/composition";
import Controlled from "./demos/controlled";
import Default from "./demos/default";
import Description from "./demos/description";
import Disabled from "./demos/disabled";
import FormatOptions from "./demos/format-options";
import Label from "./demos/label";
import Range from "./demos/range";
import Sizes from "./demos/sizes";
import Step from "./demos/step";
import Uncontrolled from "./demos/uncontrolled";
import ValueLabel from "./demos/value-label";
import ValueScale from "./demos/value-scale";
import Vertical from "./demos/vertical";

export default function SliderExamples() {
	return (
		<Examples>
			<Example title="composition">
				<Composition />
			</Example>
			<Example title="controlled">
				<Controlled />
			</Example>
			<Example title="default">
				<Default />
			</Example>
			<Example title="description">
				<Description />
			</Example>
			<Example title="disabled">
				<Disabled />
			</Example>
			<Example title="format options">
				<FormatOptions />
			</Example>
			<Example title="label">
				<Label />
			</Example>
			<Example title="range">
				<Range />
			</Example>
			<Example title="sizes">
				<Sizes />
			</Example>
			<Example title="step">
				<Step />
			</Example>
			<Example title="uncontrolled">
				<Uncontrolled />
			</Example>
			<Example title="value label">
				<ValueLabel />
			</Example>
			<Example title="value scale">
				<ValueScale />
			</Example>
			<Example title="vertical">
				<Vertical />
			</Example>
		</Examples>
	);
}
