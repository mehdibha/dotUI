"use client";

import { useState } from "react";

import { CircleCheckIcon } from "lucide-react";

import { AnimatedPreview } from "../animated-preview";

// Timer-driven: no cursor. A toast slides up, dwells, then slides back out.
// The real Toast renders through a fixed, body-level portal managed by a global
// singleton, which can't live inside a small isolated card — so this mirrors the
// toast anatomy (bg-card / border / icon / title / description) and animates it.
export default function Demo() {
	const [shown, setShown] = useState(false);
	return (
		<AnimatedPreview
			reset={() => setShown(false)}
			script={async (s) => {
				await s.wait(400);
				await s.do(() => setShown(true));
				await s.wait(2000);
				await s.do(() => setShown(false));
				await s.wait(800);
			}}
		>
			{() => (
				<div className="flex w-full justify-center px-4">
					<div
						className="flex w-72 items-center gap-2 rounded-lg border border-border-success bg-card px-3.5 py-3 text-fg shadow-lg transition-all duration-500 ease-out"
						style={{
							opacity: shown ? 1 : 0,
							transform: shown ? "translateY(0)" : "translateY(12px)",
						}}
					>
						<div className="flex size-4 shrink-0 items-center justify-center text-fg-success">
							<CircleCheckIcon aria-hidden="true" className="size-4" />
						</div>
						<div className="flex min-w-0 flex-1 flex-col gap-0.5">
							<div className="text-sm leading-snug font-medium">Changes saved</div>
							<div className="text-sm leading-snug text-fg-muted">Your update is now live.</div>
						</div>
					</div>
				</div>
			)}
		</AnimatedPreview>
	);
}
