"use client";

import React from "react";
import { Checkbox } from "@/registry/ui/default/core/checkbox";
import { CheckboxGroup } from "@/registry/ui/default/core/checkbox-group";

export default function Demo() {
  const [frameworks, setFrameworks] = React.useState(["nextjs"]);
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