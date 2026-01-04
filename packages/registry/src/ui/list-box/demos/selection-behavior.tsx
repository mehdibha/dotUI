import { ListBox, ListBoxItem } from "@dotui/registry/ui/list-box";

export default function Demo() {
	return (
		<ListBox aria-label="Framework" selectionMode="multiple" selectionBehavior="replace">
			<ListBoxItem>Next.js</ListBoxItem>
			<ListBoxItem>Remix</ListBoxItem>
			<ListBoxItem>Astro</ListBoxItem>
			<ListBoxItem>Gatsby</ListBoxItem>
		</ListBox>
	);
}
