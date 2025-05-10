import { PenSquareIcon } from "lucide-react";
import { Button } from "@/components/dynamic-ui/button";
import { Kbd } from "@/components/dynamic-ui/kbd";
import { TooltipRoot, TooltipContent } from "@/components/dynamic-ui/tooltip";

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
