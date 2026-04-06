import { Example } from "@/modules/create/preview/example";

import Card from "./demos/card";
import Orientation from "./demos/orientation";

export default function Examples() {
	return (
		<>
			<Example title="card">
				<Card />
			</Example>
			<Example title="orientation">
				<Orientation />
			</Example>
		</>
	);
}
