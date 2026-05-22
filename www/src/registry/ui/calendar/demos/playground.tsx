"use client";

import { Calendar, RangeCalendar } from "@/registry/ui/calendar";

interface CalendarPlaygroundProps {
	isDisabled?: boolean;
	isReadOnly?: boolean;
}

export function CalendarPlayground({ isDisabled = false, isReadOnly = false }: CalendarPlaygroundProps) {
	return <Calendar aria-label="Date" isDisabled={isDisabled} isReadOnly={isReadOnly} />;
}

interface RangeCalendarPlaygroundProps {
	isDisabled?: boolean;
	isReadOnly?: boolean;
}

export function RangeCalendarPlayground({ isDisabled = false, isReadOnly = false }: RangeCalendarPlaygroundProps) {
	return <RangeCalendar aria-label="Date range" isDisabled={isDisabled} isReadOnly={isReadOnly} />;
}
