import * as React from "react";

import { ProgressBar } from "@dotui/ui/components/progress-bar";

const variants = ["primary", "success", "accent", "danger", "warning"] as const;

export default function Demo() {
  return (
    <div className="space-y-4">
      {variants.map((variant) => (
        <ProgressBar
          key={variant}
          value={75}
          label={variant}
          variant={variant}
        />
      ))}
    </div>
  );
}
