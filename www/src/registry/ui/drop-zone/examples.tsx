import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import Basic from "./demos/basic";
import Disabled from "./demos/disabled";
import Events from "./demos/events";
import FileTrigger from "./demos/file-trigger";
import Label from "./demos/label";
import VisualFeedback from "./demos/visual-feedback";

export default function DropZoneExamples() {
	return (
		<Examples>
			<Example title="basic">
				<Basic />
			</Example>
			<Example title="disabled">
				<Disabled />
			</Example>
			<Example title="events">
				<Events />
			</Example>
			<Example title="file trigger">
				<FileTrigger />
			</Example>
			<Example title="label">
				<Label />
			</Example>
			<Example title="visual feedback">
				<VisualFeedback />
			</Example>
		</Examples>
	);
}
