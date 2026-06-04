"use client";

import { useState } from "react";

import { Group } from "@/registry/ui/group";
import { Input } from "@/registry/ui/input";
import { NumberField, NumberFieldDecrement, NumberFieldIncrement } from "@/registry/ui/number-field";

import { AnimatedPreview } from "../animated-preview";

export default function Demo() {
	const [value, setValue] = useState(24);
	return (
		<AnimatedPreview
			reset={() => setValue(24)}
			script={async (s) => {
				await s.wait(500);
				await s.click({ selector: '[slot="increment"]' }, () => setValue((v) => v + 1));
				await s.wait(280);
				await s.press(() => setValue((v) => v + 1));
				await s.wait(280);
				await s.press(() => setValue((v) => v + 1));
				await s.wait(950);
				await s.click({ selector: '[slot="decrement"]' }, () => setValue((v) => v - 1));
				await s.wait(950);
				await s.moveOff();
				await s.wait(600);
			}}
		>
			{() => (
				<div className="w-44">
					<NumberField aria-label="Quantity" value={value} onChange={setValue}>
						<Group>
							<NumberFieldDecrement />
							<Input />
							<NumberFieldIncrement />
						</Group>
					</NumberField>
				</div>
			)}
		</AnimatedPreview>
	);
}
