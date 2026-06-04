"use client";

import { Label } from "@/registry/ui/field";
import { TextArea } from "@/registry/ui/input";
import { TextField } from "@/registry/ui/text-field";

export default function Demo() {
	return (
		<TextField isReadOnly defaultValue="This is a readonly comment">
			<Label>Email</Label>
			<TextArea />
		</TextField>
	);
}
