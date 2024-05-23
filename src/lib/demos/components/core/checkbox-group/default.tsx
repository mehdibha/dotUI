"use client";

import { Checkbox } from "@/lib/components/core/default/checkbox/checkbox";
import { CheckboxGroup } from "@/lib/components/core/default/checkbox/checkbox-group";

export default function CheckboxDemo() {
  return (
    <CheckboxGroup label="Choices" description="You can pick any of these choices.">
      <Checkbox value="opt-1">First option</Checkbox>
      <Checkbox value="opt-2">Another option</Checkbox>
      <Checkbox value="opt-2">A secret third thing</Checkbox>
      <Checkbox value="opt-3">The last one</Checkbox>
    </CheckboxGroup>
  );
}
