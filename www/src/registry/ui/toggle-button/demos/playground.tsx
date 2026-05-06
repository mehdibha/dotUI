"use client";

import { PinIcon } from "lucide-react";
import type { ReactNode } from "react";

import { ToggleButton } from "@/registry/ui/toggle-button";

interface ToggleButtonPlaygroundProps {
	children?: string;
	variant?: "default" | "primary" | "quiet";
	size?: "xs" | "sm" | "md" | "lg";
	isDisabled?: boolean;
	isIconOnly?: boolean;
	prefix?: ReactNode;
	suffix?: ReactNode;
}

export function ToggleButtonPlayground({
	children = "Pin",
	prefix = <PinIcon data-icon-start="" className="rotate-45" />,
	suffix,
	isIconOnly,
	...props
}: ToggleButtonPlaygroundProps) {
	return (
		<ToggleButton aria-label={isIconOnly ? "Toggle pin" : undefined} isIconOnly={isIconOnly} {...props}>
			{prefix}
			{!isIconOnly && children}
			{suffix}
		</ToggleButton>
	);
}
