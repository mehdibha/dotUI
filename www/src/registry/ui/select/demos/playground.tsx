"use client";

import { Label } from "@/registry/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/registry/ui/select";

interface SelectPlaygroundProps {
	label?: string;
	placeholder?: string;
	isDisabled?: boolean;
	isInvalid?: boolean;
}

export function SelectPlayground({
	label = "Country",
	placeholder = "Select a country",
	...props
}: SelectPlaygroundProps) {
	return (
		<Select placeholder={placeholder} {...props}>
			{label && <Label>{label}</Label>}
			<SelectTrigger />
			<SelectContent>
				<SelectItem id="us">United States</SelectItem>
				<SelectItem id="uk">United Kingdom</SelectItem>
				<SelectItem id="fr">France</SelectItem>
				<SelectItem id="de">Germany</SelectItem>
				<SelectItem id="jp">Japan</SelectItem>
			</SelectContent>
		</Select>
	);
}
