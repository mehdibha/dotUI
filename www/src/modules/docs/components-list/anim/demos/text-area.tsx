"use client";

import { useState } from "react";

import { Label } from "@/registry/ui/field";
import { TextArea } from "@/registry/ui/input";
import { TextField } from "@/registry/ui/text-field";

import { AnimatedPreview } from "../animated-preview";

export default function Demo() {
	const [value, setValue] = useState("");
	return (
		<AnimatedPreview
			reset={() => setValue("")}
			script={async (s) => {
				await s.wait(500);
				await s.type("field", "Roses are red,\nviolets are blue.", setValue, { perChar: 55 });
				await s.wait(1500);
				await s.moveOff();
				await s.wait(700);
			}}
		>
			{(ref) => (
				<div ref={ref("field")} className="w-56">
					<TextField value={value} onChange={setValue}>
						<Label>Message</Label>
						<TextArea placeholder="Write something..." />
					</TextField>
				</div>
			)}
		</AnimatedPreview>
	);
}
