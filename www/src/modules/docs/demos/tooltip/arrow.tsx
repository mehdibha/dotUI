import { PenSquareIcon } from "lucide-react";

import { Button } from "@dotui/ui/components/button";
import { Tooltip } from "@dotui/ui/components/tooltip";

export default function Demo() {
  return (
    <Tooltip content="Create new issue" showArrow>
      <Button shape="square">
        <PenSquareIcon />
      </Button>
    </Tooltip>
  );
}
