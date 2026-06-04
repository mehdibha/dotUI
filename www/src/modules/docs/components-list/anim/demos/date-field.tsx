"use client";

import { useState } from "react";

import { parseDate } from "@internationalized/date";

import type * as DateFieldPrimitives from "react-aria-components/DateField";

import { DateField } from "@/registry/ui/date-field";
import { DateInput } from "@/registry/ui/input";

import { AnimatedPreview } from "../animated-preview";

const initial = parseDate("2024-06-12");

export default function Demo() {
	const [value, setValue] = useState<DateFieldPrimitives.DateValue>(initial);
	return (
		<AnimatedPreview
			reset={() => setValue(initial)}
			script={async (s) => {
				await s.wait(500);
				// Spin the day segment up a few notches…
				await s.moveTo({ selector: '[data-type="day"]' });
				await s.wait(120);
				for (let i = 0; i < 3; i++) {
					await s.press(() => setValue((v) => v.add({ days: 1 })));
					await s.wait(260);
				}
				await s.wait(500);
				// …then bump the month forward.
				await s.click({ selector: '[data-type="month"]' }, () => setValue((v) => v.add({ months: 1 })));
				await s.wait(1100);
				await s.moveOff();
				await s.wait(600);
			}}
		>
			{() => (
				<div className="w-48">
					<DateField
						aria-label="Meeting date"
						value={value}
						onChange={(v) => {
							if (v) setValue(v);
						}}
					>
						<DateInput />
					</DateField>
				</div>
			)}
		</AnimatedPreview>
	);
}
