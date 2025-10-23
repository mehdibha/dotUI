"use client";


import { ProgressBar } from "@dotui/registry/ui/progress-bar";

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
