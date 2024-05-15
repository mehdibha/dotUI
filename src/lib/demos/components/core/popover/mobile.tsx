import { InfoIcon } from "lucide-react";
import { Button } from "@/lib/components/core/default/button";
import { PopoverRoot, Popover } from "@/lib/components/core/default/popover";

export default function PopoverDemo() {
  return (
    <PopoverRoot>
      <Button variant="ghost" shape="square">
        <InfoIcon />
      </Button>
      <Popover title="Salemou 3alaykom">
        <div>some content here</div>
      </Popover>
    </PopoverRoot>
  );
}
