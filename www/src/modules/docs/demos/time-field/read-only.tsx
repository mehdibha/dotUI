"use client";

import React from "react";
import { TimeField } from "@/components/dynamic-ui/time-field";
import { Time } from "@internationalized/date";

export default function Demo() {
  return <TimeField label="Event time" value={new Time(11)} isReadOnly />;
}
