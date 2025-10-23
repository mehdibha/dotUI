

import { Checkbox } from "@dotui/registry/ui/checkbox";
import { CheckboxGroup } from "@dotui/registry/ui/checkbox-group";

export default function Demo() {
  return (
    <CheckboxGroup label="React frameworks" isRequired>
      <Checkbox value="nextjs">Next.js</Checkbox>
      <Checkbox value="remix">Remix</Checkbox>
    </CheckboxGroup>
  );
}
