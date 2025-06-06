"use client";

import * as React from "react";
import { ProgressBar } from "@/components/dynamic-ui/progress-bar";

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
