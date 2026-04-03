import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem } from "@/registry/ui/combobox";
import { Description, Label } from "@/registry/ui/field";

export default function Demo() {
	return (
		<Combobox>
			<Label>Country</Label>
			<ComboboxInput />
			<ComboboxContent>
				<ComboboxItem>Canada</ComboboxItem>
				<ComboboxItem>France</ComboboxItem>
				<ComboboxItem>Germany</ComboboxItem>
				<ComboboxItem>Spain</ComboboxItem>
				<ComboboxItem>Tunisia</ComboboxItem>
				<ComboboxItem>United states</ComboboxItem>
				<ComboboxItem>United Kingdom</ComboboxItem>
			</ComboboxContent>
			<Description>Please select a country.</Description>
		</Combobox>
	);
}
