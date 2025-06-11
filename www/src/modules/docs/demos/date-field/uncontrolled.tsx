"use client";

import React from "react";
import { DateField } from "@/components/dynamic-ui/date-field";
import { parseDate } from "@internationalized/date";

export default function Demo() {
  return (
    <DateField aria-label="Event date" defaultValue={parseDate("2020-02-03")} />
  );
}
