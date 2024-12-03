import { Button } from "@/components/dynamic-core/button";
import { Tooltip } from "@/components/dynamic-core/tooltip";
import { PlusIcon } from "@/__icons__";

export default function TooltipDemo() {
  return (
    <Tooltip content="Add to library" arrow>
      <Button shape="square">
        <PlusIcon />
      </Button>
    </Tooltip>
  );
}
