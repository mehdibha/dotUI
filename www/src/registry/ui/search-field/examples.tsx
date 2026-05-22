import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import Default from "./demos/default";
import Description from "./demos/description";
import Disabled from "./demos/disabled";
import ErrorMessage from "./demos/error-message";
import Label from "./demos/label";
import ReadOnly from "./demos/read-only";
import Required from "./demos/required";
import Sizes from "./demos/sizes";

export default function SearchFieldExamples() {
	return (
		<Examples className="md:grid-cols-2">
			<Example title="default">
				<Default />
			</Example>
			<Example title="disabled">
				<Disabled />
			</Example>
			<Example title="description">
				<Description />
			</Example>
			<Example title="error message">
				<ErrorMessage />
			</Example>
			<Example title="label">
				<Label />
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
