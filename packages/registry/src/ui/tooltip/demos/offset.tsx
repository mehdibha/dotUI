"use client";

import React from "react";

import { PenSquareIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { NumberField } from "@dotui/registry/ui/number-field";
import { Tooltip } from "@dotui/registry/ui/tooltip";

export default function Demo() {
  const [offset, setOffset] = React.useState(10);
  return (
    <div className="flex flex-col items-center gap-10">
      <Tooltip offset={offset} content="Create new issue">
        <Button shape="square">
          <PenSquareIcon />
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
