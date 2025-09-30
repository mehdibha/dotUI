"use client";

import React from "react";

import { PenSquareIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { NumberField } from "@dotui/registry/ui/number-field";
import { Tooltip } from "@dotui/registry/ui/tooltip";

export default function Demo() {
  const [containerPadding, setContainerPadding] = React.useState(12);
  return (
    <div className="flex flex-col items-center gap-10">
      <Tooltip containerPadding={containerPadding} content="Create new issue">
        <Button shape="square">
          <PenSquareIcon />
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
