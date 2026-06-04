"use client";

import { Loader } from "@/registry/ui/loader";

import { AnimatedPreview } from "../animated-preview";

// Display-only: no cursor. The loader spins on its own (CSS animation).
export default function Demo() {
	return (
		<AnimatedPreview
			script={async (s) => {
				await s.moveOff();
				await s.wait(2000);
			}}
		>
			{() => (
				<div className="flex items-center gap-2 text-sm text-fg-muted">
					<Loader />
					<span>Loading…</span>
				</div>
			)}
		</AnimatedPreview>
	);
}
