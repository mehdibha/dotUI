import { Button } from "@/lib/components/core/default/button";
import { Tooltip } from "@/lib/components/core/default/tooltip";

export default function TooltipDemo() {
  return (
    <div className="flex gap-4">
      <Tooltip content="Add to library" type="success">
        <Button>Success</Button>
      </Tooltip>
      <Tooltip content="Add to library" type="danger">
        <Button>Danger</Button>
      </Tooltip>
      <Tooltip content="Add to library" type="warning">
        <Button>Warning</Button>
      </Tooltip>
      <Tooltip content="Add to library" type="info">
        <Button>Info</Button>
      </Tooltip>
    </div>
  );
}
