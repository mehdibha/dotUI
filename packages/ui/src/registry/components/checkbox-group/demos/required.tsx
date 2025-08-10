import React from "react";

import { Checkbox } from "@dotui/ui/components/checkbox";
import { CheckboxGroup } from "@dotui/ui/components/checkbox-group";

export default function Demo() {
  return (
    <CheckboxGroup label="React frameworks" isRequired>
      <Checkbox value="nextjs">Next.js</Checkbox>
      <Checkbox value="remix">Remix</Checkbox>
    </CheckboxGroup>
  );
}
