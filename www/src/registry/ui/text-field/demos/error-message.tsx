"use client";

import { FieldError, Label } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";
import { TextField } from "@/registry/ui/text-field";

export default function Demo() {
	return (
		<TextField defaultValue="hello@example.com" isInvalid>
			<Label>Email</Label>
			<Input />
			<FieldError>Enter a valid email address.</FieldError>
		</TextField>
	);
}
