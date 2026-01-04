import { CopyIcon, PlusSquareIcon, SquarePenIcon } from "@dotui/registry/icons";
import { Description, Label } from "@dotui/registry/ui/field";
import { ListBox, ListBoxItem } from "@dotui/registry/ui/list-box";

export default function Demo() {
	return (
		<ListBox aria-label="Framework" className="w-60">
			<ListBoxItem>
				<PlusSquareIcon />
				<Label>New file</Label>
				<Description>Create a new file</Description>
			</ListBoxItem>
			<ListBoxItem>
				<CopyIcon />
				<Label>Copy link</Label>
				<Description>Copy the file link</Description>
			</ListBoxItem>
			<ListBoxItem>
				<SquarePenIcon />
				<Label>Edit file</Label>
				<Description>Allows you to edit the file</Description>
			</ListBoxItem>
		</ListBox>
	);
}
