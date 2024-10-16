"use client";

import React from "react";
import { Button } from "@/registry/ui/default/core/button";
import { NumberField } from "@/registry/ui/default/core/number-field";
import { Tooltip } from "@/registry/ui/default/core/tooltip";
import { PlusIcon } from "@/__icons__";

export default function Demo() {
  const [containerPadding, setContainerPadding] = React.useState(12);
  return (
    <div className="flex flex-col items-center gap-10">
      <Tooltip containerPadding={containerPadding} content="Add to library">
        <Button shape="square">
          <PlusIcon />
        </Button>
      </Tooltip>
      <NumberField
        label="Container padding"
        value={containerPadding}
        onChange={(value) => setContainerPadding(value)}
        className="max-w-[150px]"
      />
    </div>
  );
}
