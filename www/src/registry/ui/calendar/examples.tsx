"use client";

import React from "react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { CalendarCell as AriaCalendarCell } from "react-aria-components";
import type { DateRange, DateValue, Key } from "react-aria-components";

import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import {
	Calendar,
	CalendarGrid,
	CalendarGridBody,
	CalendarGridHeader,
	CalendarHeader,
	CalendarHeaderCell,
	RangeCalendar,
} from "@/registry/ui/calendar";
import { Card, CardContent, CardFooter } from "@/registry/ui/card";
import { Dialog, DialogContent } from "@/registry/ui/dialog";
import { Label } from "@/registry/ui/field";
import { DateInput } from "@/registry/ui/input";
import { Overlay } from "@/registry/ui/overlay";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/registry/ui/select";
import { TimeField } from "@/registry/ui/time-field";

export default function CalendarExamples() {
	return (
		<Examples>
			<CalendarSingle />
			<CalendarRange />
			<CalendarRangeMultipleMonths />
			<CalendarBookedDates />
			<CalendarWithPresets />
			<CalendarWithTime />
			<CalendarWithDropdowns />
			<CalendarCustomDays />
			<CalendarInCard />
			<CalendarInPopover />
		</Examples>
	);
}

function CalendarSingle() {
	const [date, setDate] = React.useState<DateValue | null>(today(getLocalTimeZone()));
	return (
		<Example title="Single">
			<Card className="mx-auto w-fit">
				<CardContent className="p-0">
					<Calendar aria-label="Date" value={date} onChange={setDate} />
				</CardContent>
			</Card>
		</Example>
	);
}

function CalendarRange() {
	const [range, setRange] = React.useState<DateRange | null>({
		start: today(getLocalTimeZone()).subtract({ days: 30 }),
		end: today(getLocalTimeZone()),
	});
	return (
		<Example title="Range">
			<Card className="mx-auto w-fit">
				<CardContent className="p-0">
					<RangeCalendar
						aria-label="Trip dates"
						value={range}
						onChange={setRange}
						maxValue={today(getLocalTimeZone())}
					>
						<CalendarHeader />
						<div className="flex gap-2">
							<CalendarGrid />
							<CalendarGrid offset={{ months: 1 }} />
						</div>
					</RangeCalendar>
				</CardContent>
			</Card>
		</Example>
	);
}

function CalendarRangeMultipleMonths() {
	const [range, setRange] = React.useState<DateRange | null>({
		start: today(getLocalTimeZone()),
		end: today(getLocalTimeZone()).add({ days: 60 }),
	});
	return (
		<Example title="Range Multiple Months">
			<Card className="mx-auto w-fit">
				<CardContent className="p-0">
					<RangeCalendar aria-label="Trip dates" value={range} onChange={setRange}>
						<CalendarHeader />
						<div className="flex gap-2">
							<CalendarGrid />
							<CalendarGrid offset={{ months: 1 }} />
							<CalendarGrid offset={{ months: 2 }} />
						</div>
					</RangeCalendar>
				</CardContent>
			</Card>
		</Example>
	);
}

function CalendarBookedDates() {
	const [date, setDate] = React.useState<DateValue | null>(today(getLocalTimeZone()));
	const now = today(getLocalTimeZone());
	const bookedStart = now.add({ days: 5 });
	const bookedEnd = now.add({ days: 19 });
	const isBooked = (d: DateValue) => d.compare(bookedStart) >= 0 && d.compare(bookedEnd) <= 0;

	return (
		<Example title="Booked Dates">
			<Card className="mx-auto w-fit">
				<CardContent className="p-0">
					<Calendar aria-label="Booking date" value={date} onChange={setDate} isDateUnavailable={isBooked} />
				</CardContent>
			</Card>
		</Example>
	);
}

