import { Button } from "@/lib/components/core/default/button";
import { Tooltip } from "@/lib/components/core/default/tooltip";

export default function TooltipDemo() {
  return (
    <Tooltip delayDuration={0} content="Add to library">
      <Button>
        Hover
      </Button>
    </Tooltip>
  );
}
