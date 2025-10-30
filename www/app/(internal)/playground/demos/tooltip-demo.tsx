"use client";

import { Edit2Icon } from "lucide-react";

import { Avatar } from "@dotui/registry/ui/avatar";
import { Button } from "@dotui/registry/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@dotui/registry/ui/tooltip";

export function TooltipDemo() {
  return (
    <div className="flex flex-col items-center gap-10 py-10">
      <div className="flex items-center gap-2">
        <Tooltip>
          <Button>Hover me</Button>
          <TooltipContent>This is tooltip content</TooltipContent>
        </Tooltip>
        <Tooltip>
          <Button>Long content</Button>
          <TooltipContent>
            This is an extremely long tooltip content that should wrap to
            multiple lines. It should also wrap to multiple lines if it's too
            long.
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <Button>
            <Edit2Icon />
          </Button>
          <TooltipContent>Edit name</TooltipContent>
        </Tooltip>
        {/* Bad example */}
        <Tooltip>
          <TooltipTrigger>
            <Avatar
              src="https://github.com/mehdibha.png"
              alt="@mehdibha"
              fallback="M"
              size="sm"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>@mehdibha</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="grid gap-2 [grid-template-areas:'top-left_top_top-right'_'left-top_top_right-top'_'left_._right'_'left-bottom_._right-bottom'_'bottom-left_bottom_bottom-right']">
        {(
          [
            "top left",
            "top",
            "top right",
            "left",
            "left top",
            "left bottom",
            "right",
            "right top",
            "right bottom",
            "bottom left",
            "bottom",
            "bottom right",
          ] as const
        ).map((placement) => (
          <Tooltip key={placement}>
            <Button style={{ gridArea: placement.replace(" ", "-") }}>
              {placement}
            </Button>
            <TooltipContent placement={placement}>Edit name</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
