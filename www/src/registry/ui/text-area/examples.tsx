import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";
import { Description, Label } from "@/registry/ui/field";
import { TextArea } from "@/registry/ui/input";
import { TextField } from "@/registry/ui/text-field";

export default function TextAreaExamples() {
	return (
		<Examples className="md:grid-cols-2">
			<TextAreaBasic />
			<TextAreaInvalid />
			<TextAreaWithLabel />
			<TextAreaWithDescription />
			<TextAreaDisabled />
		</Examples>
	);
}

function TextAreaBasic() {
	return (
		<Example title="Basic">
			<TextArea placeholder="Type your message here." />
		</Example>
	);
}

function TextAreaInvalid() {
	return (
		<Example title="Invalid">
			<TextField isInvalid>
				<TextArea placeholder="Type your message here." />
			</TextField>
		</Example>
	);
}

function TextAreaWithLabel() {
	return (
		<Example title="With Label">
			<TextField>
				<Label>Message</Label>
				<TextArea placeholder="Type your message here." />
			</TextField>
		</Example>
	);
}

function TextAreaWithDescription() {
	return (
		<Example title="With Description">
			<TextField>
				<Label>Message</Label>
				<TextArea placeholder="Type your message here." />
				<Description>Type your message and press enter to send.</Description>
			</TextField>
		</Example>
	);
}

function TextAreaDisabled() {
	return (
		<Example title="Disabled">
			<TextField isDisabled>
				<Label>Message</Label>
				<TextArea placeholder="Type your message here." />
			</TextField>
		</Example>
	);
}
