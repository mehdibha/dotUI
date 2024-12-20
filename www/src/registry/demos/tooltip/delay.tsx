"use client";

import React from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/dynamic-core/button";
import { NumberField } from "@/components/dynamic-core/number-field";
import { Tooltip } from "@/components/dynamic-core/tooltip";

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
