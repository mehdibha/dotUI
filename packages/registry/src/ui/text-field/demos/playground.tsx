"use client";

import type { ReactNode } from "react";

import { Description, FieldError, Label } from "@dotui/registry/ui/field";
import { Input, InputAddon, InputGroup } from "@dotui/registry/ui/input";
import { TextField } from "@dotui/registry/ui/text-field";

/**
 * TextField playground component.
 * Renders a TextField with optional Label, Description, FieldError, and icons.
 */

interface TextFieldPlaygroundProps {
	label?: string;
	description?: string;
	errorMessage?: string;
	isDisabled?: boolean;
	isReadOnly?: boolean;
	isInvalid?: boolean;
	startIcon?: ReactNode;
	endIcon?: ReactNode;
}

export function TextFieldPlayground({
	label,
	description,
	errorMessage,
	startIcon,
	endIcon,
	...props
}: TextFieldPlaygroundProps) {
	const hasIcons = startIcon || endIcon;

	return (
		<TextField {...props}>
			{label && <Label>{label}</Label>}
			{hasIcons ? (
				<InputGroup>
					{startIcon && <InputAddon>{startIcon}</InputAddon>}
					<Input />
					{endIcon && <InputAddon>{endIcon}</InputAddon>}
				</InputGroup>
			) : (
				<Input />
			)}
			{description && <Description>{description}</Description>}
			{errorMessage && <FieldError>{errorMessage}</FieldError>}
		</TextField>
	);
}
