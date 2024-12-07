import { PlusIcon } from "lucide-react";
import { Button } from "@/components/dynamic-core/button";
import { Tooltip } from "@/components/dynamic-core/tooltip";

export default function Demo() {
  return (
    <Tooltip content="Add to library">
      <Button shape="square">
        <PlusIcon />
      </Button>
    </Tooltip>
  );
}
