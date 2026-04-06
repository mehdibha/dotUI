import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import CustomValueLabel from "./demos/custom-value-label";
import Default from "./demos/default";
import Duration from "./demos/duration";
import FormatOptions from "./demos/format-options";
import Indeterminate from "./demos/indeterminate";
import Label from "./demos/label";
import MinMaxValues from "./demos/min-max-values";
import Shape from "./demos/shape";
import Sizes from "./demos/sizes";
import ValueLabel from "./demos/value-label";
import Variants from "./demos/variants";

export default function ProgressBarExamples() {
	return (
		<Examples>
			<Example title="custom value label">
				<CustomValueLabel />
			</Example>
			<Example title="default">
				<Default />
			</Example>
			<Example title="duration">
				<Duration />
			</Example>
			<Example title="format options">
				<FormatOptions />
			</Example>
			<Example title="indeterminate">
				<Indeterminate />
			</Example>
			<Example title="label">
				<Label />
			</Example>
			<Example title="min max values">
				<MinMaxValues />
			</Example>
			<Example title="shape">
				<Shape />
			</Example>
			<Example title="sizes">
				<Sizes />
			</Example>
			<Example title="value label">
				<ValueLabel />
			</Example>
			<Example title="variants">
				<Variants />
			</Example>
		</Examples>
	);
}
