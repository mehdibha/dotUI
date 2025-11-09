import { SquarePenIcon } from "lucide-react";

import { Button } from "@dotui/registry/ui/button";
import { Kbd } from "@dotui/registry/ui/kbd";
import { Tooltip, TooltipContent } from "@dotui/registry/ui/tooltip";

export default function Page() {
  return (
    <div className="flex items-end justify-center h-20 w-40 pb-2">
      <Tooltip isOpen>
        <Button>
          <SquarePenIcon />
        </Button>
        <TooltipContent>
          Create new issue <Kbd>C</Kbd>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
