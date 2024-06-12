import { Checkbox, CheckboxGroup } from "@/lib/components/core/default/checkbox";

export default function Demo() {
  return (
    <CheckboxGroup label="React frameworks" defaultValue={["nextjs"]}>
      <Checkbox value="nextjs">Next.js</Checkbox>
      <Checkbox value="remix">Remix</Checkbox>
      <Checkbox value="gatsby">Gatsby</Checkbox>
    </CheckboxGroup>
  );
}
