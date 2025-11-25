import { PlusIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { Tooltip, TooltipContent } from "@dotui/registry/ui/tooltip";

export default function Demo() {
  return (
    <Tooltip>
      <Button>
        <PlusIcon />
      </Button>
      <TooltipContent hideArrow>Add to library</TooltipContent>
    </Tooltip>
  );
}
