import { Button } from "@/components/dynamic-ui/button";
import { Tooltip } from "@/components/dynamic-ui/tooltip";
import { SquarePenIcon } from "lucide-react";

export default function Demo() {
  return (
    <Tooltip content="Create new issue" variant="inverse">
      <Button shape="square">
        <SquarePenIcon />
      </Button>
    </Tooltip>
  );
}
