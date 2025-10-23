"use client";


import { ProgressBar } from "@dotui/registry/ui/progress-bar";

export default function Demo() {
  return (
    <div className="space-y-4">
      <ProgressBar aria-label="Loading" value={75} />
      <ProgressBar label="Loading..." value={75} />
    </div>
  );
}
