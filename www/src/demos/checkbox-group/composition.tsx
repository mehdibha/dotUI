import { Checkbox } from "@/components/dynamic-core/checkbox";
import { CheckboxGroupRoot } from "@/components/dynamic-core/checkbox-group";
import {
  Description,
  FieldError,
  Label,
} from "@/components/dynamic-core/field";

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
