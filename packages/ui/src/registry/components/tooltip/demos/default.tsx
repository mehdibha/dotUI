import { Button } from "@dotui/ui/components/button";
import { Kbd } from "@dotui/ui/components/kbd";
import { Tooltip } from "@dotui/ui/components/tooltip";
import { SquarePenIcon } from "@dotui/ui/icons";

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
