"use client";

import { Label } from "@/registry/ui/field";
import { Switch, SwitchControl } from "@/registry/ui/switch";

interface SwitchPlaygroundProps {
	label?: string;
	size?: "sm" | "md" | "lg";
	isDisabled?: boolean;
	isReadOnly?: boolean;
}

export function SwitchPlayground({ label = "Airplane mode", ...props }: SwitchPlaygroundProps) {
	return (
		<Switch {...props}>
			<SwitchControl />
			<Label>{label}</Label>
		</Switch>
	);
}
