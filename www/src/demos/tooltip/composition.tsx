import { Button } from "@/registry/ui/default/core/button";
import {
  TooltipRoot,
  TooltipContent,
} from "@/registry/ui/default/core/tooltip";

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
