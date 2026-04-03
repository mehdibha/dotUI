import { Kbd, KbdGroup } from "@/registry/ui/kbd";

export function KbdDemo() {
	return (
		<div className="flex gap-4">
			<KbdGroup>
				<Kbd>⌘</Kbd>
				<Kbd>K</Kbd>
			</KbdGroup>
			<KbdGroup>
				<Kbd>Ctrl</Kbd>
				<Kbd>C</Kbd>
			</KbdGroup>
		</div>
	);
}
