import { TooltipArrow } from "@radix-ui/react-tooltip";
import { Button } from "@/lib/components/core/default/button";
import {
  TooltipRoot,
  TooltipContent,
  TooltipTrigger,
  TooltipPortal,
} from "@/lib/components/core/default/tooltip";

export default function TooltipDemo() {
  return (
    <TooltipRoot>
      <TooltipTrigger asChild>
        <Button>Hover</Button>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent>
          <p>Add to library</p>
          <TooltipArrow />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  );
}
