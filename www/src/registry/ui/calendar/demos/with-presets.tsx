"use client";

import React from "react";

import { getLocalTimeZone, today } from "@internationalized/date";

import type * as CalendarPrimitives from "react-aria-components/Calendar";

import { Button } from "@/registry/ui/button";
import { Calendar } from "@/registry/ui/calendar";
import { Card, CardContent, CardFooter } from "@/registry/ui/card";

export default function Demo() {
	const [date, setDate] = React.useState<CalendarPrimitives.DateValue | null>(today(getLocalTimeZone()));
	const [focused, setFocused] = React.useState<CalendarPrimitives.DateValue>(today(getLocalTimeZone()));

	const presets = [
		{ label: "Today", days: 0 },
		{ label: "Tomorrow", days: 1 },
		{ label: "In 3 days", days: 3 },
		{ label: "In a week", days: 7 },
		{ label: "In 2 weeks", days: 14 },
	];

	return (
		<Card className="mx-auto w-fit max-w-[300px]">
			<CardContent>
				<Calendar
					aria-label="Date"
					value={date}
					onChange={setDate}
					focusedValue={focused}
					onFocusChange={setFocused}
					className="mx-auto"
				/>
			</CardContent>
			<CardFooter className="flex-wrap gap-2 border-t">
				{presets.map((preset) => (
					<Button
						key={preset.label}
						variant="default"
						className="flex-1"
						onPress={() => {
							const next = today(getLocalTimeZone()).add({ days: preset.days });
							setDate(next);
							setFocused(next);
						}}
					>
						{preset.label}
					</Button>
				))}
			</CardFooter>
		</Card>
	);
}
