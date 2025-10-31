"use client";

import { Label } from "@dotui/registry/ui/field";
import {
  ProgressBar,
  ProgressBarControl,
} from "@dotui/registry/ui/progress-bar";

export default function Demo() {
  return (
    <div className="space-y-4">
      <ProgressBar aria-label="Loading" value={75}>
        <ProgressBarControl />
      </ProgressBar>
      <ProgressBar value={75}>
        <Label>Loading...</Label>
        <ProgressBarControl />
      </ProgressBar>
    </div>
  );
}
