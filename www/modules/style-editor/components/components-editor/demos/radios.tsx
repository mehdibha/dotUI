import { Radio, RadioGroup } from "@dotui/registry/ui/radio-group";

import { getComponentVariants } from "@/modules/style-editor/components/components-editor/demos/utils";
import { Section } from "@/modules/style-editor/components/components-editor/section";

export function Radios() {
  return (
    <Section
      name="radios"
      title="Radios"
      variants={getComponentVariants("radio-group")}
      previewClassName="flex-col gap-4"
    >
      <RadioGroup
        aria-label="Basic radio group"
        defaultValue="option-1"
        form="none"
      >
        <Radio value="option-1">Option 1</Radio>
        <Radio value="option-2">Option 2</Radio>
        <Radio value="option-3">Option 3</Radio>
      </RadioGroup>
      <RadioGroup
        variant="card"
        orientation="horizontal"
        aria-label="Card radio group"
        defaultValue="option-1"
        form="none"
      >
        <Radio value="option-1">Option 1</Radio>
        <Radio value="option-2">Option 2</Radio>
        <Radio value="option-3">Option 3</Radio>
      </RadioGroup>
    </Section>
  );
}
