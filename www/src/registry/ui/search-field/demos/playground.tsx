"use client";

import { Label } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";
import { SearchField } from "@/registry/ui/search-field";

interface SearchFieldPlaygroundProps {
	label?: string;
	placeholder?: string;
	isDisabled?: boolean;
	isReadOnly?: boolean;
}

export function SearchFieldPlayground({
	label = "Search",
	placeholder = "Search...",
	...props
}: SearchFieldPlaygroundProps) {
	return (
		<SearchField {...props}>
			{label && <Label>{label}</Label>}
			<Input placeholder={placeholder} />
		</SearchField>
	);
}
