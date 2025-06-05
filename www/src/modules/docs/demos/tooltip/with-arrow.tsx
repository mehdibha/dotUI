import { Button } from "@/components/dynamic-ui/button";
import { Tooltip } from "@/components/dynamic-ui/tooltip";
import { PlusIcon } from "lucide-react";

export default function TooltipDemo() {
  return (
    <Tooltip content="Add to library" showArrow>
      <Button shape="square">
        <PlusIcon />
      </Button>
    </Tooltip>
  );
}
