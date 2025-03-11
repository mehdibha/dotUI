import { SquarePenIcon } from "lucide-react";
import { Button } from "@/components/dynamic-core/button";
import { Tooltip } from "@/components/dynamic-core/tooltip";

export default function Demo() {
  return (
    <Tooltip content="Create new issue" variant="inverse">
      <Button shape="square">
        <SquarePenIcon />
      </Button>
    </Tooltip>
  );
}
