"use client";

import { useState } from "react";

import { SearchField } from "@/registry/ui/search-field";

import { AnimatedPreview } from "../animated-preview";

export default function Demo() {
	const [value, setValue] = useState("");
	return (
		<AnimatedPreview
			reset={() => setValue("")}
			script={async (s) => {
				await s.wait(500);
				await s.type("field", "components", setValue, { perChar: 90 });
				await s.wait(1300);
				await s.moveOff();
				await s.wait(700);
			}}
		>
			{(ref) => (
				<div ref={ref("field")} className="w-56">
					<SearchField aria-label="Search" placeholder="Search..." value={value} onChange={setValue} />
				</div>
			)}
		</AnimatedPreview>
	);
}
