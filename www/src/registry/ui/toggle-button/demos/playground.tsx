"use client";

import { PinIcon } from "lucide-react";

import { ToggleButton } from "@/registry/ui/toggle-button";

export default function Demo({
	children = "Pin",
	variant = "default",
	size = "md",
	isIconOnly = false,
	isDisabled = false,
}: {
	children?: string;
	variant?: "default" | "primary" | "quiet";
	size?: "lg" | "md" | "sm" | "xs";
	isIconOnly?: boolean;
	isDisabled?: boolean;
} = {}) {
	return (
		<ToggleButton variant={variant} size={size} isIconOnly={isIconOnly} isDisabled={isDisabled} aria-label="Toggle pin">
			<PinIcon data-icon-start="" className="rotate-45" />
			{children}
		</ToggleButton>
	);
}
