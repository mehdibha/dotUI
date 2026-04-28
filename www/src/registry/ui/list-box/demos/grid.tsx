import { ListBox, ListBoxItem } from "@/registry/ui/list-box";

export default function Demo() {
	return (
		<div className="rounded-md border bg-card shadow-sm">
			<ListBox aria-label="Frameworks" layout="grid" selectionMode="multiple">
				<ListBoxItem id="next">Next.js</ListBoxItem>
				<ListBoxItem id="remix">Remix</ListBoxItem>
				<ListBoxItem id="astro">Astro</ListBoxItem>
				<ListBoxItem id="gatsby">Gatsby</ListBoxItem>
				<ListBoxItem id="solid">SolidStart</ListBoxItem>
				<ListBoxItem id="qwik">Qwik City</ListBoxItem>
			</ListBox>
		</div>
	);
}
