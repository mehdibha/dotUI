import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import Basic from "./demos/basic";
import Description from "./demos/description";
import Disabled from "./demos/disabled";
import ErrorMessage from "./demos/error-message";
import FormatOptions from "./demos/format-options";
import Label from "./demos/label";
import ReadOnly from "./demos/read-only";
import Required from "./demos/required";
import Sizes from "./demos/sizes";
import WithInputGroup from "./demos/with-input-group";


export default function NumberFieldExamples() {
	return (
		<Examples className="md:grid-cols-2">
			<Example title="basic">
				<Basic />
			</Example>
			<Example title="With input group">
				<WithInputGroup />
			</Example>
			<Example title="disabled">
				<Disabled />
			</Example>
			<Example title="with label">
				<Label />
			</Example>
			<Example title="description">
				<Description />
			</Example>
			<Example title="error message">
				<ErrorMessage />
			</Example>
			<Example title="format options">
				<FormatOptions />
			</Example>
			<Example title="read only">
				<ReadOnly />
			</Example>
			<Example title="required">
				<Required />
			</Example>
			<Example title="sizes">
				<Sizes />
			</Example>
		</Examples>
	);
}
