"use client";

import type { ReactNode } from "react";

import { Alert, AlertDescription, AlertTitle, type AlertProps } from "@/registry/ui/alert";

export default function Demo({
	title = "Alert Title",
	description = "This is an alert description.",
	variant = "neutral",
	icon,
}: {
	title?: string;
	description?: string;
	variant?: AlertProps["variant"];
	icon?: ReactNode;
} = {}) {
	return (
		<Alert variant={variant}>
			{icon}
			{title && <AlertTitle>{title}</AlertTitle>}
			{description && <AlertDescription>{description}</AlertDescription>}
		</Alert>
	);
}
