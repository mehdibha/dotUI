"use client";

import * as React from "react";
import { DatePicker } from "@/lib/components/core/default/date-picker";

export default function DatePickerDemo() {
  const [date, setDate] = React.useState<Date>();

  return <DatePicker />;
}
