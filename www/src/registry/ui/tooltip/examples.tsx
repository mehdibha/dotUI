import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import Basic from "./demos/basic";
import Formatted from "./demos/formatted";
import LongContent from "./demos/long-content";
import OnLink from "./demos/on-link";
import Placement from "./demos/placement";
import WithIcon from "./demos/with-icon";
import WithKeyboard from "./demos/with-keyboard";

export default function TooltipExamples() {
	return (
		<Examples className="md:grid-cols-2">
			<Example title="basic">
				<Basic />
			</Example>
			<Example title="with icon">
				<WithIcon />
			</Example>
			<Example title="with keyboard">
				<WithKeyboard />
			</Example>
			<Example title="on link">
				<OnLink />
			</Example>
			<Example title="long content">
				<LongContent />
			</Example>
			<Example title="formatted">
				<Formatted />
			</Example>
			<Example title="placement">
				<Placement />
			</Example>
		</Examples>
	);
}
