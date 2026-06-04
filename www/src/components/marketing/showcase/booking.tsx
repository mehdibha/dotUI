"use client";

import { parseDate, Time } from "@internationalized/date";

import { cn } from "@/registry/lib/utils";
import { Button } from "@/registry/ui/button";
import { Calendar } from "@/registry/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/registry/ui/card";
import { Label } from "@/registry/ui/field";
import { DateInput } from "@/registry/ui/input";
import { TimeField } from "@/registry/ui/time-field";

export function Booking({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<Card className={cn("", className)} {...props}>
			<CardHeader>
				<CardTitle>Booking</CardTitle>
				<CardDescription>Pick a time for your meeting.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-3">
				<Calendar className="w-full border-0 bg-transparent p-0" defaultValue={parseDate("2025-09-23")} />
				<div className="grid grid-cols-2 gap-2">
					<TimeField defaultValue={new Time(9, 0)}>
						<Label>Start time</Label>
						<DateInput />
					</TimeField>
					<TimeField defaultValue={new Time(9, 30)}>
						<Label>End time</Label>
						<DateInput />
					</TimeField>
				</div>
			</CardContent>
			<CardFooter className="justify-end gap-2">
				<Button>Dismiss</Button>
				<Button variant="primary">Apply</Button>
			</CardFooter>
		</Card>
	);
}
