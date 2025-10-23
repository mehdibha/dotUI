"use client";


import { ProgressBar } from "@dotui/registry/ui/progress-bar";

const sizes = ["sm", "md", "lg"] as const;

export default function Demo() {
  return (
    <div className="space-y-4">
      {sizes.map((size) => (
        <ProgressBar
          key={size}
          aria-label={`Progress size: ${size}`}
          value={75}
          size={size}
          label={size}
        />
      ))}
    </div>
  );
}
