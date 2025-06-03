"use client";

import type { DateValue } from "@internationalized/date";
import { Calendar } from "@/components/dynamic-ui/calendar";
import {
  CalendarDate,
  getLocalTimeZone,
  isWeekend,
  today,
} from "@internationalized/date";
import { useLocale } from "react-aria";

export default function Demo() {
  const now = today(getLocalTimeZone());
  const disabledRanges: [CalendarDate, CalendarDate][] = [
    [now, now.add({ days: 5 })],
    [now.add({ days: 14 }), now.add({ days: 16 })],
    [now.add({ days: 23 }), now.add({ days: 24 })],
  ];

  const { locale } = useLocale();
  const isDateUnavailable = (date: DateValue) =>
    isWeekend(date, locale) ||
    disabledRanges.some(
      (interval) =>
        date.compare(interval[0]) >= 0 && date.compare(interval[1]) <= 0
    );

  return (
    <Calendar
      aria-label="Appointment date"
      minValue={today(getLocalTimeZone())}
      isDateUnavailable={isDateUnavailable}
    />
  );
}
