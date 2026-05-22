import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import Basic from "./demos/basic";
import InModal from "./demos/in-modal";
import InSelect from "./demos/in-select";
import WithTagGroup from "./demos/with-tag-group";

export default function CommandExamples() {
	return (
		<Examples className="md:grid-cols-2 md:grid-rows-2">
			<Example title="basic" className="md:row-span-2">
				<Basic />
			</Example>
			<Example title="in modal" className="md:row-span-1">
				<InModal />
			</Example>
			<Example title="in select" className="md:row-span-1">
				<InSelect />
			</Example>
			<Example title="with tag group">
				<WithTagGroup />
			</Example>
		</Examples>
	);
}
