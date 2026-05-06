import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";
import ColorFieldDemo from "@/registry/ui/color-field/demos/basic";
import DateFieldDemo from "@/registry/ui/date-field/demos/basic";
import { Description, Field, Label } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";
import InputDemo from "@/registry/ui/input/demos/default";
import NumberFieldDemo from "@/registry/ui/number-field/demos/basic";
import SearchFieldDemo from "@/registry/ui/search-field/demos/default";
import TextAreaDemo from "@/registry/ui/text-area/demos/default";
import { TextField } from "@/registry/ui/text-field";
import TextFieldDemo from "@/registry/ui/text-field/demos/basic";
import TimeFieldDemo from "@/registry/ui/time-field/demos/default";

export default function InputsGroupExamples() {
	return (
		<Examples>
			<Example title="Input">
				<InputDemo />
			</Example>
			<Example title="Text Field">
				<TextFieldDemo />
			</Example>
			<Example title="Text Area">
				<TextAreaDemo />
			</Example>
			<Example title="Search Field">
				<SearchFieldDemo />
			</Example>
			<Example title="Number Field">
				<NumberFieldDemo />
			</Example>
			<Example title="Color Field">
				<ColorFieldDemo />
			</Example>
			<Example title="Date Field">
				<DateFieldDemo />
			</Example>
			<Example title="Time Field">
				<TimeFieldDemo />
			</Example>
			<Example title="Field">
				<Field className="flex w-full max-w-sm flex-col gap-2">
					<TextField>
						<Label>Email</Label>
						<Input type="email" placeholder="you@example.com" />
						<Description>We&apos;ll never share your email.</Description>
					</TextField>
				</Field>
			</Example>
		</Examples>
	);
}
