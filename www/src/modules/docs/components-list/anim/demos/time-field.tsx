"use client";

import { useState } from "react";

import { Time } from "@internationalized/date";

import type * as TimeFieldPrimitives from "react-aria-components/TimeField";

import { DateInput } from "@/registry/ui/input";
import { TimeField } from "@/registry/ui/time-field";

import { AnimatedPreview } from "../animated-preview";

const initial = new Time(9, 30);

export default function Demo() {
	const [value, setValue] = useState<TimeFieldPrimitives.TimeValue>(initial);
	return (
		<AnimatedPreview
			reset={() => setValue(initial)}
			script={async (s) => {
				await s.wait(500);
				// Nudge the minute segment upward, like holding the up arrow.
				await s.moveTo({ selector: '[data-type="minute"]' });
				await s.wait(140);
				for (let i = 0; i < 4; i++) {
					await s.press(() => setValue((v) => v.add({ minutes: 5 })));
					await s.wait(280);
				}
				await s.wait(900);
				await s.moveOff();
				await s.wait(600);
			}}
		>
			{() => (
				<div className="w-40">
					<TimeField
						aria-label="Reminder time"
						value={value}
						onChange={(v) => {
							if (v) setValue(v);
						}}
					>
						<DateInput />
					</TimeField>
				</div>
			)}
		</AnimatedPreview>
	);
}
