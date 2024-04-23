import { Button } from "@/lib/components/core/default/button";
import { Tooltip } from "@/lib/components/core/default/tooltip";

export default function TooltipDemo() {
  return (
    <Tooltip
      content={
        <>
          The <b>Evil Rabbit</b> Jumped over the <i>Fence</i>.
        </>
      }
    >
      <Button>Hover</Button>
    </Tooltip>
  );
}
