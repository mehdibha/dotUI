"use client";

import { useState } from "react";

import { Link } from "@/registry/ui/link";

import { AnimatedPreview } from "../animated-preview";

export default function Demo() {
	const [pressed, setPressed] = useState(false);
	return (
		<AnimatedPreview
			reset={() => setPressed(false)}
			script={async (s) => {
				await s.wait(500);
				await s.hover("link", { dwell: 1000 });
				await s.press(() => {
					setPressed(true);
					setTimeout(() => setPressed(false), 160);
				});
				await s.wait(1100);
				await s.moveOff();
				await s.wait(600);
			}}
		>
			{(ref) => (
				<p className="text-sm text-fg-muted">
					Built with{" "}
					<span ref={ref("link")} className="inline-block transition-transform" style={{ scale: pressed ? 0.94 : 1 }}>
						<Link href="#">React Aria</Link>
					</span>{" "}
					primitives.
				</p>
			)}
		</AnimatedPreview>
	);
}
