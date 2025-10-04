import { Button } from "@dotui/registry/ui/button";
import { Tooltip } from "@dotui/registry/ui/tooltip";

import { getComponentVariants } from "@/modules/style-editor/components/components-editor/demos/utils";
import { Section } from "@/modules/style-editor/components/components-editor/section";

export function Tooltips() {
  return (
    <Section
      name="tooltip"
      title="Tooltip"
      variants={getComponentVariants("tooltip")}
      previewClassName="gap-4"
    >
      <Tooltip content="This is a tooltip">
        <Button>Hover me</Button>
      </Tooltip>
    </Section>
  );
}
