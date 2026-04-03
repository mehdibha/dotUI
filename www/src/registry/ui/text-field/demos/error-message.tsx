"use client";

import { FieldError, Label } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";
import { TextField } from "@/registry/ui/text-field";

export default function Demo() {
	return (
		<TextField defaultValue="support@copyui.dev" isInvalid>
			<Label>Email</Label>
			<Input />
			<FieldError>This email is already taken.</FieldError>
		</TextField>
	);
}
