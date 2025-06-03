"use client";

import React from "react";
import { Button } from "@/components/dynamic-ui/button";
import { NumberField } from "@/components/dynamic-ui/number-field";
import { Tooltip } from "@/components/dynamic-ui/tooltip";
import { PenSquareIcon } from "lucide-react";

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
