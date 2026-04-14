"use client";

import React from "react";
import { getLocalTimeZone, isSameDay, isWeekend, Time, today } from "@internationalized/date";
import { TimerIcon } from "lucide-react";
import { CalendarCell as AriaCalendarCell, I18nProvider, Text, useLocale } from "react-aria-components";
import type { DateRange, DateValue, Key } from "react-aria-components";

import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";
import { ChevronLeftIcon, ChevronRightIcon } from "@/registry/__generated__/icons";
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
	RangeCalendar,
} from "@/registry/ui/calendar";
import { Card, CardContent, CardFooter } from "@/registry/ui/card";
import { FieldError, Label } from "@/registry/ui/field";
import { DateInput, InputAddon, InputGroup } from "@/registry/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/registry/ui/select";
import { TimeField } from "@/registry/ui/time-field";

export default function CalendarExamples() {
	return (
		<Examples className="**:data-example-preview:items-center **:data-example-preview:justify-center lg:grid-cols-2">
			<CalendarSingle />
			<CalendarRange />
			<CalendarRangeMultipleMonths />
			<CalendarBookedDates />
			<CalendarWithPresets />
			<CalendarWithTime />
			<CalendarWithDropdowns />
			<CalendarCustomDays />
			<CalendarDisabled />
			<CalendarMinMax />
			<CalendarUnavailableWeekends />
			<CalendarInvalid />
			<CalendarTodayIndicator />
			<CalendarInternational />
			<CalendarShortWeekdays />
		</Examples>
	);
}

function CalendarSingle() {
	return (
		<Example title="Single">
			<Calendar aria-label="Date" defaultValue={today(getLocalTimeZone())} />
		</Example>
	);
}

function CalendarRange() {
	return (
		<Example title="Range">
			<RangeCalendar
				aria-label="Trip dates"
				defaultValue={{
					start: today(getLocalTimeZone()).subtract({ days: 6 }),
					end: today(getLocalTimeZone()),
				}}
			/>
		</Example>
	);
}

