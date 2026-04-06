import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import EmptyProjects from "./demos/empty-projects";

export default function EmptyExamples() {
	return (
		<Examples>
			<Example title="empty projects">
				<EmptyProjects />
			</Example>
		</Examples>
	);
}
