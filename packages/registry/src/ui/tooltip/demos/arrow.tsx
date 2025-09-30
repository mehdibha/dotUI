import { PenSquareIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { Tooltip } from "@dotui/registry/ui/tooltip";

export default function Demo() {
  return (
    <Tooltip content="Create new issue" showArrow>
      <Button shape="square">
        <PenSquareIcon />
      </Button>
    </Tooltip>
  );
}
