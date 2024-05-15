import { Button } from "@/lib/components/core/default/button";
import { TooltipRoot, TooltipContent } from "@/lib/components/core/default/tooltip";

export default function TooltipDemo() {
  return (
    <TooltipRoot>
      <Button>Hover</Button>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </TooltipRoot>
  );
}
