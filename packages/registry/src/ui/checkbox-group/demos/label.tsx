import { Checkbox } from "@dotui/registry/ui/checkbox";
import { CheckboxGroup } from "@dotui/registry/ui/checkbox-group";

export default function Demo() {
  return (
    <div className="flex items-center gap-10">
      <CheckboxGroup label="React frameworks" defaultValue={["nextjs"]}>
        <Checkbox value="nextjs">Next.js</Checkbox>
        <Checkbox value="remix">Remix</Checkbox>
      </CheckboxGroup>
      <CheckboxGroup aria-label="React frameworks" defaultValue={["nextjs"]}>
        <Checkbox value="nextjs">Next.js</Checkbox>
        <Checkbox value="remix">Remix</Checkbox>
      </CheckboxGroup>
    </div>
  );
}
