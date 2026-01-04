"use client";

import React from "react";

import { FieldGroup, Label } from "@dotui/registry/ui/field";
import { Radio, RadioGroup, RadioIndicator } from "@dotui/registry/ui/radio-group";

export default function Demo() {
	const [size, setSize] = React.useState("sm");
	return (
		<div className="flex flex-col items-center gap-4">
			<RadioGroup value={size} onChange={(value) => setSize(value)}>
				<Label>Size</Label>
				<FieldGroup>
					<Radio value="sm">
						<RadioIndicator />
						<Label>Small</Label>
					</Radio>
					<Radio value="md">
						<RadioIndicator />
						<Label>Medium</Label>
					</Radio>
					<Radio value="lg">
						<RadioIndicator />
						<Label>Large</Label>
					</Radio>
				</FieldGroup>
			</RadioGroup>
			<p className="text-fg-muted text-xs">{`You selected: ${size}`}</p>
		</div>
	);
}
