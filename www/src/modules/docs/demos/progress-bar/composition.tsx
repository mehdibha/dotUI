"use client";

import * as React from "react";
import {
  ProgressBarIndicator,
  ProgressBarRoot,
  ProgressBarValueLabel,
} from "@/components/dynamic-ui/progress-bar";
import { Label } from "react-aria-components";

export default function Demo() {
  return (
    <ProgressBarRoot value={50} className="flex-row items-center gap-4">
      <Label>Progress</Label>
      <ProgressBarIndicator />
      <ProgressBarValueLabel />
    </ProgressBarRoot>
  );
}
