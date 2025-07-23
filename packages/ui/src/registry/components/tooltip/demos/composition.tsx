import { Button } from "@dotui/ui/components/button";
import { Kbd } from "@dotui/ui/components/kbd";
import { TooltipContent, TooltipRoot } from "@dotui/ui/components/tooltip";
import { PenSquareIcon } from "@dotui/ui/icons";

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
