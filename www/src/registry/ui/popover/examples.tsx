import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import Basic from "./demos/basic";
import InDialog from "./demos/in-dialog";
import Placement from "./demos/placement";
import WithForm from "./demos/with-form";

export default function PopoverExamples() {
	return (
		<Examples className="md:grid-cols-2">
			<Example title="basic">
				<Basic />
			</Example>
			<Example title="with form">
				<WithForm />
			</Example>
			<Example title="placement">
				<Placement />
			</Example>
			<Example title="in dialog">
				<InDialog />
			</Example>
		</Examples>
	);
}
