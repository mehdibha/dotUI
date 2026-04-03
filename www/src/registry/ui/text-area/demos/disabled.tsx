import { TextArea } from "@/registry/ui/input";
import { TextField } from "@/registry/ui/text-field";

export default function Demo() {
	return (
		<TextField aria-label="Comment" value="This is a comment" isDisabled>
			<TextArea />
		</TextField>
	);
}
