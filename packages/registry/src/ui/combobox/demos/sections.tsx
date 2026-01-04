import {
	Combobox,
	ComboboxContent,
	ComboboxInput,
	ComboboxItem,
	ComboboxSection,
	ComboboxSectionHeader,
} from "@dotui/registry/ui/combobox";

export default function Demo() {
	return (
		<Combobox aria-label="Country">
			<ComboboxInput />
			<ComboboxContent>
				<ComboboxSection>
					<ComboboxSectionHeader>Africa</ComboboxSectionHeader>
					<ComboboxItem>Tunisia</ComboboxItem>
					<ComboboxItem>Algeria</ComboboxItem>
					<ComboboxItem>Morocco</ComboboxItem>
				</ComboboxSection>
				<ComboboxSection>
					<ComboboxSectionHeader>America</ComboboxSectionHeader>
					<ComboboxItem>Canada</ComboboxItem>
					<ComboboxItem>United states</ComboboxItem>
				</ComboboxSection>
				<ComboboxSection>
					<ComboboxSectionHeader>Asia</ComboboxSectionHeader>
					<ComboboxItem>India</ComboboxItem>
					<ComboboxItem>Japan</ComboboxItem>
					<ComboboxItem>Korea</ComboboxItem>
				</ComboboxSection>
				<ComboboxSection>
					<ComboboxSectionHeader>Europe</ComboboxSectionHeader>
					<ComboboxItem>France</ComboboxItem>
					<ComboboxItem>Germany</ComboboxItem>
					<ComboboxItem>Spain</ComboboxItem>
					<ComboboxItem>United Kingdom</ComboboxItem>
				</ComboboxSection>
			</ComboboxContent>
		</Combobox>
	);
}
