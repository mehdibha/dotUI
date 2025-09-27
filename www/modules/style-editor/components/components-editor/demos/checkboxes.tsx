import { Checkbox } from "@dotui/ui/components/checkbox";

import { getComponentVariants } from "@/modules/style-editor/components/components-editor/demos/utils";
import { Section } from "@/modules/style-editor/components/components-editor/section";

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
      <Checkbox appearance="card" defaultSelected form="none">
        Hello world
      </Checkbox>
    </Section>
  );
}
