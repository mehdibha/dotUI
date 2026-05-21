import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import Card from "./demos/card";

export default function SkeletonExamples() {
	return (
		<Examples className="md:grid-cols-2">
			<Example title="card">
				<Card />
			</Example>
		</Examples>
	);
}
