import React from "react";
import { Checkbox } from "@/components/dynamic-ui/checkbox";
import { CheckboxGroup } from "@/components/dynamic-ui/checkbox-group";

export default function Demo() {
  return (
    <CheckboxGroup label="React frameworks" isRequired>
      <Checkbox value="nextjs">Next.js</Checkbox>
      <Checkbox value="remix">Remix</Checkbox>
    </CheckboxGroup>
  );
}
