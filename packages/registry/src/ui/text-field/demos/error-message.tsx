"use client";

import { FieldError, Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import { TextField } from "@dotui/registry/ui/text-field";

export default function Demo() {
	return (
		<TextField defaultValue="support@copyui.dev" isInvalid>
			<Label>Email</Label>
			<Input />
			<FieldError>This email is already taken.</FieldError>
		</TextField>
	);
}
