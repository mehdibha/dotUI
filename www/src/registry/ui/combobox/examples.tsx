import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import AsyncLoading from "./demos/async-loading";
import Basic from "./demos/basic";
import Controlled from "./demos/controlled";
import CustomValue from "./demos/custom-value";
import Description from "./demos/description";
import Disabled from "./demos/disabled";
import Label from "./demos/label";
import Loading from "./demos/loading";
import Required from "./demos/required";
import Sections from "./demos/sections";
import Uncontrolled from "./demos/uncontrolled";
import Validation from "./demos/validation";

export default function ComboboxExamples() {
	return (
		<Examples>
			<Example title="async loading">
				<AsyncLoading />
			</Example>
			<Example title="basic">
				<Basic />
			</Example>
			<Example title="controlled">
				<Controlled />
			</Example>
			<Example title="custom value">
				<CustomValue />
			</Example>
			<Example title="description">
				<Description />
			</Example>
			<Example title="disabled">
				<Disabled />
			</Example>
			<Example title="label">
				<Label />
			</Example>
			<Example title="loading">
				<Loading />
			</Example>
			<Example title="required">
				<Required />
			</Example>
			<Example title="sections">
				<Sections />
			</Example>
			<Example title="uncontrolled">
				<Uncontrolled />
			</Example>
			<Example title="validation">
				<Validation />
			</Example>
		</Examples>
	);
}
