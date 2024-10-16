import { ContextualHelp } from "@/registry/ui/default/core/contextual-help";
import { RadioGroup, Radio } from "@/registry/ui/default/core/radio-group";

export default function Demo() {
  return (
    <RadioGroup
      defaultValue="sm"
      label="Size"
      contextualHelp={
        <ContextualHelp
          title="Need help?"
          description="If you need help, please contact support."
        />
      }
    >
      <Radio value="sm">Small</Radio>
      <Radio value="md">Medium</Radio>
      <Radio value="lg">Large</Radio>
    </RadioGroup>
  );
}
