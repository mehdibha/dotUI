"use client";

import { SquarePenIcon } from "lucide-react";

import { Button } from "@dotui/registry/ui/button";
import { Kbd } from "@dotui/registry/ui/kbd";
import { Tooltip, TooltipContent } from "@dotui/registry/ui/tooltip";

export default function Page() {
	return (
		<div className="flex h-20 w-40 items-end justify-center pb-2">
			<Tooltip defaultOpen>
				<Button>
					<SquarePenIcon />
				</Button>
				<TooltipContent>
					Create new issue <Kbd>C</Kbd>
				</TooltipContent>
			</Tooltip>
		</div>
	);
}
