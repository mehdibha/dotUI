import { TextArea } from "@dotui/registry/ui/input";
import { TextField } from "@dotui/registry/ui/text-field";

export default function Demo() {
	return (
		<TextField aria-label="Comment" value="This is a comment" isDisabled>
			<TextArea />
		</TextField>
	);
}
