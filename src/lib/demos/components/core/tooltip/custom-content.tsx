import { Button } from "@/lib/components/core/default/button";
import { Tooltip } from "@/lib/components/core/default/tooltip";
import { PlusIcon } from "@/lib/icons";

export default function Demo() {
  return (
    <Tooltip
      content={
        <p>
          Add to <b className="font-bold">library</b>
        </p>
      }
    >
      <Button shape="square">
        <PlusIcon />
      </Button>
    </Tooltip>
  );
}
