"use client";

import { Calendar } from "@/registry/ui/calendar";

interface RangeCalendarPlaygroundProps {
	isDisabled?: boolean;
	isReadOnly?: boolean;
}

export function RangeCalendarPlayground({ isDisabled = false, isReadOnly = false }: RangeCalendarPlaygroundProps) {
	return <Calendar mode="range" aria-label="Date range" isDisabled={isDisabled} isReadOnly={isReadOnly} />;
}
