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
	const [containerPadding, setContainerPadding] = React.useState(12);
	return (
		<div className="flex flex-col items-center gap-10">
			<Tooltip>
				<Button>
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
