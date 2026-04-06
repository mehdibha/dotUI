import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import Action from "./demos/action";
import CustomIcon from "./demos/custom-icon";
import Danger from "./demos/danger";
import Default from "./demos/default";
import Success from "./demos/success";
import Warning from "./demos/warning";

export default function AlertExamples() {
	return (
		<Examples>
			<Example title="default">
				<Default />
			</Example>
			<Example title="danger">
				<Danger />
			</Example>
			<Example title="warning">
				<Warning />
			</Example>
			<Example title="success">
				<Success />
			</Example>
			<Example title="custom icon">
				<CustomIcon />
			</Example>
			<Example title="action">
				<Action />
			</Example>
		</Examples>
	);
}
