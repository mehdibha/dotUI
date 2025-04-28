import { PenSquareIcon } from "lucide-react";
import { Button } from "@/components/dynamic-ui/button";
import { Tooltip } from "@/components/dynamic-ui/tooltip";

export default function Demo() {
  return (
    <Tooltip content="Create new issue" showArrow>
      <Button shape="square">
        <PenSquareIcon />
      </Button>
    </Tooltip>
  );
}
