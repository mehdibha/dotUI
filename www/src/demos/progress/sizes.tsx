"use client";

import * as React from "react";
import { Progress } from "@/registry/ui/default/core/progress";

const sizes = ["sm", "md", "lg"] as const;

export default function Demo() {
  return (
    <div className="space-y-4">
      {sizes.map((size) => (
        <Progress
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
