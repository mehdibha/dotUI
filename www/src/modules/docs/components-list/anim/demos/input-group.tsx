"use client";

import { useState } from "react";

import { AtSignIcon } from "lucide-react";

import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input";
import { TextField } from "@/registry/ui/text-field";

import { AnimatedPreview } from "../animated-preview";

export default function Demo() {
	const [value, setValue] = useState("");
	return (
		<AnimatedPreview
			reset={() => setValue("")}
			script={async (s) => {
				await s.wait(500);
				await s.type("field", "mehdibha", setValue, { perChar: 100 });
				await s.wait(1500);
				await s.moveOff();
				await s.wait(700);
			}}
		>
			{(ref) => (
				<div ref={ref("field")} className="w-56">
					<TextField aria-label="Username" value={value} onChange={setValue}>
						<InputGroup>
							<InputGroupAddon>
								<AtSignIcon />
							</InputGroupAddon>
							<Input placeholder="username" />
							<InputGroupAddon>.dev</InputGroupAddon>
						</InputGroup>
					</TextField>
				</div>
			)}
		</AnimatedPreview>
	);
}
