import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem } from "@/registry/ui/combobox";
import { Label } from "@/registry/ui/field";

export default function Demo() {
	return (
		<Combobox className="w-60">
			<Label>Country</Label>
			<ComboboxInput placeholder="Search…" />
			<ComboboxContent>
				<ComboboxItem id="ca">Canada</ComboboxItem>
				<ComboboxItem id="fr">France</ComboboxItem>
				<ComboboxItem id="de">Germany</ComboboxItem>
				<ComboboxItem id="es">Spain</ComboboxItem>
				<ComboboxItem id="tn">Tunisia</ComboboxItem>
				<ComboboxItem id="us">United States</ComboboxItem>
				<ComboboxItem id="uk">United Kingdom</ComboboxItem>
			</ComboboxContent>
		</Combobox>
	);
}
