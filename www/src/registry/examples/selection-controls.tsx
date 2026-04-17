import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";
import CheckboxDemo from "@/registry/ui/checkbox/demos/basic";
import CheckboxGroupDemo from "@/registry/ui/checkbox-group/demos/default";
import RadioGroupDemo from "@/registry/ui/radio-group/demos/default";
import SwitchDemo from "@/registry/ui/switch/demos/default";

export default function SelectionControlsGroupExamples() {
	return (
		<Examples>
			<Example title="Checkbox">
				<CheckboxDemo />
			</Example>
			<Example title="Checkbox Group">
				<CheckboxGroupDemo />
			</Example>
			<Example title="Radio Group">
				<RadioGroupDemo />
			</Example>
			<Example title="Switch">
				<SwitchDemo />
			</Example>
		</Examples>
	);
}
