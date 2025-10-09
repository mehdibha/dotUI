import { Edit2Icon } from "lucide-react";

import { Button } from "@dotui/registry-v2/ui/button";
import { Tooltip } from "@dotui/registry-v2/ui/tooltip";

export function TooltipDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-1tp">
        {(["top", "right", "bottom", "left"] as const).map((placement) => (
          <Tooltip key={placement} placement={placement} content="Edit name">
            <Button>{placement}</Button>
          </Tooltip>
        ))}
      </div>
      <Tooltip content="Edit name">
        <Button shape="square">
          <Edit2Icon />
        </Button>
      </Tooltip>
    </div>
  );
}
