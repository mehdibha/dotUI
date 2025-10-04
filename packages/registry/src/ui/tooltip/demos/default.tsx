import { SquarePenIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { Kbd } from "@dotui/registry/ui/kbd";
import { Tooltip } from "@dotui/registry/ui/tooltip";

export default function Demo() {
  return (
    <Tooltip
      content={
        <span>
          Create new issue <Kbd>C</Kbd>
        </span>
      }
    >
      <Button shape="square">
        <SquarePenIcon />
      </Button>
    </Tooltip>
  );
}
