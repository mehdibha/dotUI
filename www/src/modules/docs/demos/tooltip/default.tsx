import { Button } from "@/components/dynamic-ui/button";
import { Kbd } from "@/components/dynamic-ui/kbd";
import { Tooltip } from "@/components/dynamic-ui/tooltip";
import { SquarePenIcon } from "lucide-react";

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
