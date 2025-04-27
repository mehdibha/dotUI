"use client";

import * as React from "react";
import { ProgressBar } from "@/components/dynamic-core/progress-bar";

export default function Demo() {
  return (
    <div className="space-y-4">
      <ProgressBar aria-label="Loading" value={75} />
      <ProgressBar label="Loading..." value={75} />
    </div>
  );
}
