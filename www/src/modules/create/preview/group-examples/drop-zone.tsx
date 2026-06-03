import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";
import DropZoneDemo from "@/registry/ui/drop-zone/demos/basic";

export default function DropZoneGroupExamples() {
	return (
		<Examples>
			<Example title="Drop Zone">
				<DropZoneDemo />
			</Example>
		</Examples>
	);
}
