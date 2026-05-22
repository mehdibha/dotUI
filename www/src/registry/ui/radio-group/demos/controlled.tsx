"use client";

import React from "react";

import { FieldGroup, Label } from "@/registry/ui/field";
import { Radio, RadioControl, RadioGroup } from "@/registry/ui/radio-group";

export default function Demo() {
	const [framework, setFramework] = React.useState("nextjs");
	return (
		<div className="flex flex-col items-center gap-4">
			<RadioGroup value={framework} onChange={setFramework}>
				<Label>React frameworks</Label>
				<FieldGroup>
					<Radio value="nextjs">
						<RadioControl />
						<Label>Next.js</Label>
					</Radio>
					<Radio value="remix">
						<RadioControl />
						<Label>Remix</Label>
					</Radio>
					<Radio value="gatsby">
						<RadioControl />
						<Label>Gatsby</Label>
					</Radio>
				</FieldGroup>
			</RadioGroup>
			<p className="text-xs text-fg-muted">{`You selected ${framework}.`}</p>
		</div>
	);
}
