import { Checkbox } from "@/components/dynamic-core/checkbox";
import { CheckboxGroup } from "@/components/dynamic-core/checkbox-group";
import { ContextualHelp } from "@/components/dynamic-core/contextual-help";

export default function Demo() {
  return (
    <CheckboxGroup
      label="React frameworks"
      defaultValue={["nextjs"]}
      contextualHelp={
        <ContextualHelp
          title="Need help?"
          description="If you need help, please contact support."
        />
      }
    >
      <Checkbox value="nextjs">Next.js</Checkbox>
      <Checkbox value="remix">Remix</Checkbox>
      <Checkbox value="gatsby">Gatsby</Checkbox>
    </CheckboxGroup>
  );
}
