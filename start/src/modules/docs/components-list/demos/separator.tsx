import { Separator } from "@dotui/registry/ui/separator";

export function SeparatorDemo() {
	return (
		<div className="space-y-2 p-4">
			<div>
				<h3 className="font-bold">dotUI</h3>
				<p className="text-fg-muted text-sm">Accessible UI components.</p>
			</div>
			<Separator className="my-4" />
			<div className="flex h-5 items-center space-x-4 text-sm">
				<div>Docs</div>
				<Separator orientation="vertical" />
				<div>Components</div>
				<Separator orientation="vertical" />
				<div>Styles</div>
			</div>
		</div>
	);
}
