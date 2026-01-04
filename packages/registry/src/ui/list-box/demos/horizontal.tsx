import { Description, Label } from "@dotui/registry/ui/field";
import { ListBox, ListBoxItem } from "@dotui/registry/ui/list-box";

export default function Demo() {
	return (
		<ListBox aria-label="Options" orientation="horizontal" selectionMode="single">
			<ListBoxItem>
				<Label>Read</Label>
				<Description>Read Only</Description>
			</ListBoxItem>
			<ListBoxItem>
				<Label>Write</Label>
				<Description>Read and Write Only</Description>
			</ListBoxItem>
			<ListBoxItem>
				<Label>Admin</Label>
				<Description>Full access</Description>
			</ListBoxItem>
		</ListBox>
	);
}
