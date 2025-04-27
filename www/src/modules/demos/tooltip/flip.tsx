"use client";

import React from "react";
import { PenSquareIcon } from "lucide-react";
import { Button } from "@/components/dynamic-ui/button";
import { Switch } from "@/components/dynamic-ui/switch";
import { Tooltip } from "@/components/dynamic-ui/tooltip";

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
