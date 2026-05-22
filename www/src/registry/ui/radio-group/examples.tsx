import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import Cards from "./demos/cards";
import Default from "./demos/default";
import Description from "./demos/description";
import Disabled from "./demos/disabled";
import ErrorMessage from "./demos/error-message";
import ReadOnly from "./demos/read-only";
import Required from "./demos/required";

export default function RadioGroupExamples() {
	return (
		<Examples className="lg:grid-cols-2">
			<Example title="Default">
				<Default />
			</Example>
			<Example title="With Description">
				<Description />
			</Example>
			<Example title="Error message">
				<ErrorMessage />
			</Example>
			<Example title="Disabled">
				<Disabled />
			</Example>
			<Example title="Read only">
				<ReadOnly />
			</Example>
			<Example title="Required">
				<Required />
			</Example>
			<Example title="Cards">
				<Cards />
			</Example>
		</Examples>
	);
}
