import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { WheelPicker, WheelPickerItem } from "@/components/wheel-picker";
import { Button } from "@/registry/ui/button";
import { Dialog, DialogContent, DialogHeading } from "@/registry/ui/dialog";
import { Popover } from "@/registry/ui/popover";

export const Route = createFileRoute("/playground")({
	component: PlaygroundPage,
});

// --------------------------------------------------------------------------
// Shared data
// --------------------------------------------------------------------------

const YEARS = Array.from({ length: 150 }, (_, i) => 1950 + i);
const CURRENT_YEAR = new Date().getFullYear();

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);
const pad = (n: number) => String(n).padStart(2, "0");

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

// --------------------------------------------------------------------------
// Example: Year picker (standalone)
// --------------------------------------------------------------------------

function YearExample() {
	const [year, setYear] = useState<string>(String(CURRENT_YEAR));
	return (
		<ExampleFrame label="Year" value={year}>
			<WheelPicker
				aria-label="Year"
				value={year}
				onValueChange={(v) => setYear(String(v))}
				className="w-24"
			>
				{YEARS.map((y) => (
					<WheelPickerItem key={y} id={String(y)} textValue={String(y)}>
						{y}
					</WheelPickerItem>
				))}
			</WheelPicker>
		</ExampleFrame>
	);
}

// --------------------------------------------------------------------------
// Example: Time picker (HH : MM)
// --------------------------------------------------------------------------

function TimeExample() {
	const [hour, setHour] = useState<string>("9");
	const [minute, setMinute] = useState<string>("30");
	return (
		<ExampleFrame label="Time" value={`${pad(Number(hour))}:${pad(Number(minute))}`}>
			<div className="flex items-center gap-1">
				<WheelPicker
					aria-label="Hour"
					value={hour}
					onValueChange={(v) => setHour(String(v))}
					className="w-16"
				>
					{HOURS.map((h) => (
						<WheelPickerItem key={h} id={String(h)} textValue={pad(h)}>
							{pad(h)}
						</WheelPickerItem>
					))}
				</WheelPicker>
				<span className="pb-0.5 font-medium text-fg text-lg">:</span>
				<WheelPicker
					aria-label="Minute"
					value={minute}
					onValueChange={(v) => setMinute(String(v))}
					className="w-16"
				>
					{MINUTES.map((m) => (
						<WheelPickerItem key={m} id={String(m)} textValue={pad(m)}>
							{pad(m)}
						</WheelPickerItem>
					))}
				</WheelPicker>
			</div>
		</ExampleFrame>
	);
}

// --------------------------------------------------------------------------
// Example: Month + year picker
// --------------------------------------------------------------------------

function MonthYearExample() {
	const [month, setMonth] = useState<string>("4");
	const [year, setYear] = useState<string>(String(CURRENT_YEAR));
	return (
		<ExampleFrame label="Month / Year" value={`${MONTHS[Number(month)]} ${year}`}>
			<div className="flex items-center gap-2">
				<WheelPicker
					aria-label="Month"
					value={month}
					onValueChange={(v) => setMonth(String(v))}
					className="w-32"
				>
					{MONTHS.map((name, i) => (
						<WheelPickerItem key={i} id={String(i)} textValue={name}>
							{name}
						</WheelPickerItem>
					))}
				</WheelPicker>
				<WheelPicker
					aria-label="Year"
					value={year}
					onValueChange={(v) => setYear(String(v))}
					className="w-20"
				>
					{YEARS.map((y) => (
						<WheelPickerItem key={y} id={String(y)} textValue={String(y)}>
							{y}
						</WheelPickerItem>
					))}
				</WheelPicker>
			</div>
		</ExampleFrame>
	);
}

// --------------------------------------------------------------------------
// Example: Inside a popover (acts like a compact Select)
// --------------------------------------------------------------------------

function PopoverExample() {
	const [year, setYear] = useState<string>(String(CURRENT_YEAR));
	return (
		<ExampleFrame label="Popover trigger" value={year}>
			<Dialog>
				<Button variant="outline">Pick year: {year}</Button>
				<Popover>
					<DialogContent className="w-32 p-2">
						<DialogHeading className="sr-only">Pick a year</DialogHeading>
						<WheelPicker
							aria-label="Year"
							value={year}
							onValueChange={(v) => setYear(String(v))}
							visibleCount={7}
						>
							{YEARS.map((y) => (
								<WheelPickerItem
									key={y}
									id={String(y)}
									textValue={String(y)}
								>
									{y}
								</WheelPickerItem>
							))}
						</WheelPicker>
					</DialogContent>
				</Popover>
			</Dialog>
		</ExampleFrame>
	);
}

// --------------------------------------------------------------------------
// Layout
// --------------------------------------------------------------------------

function ExampleFrame({
	label,
	value,
	children,
}: {
	label: string;
	value: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex w-72 flex-col items-center gap-3 rounded-lg border bg-card p-6">
			<div className="flex w-full items-baseline justify-between">
				<span className="text-fg-muted text-xs uppercase tracking-wide">
					{label}
				</span>
				<span className="font-medium text-fg text-sm tabular-nums">{value}</span>
			</div>
			{children}
		</div>
	);
}

function PlaygroundPage() {
	return (
		<div className="flex min-h-screen items-start justify-center bg-bg p-10">
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<YearExample />
				<TimeExample />
				<MonthYearExample />
				<PopoverExample />
			</div>
		</div>
	);
}
