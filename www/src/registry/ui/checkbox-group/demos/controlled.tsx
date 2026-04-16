"use client";

import React from "react";

import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox";
import { CheckboxGroup } from "@/registry/ui/checkbox-group";
import { FieldGroup, Label } from "@/registry/ui/field";

export default function Demo() {
	const [frameworks, setFrameworks] = React.useState(["nextjs"]);
	return (
		<div className="flex flex-col items-center gap-4">
			<CheckboxGroup value={frameworks} onChange={setFrameworks}>
				<Label>React frameworks</Label>
				<FieldGroup>
					<Checkbox value="nextjs">
						<CheckboxControl />
						<Label>Next.js</Label>
					</Checkbox>
					<Checkbox value="remix">
						<CheckboxControl />
						<Label>Remix</Label>
					</Checkbox>
					<Checkbox value="gatsby">
						<CheckboxControl />
						<Label>Gatsby</Label>
					</Checkbox>
				</FieldGroup>
			</CheckboxGroup>
			<p className="text-fg-muted text-xs">
				{frameworks.length === 0
					? "You haven't selected any frameworks."
					: `You selected ${frameworks.join(", ")}.`}
			</p>
		</div>
	);
}
