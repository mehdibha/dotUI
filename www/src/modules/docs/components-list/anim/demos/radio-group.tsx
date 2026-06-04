"use client";

import { useState } from "react";

import { FieldGroup, Label } from "@/registry/ui/field";
import { Radio, RadioControl, RadioGroup } from "@/registry/ui/radio-group";

import { AnimatedPreview } from "../animated-preview";

export default function Demo() {
	const [value, setValue] = useState("free");
	return (
		<AnimatedPreview
			reset={() => setValue("free")}
			script={async (s) => {
				await s.wait(500);
				await s.click("pro", () => setValue("pro"));
				await s.wait(900);
				await s.click("team", () => setValue("team"));
				await s.wait(900);
				await s.click("free", () => setValue("free"));
				await s.wait(900);
				await s.moveOff();
				await s.wait(600);
			}}
		>
			{(ref) => (
				<RadioGroup aria-label="Plan" value={value} onChange={setValue}>
					<FieldGroup>
						<span ref={ref("free")}>
							<Radio value="free">
								<RadioControl />
								<Label>Free</Label>
							</Radio>
						</span>
						<span ref={ref("pro")}>
							<Radio value="pro">
								<RadioControl />
								<Label>Pro</Label>
							</Radio>
						</span>
						<span ref={ref("team")}>
							<Radio value="team">
								<RadioControl />
								<Label>Team</Label>
							</Radio>
						</span>
					</FieldGroup>
				</RadioGroup>
			)}
		</AnimatedPreview>
	);
}
