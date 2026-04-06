import { Example } from "@/modules/create/preview/example";

import Cards from "./demos/cards";
import Controlled from "./demos/controlled";
import Default from "./demos/default";
import Description from "./demos/description";
import Disabled from "./demos/disabled";
import ErrorMessage from "./demos/error-message";
import Label from "./demos/label";
import ReadOnly from "./demos/read-only";
import Required from "./demos/required";
import Uncontrolled from "./demos/uncontrolled";

export default function Examples() {
	return (
		<>
			<Example title="cards">
				<Cards />
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
			<Example title="uncontrolled">
				<Uncontrolled />
			</Example>
		</>
	);
}
