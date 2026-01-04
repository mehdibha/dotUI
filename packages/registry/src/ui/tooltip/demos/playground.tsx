"use client";

import { Button } from "@dotui/registry/ui/button";
import { Tooltip, TooltipContent } from "@dotui/registry/ui/tooltip";

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
