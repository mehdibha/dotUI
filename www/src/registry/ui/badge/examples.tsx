import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import Count from "./demos/count";
import Default from "./demos/default";
import Icon from "./demos/icon";
import Link from "./demos/link";
import Loader from "./demos/loader";
import Pending from "./demos/pending";
import Sizes from "./demos/sizes";
import Variants from "./demos/variants";

export default function BadgeExamples() {
	return (
		<Examples>
			<Example title="count">
				<Count />
			</Example>
			<Example title="default">
				<Default />
			</Example>
			<Example title="icon">
				<Icon />
			</Example>
			<Example title="link">
				<Link />
			</Example>
			<Example title="loader">
				<Loader />
			</Example>
			<Example title="pending">
				<Pending />
			</Example>
			<Example title="sizes">
				<Sizes />
			</Example>
			<Example title="variants">
				<Variants />
			</Example>
		</Examples>
	);
}
