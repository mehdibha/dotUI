"use client";

import React from "react";
import { Checkbox, CheckboxGroup } from "@/lib/components/core/default/checkbox";

export default function Demo() {
  const [frameworks, setFrameworks] = React.useState(["nextjs", "remix", "gatsby"]);
  return (
    <div className="flex flex-col items-center gap-4">
      <CheckboxGroup
        label="React frameworks"
        value={frameworks}
        onChange={(value) => setFrameworks(value)}
      >
        <Checkbox value="nextjs">Next.js</Checkbox>
        <Checkbox value="remix">Remix</Checkbox>
        <Checkbox value="gatsby">Gatsby</Checkbox>
      </CheckboxGroup>
      <p className="text-xs text-fg-muted">
        {frameworks.length === 0
          ? "You haven't selected any frameworks."
          : `You selected ${frameworks.join(", ")}.`}
      </p>
    </div>
  );
}
