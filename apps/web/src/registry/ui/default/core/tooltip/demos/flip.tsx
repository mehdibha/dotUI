"use client";

import React from "react";
import { PlusIcon } from "@/__icons__";
import { Button } from "@/registry/ui/default/core/button";
import { Switch } from "@/registry/ui/default/core/switch";
import { Tooltip } from "@/registry/ui/default/core/tooltip";

export default function Demo() {
  const [shouldFlip, setShouldFlip] = React.useState(false);
  return (
    <div className="flex flex-col items-center gap-10">
      <Tooltip shouldFlip={shouldFlip} content="Add to library">
        <Button shape="square">
          <PlusIcon />
        </Button>
      </Tooltip>
      <Switch
        isSelected={shouldFlip}
        onChange={(isSelected) => setShouldFlip(isSelected)}
      >
        Should flip
      </Switch>
    </div>
  );
}
