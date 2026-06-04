"use client";

import { useState } from "react";

import { CalendarDate } from "@internationalized/date";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import type * as CalendarPrimitives from "react-aria-components/Calendar";

import { Button } from "@/registry/ui/button";
import {
	Calendar,
	CalendarCell,
	CalendarGrid,
	CalendarGridBody,
	CalendarGridHeader,
	CalendarHeader,
	CalendarHeaderCell,
	CalendarHeading,
} from "@/registry/ui/calendar";

import { AnimatedPreview } from "../animated-preview";

const initial = new CalendarDate(2024, 6, 12);

export default function Demo() {
	const [value, setValue] = useState<CalendarPrimitives.DateValue>(initial);
	const [focused, setFocused] = useState<CalendarDate>(initial);

	const reset = () => {
		setValue(initial);
		setFocused(initial);
	};

	return (
		<AnimatedPreview
			reset={reset}
			script={async (s) => {
				await s.wait(600);
				// Page forward a month — the selection follows to the same day…
				await s.click("next", () => {
					setFocused((f) => f.add({ months: 1 }));
					setValue((v) => v.add({ months: 1 }));
				});
				await s.wait(1100);
				// …then page back to where we started.
				await s.click("prev", () => {
					setFocused((f) => f.add({ months: -1 }));
					setValue((v) => v.add({ months: -1 }));
				});
				await s.wait(1000);
				await s.moveOff();
				await s.wait(600);
			}}
		>
			{(ref) => (
				<div className="origin-center scale-[0.66]">
					<Calendar
						aria-label="Date"
						value={value}
						onChange={(v) => {
							if (v) setValue(v);
						}}
						focusedValue={focused}
						onFocusChange={setFocused}
						className="gap-3"
					>
						<CalendarHeader>
							<span ref={ref("prev")} className="inline-flex">
								<Button slot="previous" variant="quiet" isIconOnly>
									<ChevronLeftIcon />
								</Button>
							</span>
							<CalendarHeading />
							<span ref={ref("next")} className="inline-flex">
								<Button slot="next" variant="quiet" isIconOnly>
									<ChevronRightIcon />
								</Button>
							</span>
						</CalendarHeader>
						<CalendarGrid>
							<CalendarGridHeader>{(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}</CalendarGridHeader>
							<CalendarGridBody>{(date) => <CalendarCell date={date} />}</CalendarGridBody>
						</CalendarGrid>
					</Calendar>
				</div>
			)}
		</AnimatedPreview>
	);
}
