"use client";

import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as SearchFieldPrimitives from "react-aria-components/SearchField";
import type * as React from "react";

import { cn } from "@/registry/lib/utils";
import { useStyles } from "@/registry/ui/field/styles";

// MARK: searchFieldStyles

// MARK: Separator

interface SearchFieldProps extends React.ComponentProps<typeof SearchFieldPrimitives.SearchField> {}

const SearchField = ({ className, ...props }: SearchFieldProps) => {
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
		/>
	);
};

// MARK: Separator

export type { SearchFieldProps };
export { SearchField };
