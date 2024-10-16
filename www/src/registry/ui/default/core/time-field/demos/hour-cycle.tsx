"use client";

import { TimeField } from "@/registry/ui/default/core/time-field";

export default function Demo() {
  return <TimeField aria-label="Appointment time" hourCycle={24} />;
}
