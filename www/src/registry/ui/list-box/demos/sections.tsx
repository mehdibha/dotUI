import { ListBox, ListBoxItem, ListBoxSection, ListBoxSectionHeader } from "@/registry/ui/list-box";

export default function Demo() {
	return (
		<div className="w-60 rounded-md border bg-popover p-1 shadow-sm">
			<ListBox aria-label="Burger contents" selectionMode="multiple">
				<ListBoxSection>
					<ListBoxSectionHeader>Sauces</ListBoxSectionHeader>
					<ListBoxItem id="signature">Signature sauce</ListBoxItem>
					<ListBoxItem id="bbq">BBQ sauce</ListBoxItem>
					<ListBoxItem id="honey-mustard">Honey mustard</ListBoxItem>
				</ListBoxSection>
				<ListBoxSection>
					<ListBoxSectionHeader>Cheese</ListBoxSectionHeader>
					<ListBoxItem id="pepperjack">Pepperjack</ListBoxItem>
					<ListBoxItem id="mozzarella">Mozzarella</ListBoxItem>
					<ListBoxItem id="blue-cheese">Blue cheese</ListBoxItem>
				</ListBoxSection>
				<ListBoxSection>
					<ListBoxSectionHeader>Extras</ListBoxSectionHeader>
					<ListBoxItem id="bacon">Bacon</ListBoxItem>
					<ListBoxItem id="onions">Sauteed onions</ListBoxItem>
				</ListBoxSection>
			</ListBox>
		</div>
	);
}
