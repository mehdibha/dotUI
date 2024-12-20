"use client";

import * as React from "react";
import { Progress } from "@/components/dynamic-core/progress";

export default function Demo() {
  return (
    <Progress
      value={75}
      aria-label="Custom color"
      classNames={{
        indicator: "bg-slate-300 dark:bg-slate-800",
        filler: "bg-slate-800 dark:bg-slate-300",
      }}
    />
  );
}
