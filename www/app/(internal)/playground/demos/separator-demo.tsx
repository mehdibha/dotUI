"use client";

import { Separator } from "@dotui/registry/ui/separator";

export function SeparatorDemo() {
	return (
		<div>
			<div className="space-y-1">
				<h4 className="font-medium text-sm leading-none">Tanstack start</h4>
				<p className="text- fg-muted text-sm">Full-stack Framework for React and Solid</p>
			</div>
			<Separator className="my-4" />
			<div className="flex h-5 items-center space-x-4 text-sm">
				<div>Routing</div>
				<Separator orientation="vertical" />
				<div>SSR</div>
				<Separator orientation="vertical" />
				<div>Deploy Anywhere</div>
			</div>
		</div>
	);
}
