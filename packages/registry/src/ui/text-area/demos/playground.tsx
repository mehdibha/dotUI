"use client";

import { Description, FieldError, Label } from "@dotui/registry/ui/field";
import { TextArea } from "@dotui/registry/ui/input";
import { TextField } from "@dotui/registry/ui/text-field";

interface TextAreaPlaygroundProps {
	label?: string;
	description?: string;
	errorMessage?: string;
	placeholder?: string;
	isDisabled?: boolean;
	isReadOnly?: boolean;
	isInvalid?: boolean;
}

export function TextAreaPlayground({
	label,
	description,
	errorMessage,
	placeholder = "Enter description...",
	...props
}: TextAreaPlaygroundProps) {
	return (
		<TextField {...props}>
			{label && <Label>{label}</Label>}
			<TextArea placeholder={placeholder} />
			{description && <Description>{description}</Description>}
			{errorMessage && <FieldError>{errorMessage}</FieldError>}
		</TextField>
	);
}
