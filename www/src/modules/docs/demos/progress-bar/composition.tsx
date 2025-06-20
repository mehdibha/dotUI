"use client";

import * as React from "react";
import { Label } from "react-aria-components";

import {
  ProgressBarIndicator,
  ProgressBarRoot,
  ProgressBarValueLabel,
} from "@dotui/ui/components/progress-bar";

export default function Demo() {
  return (
    <ProgressBarRoot value={50} className="flex-row items-center gap-4">
      <Label>Progress</Label>
      <ProgressBarIndicator />
      <ProgressBarValueLabel />
    </ProgressBarRoot>
  );
}
