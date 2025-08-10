import { Button } from "@dotui/ui/components/button";
import { Tooltip } from "@dotui/ui/components/tooltip";
import { PlusIcon } from "@dotui/ui/icons";

export default function TooltipDemo() {
  return (
    <Tooltip content="Add to library" showArrow>
      <Button shape="square">
        <PlusIcon />
      </Button>
    </Tooltip>
  );
}
