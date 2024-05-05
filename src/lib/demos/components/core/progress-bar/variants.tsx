import * as React from "react";
import { ProgressBar } from "@/lib/components/core/default/progress-bar";

const variants = ["default", "success", "info", "danger", "warning"] as const;

export default function ProgressDemo() {
  return (
    <div className="w-full space-y-4">
      {variants.map((variant) => (
        <div key={variant}>
          <p className="font-bold">{variant}</p>
          <ProgressBar value={75} variant={variant} />
        </div>
      ))}
    </div>
  );
}
