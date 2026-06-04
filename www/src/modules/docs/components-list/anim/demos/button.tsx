"use client";

import { useState } from "react";

import { Button } from "@/registry/ui/button";

import { AnimatedPreview } from "../animated-preview";

export default function Demo() {
	const [pressed, setPressed] = useState(false);
	return (
		<AnimatedPreview
			reset={() => setPressed(false)}
			script={async (s) => {
				await s.wait(500);
				await s.click("btn", () => {
					setPressed(true);
					setTimeout(() => setPressed(false), 160);
				});
				await s.wait(1400);
				await s.moveOff();
				await s.wait(700);
			}}
		>
			{(ref) => (
				<span ref={ref("btn")} className="inline-block transition-transform" style={{ scale: pressed ? 0.94 : 1 }}>
					<Button variant="primary">Get started</Button>
				</span>
			)}
		</AnimatedPreview>
	);
}
