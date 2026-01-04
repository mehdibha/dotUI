"use client";

import { PinIcon } from "lucide-react";
import type { ReactNode } from "react";

import { ToggleButton } from "@dotui/registry/ui/toggle-button";

interface ToggleButtonPlaygroundProps {
	variant?: "default" | "quiet";
	size?: "sm" | "md" | "lg";
	isDisabled?: boolean;
	children?: ReactNode;
}

export function ToggleButtonPlayground({
	variant = "default",
	size = "md",
	isDisabled = false,
}: ToggleButtonPlaygroundProps) {
	return (
		<ToggleButton aria-label="Toggle pin" variant={variant} size={size} isDisabled={isDisabled}>
			<PinIcon className="rotate-45" />
		</ToggleButton>
	);
}
