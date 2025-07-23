"use client";

import React from "react";

import { Button } from "@dotui/ui/components/button";
import { NumberField } from "@dotui/ui/components/number-field";
import { Tooltip } from "@dotui/ui/components/tooltip";
import { PenSquareIcon } from "@dotui/ui/icons";

export default function Demo() {
  const [delay, setDelay] = React.useState(700);
  const [closeDelay, setCloseDelay] = React.useState(0);
  return (
    <div className="flex items-center gap-12">
      <Tooltip delay={delay} closeDelay={closeDelay} content="Create new issue">
        <Button shape="square">
          <PenSquareIcon />
        </Button>
      </Tooltip>
      <div className="max-w-[150px] space-y-4">
        <NumberField
          label="Delay"
          value={delay}
          onChange={(value) => setDelay(value)}
        />
        <NumberField
          label="Close Delay"
          value={closeDelay}
          onChange={(value) => setCloseDelay(value)}
        />
      </div>
    </div>
  );
}
