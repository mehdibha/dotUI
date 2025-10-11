"use client";

import { ProgressBar } from "@dotui/registry-v2/ui/progress-bar";

export function ProgressBarDemo() {
  return (
    <div className="flex flex-col gap-6">
      {(["sm", "md", "lg"] as const).map((size) => (
        <ProgressBar
          key={size}
          size={size}
          label="Loading..."
          value={45}
          showValueLabel
        />
      ))}
      <ProgressBar
        label="Download progress"
        value={75}
        variant="accent"
        showValueLabel
      />
      <ProgressBar
        label="Upload progress"
        value={30}
        variant="primary"
        showValueLabel
      />
      <ProgressBar
        label="Warning state"
        value={90}
        variant="warning"
        showValueLabel
      />
      <ProgressBar
        label="Danger state"
        value={95}
        variant="danger"
        showValueLabel
      />
      <ProgressBar
        label="Success state"
        value={100}
        variant="success"
        showValueLabel
      />
      <ProgressBar label="Indeterminate" isIndeterminate />
      <ProgressBar
        label="Processing"
        description="This may take a few moments"
        value={60}
        showValueLabel
      />
    </div>
  );
}
