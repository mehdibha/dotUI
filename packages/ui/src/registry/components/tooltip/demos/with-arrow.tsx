import { PlusIcon } from "lucide-react";

import { Button } from "@dotui/ui/components/button";
import { Tooltip } from "@dotui/ui/components/tooltip";

export default function TooltipDemo() {
  return (
    <Tooltip content="Add to library" showArrow>
      <Button shape="square">
        <PlusIcon />
      </Button>
    </Tooltip>
  );
}
