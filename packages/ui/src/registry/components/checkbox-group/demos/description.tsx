import { Checkbox } from "@dotui/ui/components/checkbox";
import { CheckboxGroup } from "@dotui/ui/components/checkbox-group";

export default function Demo() {
  return (
    <CheckboxGroup
      label="React frameworks"
      defaultValue={["nextjs"]}
      description="You can pick any frameworks."
    >
      <Checkbox value="nextjs">Next.js</Checkbox>
      <Checkbox value="remix">Remix</Checkbox>
      <Checkbox value="gatsby">Gatsby</Checkbox>
    </CheckboxGroup>
  );
}
