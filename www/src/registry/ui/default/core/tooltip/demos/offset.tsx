"use client";

import React from "react";
import { Button } from "@/registry/ui/default/core/button";
import { NumberField } from "@/registry/ui/default/core/number-field";
import { Tooltip } from "@/registry/ui/default/core/tooltip";
import { PlusIcon } from "@/__icons__";

export default function Demo() {
  const [offset, setOffset] = React.useState(10);
  return (
    <div className="flex flex-col items-center gap-10">
      <Tooltip offset={offset} content="Add to library">
        <Button shape="square">
          <PlusIcon />
        </Button>
      </Tooltip>
      <NumberField
        label="Offset"
        value={offset}
        onChange={(value) => setOffset(value)}
        className="max-w-[150px]"
      />
    </div>
  );
}
