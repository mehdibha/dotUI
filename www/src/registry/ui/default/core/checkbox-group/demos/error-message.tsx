import { Checkbox } from "@/registry/ui/default/core/checkbox";
import { CheckboxGroup } from "@/registry/ui/default/core/checkbox-group";

export default function Demo() {
  return (
    <CheckboxGroup
      label="React frameworks"
      isInvalid
      errorMessage="Please select a framework."
    >
      <Checkbox value="nextjs">Next.js</Checkbox>
      <Checkbox value="remix">Remix</Checkbox>
      <Checkbox value="gatsby">Gatsby</Checkbox>
    </CheckboxGroup>
  );
}
