"use client";

import { useState } from "react";

import { Group } from "@/registry/ui/group";
import { Input } from "@/registry/ui/input";
import { OTPField } from "@/registry/ui/otp-field";

import { AnimatedPreview } from "../animated-preview";

export default function Demo() {
	const [value, setValue] = useState("");
	return (
		<AnimatedPreview
			reset={() => setValue("")}
			script={async (s) => {
				await s.wait(500);
				await s.type("group", "2048", setValue, { perChar: 230 });
				await s.wait(1400);
				await s.moveOff();
				await s.wait(700);
			}}
		>
			{(ref) => (
				<OTPField aria-label="Verification code" length={4} value={value} onChange={setValue}>
					<div ref={ref("group")} className="inline-flex">
						<Group>
							<Input />
							<Input aria-label="Digit 2" />
							<Input aria-label="Digit 3" />
							<Input aria-label="Digit 4" />
						</Group>
					</div>
				</OTPField>
			)}
		</AnimatedPreview>
	);
}
