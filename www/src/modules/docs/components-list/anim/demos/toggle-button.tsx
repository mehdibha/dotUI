"use client";

import { useState } from "react";

import { PinIcon } from "@/registry/__generated__/icons";
import { ToggleButton } from "@/registry/ui/toggle-button";

import { AnimatedPreview } from "../animated-preview";

export default function Demo() {
	const [isSelected, setSelected] = useState(false);
	return (
		<AnimatedPreview
			reset={() => setSelected(false)}
			script={async (s) => {
				await s.wait(500);
				await s.click("tgl", () => setSelected(true));
				await s.wait(1300);
				await s.click("tgl", () => setSelected(false));
				await s.wait(900);
				await s.moveOff();
				await s.wait(500);
			}}
		>
			{(ref) => (
				<span ref={ref("tgl")}>
					<ToggleButton isSelected={isSelected} onChange={setSelected} aria-label="Pin">
						<PinIcon data-icon-start="" className="rotate-45" />
						Pin
					</ToggleButton>
				</span>
			)}
		</AnimatedPreview>
	);
}
