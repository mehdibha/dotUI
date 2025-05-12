import { Checkbox } from "@/components/dynamic-ui/checkbox";
import { CheckboxGroup } from "@/components/dynamic-ui/checkbox-group";

export default function Demo() {
  return (
    <CheckboxGroup
      label="React frameworks"
      isInvalid
      errorMessage="Please select a framework."
      description="hello world"
    >
      <Checkbox value="nextjs">Next.js</Checkbox>
      <Checkbox value="remix">Remix</Checkbox>
      <Checkbox value="gatsby">Gatsby</Checkbox>
    </CheckboxGroup>
  );
}
