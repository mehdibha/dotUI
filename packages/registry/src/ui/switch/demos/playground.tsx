"use client";

import { Label } from "@dotui/registry/ui/field";
import { Switch, SwitchIndicator, SwitchThumb } from "@dotui/registry/ui/switch";

interface SwitchPlaygroundProps {
	label?: string;
	size?: "sm" | "md" | "lg";
	isDisabled?: boolean;
	isReadOnly?: boolean;
}

export function SwitchPlayground({ label = "Airplane mode", ...props }: SwitchPlaygroundProps) {
	return (
		<Switch {...props}>
			<SwitchIndicator>
				<SwitchThumb />
			</SwitchIndicator>
			<Label>{label}</Label>
		</Switch>
	);
}
