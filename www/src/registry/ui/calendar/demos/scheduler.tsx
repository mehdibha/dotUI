"use client";

import React from "react";

import { getLocalTimeZone, today } from "@internationalized/date";

import type * as CalendarPrimitives from "react-aria-components/Calendar";

import { PlusIcon, Trash2Icon } from "@/registry/__generated__/icons";
import { Badge } from "@/registry/ui/badge";
import { Button } from "@/registry/ui/button";
import {
	Calendar,
	CalendarCell,
	CalendarGrid,
	CalendarGridBody,
	CalendarGridHeader,
	CalendarHeader,
	CalendarHeaderCell,
} from "@/registry/ui/calendar";
import { Card, CardContent } from "@/registry/ui/card";
import { ColorPicker } from "@/registry/ui/color-picker";
import { ColorSwatch } from "@/registry/ui/color-swatch";
import { ColorSwatchPicker, ColorSwatchPickerItem } from "@/registry/ui/color-swatch-picker";
import { DialogContent } from "@/registry/ui/dialog";
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input";
import { Popover } from "@/registry/ui/popover";
import { TextField } from "@/registry/ui/text-field";

type EventVariant = "accent" | "info" | "success" | "warning" | "danger";
type ScheduleEvent = {
	id: string;
	title: string;
	date: CalendarPrimitives.DateValue;
	variant: EventVariant;
};

const EVENT_DOT_CLASS: Record<EventVariant, string> = {
	accent: "bg-accent",
	info: "bg-info",
	success: "bg-success",
	warning: "bg-warning",
	danger: "bg-danger",
};

const INITIAL_EVENTS = (now: CalendarPrimitives.DateValue): ScheduleEvent[] => [
	{ id: "1", title: "Standup", date: now.subtract({ days: 2 }), variant: "accent" },
	{ id: "2", title: "Design review", date: now, variant: "info" },
	{ id: "3", title: "1:1 with Sam", date: now, variant: "success" },
	{ id: "4", title: "Product sync", date: now, variant: "warning" },
	{ id: "5", title: "Lunch w/ Alex", date: now, variant: "danger" },
	{ id: "6", title: "Sprint planning", date: now.add({ days: 1 }), variant: "accent" },
	{ id: "7", title: "Ship v2.1", date: now.add({ days: 3 }), variant: "info" },
	{ id: "8", title: "Customer call", date: now.add({ days: 4 }), variant: "success" },
	{ id: "9", title: "Team offsite", date: now.add({ days: 7 }), variant: "warning" },
	{ id: "10", title: "Board meeting", date: now.add({ days: 9 }), variant: "danger" },
	{ id: "11", title: "Launch review", date: now.add({ days: 14 }), variant: "info" },
];

