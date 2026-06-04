"use client";

import { useState } from "react";

import { Description, Field, FieldContent, Label } from "@/registry/ui/field";
import { Switch, SwitchControl } from "@/registry/ui/switch";

import { AnimatedPreview } from "../animated-preview";

export default function Demo() {
	const [selected, setSelected] = useState(false);
	return (
		<AnimatedPreview
			reset={() => setSelected(false)}
			script={async (s) => {
				await s.wait(600);
				await s.click("switch", () => setSelected(true));
				await s.wait(1300);
				await s.click("switch", () => setSelected(false));
				await s.wait(900);
				await s.moveOff();
				await s.wait(600);
			}}
		>
			{(ref) => (
				<div className="w-60">
					<Field orientation="horizontal">
						<FieldContent>
							<Label>Notifications</Label>
							<Description>Email me about updates.</Description>
						</FieldContent>
						<span ref={ref("switch")}>
							<Switch aria-label="Notifications" isSelected={selected} onChange={setSelected}>
								<SwitchControl />
							</Switch>
						</span>
					</Field>
				</div>
			)}
		</AnimatedPreview>
	);
}
