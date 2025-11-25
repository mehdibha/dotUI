"use client";

import { Button } from "@dotui/registry/ui/button";
import type { Control } from "@dotui/registry/playground";

import { Tooltip, TooltipContent } from "../index";

interface TooltipPlaygroundProps {
  content?: string;
  placement?: "top" | "bottom" | "left" | "right";
  hideArrow?: boolean;
}

export function TooltipPlayground({
  content = "Tooltip content",
  placement = "top",
  hideArrow = false,
}: TooltipPlaygroundProps) {
  return (
    <Tooltip>
      <Button>Hover me</Button>
      <TooltipContent placement={placement} hideArrow={hideArrow}>
        {content}
      </TooltipContent>
    </Tooltip>
  );
}

export const tooltipControls: Control[] = [
  {
    type: "string",
    name: "content",
    label: "Content",
    defaultValue: "Tooltip content",
  },
  {
    type: "enum",
    name: "placement",
    label: "Placement",
    options: ["top", "bottom", "left", "right"],
    defaultValue: "top",
  },
  {
    type: "boolean",
    name: "hideArrow",
    label: "Hide Arrow",
    defaultValue: false,
  },
];
