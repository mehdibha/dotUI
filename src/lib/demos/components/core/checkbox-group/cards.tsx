import { CheckboxCard, CheckboxGroup } from "@/lib/components/core/default/checkbox";

export default function Demo() {
  return (
    <CheckboxGroup label="React frameworks" defaultValue={["nextjs"]}>
      <CheckboxCard value="nextjs" title="Next.js" />
      <CheckboxCard value="remix" title="Remix" />
      <CheckboxCard value="gatsby" title="Gatsby" />
    </CheckboxGroup>
  );
}
