"use client";

import React from "react";

import { FieldGroup, Label } from "@/registry/ui/field";
import { Radio, RadioControl, RadioGroup } from "@/registry/ui/radio-group";

export default function Demo() {
	const [size, setSize] = React.useState("sm");
	return (
		<div className="flex flex-col items-center gap-4">
			<RadioGroup value={size} onChange={(value) => setSize(value)}>
				<Label>Size</Label>
				<FieldGroup>
					<Radio value="sm">
						<RadioControl />
						<Label>Small</Label>
					</Radio>
					<Radio value="md">
						<RadioControl />
						<Label>Medium</Label>
					</Radio>
					<Radio value="lg">
						<RadioControl />
						<Label>Large</Label>
					</Radio>
				</FieldGroup>
			</RadioGroup>
			<p className="text-fg-muted text-xs">{`You selected: ${size}`}</p>
		</div>
	);
}
