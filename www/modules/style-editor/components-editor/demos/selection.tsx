import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@dotui/registry/ui/select";

import { getComponentVariants } from "@/modules/style-editor/components-editor/demos/utils";
import { Section } from "@/modules/style-editor/components-editor/section";

export function Selection() {
  return (
    <Section
      name="selection"
      title="Selection"
      variants={getComponentVariants("select")}
    >
      <Select aria-label="Basic select" form="none" defaultValue="option-1">
        <SelectTrigger />
        <SelectContent>
          <SelectItem id="option-1">Option 1</SelectItem>
          <SelectItem id="option-2">Option 2</SelectItem>
          <SelectItem id="option-3">Option 3</SelectItem>
        </SelectContent>
      </Select>
    </Section>
  );
}
