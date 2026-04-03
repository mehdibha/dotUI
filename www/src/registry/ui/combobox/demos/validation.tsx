import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem } from "@/registry/ui/combobox";
import { FieldError } from "@/registry/ui/field";

export default function Demo() {
	return (
		<Combobox aria-label="Country" isInvalid>
			<ComboboxInput />
			<FieldError>Please select a country in the list.</FieldError>
			<ComboboxContent>
				<ComboboxItem>Canada</ComboboxItem>
				<ComboboxItem>France</ComboboxItem>
				<ComboboxItem>Germany</ComboboxItem>
				<ComboboxItem>Spain</ComboboxItem>
				<ComboboxItem>Tunisia</ComboboxItem>
				<ComboboxItem>United states</ComboboxItem>
				<ComboboxItem>United Kingdom</ComboboxItem>
			</ComboboxContent>
		</Combobox>
	);
}
