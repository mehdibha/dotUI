"use client";

import * as React from "react";

import { ProgressBar } from "@dotui/ui/components/progress-bar";

export default function Demo() {
  return (
    <ProgressBar
      aria-label="Min and max values"
      minValue={50}
      maxValue={150}
      value={100}
    />
  );
}
