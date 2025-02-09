import { SquarePenIcon } from "lucide-react";
import { Button } from "@/components/dynamic-core/button";
import { Kbd } from "@/components/dynamic-core/kbd";
import { Tooltip } from "@/components/dynamic-core/tooltip";

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
