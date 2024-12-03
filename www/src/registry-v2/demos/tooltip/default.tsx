import { Button } from "@/components/dynamic-core/button";
import { Tooltip } from "@/components/dynamic-core/tooltip";
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
