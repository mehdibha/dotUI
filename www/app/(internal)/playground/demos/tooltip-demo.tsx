"use client";

import { Edit2Icon } from "lucide-react";

import { Avatar } from "@dotui/registry-v2/ui/avatar";
import { Button } from "@dotui/registry-v2/ui/button";
import { Tooltip } from "@dotui/registry-v2/ui/tooltip";

export function TooltipDemo() {
  return (
    <div className="flex flex-col items-center gap-10 py-10">
      <div className="flex items-center gap-2">
        <Tooltip content="This is tooltip content">
          <Button>Hover me</Button>
        </Tooltip>
        <Tooltip content="This is an extremely long tooltip content that should wrap to multiple lines. It should also wrap to multiple lines if it's too long.">
          <Button>Long content</Button>
        </Tooltip>
        <Tooltip content="Edit name">
          <Button>
            <Edit2Icon />
          </Button>
        </Tooltip>
        <Tooltip.Root>
          <Tooltip.Trigger>
            <Avatar
              src="https://github.com/mehdibha.png"
              alt="@mehdibha"
              fallback="M"
              size="sm"
            />
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Tooltip.Arrow />
            <p>@mehdibha</p>
          </Tooltip.Content>
        </Tooltip.Root>
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
          <Tooltip key={placement} placement={placement} content="Edit name">
            <Button style={{ gridArea: placement.replace(" ", "-") }}>
              {placement}
            </Button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