function CalendarRangeMultipleMonths() {
	return (
		<Example title="Range Multiple Months" className="lg:col-span-2">
			<RangeCalendar aria-label="Trip dates" visibleDuration={{ months: 2 }}>
				<CalendarHeader>
					<Button slot="previous" variant="quiet" size="icon">
						<ChevronLeftIcon />
					</Button>
					<CalendarHeading />
					<Button slot="next" variant="quiet" size="icon">
						<ChevronRightIcon />
					</Button>
				</CalendarHeader>
				<div className="flex items-start gap-4">
					{Array.from({ length: 2 }).map((_, index) => (
						<CalendarGrid key={index} offset={{ months: index }}>
							<CalendarGridHeader>{(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}</CalendarGridHeader>
							<CalendarGridBody>{(date) => <CalendarCell date={date} />}</CalendarGridBody>
						</CalendarGrid>
					))}
				</div>
			</RangeCalendar>
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
			<Calendar aria-label="Booking date" value={date} onChange={setDate} isDateUnavailable={isBooked} />
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
		</Example>
	);
}

function CalendarWithTime() {
	const [date, setDate] = React.useState<DateValue | null>(today(getLocalTimeZone()));
	return (
		<Example title="With Time">
			<Card className="mx-auto w-fit">
				<CardContent>
					<Calendar aria-label="Date" value={date} onChange={setDate} />
				</CardContent>
				<CardFooter className="flex flex-col gap-4 border-t">
					<TimeField className="w-full" defaultValue={new Time(11, 45)}>
						<Label>Start time</Label>
						<InputGroup>
							<InputAddon>
								<TimerIcon />
							</InputAddon>
							<DateInput />
						</InputGroup>
					</TimeField>
					<TimeField className="w-full" defaultValue={new Time(13, 30)}>
						<Label>End time</Label>
						<InputGroup>
							<InputAddon>
								<TimerIcon />
							</InputAddon>
							<DateInput />
						</InputGroup>
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
					<Calendar aria-label="Date" value={date} onChange={setDate} focusedValue={focused} onFocusChange={setFocused}>
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

function CalendarDisabled() {
	return (
		<Example title="Disabled">
			<Calendar aria-label="Date" defaultValue={today(getLocalTimeZone())} isDisabled />
		</Example>
	);
}

function CalendarMinMax() {
	const now = today(getLocalTimeZone());
	return (
		<Example title="Min & Max">
			<Calendar
				aria-label="Date"
				defaultValue={now}
				minValue={now.subtract({ days: 3 })}
				maxValue={now.add({ days: 14 })}
			/>
		</Example>
	);
}

function CalendarUnavailableWeekends() {
	const isWeekend = (d: DateValue) => {
		const day = d.toDate(getLocalTimeZone()).getDay();
		return day === 0 || day === 6;
	};
	return (
		<Example title="Unavailable Weekends">
			<Calendar aria-label="Date" defaultValue={today(getLocalTimeZone())} isDateUnavailable={isWeekend} />
		</Example>
	);
}

function CalendarInvalid() {
	return (
		<Example title="Invalid">
			<Card className="mx-auto w-fit">
				<CardContent>
					<Calendar aria-label="Date" defaultValue={today(getLocalTimeZone())} isInvalid>
						<CalendarHeader>
							<Button slot="previous" variant="quiet" size="icon">
								<ChevronLeftIcon />
							</Button>
							<CalendarHeading />
							<Button slot="next" variant="quiet" size="icon">
								<ChevronRightIcon />
							</Button>
						</CalendarHeader>
						<CalendarGrid>
							<CalendarGridHeader>{(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}</CalendarGridHeader>
							<CalendarGridBody>{(date) => <CalendarCell date={date} />}</CalendarGridBody>
						</CalendarGrid>
					</Calendar>
					<div className="mt-2">
						<p className="text-fg-danger text-sm">We are closed on weekends</p>
					</div>
				</CardContent>
				{/* <CardFooter className="flex-wrap gap-2 border-t"></CardFooter> */}
			</Card>
		</Example>
	);
}

function CalendarTodayIndicator() {
	return (
		<Example title="Today Indicator">
			<Calendar aria-label="Date">
				<CalendarHeader>
					<Button slot="previous" variant="quiet" size="icon">
						<ChevronLeftIcon />
					</Button>
					<CalendarHeading />
					<Button slot="next" variant="quiet" size="icon">
						<ChevronRightIcon />
					</Button>
				</CalendarHeader>
				<CalendarGrid>
					<CalendarGridHeader>{(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}</CalendarGridHeader>
					<CalendarGridBody>
						{(date) => (
							<CalendarCell date={date}>
								{({ formattedDate, isToday }) => (
									<>
										<span>{formattedDate}</span>
										{isToday && (
											<span className="absolute bottom-1 left-1/2 size-0.75 -translate-x-1/2 rounded-full bg-fg-muted" />
										)}
									</>
								)}
							</CalendarCell>
						)}
					</CalendarGridBody>
				</CalendarGrid>
			</Calendar>
		</Example>
	);
}

function CalendarInternational() {
	return (
		<Example title="International (Arabic)">
			<I18nProvider locale="ar-EG">
				<Calendar aria-label="التاريخ" defaultValue={today(getLocalTimeZone())} />
			</I18nProvider>
		</Example>
	);
}

function CalendarShortWeekdays() {
	return (
		<Example title="Short Weekdays">
			<Calendar aria-label="Date" defaultValue={today(getLocalTimeZone())}>
				<CalendarHeader>
					<Button slot="previous" variant="quiet" size="icon">
						<ChevronLeftIcon />
					</Button>
					<CalendarHeading />
					<Button slot="next" variant="quiet" size="icon">
						<ChevronRightIcon />
					</Button>
				</CalendarHeader>
				<CalendarGrid weekdayStyle="short">
					<CalendarGridHeader>{(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}</CalendarGridHeader>
					<CalendarGridBody>{(date) => <CalendarCell date={date} />}</CalendarGridBody>
				</CalendarGrid>
			</Calendar>
		</Example>
	);
}

function CalendarCustomDays() {
	const { locale } = useLocale();
	const [range, setRange] = React.useState<DateRange | null>({
		start: today(getLocalTimeZone()).add({ days: 2 }),
		end: today(getLocalTimeZone()).add({ days: 9 }),
	});

	const getPrice = (d: DateValue) => {
		if (isWeekend(d, locale)) return "$120";
		return "$100";
	};

	return (
		<Example title="Custom Days" className="lg:col-span-2">
			<Card className="mx-auto w-fit">
				<CardContent className="p-0">
					<RangeCalendar
						aria-label="Stay"
						value={range}
						onChange={setRange}
						className="[--cell-size:calc(var(--spacing)*12)]"
					>
						<CalendarHeader>
							<Button slot="previous" variant="quiet" size="icon">
								<ChevronLeftIcon />
							</Button>
							<CalendarHeading />
							<Button slot="next" variant="quiet" size="icon">
								<ChevronRightIcon />
							</Button>
						</CalendarHeader>
						<CalendarGrid>
							<CalendarGridHeader>{(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}</CalendarGridHeader>
							<CalendarGridBody>
								{(date) => (
									<CalendarCell date={date}>
										{({ formattedDate, date, isOutsideMonth }) => (
											<span className="flex flex-col">
												<span>{formattedDate}</span>
												{!isOutsideMonth && (
													<span className="in-selection-end:text-fg-on-accent/60 in-selection-start:text-fg-on-accent/60 text-fg-muted text-xs">
														{getPrice(date)}
													</span>
												)}
											</span>
										)}
									</CalendarCell>
								)}
							</CalendarGridBody>
						</CalendarGrid>
					</RangeCalendar>
				</CardContent>
			</Card>
		</Example>
	);
}
