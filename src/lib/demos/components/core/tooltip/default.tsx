import { PlusIcon } from "lucide-react";
import { Button } from "@/lib/components/core/default/button";
import { Tooltip } from "@/lib/components/core/default/tooltip";

export default function TooltipDemo() {
  return (
    <Tooltip content="Add to library">
      <Button shape="square">
        <PlusIcon />
      </Button>
    </Tooltip>
  );
}
