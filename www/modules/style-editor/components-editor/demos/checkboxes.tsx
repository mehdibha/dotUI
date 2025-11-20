import { Checkbox } from "@dotui/registry/ui/checkbox";

import { Section } from "@/modules/style-editor/components-editor/component-config-section";
import { getComponentVariants } from "@/modules/style-editor/components-editor/demos/utils";

export function Checkboxes() {
  return (
    <Section
      name="checkboxes"
      title="Checkboxes"
      variants={getComponentVariants("checkbox")}
      previewClassName="gap-4"
    >
      <Checkbox aria-label="Basic checkbox" form="none" />
      <Checkbox defaultSelected form="none">
        Hello world
      </Checkbox>
      <Checkbox defaultSelected form="none">
        Hello world
      </Checkbox>
    </Section>
  );
}
