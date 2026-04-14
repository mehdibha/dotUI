"use client";

import React from "react";
import { getLocalTimeZone, isWeekend, Time, today } from "@internationalized/date";
import { TimerIcon } from "lucide-react";
import { CalendarCell as AriaCalendarCell, I18nProvider, useLocale } from "react-aria-components";
import type { DateRange, DateValue } from "react-aria-components";

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
	CalendarMonthPicker,
	CalendarYearPicker,
	RangeCalendar,
} from "@/registry/ui/calendar";
import { Card, CardContent, CardFooter } from "@/registry/ui/card";
import { Label } from "@/registry/ui/field";
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
			<CalendarWithSlottedPickers />
			<CalendarShortWeekdays />
			<CalendarCustomDays />
			<CalendarDisabled />
			<CalendarMinMax />
			<CalendarUnavailableWeekends />
			<CalendarInvalid />
			<CalendarTodayIndicator />
			<CalendarInternational />
			<CalendarScheduler />
		</Examples>
	);
}

function CalendarSingle() {
	return (
		<Example title="Single">
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
				<CalendarGrid>
					<CalendarGridHeader>{(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}</CalendarGridHeader>
					<CalendarGridBody>{(date) => <CalendarCell date={date} />}</CalendarGridBody>
				</CalendarGrid>
			</Calendar>
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
				<CalendarHeader />
				<div className="flex items-start gap-4">
					{Array.from({ length: 2 }).map((_, index) => (
						<CalendarGrid key={index} offset={{ months: index }} />
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

// Approach B — dedicated picker components
function CalendarWithDropdowns() {
	return (
		<Example title="With Dropdowns (dedicated)">
			<Card className="mx-auto w-fit">
				<CardContent>
					<Calendar aria-label="Date" defaultValue={today(getLocalTimeZone())}>
						<CalendarHeader>
							<Button slot="previous" variant="default" size="icon-sm">
								<ChevronLeftIcon />
							</Button>
							<div className="flex flex-1 gap-1.5">
								<CalendarMonthPicker />
								<CalendarYearPicker />
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

// Approach A — slotted SelectContext via slot="month-picker" / "year-picker"
function CalendarWithSlottedPickers() {
	const currentYear = today(getLocalTimeZone()).year;
	const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

	return (
		<Example title="With Dropdowns (slotted)">
			<Card className="mx-auto w-fit">
				<CardContent className="p-0">
					<Calendar aria-label="Date" defaultValue={today(getLocalTimeZone())}>
						<CalendarHeader>
							<Button slot="previous" variant="default" size="icon-sm">
								<ChevronLeftIcon />
							</Button>
							<div className="flex flex-1 gap-1.5">
								<Select slot="month-picker">
									<SelectTrigger slot={null} />
									<SelectContent>
										{MONTHS.map((name, i) => (
											<SelectItem key={i + 1} id={String(i + 1)}>
												{name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Select slot="year-picker">
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
					<Calendar aria-label="Date" defaultValue={today(getLocalTimeZone())} isInvalid />
					<p className="mt-2 text-fg-danger text-sm">We are closed on weekends</p>
				</CardContent>
			</Card>
		</Example>
	);
}

function CalendarTodayIndicator() {
	return (
		<Example title="Today Indicator">
			<Calendar aria-label="Date">
				<CalendarHeader />
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
				<CalendarHeader />
				<CalendarGrid weekdayStyle="short" />
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
			<Card>
				<CardContent>
					<RangeCalendar
						aria-label="Stay"
						value={range}
						onChange={setRange}
						className="[--cell-size:calc(var(--spacing)*12)]"
					>
						<CalendarHeader />
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

type ScheduleEvent = {
	id: string;
	title: string;
	date: DateValue;
	color: "accent" | "blue" | "emerald" | "amber" | "rose";
};

const EVENT_PILL_CLASS: Record<ScheduleEvent["color"], string> = {
	accent: "bg-accent/15 text-accent border-accent/30",
	blue: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
	emerald: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
	amber: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
	rose: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
};

const EVENT_DOT_CLASS: Record<ScheduleEvent["color"], string> = {
	accent: "bg-accent",
	blue: "bg-blue-500",
	emerald: "bg-emerald-500",
	amber: "bg-amber-500",
	rose: "bg-rose-500",
};

function CalendarScheduler() {
	const now = today(getLocalTimeZone());
	const [selected, setSelected] = React.useState<DateValue | null>(now);

	const events = React.useMemo<ScheduleEvent[]>(
		() => [
			{ id: "1", title: "Standup", date: now.subtract({ days: 2 }), color: "accent" },
			{ id: "2", title: "Design review", date: now, color: "blue" },
			{ id: "3", title: "1:1 with Sam", date: now, color: "emerald" },
			{ id: "4", title: "Product sync", date: now, color: "amber" },
			{ id: "5", title: "Lunch w/ Alex", date: now, color: "rose" },
			{ id: "6", title: "Sprint planning", date: now.add({ days: 1 }), color: "accent" },
			{ id: "7", title: "Ship v2.1", date: now.add({ days: 3 }), color: "blue" },
			{ id: "8", title: "Customer call", date: now.add({ days: 4 }), color: "emerald" },
			{ id: "9", title: "Team offsite", date: now.add({ days: 7 }), color: "amber" },
			{ id: "10", title: "Board meeting", date: now.add({ days: 9 }), color: "rose" },
			{ id: "11", title: "Interview: FE eng", date: now.add({ days: 12 }), color: "accent" },
			{ id: "12", title: "Launch review", date: now.add({ days: 14 }), color: "blue" },
			{ id: "13", title: "QBR prep", date: now.add({ days: 18 }), color: "emerald" },
		],
		[now],
	);

	const eventsByDay = React.useMemo(() => {
		const map = new Map<string, ScheduleEvent[]>();
		for (const e of events) {
			const key = e.date.toString();
			const list = map.get(key) ?? [];
			list.push(e);
			map.set(key, list);
		}
		return map;
	}, [events]);

	const getEvents = (d: DateValue) => eventsByDay.get(d.toString()) ?? [];
	const selectedEvents = selected ? getEvents(selected) : [];
	const selectedLabel = selected
		? selected.toDate(getLocalTimeZone()).toLocaleDateString(undefined, {
				weekday: "long",
				month: "long",
				day: "numeric",
			})
		: "";

	return (
		<Example title="Scheduler" className="lg:col-span-2">
			<Card className="mx-auto flex w-fit flex-col overflow-hidden md:flex-row md:items-stretch">
				<CardContent className="p-4">
					<Calendar aria-label="Schedule" value={selected} onChange={setSelected}>
						<CalendarHeader />
						<CalendarGrid>
							<CalendarGridHeader>{(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}</CalendarGridHeader>
							<CalendarGridBody>
								{(date) => (
									<AriaCalendarCell
										date={date}
										className="focus-visible:focus-ring flex aspect-auto h-20 cursor-pointer flex-col gap-0.5 rounded-md selected:bg-accent/10 p-1 text-left outside-month:text-fg-muted/40 outline-none selected:ring-1 selected:ring-accent/40 transition-colors hover:bg-inverse/5"
									>
										{({ formattedDate, isOutsideMonth }) => {
											const dayEvents = getEvents(date);
											const visible = dayEvents.slice(0, 2);
											const overflow = dayEvents.length - visible.length;
											return (
												<>
													<span className="px-1 font-medium text-center text-xs">{formattedDate}</span>
													{!isOutsideMonth && dayEvents.length > 0 && (
														<div className="flex min-w-0 flex-col gap-0.5">
															{visible.map((e) => (
																<span
																	key={e.id}
																	className={`truncate rounded-sm border px-1 text-[10px] leading-tight ${EVENT_PILL_CLASS[e.color]}`}
																>
																	{e.title}
																</span>
															))}
															{overflow > 0 && <span className="px-1 text-[10px] text-fg-muted">+{overflow} more</span>}
														</div>
													)}
												</>
											);
										}}
									</AriaCalendarCell>
								)}
							</CalendarGridBody>
						</CalendarGrid>
					</Calendar>
				</CardContent>
				<div className="flex w-full flex-col border-t p-4 md:w-64 md:border-t-0 md:border-l">
					<h4 className="font-medium text-sm">{selectedLabel || "No date selected"}</h4>
					<p className="mt-0.5 text-fg-muted text-xs">
						{selectedEvents.length === 0
							? "Nothing scheduled."
							: `${selectedEvents.length} event${selectedEvents.length > 1 ? "s" : ""}`}
					</p>
					<div className="mt-3 flex flex-col gap-2">
						{selectedEvents.map((e) => (
							<div key={e.id} className="flex items-center gap-2 rounded-md border p-2">
								<span className={`size-2 shrink-0 rounded-full ${EVENT_DOT_CLASS[e.color]}`} />
								<span className="truncate text-xs">{e.title}</span>
							</div>
						))}
					</div>
				</div>
			</Card>
		</Example>
	);
}
