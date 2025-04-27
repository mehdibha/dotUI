import React from "react";
import { Button } from "@/components/dynamic-ui/button";
import { Tooltip } from "@/components/dynamic-ui/tooltip";

export default function Demo() {
  return (
    <div className="flex items-center gap-4">
      <Tooltip placement="top" content="Create new issue">
        <Button>Top</Button>
      </Tooltip>
      <Tooltip placement="bottom" content="Create new issue">
        <Button>Bottom</Button>
      </Tooltip>
      <Tooltip placement="left" content="Create new issue">
        <Button>Left</Button>
      </Tooltip>
      <Tooltip placement="right" content="Create new issue">
        <Button>Right</Button>
      </Tooltip>
    </div>
  );
}
