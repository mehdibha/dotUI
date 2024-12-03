"use client";

import React from "react";
import { Time } from "@internationalized/date";
import { TimeField } from "@/registry/ui/default/core/time-field";

export default function Demo() {
  return <TimeField label="Event time" value={new Time(11)} isReadOnly />;
}
