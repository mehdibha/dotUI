"use client";

import { useState } from "react";

import { Checkbox } from "@/registry/ui/checkbox";

import { AnimatedPreview } from "../animated-preview";

export default function Demo() {
	const [selected, setSelected] = useState(false);
	return (
		<AnimatedPreview
			reset={() => setSelected(false)}
			script={async (s) => {
				await s.wait(500);
				await s.click("box", () => setSelected(true));
				await s.wait(1300);
				await s.click("box", () => setSelected(false));
				await s.wait(900);
				await s.moveOff();
				await s.wait(500);
			}}
		>
			{(ref) => (
				<span ref={ref("box")}>
					<Checkbox isSelected={selected} onChange={setSelected}>
						Subscribe to updates
					</Checkbox>
				</span>
			)}
		</AnimatedPreview>
	);
}
