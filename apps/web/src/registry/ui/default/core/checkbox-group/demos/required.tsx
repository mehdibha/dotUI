import React from "react";
import { Checkbox } from "@/registry/ui/default/core/checkbox";
import { CheckboxGroup } from "@/registry/ui/default/core/checkbox-group";

export default function Demo() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <CheckboxGroup label="React frameworks" isRequired>
        <Checkbox value="nextjs">Next.js</Checkbox>
        <Checkbox value="remix">Remix</Checkbox>
      </CheckboxGroup>
      <CheckboxGroup
        label="React frameworks"
        isRequired
        necessityIndicator="icon"
      >
        <Checkbox value="nextjs">Next.js</Checkbox>
        <Checkbox value="remix">Remix</Checkbox>
      </CheckboxGroup>
      <CheckboxGroup
        label="React frameworks"
        isRequired
        necessityIndicator="label"
      >
        <Checkbox value="nextjs">Next.js</Checkbox>
        <Checkbox value="remix">Remix</Checkbox>
      </CheckboxGroup>
      <CheckboxGroup label="React frameworks" necessityIndicator="label">
        <Checkbox value="nextjs">Next.js</Checkbox>
        <Checkbox value="remix">Remix</Checkbox>
      </CheckboxGroup>
    </div>
  );
}
