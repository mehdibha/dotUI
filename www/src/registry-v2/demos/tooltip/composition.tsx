import { Button } from "@/components/dynamic-core/button";
import { TooltipRoot, TooltipContent } from "@/components/dynamic-core/tooltip";

export default function Demo() {
  return (
    <TooltipRoot>
      <Button>Hover</Button>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </TooltipRoot>
  );
}
