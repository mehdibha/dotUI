import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import Basic from "./demos/basic";
import Controlled from "./demos/controlled";
import HandleOnly from "./demos/handle-only";
import Indent from "./demos/indent";
import Nested from "./demos/nested";
import NonDismissable from "./demos/non-dismissable";
import Placement from "./demos/placement";
import Scrollable from "./demos/scrollable";
import WithForm from "./demos/with-form";

export default function DrawerExamples() {
	return (
		<Examples className="md:grid-cols-2">
			<Example title="basic">
				<Basic />
			</Example>
			<Example title="placement">
				<Placement />
			</Example>
			<Example title="indent">
				<Indent />
			</Example>
			<Example title="nested">
				<Nested />
			</Example>
			<Example title="scrollable">
				<Scrollable />
			</Example>
			<Example title="with form">
				<WithForm />
			</Example>
			<Example title="handle only">
				<HandleOnly />
			</Example>
			<Example title="controlled">
				<Controlled />
			</Example>
			<Example title="non-dismissable">
				<NonDismissable />
			</Example>
		</Examples>
	);
}
