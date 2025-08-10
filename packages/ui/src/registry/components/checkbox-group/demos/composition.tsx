import { Checkbox } from "@dotui/ui/components/checkbox";
import { CheckboxGroupRoot } from "@dotui/ui/components/checkbox-group";
import { Description, FieldError, Label } from "@dotui/ui/components/field";

export default function Demo() {
  return (
    <CheckboxGroupRoot defaultValue={["nextjs"]}>
      <Label>React frameworks</Label>
      <Description>You can pick any frameworks.</Description>
      <div className="flex items-center gap-4">
        <Checkbox value="nextjs">Next.js</Checkbox>
        <Checkbox value="remix">Remix</Checkbox>
        <Checkbox value="gatsby">Gatsby</Checkbox>
      </div>
      <FieldError />
    </CheckboxGroupRoot>
  );
}
