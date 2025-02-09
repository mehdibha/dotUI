import { PenSquareIcon } from "lucide-react";
import { Button } from "@/components/dynamic-core/button";
import { Kbd } from "@/components/dynamic-core/kbd";
import { TooltipRoot, TooltipContent } from "@/components/dynamic-core/tooltip";

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
