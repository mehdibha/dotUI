"use client";

import { TimeField } from "@/components/dynamic-core/time-field";

export default function Demo() {
  return <TimeField aria-label="Appointment time" hourCycle={24} />;
}
