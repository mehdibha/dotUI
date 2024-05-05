"use client";

import * as React from "react";
import { ProgressBar } from "@/lib/components/core/default/progress-bar";

const sizes = ["sm", "md", "lg"] as const;

export default function ProgressDemo() {
  return (
    <div className="w-full space-y-4">
      {sizes.map((size) => (
        <div key={size}>
          <p className="font-bold">{size}</p>
          <ProgressBar value={75} size={size} />
        </div>
      ))}
    </div>
  );
}
