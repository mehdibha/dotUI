import { Button } from "@dotui/registry/ui/button";
import { Tooltip, TooltipContent } from "@dotui/registry/ui/tooltip";

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
      <Tooltip>
        <Button>Hover me</Button>
        <TooltipContent>This is a tooltip</TooltipContent>
      </Tooltip>
    </Section>
  );
}
