"use client";

import {
  ProgressBar,
  ProgressBarControl,
} from "@dotui/registry/ui/progress-bar";

export default function Demo() {
  return (
    <ProgressBar aria-label="Progress shape" value={75}>
      <ProgressBarControl />
    </ProgressBar>
  );
}
