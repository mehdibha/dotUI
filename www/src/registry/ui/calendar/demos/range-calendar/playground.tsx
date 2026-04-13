"use client";

import { RangeCalendar } from "@/registry/ui/calendar";

interface RangeCalendarPlaygroundProps {
	isDisabled?: boolean;
	isReadOnly?: boolean;
}

export function RangeCalendarPlayground({ isDisabled = false, isReadOnly = false }: RangeCalendarPlaygroundProps) {
	return <RangeCalendar aria-label="Date range" isDisabled={isDisabled} isReadOnly={isReadOnly} />;
}
