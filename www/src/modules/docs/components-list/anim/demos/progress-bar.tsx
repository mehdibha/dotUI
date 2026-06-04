"use client";

import { useState } from "react";

import { Label } from "@/registry/ui/field";
import { ProgressBar, ProgressBarControl, ProgressBarOutput } from "@/registry/ui/progress-bar";

import { AnimatedPreview } from "../animated-preview";

// Timer-driven: no cursor. The value climbs to 100% then resets and climbs again.
export default function Demo() {
	const [value, setValue] = useState(0);
	return (
		<AnimatedPreview
			reset={() => setValue(0)}
			script={async (s) => {
				await s.wait(350);
				const steps = 40;
				for (let i = 1; i <= steps; i++) {
					await s.do(() => setValue(Math.round((i / steps) * 100)));
					await s.wait(55);
				}
				await s.wait(900);
			}}
		>
			{() => (
				<ProgressBar aria-label="Uploading" value={value} className="w-60">
					<div className="flex items-center justify-between gap-2">
						<Label>Uploading</Label>
						<ProgressBarOutput />
					</div>
					<ProgressBarControl />
				</ProgressBar>
			)}
		</AnimatedPreview>
	);
}
