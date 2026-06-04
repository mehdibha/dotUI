"use client";

import { useState } from "react";

import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox";
import { CheckboxGroup } from "@/registry/ui/checkbox-group";
import { FieldGroup, Label } from "@/registry/ui/field";

import { AnimatedPreview } from "../animated-preview";

export default function Demo() {
	const [value, setValue] = useState<string[]>(["react"]);
	const toggle = (key: string) => setValue((v) => (v.includes(key) ? v.filter((k) => k !== key) : [...v, key]));
	return (
		<AnimatedPreview
			reset={() => setValue(["react"])}
			script={async (s) => {
				await s.wait(500);
				await s.click("vue", () => toggle("vue"));
				await s.wait(800);
				await s.click("svelte", () => toggle("svelte"));
				await s.wait(900);
				await s.click("react", () => toggle("react"));
				await s.wait(900);
				await s.moveOff();
				await s.wait(600);
			}}
		>
			{(ref) => (
				<CheckboxGroup aria-label="Frameworks" value={value} onChange={setValue}>
					<FieldGroup>
						<span ref={ref("react")}>
							<Checkbox value="react">
								<CheckboxControl />
								<Label>React</Label>
							</Checkbox>
						</span>
						<span ref={ref("vue")}>
							<Checkbox value="vue">
								<CheckboxControl />
								<Label>Vue</Label>
							</Checkbox>
						</span>
						<span ref={ref("svelte")}>
							<Checkbox value="svelte">
								<CheckboxControl />
								<Label>Svelte</Label>
							</Checkbox>
						</span>
					</FieldGroup>
				</CheckboxGroup>
			)}
		</AnimatedPreview>
	);
}
