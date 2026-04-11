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
	const [offset, setOffset] = React.useState(10);
	return (
		<div className="flex flex-col items-center gap-10">
			<Tooltip>
				<Button size="icon">
					<PenSquareIcon />
				</Button>
				<TooltipContent offset={offset}>Create new issue</TooltipContent>
			</Tooltip>
			<NumberField value={offset} onChange={setOffset}>
				<Label>Offset</Label>
				<Group>
					<Input />
					<Button slot="decrement" />
					<Button slot="increment" />
				</Group>
			</NumberField>
		</div>
	);
}
