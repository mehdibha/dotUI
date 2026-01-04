"use client";

import { Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import { SearchField } from "@dotui/registry/ui/search-field";

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
