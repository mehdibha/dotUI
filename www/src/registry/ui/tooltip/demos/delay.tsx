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
	const [delay, setDelay] = React.useState(700);
	const [closeDelay, setCloseDelay] = React.useState(0);
	return (
		<div className="flex items-center gap-12">
			<Tooltip delay={delay} closeDelay={closeDelay}>
				<Button size="icon">
					<PenSquareIcon />
				</Button>
				<TooltipContent>Create new issue</TooltipContent>
			</Tooltip>
			<div className="max-w-[150px] space-y-4">
				<NumberField value={delay} onChange={setDelay}>
					<Label>Delay</Label>
					<Group>
						<Input />
						<Button slot="decrement" />
						<Button slot="increment" />
					</Group>
				</NumberField>
				<NumberField value={closeDelay} onChange={setCloseDelay}>
					<Label>Close Delay</Label>
					<Group>
						<Input />
						<Button slot="decrement" />
						<Button slot="increment" />
					</Group>
				</NumberField>
			</div>
		</div>
	);
}
