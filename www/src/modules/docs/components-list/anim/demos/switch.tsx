"use client";

import { useState } from "react";

import { Switch } from "@/registry/ui/switch";

import { AnimatedPreview } from "../animated-preview";

export default function Demo() {
	const [selected, setSelected] = useState(false);
	return (
		<AnimatedPreview
			reset={() => setSelected(false)}
			script={async (s) => {
				await s.wait(500);
				await s.click("sw", () => setSelected(true));
				await s.wait(1300);
				await s.click("sw", () => setSelected(false));
				await s.wait(900);
				await s.moveOff();
				await s.wait(500);
			}}
		>
			{(ref) => (
				<span ref={ref("sw")}>
					<Switch isSelected={selected} onChange={setSelected}>
						Airplane mode
					</Switch>
				</span>
			)}
		</AnimatedPreview>
	);
}
