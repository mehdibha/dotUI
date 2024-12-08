"use client";

import * as React from "react";
import { Progress } from "@/components/dynamic-core/progress";

export default function Demo() {
  return (
    <Progress
      aria-label="Min and max values"
      minValue={50}
      maxValue={150}
      value={100}
    />
  );
}
