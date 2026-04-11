"use client";

import { SquarePenIcon } from "lucide-react";

import { Button } from "@/registry/ui/button";
import { Kbd } from "@/registry/ui/kbd";
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip";

export function TooltipDemo() {
	return (
		<div className="flex h-20 w-40 items-end justify-center pb-2">
			<Tooltip>
				<Button size="icon">
					<SquarePenIcon />
				</Button>
				<TooltipContent>
					Create new issue <Kbd>C</Kbd>
				</TooltipContent>
			</Tooltip>
		</div>
	);
}
