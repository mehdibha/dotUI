"use client";

import React from "react";

import { PenSquareIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { Switch } from "@dotui/registry/ui/switch";
import { Tooltip, TooltipContent } from "@dotui/registry/ui/tooltip";

export default function Demo() {
  const [shouldFlip, setShouldFlip] = React.useState(false);
  return (
    <div className="flex flex-col items-center gap-10">
      <Tooltip>
        <Button>
          <PenSquareIcon />
        </Button>
        <TooltipContent shouldFlip={shouldFlip}>
          Create new issue
        </TooltipContent>
      </Tooltip>
      <Switch isSelected={shouldFlip} onChange={setShouldFlip}>
        Should flip
      </Switch>
    </div>
  );
}
