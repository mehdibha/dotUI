import { PenSquareIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { Kbd } from "@dotui/registry/ui/kbd";
import { TooltipContent, TooltipRoot } from "@dotui/registry/ui/tooltip";

export default function Demo() {
  return (
    <TooltipRoot>
      <Button shape="square" variant="quiet">
        <PenSquareIcon />
      </Button>
      <TooltipContent>
        <p className="flex items-center gap-2">
          Create new issue <Kbd>C</Kbd>
        </p>
      </TooltipContent>
    </TooltipRoot>
  );
}
