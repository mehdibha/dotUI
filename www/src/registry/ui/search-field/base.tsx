"use client";

import { SearchField as AriaSearchField, composeRenderProps } from "react-aria-components";
import type * as React from "react";

import { useStyles } from "./styles";

// MARK: searchFieldStyles

// MARK: SearchField

interface SearchFieldProps extends React.ComponentProps<typeof AriaSearchField> {}

const SearchField = ({ className, ...props }: SearchFieldProps) => {
	const searchFieldStyles = useStyles();
	return (
		<AriaSearchField
			data-slot="search-field"
			className={composeRenderProps(className, (className) => searchFieldStyles({ className }))}
			{...props}
		/>
	);
};

// MARK: exports

export { SearchField };

export type { SearchFieldProps };
