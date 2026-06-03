import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";
import BreadcrumbsDemo from "@/registry/ui/breadcrumbs/demos/basic";
import TabsDemo from "@/registry/ui/tabs/demos/basic";

export default function NavigationGroupExamples() {
	return (
		<Examples>
			<Example title="Breadcrumbs">
				<BreadcrumbsDemo />
			</Example>
			<Example title="Tabs">
				<TabsDemo />
			</Example>
		</Examples>
	);
}
