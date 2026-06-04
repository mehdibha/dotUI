"use client";

import { useState } from "react";

import { CalendarDate } from "@internationalized/date";

import type * as CalendarPrimitives from "react-aria-components/Calendar";

import { CalendarIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Calendar } from "@/registry/ui/calendar";
import { DatePicker } from "@/registry/ui/date-picker";
import { DialogContent } from "@/registry/ui/dialog";
import { DateInput, InputGroup, InputGroupAddon } from "@/registry/ui/input";
import { Popover } from "@/registry/ui/popover";

import { AnimatedPreview } from "../animated-preview";

// A controlled value pins the open calendar to a known month (June 2024), so the
// targeted day cell is stable across reloads and the trigger stays coherent with
// the grid. In an en-US (Sunday-start) grid, June 2024 lays out as:
//   row3 = Jun 9–15  → col4 (Wed) = Jun 12  (the day the cursor picks)
//   row4 = Jun 16–22 → col3 (Tue) = Jun 18  (the initial selection)
const INITIAL = new CalendarDate(2024, 6, 18);
const PICKED = new CalendarDate(2024, 6, 12);
const DAY_CELL = '[data-calendar-grid-body] tr:nth-child(3) td:nth-child(4) [role="button"]';

export default function Demo() {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState<CalendarPrimitives.DateValue | null>(INITIAL);

	return (
		<AnimatedPreview
			contain
			reset={() => {
				setOpen(false);
				setValue(INITIAL);
			}}
			script={async (s) => {
				await s.wait(600);
				await s.click("trigger", () => setOpen(true));
				await s.wait(800);
				// Move to an in-month day (3rd week, 4th column = Jun 12), then pick it.
				await s.moveTo({ selector: DAY_CELL });
				await s.wait(450);
				await s.click({ selector: DAY_CELL }, () => {
					setValue(PICKED);
					setOpen(false);
				});
				await s.wait(1300);
				await s.moveOff();
				await s.wait(500);
			}}
		>
			{(ref) => (
				<DatePicker
					aria-label="Meeting date"
					value={value}
					onChange={setValue}
					isOpen={open}
					onOpenChange={setOpen}
					className="w-52"
				>
					<span ref={ref("trigger")} className="block">
						<InputGroup>
							<DateInput />
							<InputGroupAddon>
								<Button variant="default" size="sm" isIconOnly>
									<CalendarIcon />
								</Button>
							</InputGroupAddon>
						</InputGroup>
					</span>
					<Popover>
						<DialogContent>
							<Calendar />
						</DialogContent>
					</Popover>
				</DatePicker>
			)}
		</AnimatedPreview>
	);
}
