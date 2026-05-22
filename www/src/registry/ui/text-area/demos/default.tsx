"use client";

import { Label } from "@/registry/ui/field";
import { TextArea } from "@/registry/ui/input";
import { TextField } from "@/registry/ui/text-field";

export default function Demo() {
	return (
		<TextField>
			<Label>Description</Label>
			<TextArea />
		</TextField>
	);
}
