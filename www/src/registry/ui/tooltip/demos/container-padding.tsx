"use client";

import React from "react";

import { PenSquareIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Label } from "@/registry/ui/field";
import { Group } from "@/registry/ui/group";
import { Input } from "@/registry/ui/input";
import { NumberField } from "@/registry/ui/number-field";
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip";

export default function Demo() {
	const [containerPadding, setContainerPadding] = React.useState(12);
	return (
		<div className="flex flex-col items-center gap-10">
			<Tooltip>
				<Button size="icon">
					<PenSquareIcon />
				</Button>
				<TooltipContent containerPadding={containerPadding}>Create new issue</TooltipContent>
			</Tooltip>
			<NumberField value={containerPadding} onChange={setContainerPadding}>
				<Label>Container padding</Label>
				<Group className="max-w-[150px]">
					<Input />
					<Button slot="decrement" />
					<Button slot="increment" />
				</Group>
			</NumberField>
		</div>
	);
}
