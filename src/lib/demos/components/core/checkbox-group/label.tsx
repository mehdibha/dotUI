import { CheckboxGroup, Checkbox } from "@/lib/components/core/default/checkbox";

export default function Demo() {
  return (
    <div className="flex items-center gap-10">
      <CheckboxGroup label="React frameworks" defaultValue={["nextjs"]}>
        <Checkbox value="nextjs">Next.js</Checkbox>
        <Checkbox value="remix">Remix</Checkbox>
        <Checkbox value="gatsby">Gatsby</Checkbox>
      </CheckboxGroup>
      <CheckboxGroup aria-label="React frameworks" defaultValue={["nextjs"]}>
        <Checkbox value="nextjs">Next.js</Checkbox>
        <Checkbox value="remix">Remix</Checkbox>
        <Checkbox value="gatsby">Gatsby</Checkbox>
      </CheckboxGroup>
    </div>
  );
}
