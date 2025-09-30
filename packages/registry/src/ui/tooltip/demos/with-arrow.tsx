import { PlusIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { Tooltip } from "@dotui/registry/ui/tooltip";

export default function TooltipDemo() {
  return (
    <Tooltip content="Add to library" showArrow>
      <Button shape="square">
        <PlusIcon />
      </Button>
    </Tooltip>
  );
}
