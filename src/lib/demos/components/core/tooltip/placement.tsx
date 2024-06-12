"use client";

import React from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/lib/components/core/default/button";
import { Select, SelectItem } from "@/lib/components/core/default/select";
import { Tooltip, TooltipProps } from "@/lib/components/core/default/tooltip";

type Placement = TooltipProps["placement"];

export default function Demo() {
  const [placement, setPlacement] = React.useState<Placement>("top");
  return (
    <div className="flex items-center gap-10">
      <Tooltip placement={placement} content="Add to library">
        <Button shape="square">
          <PlusIcon />
        </Button>
      </Tooltip>
      <Select
        label="Placement"
        selectedKey={placement}
        onSelectionChange={(key) => setPlacement(key as Placement)}
      >
        {[
          "bottom",
          "bottom left",
          "bottom right",
          "bottom start",
          "bottom end",
          "top",
          "top left",
          "top right",
          "top start",
          "top end",
          "left",
          "left top",
          "left",
          "bottom",
          "start",
          "start top",
          "start bottom",
          "right",
          "right top",
          "right",
          "bottom",
          "end",
          "end top",
          "end bottom",
        ].map((pos, index) => (
          <SelectItem key={index}>{pos}</SelectItem>
        ))}
      </Select>
    </div>
  );
}
