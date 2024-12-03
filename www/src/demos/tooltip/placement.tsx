import React from "react";
import { Button } from "@/components/dynamic-core/button";
import { Tooltip } from "@/components/dynamic-core/tooltip";
import { PlusIcon } from "@/__icons__";

export default function Demo() {
  return (
    <div className="flex items-center gap-4">
      <Tooltip placement="top" content="Add to library">
        <Button shape="square">
          <PlusIcon />
        </Button>
      </Tooltip>
      <Tooltip placement="bottom" content="Add to library">
        <Button shape="square">
          <PlusIcon />
        </Button>
      </Tooltip>
      <Tooltip placement="left" content="Add to library">
        <Button shape="square">
          <PlusIcon />
        </Button>
      </Tooltip>
      <Tooltip placement="right" content="Add to library">
        <Button shape="square">
          <PlusIcon />
        </Button>
      </Tooltip>
    </div>
  );
}
