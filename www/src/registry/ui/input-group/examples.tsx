"use client";

import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import Addons from "./demos/addons";
import Basic from "./demos/basic";
import Buttons from "./demos/buttons";

export default function InputGroupExamples() {
	return (
		<Examples className="**:data-input-group:w-full **:data-input:w-full **:data-textfield:w-full lg:grid-cols-2">
			<Example title="basic">
				<Basic />
			</Example>
			<Example title="With addons">
				<Addons />
			</Example>
			<Example title="With buttons">
				<Buttons />
			</Example>
		</Examples>
	);
}
