"use client";

import React from "react";

import { Button } from "@dotui/ui/components/button";
import { Switch } from "@dotui/ui/components/switch";
import { Tooltip } from "@dotui/ui/components/tooltip";
import { PenSquareIcon } from "@dotui/ui/icons";

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
