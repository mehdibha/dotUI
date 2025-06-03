"use client";

import React from "react";
import { Button } from "@/components/dynamic-ui/button";
import { NumberField } from "@/components/dynamic-ui/number-field";
import { Tooltip } from "@/components/dynamic-ui/tooltip";
import { PenSquareIcon } from "lucide-react";

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
