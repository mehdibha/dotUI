import { ListBox, ListBoxItem } from "@dotui/registry/ui/list-box";

export function ListBoxDemo() {
	return (
		<ListBox aria-label="Framework">
			<ListBoxItem>Next.js</ListBoxItem>
			<ListBoxItem>Remix</ListBoxItem>
			<ListBoxItem>Astro</ListBoxItem>
			<ListBoxItem>Gatsby</ListBoxItem>
		</ListBox>
	);
}
