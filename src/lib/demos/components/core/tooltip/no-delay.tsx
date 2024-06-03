import { Button } from "@/lib/components/core/default/button";
import { Tooltip } from "@/lib/components/core/default/tooltip";

export default function TooltipDemo() {
  return (
    <Tooltip content="Add to library" delay={0} closeDelay={0}>
      <Button>Hover</Button>
    </Tooltip>
  );
}
