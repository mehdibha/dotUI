"use client";

import { Separator } from "@/registry/ui/separator";

import { AnimatedPreview } from "../animated-preview";

export default function Demo() {
	return (
		<AnimatedPreview
			script={async (s) => {
				await s.moveOff();
				await s.wait(2400);
			}}
		>
			{() => (
				<div className="w-56">
					<div>
						<h3 className="text-sm font-bold">dotUI</h3>
						<p className="text-xs text-fg-muted">Accessible UI components.</p>
					</div>
					<Separator className="my-3" />
					<div className="flex h-5 items-center space-x-3 text-sm">
						<span>Docs</span>
						<Separator orientation="vertical" />
						<span>Components</span>
						<Separator orientation="vertical" />
						<span>Hooks</span>
					</div>
				</div>
			)}
		</AnimatedPreview>
	);
}
