import { PenSquareIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { Tooltip, TooltipContent } from "@dotui/registry/ui/tooltip";

export default function Demo() {
  return (
    <Tooltip>
      <Button>
        <PenSquareIcon />
      </Button>
      <TooltipContent hideArrow>Create new issue</TooltipContent>
    </Tooltip>
  );
}
