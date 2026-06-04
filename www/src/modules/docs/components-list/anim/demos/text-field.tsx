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
				await s.type("field", "hello@dotui.com", setValue);
				await s.wait(1600);
				await s.moveOff();
				await s.wait(700);
			}}
		>
			{(ref) => (
				<div ref={ref("field")} className="w-56">
					<TextField aria-label="Email" value={value} onChange={setValue}>
						<Input placeholder="you@example.com" />
					</TextField>
				</div>
			)}
		</AnimatedPreview>
	);
}
