"use client";

import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as SearchFieldPrimitives from "react-aria-components/SearchField";
import type * as React from "react";

import { useStyles } from "./styles";

// MARK: searchFieldStyles

// MARK: SearchField

interface SearchFieldProps extends React.ComponentProps<typeof SearchFieldPrimitives.SearchField> {}

const SearchField = ({ className, ...props }: SearchFieldProps) => {
	const searchFieldStyles = useStyles();
	return (
		<SearchFieldPrimitives.SearchField
			data-slot="search-field"
			className={composeRenderProps(className, (className) => searchFieldStyles({ className }))}
			{...props}
		/>
	);
};

// MARK: exports

export type { SearchFieldProps };
export { SearchField };
