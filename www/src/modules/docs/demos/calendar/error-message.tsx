"use client";

import React from "react";
import { today, isWeekend, getLocalTimeZone } from "@internationalized/date";
import { useLocale } from "react-aria";
import { type DateValue } from "react-aria-components";
import { Calendar } from "@/components/dynamic-ui/calendar";

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
      errorMessage={"We are closed on weekends"}
    />
  );
}