function CalendarWithPresets() {
	const [date, setDate] = React.useState<DateValue | null>(today(getLocalTimeZone()));
	const [focused, setFocused] = React.useState<DateValue>(today(getLocalTimeZone()));

	const presets = [
		{ label: "Today", days: 0 },
		{ label: "Tomorrow", days: 1 },
		{ label: "In 3 days", days: 3 },
		{ label: "In a week", days: 7 },
		{ label: "In 2 weeks", days: 14 },
	];

	return (
		<Example title="With Presets">
			<Card className="mx-auto w-fit">
				<CardContent className="p-0">
					<Calendar
						aria-label="Date"
						value={date}
						onChange={setDate}
						focusedValue={focused}
						onFocusChange={setFocused}
					/>
				</CardContent>
				<CardFooter className="flex flex-wrap gap-2 border-t pt-4">
					{presets.map((preset) => (
						<Button
							key={preset.label}
							variant="default"
							size="sm"
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
		</Example>
	);
}

function CalendarWithTime() {
	const [date, setDate] = React.useState<DateValue | null>(today(getLocalTimeZone()));
	return (
		<Example title="With Time">
			<Card className="mx-auto w-fit">
				<CardContent className="p-0">
					<Calendar aria-label="Date" value={date} onChange={setDate} />
				</CardContent>
				<CardFooter className="flex flex-col gap-3 border-t pt-4">
					<TimeField>
						<Label>Start time</Label>
						<DateInput />
					</TimeField>
					<TimeField>
						<Label>End time</Label>
						<DateInput />
					</TimeField>
				</CardFooter>
			</Card>
		</Example>
	);
}

const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

function CalendarWithDropdowns() {
	const [date, setDate] = React.useState<DateValue | null>(today(getLocalTimeZone()));
	const [focused, setFocused] = React.useState<DateValue>(today(getLocalTimeZone()));

	const currentYear = today(getLocalTimeZone()).year;
	const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

	const handleMonthChange = (key: Key | null) => {
		if (key == null) return;
		setFocused(focused.set({ month: Number(key) }));
	};
	const handleYearChange = (key: Key | null) => {
		if (key == null) return;
		setFocused(focused.set({ year: Number(key) }));
	};

	return (
		<Example title="With Dropdowns">
			<Card className="mx-auto w-fit">
				<CardContent className="p-0">
					<Calendar
						aria-label="Date"
						value={date}
						onChange={setDate}
						focusedValue={focused}
						onFocusChange={setFocused}
					>
						<CalendarHeader>
							<Button slot="previous" variant="default" size="icon-sm">
								<ChevronLeftIcon />
							</Button>
							<div className="flex gap-1.5">
								<Select aria-label="Month" value={String(focused.month)} onChange={handleMonthChange}>
									<SelectTrigger slot={null} />
									<SelectContent>
										{MONTHS.map((name, i) => (
											<SelectItem key={i + 1} id={String(i + 1)}>
												{name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Select aria-label="Year" value={String(focused.year)} onChange={handleYearChange}>
									<SelectTrigger slot={null} />
									<SelectContent>
										{years.map((y) => (
											<SelectItem key={y} id={String(y)}>
												{y}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<Button slot="next" variant="default" size="icon-sm">
								<ChevronRightIcon />
							</Button>
						</CalendarHeader>
						<CalendarGrid />
					</Calendar>
				</CardContent>
			</Card>
		</Example>
	);
}

function CalendarCustomDays() {
	const [range, setRange] = React.useState<DateRange | null>({
		start: today(getLocalTimeZone()).add({ days: 2 }),
		end: today(getLocalTimeZone()).add({ days: 9 }),
	});
	const getPrice = (d: DateValue) => {
		const day = d.toDate(getLocalTimeZone()).getDay();
		return day === 0 || day === 6 ? "$120" : "$100";
	};

	return (
		<Example title="Custom Days">
			<Card className="mx-auto w-fit">
				<CardContent className="p-0">
					<RangeCalendar aria-label="Stay" value={range} onChange={setRange}>
						<CalendarHeader />
						<CalendarGrid>
							<CalendarGridHeader>{(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}</CalendarGridHeader>
							<CalendarGridBody>
								{(date) => (
									<AriaCalendarCell
										date={date}
										className="flex size-14 cursor-pointer flex-col items-center justify-center rounded-md text-sm outline-none transition-colors hover:bg-inverse/10 focus-visible:focus-ring selected:bg-accent/20 selection-end:bg-accent selection-end:text-fg-on-accent selection-start:bg-accent selection-start:text-fg-on-accent outside-month:text-fg-muted/40"
									>
										{({ formattedDate, isOutsideMonth }) => (
											<>
												<span>{formattedDate}</span>
												{!isOutsideMonth && <span className="text-[10px] opacity-80">{getPrice(date)}</span>}
											</>
										)}
									</AriaCalendarCell>
								)}
							</CalendarGridBody>
						</CalendarGrid>
					</RangeCalendar>
				</CardContent>
			</Card>
		</Example>
	);
}

function CalendarInCard() {
	return (
		<Example title="In Card">
			<Card className="mx-auto w-fit">
				<CardContent className="p-0">
					<Calendar aria-label="Date" />
				</CardContent>
			</Card>
		</Example>
	);
}

function CalendarInPopover() {
	return (
		<Example title="In Popover">
			<Dialog>
				<Button variant="default" className="gap-2">
					<CalendarIcon />
					Open Calendar
				</Button>
				<Overlay type="popover">
					<DialogContent className="in-popover:p-0">
						<Calendar aria-label="Date" />
					</DialogContent>
				</Overlay>
			</Dialog>
		</Example>
	);
}
