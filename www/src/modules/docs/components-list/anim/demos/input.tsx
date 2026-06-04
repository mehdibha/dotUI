"use client";

import { useState } from "react";

import { Input } from "@/registry/ui/input";
import { TextField } from "@/registry/ui/text-field";

import { AnimatedPreview } from "../animated-preview";

export default function Demo() {
	const [value, setValue] = useState("");
	return (
		<AnimatedPreview
			reset={() => setValue("")}
			script={async (s) => {
				await s.wait(500);
				await s.type("field", "dotUI", setValue, { perChar: 110 });
				await s.wait(1500);
				await s.moveOff();
				await s.wait(700);
			}}
		>
			{(ref) => (
				<div ref={ref("field")} className="w-52">
					<TextField aria-label="Name" value={value} onChange={setValue}>
						<Input placeholder="Enter text..." />
					</TextField>
				</div>
			)}
		</AnimatedPreview>
	);
}
