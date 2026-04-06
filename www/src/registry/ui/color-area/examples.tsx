import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import Channels from "./demos/channels";
import Controlled from "./demos/controlled";
import Default from "./demos/default";
import Disabled from "./demos/disabled";
import Uncontrolled from "./demos/uncontrolled";

export default function ColorAreaExamples() {
	return (
		<Examples>
			<Example title="channels">
				<Channels />
			</Example>
			<Example title="controlled">
				<Controlled />
			</Example>
			<Example title="default">
				<Default />
			</Example>
			<Example title="disabled">
				<Disabled />
			</Example>
			<Example title="uncontrolled">
				<Uncontrolled />
			</Example>
		</Examples>
	);
}
