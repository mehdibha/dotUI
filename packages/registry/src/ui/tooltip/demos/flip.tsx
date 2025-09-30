"use client";

import React from "react";

import { PenSquareIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { Switch } from "@dotui/registry/ui/switch";
import { Tooltip } from "@dotui/registry/ui/tooltip";

export default function Demo() {
  const [shouldFlip, setShouldFlip] = React.useState(false);
  return (
    <div className="flex flex-col items-center gap-10">
      <Tooltip shouldFlip={shouldFlip} content="Create new issue">
        <Button shape="square">
          <PenSquareIcon />
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
