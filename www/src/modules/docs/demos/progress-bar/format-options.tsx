"use client";

import * as React from "react";
import { ProgressBar } from "@/components/dynamic-ui/progress-bar";

export default function Demo() {
  return (
    <ProgressBar
      label="Sending…"
      showValueLabel
      formatOptions={{ style: "currency", currency: "JPY" }}
      value={60}
    />
  );
}
