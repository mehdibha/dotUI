import { PlusIcon } from "@/lib/icons";
import { Button } from "@/registry/ui/default/core/button";
import { Tooltip } from "@/registry/ui/default/core/tooltip";

export default function TooltipDemo() {
  return (
    <Tooltip content="Add to library" arrow>
      <Button shape="square">
        <PlusIcon />
      </Button>
    </Tooltip>
  );
}
