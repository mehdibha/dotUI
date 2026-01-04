"use client";

import React from "react";

import { PenSquareIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { Label } from "@dotui/registry/ui/field";
import { Group } from "@dotui/registry/ui/group";
import { Input } from "@dotui/registry/ui/input";
import { NumberField } from "@dotui/registry/ui/number-field";
import { Tooltip, TooltipContent } from "@dotui/registry/ui/tooltip";

export default function Demo() {
	const [offset, setOffset] = React.useState(10);
	return (
		<div className="flex flex-col items-center gap-10">
			<Tooltip>
				<Button>
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
