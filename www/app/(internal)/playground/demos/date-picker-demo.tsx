"use client";

import React from "react";
import { CalendarIcon } from "lucide-react";

import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";
import { Calendar } from "@dotui/registry/ui/calendar";
import { DatePicker } from "@dotui/registry/ui/date-picker";
import { DatePickerContent, DatePickerInput } from "@dotui/registry/ui/date-picker/basic";
import { DialogContent } from "@dotui/registry/ui/dialog";
import { Label } from "@dotui/registry/ui/field";
import { DateInput, InputAddon, InputGroup } from "@dotui/registry/ui/input";
import { Overlay } from "@dotui/registry/ui/overlay";

export function DatePickerDemo() {
	const triggerRef = React.useRef<HTMLButtonElement>(null);
	const triggerRef2 = React.useRef<HTMLButtonElement>(null);

	const triggerRef3 = React.useRef<HTMLButtonElement>(null);
	const triggerRef4 = React.useRef<HTMLButtonElement>(null);

	return (
		<div className="grid grid-cols-2 gap-6">
			<div className="space-y-6">
				<DatePicker>
					<Label>Meeting date</Label>
					<DatePickerInput />
					<DatePickerContent>
						<Calendar aria-label="Pick a date" />
					</DatePickerContent>
				</DatePicker>

				<DatePicker>
					{({ state }) => (
						<>
							<Label>Meeting date</Label>
							<Button
								ref={triggerRef}
								className={cn("w-48 justify-start border-border-field font-normal", !state.value && "text-fg-muted")}
							>
								<CalendarIcon className="text-fg-muted" /> {state.value ? state.value.toString() : "Pick a date"}
							</Button>
							<Overlay type="popover" popoverProps={{ triggerRef }}>
								<DialogContent>
									<Calendar aria-label="Pick a date" />
								</DialogContent>
							</Overlay>
						</>
					)}
				</DatePicker>

				<DatePicker>
					{({ state }) => (
						<>
							<Label>Meeting date</Label>
							<Button
								ref={triggerRef2}
								className={cn("w-48 justify-between border-border-field font-normal", !state.value && "text-fg-muted")}
							>
								{state.value ? state.value.toString() : "Pick a date"}
								<CalendarIcon className="text-fg-muted" />{" "}
							</Button>
							<Overlay type="popover" popoverProps={{ triggerRef: triggerRef2 }}>
								<DialogContent>
									<Calendar aria-label="Pick a date" />
								</DialogContent>
							</Overlay>
						</>
					)}
				</DatePicker>
			</div>

			<div className="space-y-6">
				<DatePicker mode="range">
					<Label>Trip date</Label>
					<InputGroup>
						<DateInput slot="start" />
						<span>–</span>
						<DateInput slot="end" />
						<InputAddon>
							<Button>
								<CalendarIcon />
							</Button>
						</InputAddon>
					</InputGroup>
					<Overlay type="popover">
						<DialogContent>
							<Calendar />
						</DialogContent>
					</Overlay>
				</DatePicker>

				<DatePicker mode="range">
					{({ state }) => (
						<>
							<Label>Meeting date</Label>
							<Button
								ref={triggerRef3}
								className={cn("border-border-field font-normal", !state.value && "text-fg-muted")}
							>
								<CalendarIcon className="text-fg-muted" />{" "}
								{state.value.start && state.value.end
									? `${state.value.start.toString()} – ${state.value.end.toString()}`
									: "Pick your trip dates"}
							</Button>
							<Overlay type="popover" popoverProps={{ triggerRef: triggerRef3 }}>
								<DialogContent>
									<Calendar mode="range" aria-label="Pick your trip dates" />
								</DialogContent>
							</Overlay>
						</>
					)}
				</DatePicker>

				<DatePicker mode="range">
					{({ state }) => (
						<>
							<Label>Trip dates</Label>
							<Button
								ref={triggerRef4}
								className={cn("border-border-field font-normal", !state.value && "text-fg-muted")}
							>
								{state.value.start && state.value.end
									? `${state.value.start.toString()} – ${state.value.end.toString()}`
									: "Pick your trip dates"}
								<CalendarIcon className="text-fg-muted" />{" "}
							</Button>
							<Overlay type="popover" popoverProps={{ triggerRef: triggerRef4 }}>
								<DialogContent>
									<Calendar mode="range" aria-label="Pick your trip dates" />
								</DialogContent>
							</Overlay>
						</>
					)}
				</DatePicker>
			</div>
		</div>
	);
}
