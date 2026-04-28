import { ListBox, ListBoxItem } from "@/registry/ui/list-box";

export default function Demo() {
	return (
		<div className="rounded-md border bg-card shadow-sm">
			<ListBox aria-label="Toppings" selectionMode="multiple" defaultSelectedKeys={["mushroom", "olives"]}>
				<ListBoxItem id="mushroom">Mushroom</ListBoxItem>
				<ListBoxItem id="olives">Olives</ListBoxItem>
				<ListBoxItem id="onion">Onion</ListBoxItem>
				<ListBoxItem id="pepperoni">Pepperoni</ListBoxItem>
				<ListBoxItem id="basil">Fresh basil</ListBoxItem>
				<ListBoxItem id="bacon">Bacon</ListBoxItem>
			</ListBox>
		</div>
	);
}
