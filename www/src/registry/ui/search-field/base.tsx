"use client";

import { SearchIcon } from "lucide-react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as SearchFieldPrimitives from "react-aria-components/SearchField";
import type * as React from "react";

import { cn } from "@/registry/lib/utils";
import { useStyles } from "@/registry/ui/field/styles";
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input";

// MARK: searchFieldStyles

// MARK: Separator

interface SearchFieldProps extends React.ComponentProps<typeof SearchFieldPrimitives.SearchField> {
	placeholder?: string;
}

const SearchField = ({ className, placeholder, ...props }: SearchFieldProps) => {
	const fieldStyles = useStyles()();
	return (
		<SearchFieldPrimitives.SearchField
			data-search-field=""
			data-slot="search-field"
			className={composeRenderProps(className, (className) =>
				cn(
					fieldStyles.field({ className }),
					"group/search-field empty:**:data-input-group-addon:*:data-button:not-[[slot]]:hidden **:data-input:[&::-webkit-search-cancel-button]:appearance-none **:data-input:[&::-webkit-search-decoration]:appearance-none",
				),
			)}
			{...props}
		>
			{props?.children ?? (
				<InputGroup>
					<InputGroupAddon>
						<SearchIcon />
					</InputGroupAddon>
					<Input placeholder={placeholder} />
				</InputGroup>
			)}
		</SearchFieldPrimitives.SearchField>
	);
};

// MARK: Separator

export type { SearchFieldProps };
export { SearchField };
