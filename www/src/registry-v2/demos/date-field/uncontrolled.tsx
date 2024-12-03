"use client";

import React from "react";
import { parseDate } from "@internationalized/date";
import { DateField } from "@/components/dynamic-core/date-field";

export default function Demo() {
  return (
    <DateField aria-label="Event date" defaultValue={parseDate("2020-02-03")} />
  );
}
