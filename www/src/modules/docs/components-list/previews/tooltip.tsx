"use client";

import { SquarePenIcon } from "lucide-react";

import { Button } from "@/registry/ui/button";
import { Kbd } from "@/registry/ui/kbd";
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip";

import { LivePreview } from "./live-preview";

/** Interactive Tooltip preview — hover/focus the trigger to show it inside the card. */
export function TooltipPreview() {
	return (
		<LivePreview>
			<Tooltip>
				<Button aria-label="Edit" isIconOnly>
					<SquarePenIcon />
				</Button>
				<TooltipContent>
					Create new issue <Kbd>C</Kbd>
				</TooltipContent>
			</Tooltip>
		</LivePreview>
	);
}
