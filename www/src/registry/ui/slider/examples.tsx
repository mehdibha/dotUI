import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import Default from "./demos/default";
import Description from "./demos/description";
import Disabled from "./demos/disabled";
import FormatOptions from "./demos/format-options";
import Label from "./demos/label";
import Range from "./demos/range";
import Step from "./demos/step";
import Uncontrolled from "./demos/uncontrolled";
import ValueLabel from "./demos/value-label";
import ValueScale from "./demos/value-scale";
import Vertical from "./demos/vertical";

export default function SliderExamples() {
	return (
		<Examples className="md:grid-cols-2">
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
