import { Checkbox } from "@/registry/ui/default/core/checkbox";
import { CheckboxGroup } from "@/registry/ui/default/core/checkbox-group";
import { ContextualHelp } from "@/registry/ui/default/core/contextual-help";

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
