"use client";

import React from "react";

import { PenSquareIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Switch } from "@/registry/ui/switch";
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip";

export default function Demo() {
	const [shouldFlip, setShouldFlip] = React.useState(false);
	return (
		<div className="flex flex-col items-center gap-10">
			<Tooltip>
				<Button isIconOnly>
					<PenSquareIcon />
				</Button>
				<TooltipContent shouldFlip={shouldFlip}>Create new issue</TooltipContent>
			</Tooltip>
			<Switch isSelected={shouldFlip} onChange={setShouldFlip}>
				Should flip
			</Switch>
		</div>
	);
}
