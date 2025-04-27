import { PlusIcon } from "lucide-react";
import { Button } from "@/components/dynamic-ui/button";
import { Tooltip } from "@/components/dynamic-ui/tooltip";

export default function TooltipDemo() {
  return (
    <Tooltip content="Add to library" showArrow>
      <Button shape="square">
        <PlusIcon />
      </Button>
    </Tooltip>
  );
}
