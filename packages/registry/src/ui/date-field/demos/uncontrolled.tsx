"use client";

import { parseDate } from "@internationalized/date";

import { DateField } from "@dotui/registry/ui/date-field";

export default function Demo() {
  return (
    <DateField aria-label="Event date" defaultValue={parseDate("2020-02-03")} />
  );
}
