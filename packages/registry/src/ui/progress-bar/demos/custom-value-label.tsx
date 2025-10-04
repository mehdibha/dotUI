"use client";

import * as React from "react";

import { ProgressBar } from "@dotui/registry/ui/progress-bar";

export default function Demo() {
  return (
    <ProgressBar
      label="Feeding…"
      showValueLabel
      valueLabel="30 of 100 dogs"
      value={30}
    />
  );
}
