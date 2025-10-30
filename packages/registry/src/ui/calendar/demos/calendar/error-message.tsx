"use client";

import React from "react";
import { getLocalTimeZone, isWeekend, today } from "@internationalized/date";
import { useLocale } from "react-aria-components";
import type { DateValue } from "react-aria-components";

import {
  Calendar,
  CalendarGrid,
  CalendarHeader,
} from "@dotui/registry/ui/calendar";
import { FieldError } from "@dotui/registry/ui/field";

export default function Demo() {
  const [date, setDate] = React.useState<DateValue>(today(getLocalTimeZone()));
  const { locale } = useLocale();
  const isInvalid = isWeekend(date, locale);
  return (
    <Calendar
      aria-label="Appointment date"
      value={date}
      onChange={setDate}
      isInvalid={isInvalid}
    >
      <CalendarHeader />
      <CalendarGrid />
      <FieldError>We are closed on weekends</FieldError>
    </Calendar>
  );
}
