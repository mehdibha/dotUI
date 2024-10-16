"use client";

import React from "react";
import { Button } from "@/registry/ui/default/core/button";
import { NumberField } from "@/registry/ui/default/core/number-field";
import { Tooltip } from "@/registry/ui/default/core/tooltip";
import { PlusIcon } from "@/__icons__";

export default function Demo() {
  const [delay, setDelay] = React.useState(700);
  const [closeDelay, setCloseDelay] = React.useState(0);
  return (
    <div className="flex flex-col items-center gap-10">
      <Tooltip delay={delay} closeDelay={closeDelay} content="Add to library">
        <Button shape="square">
          <PlusIcon />
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
