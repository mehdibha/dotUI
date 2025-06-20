"use client";

import React from "react";
import { PenSquareIcon } from "lucide-react";

import { Button } from "@dotui/ui/components/button";
import { NumberField } from "@dotui/ui/components/number-field";
import { Tooltip } from "@dotui/ui/components/tooltip";

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
