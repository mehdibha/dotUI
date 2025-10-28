"use client";

import {
  ProgressBar,
  ProgressBarControl,
} from "@dotui/registry-v2/ui/progress-bar";

export function ProgressBarDemo() {
  return (
    <div className="flex flex-col gap-6">
      {(["sm", "md", "lg"] as const).map((size) => (
        <ProgressBar key={size} value={45}>
          <ProgressBarControl />
        </ProgressBar>
      ))}
    </div>
  );
}
