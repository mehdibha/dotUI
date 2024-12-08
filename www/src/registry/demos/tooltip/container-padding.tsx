"use client";

import React from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/dynamic-core/button";
import { NumberField } from "@/components/dynamic-core/number-field";
import { Tooltip } from "@/components/dynamic-core/tooltip";

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
