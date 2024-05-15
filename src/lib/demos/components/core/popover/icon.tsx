import { InfoIcon } from "lucide-react";
import { Button } from "@/lib/components/core/default/button";
import { PopoverRoot, PopoverContent } from "@/lib/components/core/default/popover";

export default function PopoverDemo() {
  return (
    <PopoverRoot>
      <Button variant="ghost" shape="square">
        <InfoIcon />
      </Button>
      <PopoverContent className="w-80">
        <p>title</p>
      </PopoverContent>
    </PopoverRoot>
  );
}
