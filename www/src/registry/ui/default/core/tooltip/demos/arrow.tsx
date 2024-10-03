import { PlusIcon } from "@/__icons__";
import { Button } from "@/registry/ui/default/core/button";
import { Tooltip } from "@/registry/ui/default/core/tooltip";

export default function Demo() {
  return (
    <Tooltip content="Add to library" arrow>
      <Button shape="square">
        <PlusIcon />
      </Button>
    </Tooltip>
  );
}
