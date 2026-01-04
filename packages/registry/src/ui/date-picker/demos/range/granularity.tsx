"use client";

import { parseAbsoluteToLocal } from "@internationalized/date";

import { Calendar } from "@dotui/registry/ui/calendar";
import { DatePicker, DatePickerContent, DatePickerInput } from "@dotui/registry/ui/date-picker";
import { Label } from "@dotui/registry/ui/field";

export default function Demo() {
	const dates = {
		start: parseAbsoluteToLocal("2021-04-07T18:45:22Z"),
		end: parseAbsoluteToLocal("2021-04-08T20:00:00Z"),
	};

	return (
		<div className="flex flex-col items-center gap-4">
			<DatePicker mode="range" granularity="hour" defaultValue={dates}>
				<Label>Hour</Label>
				<DatePickerInput />
				<DatePickerContent>
					<Calendar />
				</DatePickerContent>
			</DatePicker>

			<DatePicker mode="range" granularity="minute" defaultValue={dates}>
				<Label>Minute</Label>
				<DatePickerInput />
				<DatePickerContent>
					<Calendar />
				</DatePickerContent>
			</DatePicker>

			<DatePicker mode="range" granularity="second" defaultValue={dates}>
				<Label>Second</Label>
				<DatePickerInput />
				<DatePickerContent>
					<Calendar />
				</DatePickerContent>
			</DatePicker>
		</div>
	);
}
