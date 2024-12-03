import { Button } from "@/registry/ui/default/core/button";
import { Tooltip } from "@/registry/ui/default/core/tooltip";
import { PlusIcon } from "@/__icons__";

export default function Demo() {
  return (
    <Tooltip content="Add to library">
      <Button shape="square">
        <PlusIcon />
      </Button>
    </Tooltip>
  );
}
