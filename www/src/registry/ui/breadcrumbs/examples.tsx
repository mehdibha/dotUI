import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import Basic from "./demos/basic";
import Composition from "./demos/composition";
import Disabled from "./demos/disabled";
import Icon from "./demos/icon";
import MenuDemo from "./demos/menu";
import RouterIntegration from "./demos/router-integration";

export default function BreadcrumbsExamples() {
	return (
		<Examples>
			<Example title="basic">
				<Basic />
			</Example>
			<Example title="composition">
				<Composition />
			</Example>
			<Example title="disabled">
				<Disabled />
			</Example>
			<Example title="icon">
				<Icon />
			</Example>
			<Example title="menu">
				<MenuDemo />
			</Example>
			<Example title="router integration">
				<RouterIntegration />
			</Example>
		</Examples>
	);
}
