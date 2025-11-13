"use client";

import React from "react";

import { Checkbox } from "@dotui/registry/ui/checkbox";
import { CheckboxGroup } from "@dotui/registry/ui/checkbox-group";
import { FieldGroup, Label } from "@dotui/registry/ui/field";

export default function Demo() {
  const [frameworks, setFrameworks] = React.useState(["nextjs"]);
  return (
    <div className="flex flex-col items-center gap-4">
      <CheckboxGroup
        value={frameworks}
        onChange={(value) => setFrameworks(value)}
      >
        <Label>React frameworks</Label>
        <FieldGroup>
          <Checkbox value="nextjs">Next.js</Checkbox>
          <Checkbox value="remix">Remix</Checkbox>
          <Checkbox value="gatsby">Gatsby</Checkbox>
        </FieldGroup>
      </CheckboxGroup>
      <p className="text-fg-muted text-xs">
        {frameworks.length === 0
          ? "You haven't selected any frameworks."
          : `You selected ${frameworks.join(", ")}.`}
      </p>
    </div>
  );
}