export default function Demo() {
	const now = React.useMemo(() => today(getLocalTimeZone()), []);
	const [events, setEvents] = React.useState<ScheduleEvent[]>(() => INITIAL_EVENTS(now));
	const [selectedDate, setSelectedDate] = React.useState<CalendarPrimitives.DateValue>(now);
	const [newTitle, setNewTitle] = React.useState("");
	const [newVariant] = React.useState<EventVariant>("accent");
	const idCounter = React.useRef(events.length + 1);

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

	const getEvents = (d: CalendarPrimitives.DateValue) => eventsByDay.get(d.toString()) ?? [];

	const selectedLabel = selectedDate.toDate(getLocalTimeZone()).toLocaleDateString(undefined, {
		weekday: "long",
		month: "long",
		day: "numeric",
	});
	const selectedEvents = getEvents(selectedDate);

	const submitNewEvent = () => {
		const trimmed = newTitle.trim();
		if (!trimmed) return;
		setEvents((prev) => [
			...prev,
			{ id: String(idCounter.current++), title: trimmed, date: selectedDate, variant: newVariant },
		]);
		setNewTitle("");
	};

	return (
		<Card className="mx-auto w-fit overflow-hidden">
			<CardContent className="flex flex-col gap-4 p-4 lg:flex-row">
				<Calendar aria-label="Schedule" value={selectedDate} onChange={(d) => d && setSelectedDate(d)}>
					<CalendarHeader />
					<CalendarGrid>
						<CalendarGridHeader>{(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}</CalendarGridHeader>
						<CalendarGridBody>
							{(date) => (
								<CalendarCell
									date={date}
									className="flex aspect-auto h-20 w-full cursor-pointer flex-col items-stretch justify-start gap-0.5 overflow-hidden rounded-md p-2 text-left transition-colors outline-none hover:bg-inverse/5! focus-visible:focus-ring outside-month:text-fg-muted/40 selected:bg-accent/15! selected:text-fg!"
								>
									{({ formattedDate, isOutsideMonth }) => {
										const dayEvents = getEvents(date);
										const visible = dayEvents.slice(0, 2);
										const overflow = dayEvents.length - visible.length;
										return (
											<>
												<span className="px-1 text-center text-xs font-medium">{formattedDate}</span>
												{!isOutsideMonth && dayEvents.length > 0 && (
													<div className="flex min-w-0 flex-col items-stretch gap-0.5">
														{visible.map((e) => (
															<Badge
																key={e.id}
																variant={e.variant}
																appearance="subtle"
																size="sm"
																className="flex w-full min-w-0 justify-start overflow-hidden"
															>
																<span className="min-w-0 flex-1 truncate">{e.title}</span>
															</Badge>
														))}
														{overflow > 0 && <span className="px-1 text-[10px] text-fg-muted">+{overflow} more</span>}
													</div>
												)}
											</>
										);
									}}
								</CalendarCell>
							)}
						</CalendarGridBody>
					</CalendarGrid>
				</Calendar>
				<div className="flex w-full min-w-64 flex-col gap-3 border-t pt-4 lg:w-72 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-4">
					<div>
						<h4 className="text-sm font-medium">{selectedLabel}</h4>
						<p className="text-xs text-fg-muted">
							{selectedEvents.length} {selectedEvents.length === 1 ? "event" : "events"}
						</p>
					</div>
					{selectedEvents.length === 0 ? (
						<p className="text-sm text-fg-muted">No events yet. Add one below.</p>
					) : (
						<ul className="flex flex-col gap-2">
							{selectedEvents.map((e) => (
								<li key={e.id} className="flex items-center gap-2 rounded-md border p-2">
									<span className={`size-2 shrink-0 rounded-full ${EVENT_DOT_CLASS[e.variant]}`} />
									<span className="flex-1 truncate text-sm">{e.title}</span>
									<Button
										variant="quiet"
										size="sm"
										isIconOnly
										aria-label={`Remove ${e.title}`}
										onPress={() => setEvents((prev) => prev.filter((ev) => ev.id !== e.id))}
									>
										<Trash2Icon />
									</Button>
								</li>
							))}
						</ul>
					)}
					<form
						className="flex flex-col gap-2 border-t pt-3"
						onSubmit={(e) => {
							e.preventDefault();
							submitNewEvent();
						}}
					>
						<div className="flex items-center gap-2">
							<TextField aria-label="Event title" value={newTitle} onChange={setNewTitle} className="w-auto flex-1">
								<InputGroup>
									<InputGroupAddon>
										<ColorPicker>
											<Button>
												<ColorSwatch />
											</Button>
											<Popover>
												<DialogContent>
													<ColorSwatchPicker>
														{[""].map((v) => (
															<ColorSwatchPickerItem key={v} color={v} />
														))}
													</ColorSwatchPicker>
												</DialogContent>
											</Popover>
										</ColorPicker>
									</InputGroupAddon>
									<Input placeholder="New event…" className="w-auto" />
								</InputGroup>
							</TextField>
							<Button type="submit" isDisabled={newTitle.trim().length === 0}>
								<PlusIcon />
								Add
							</Button>
						</div>
					</form>
				</div>
			</CardContent>
		</Card>
	);
}
