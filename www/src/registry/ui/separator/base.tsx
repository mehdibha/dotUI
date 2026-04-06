"use client";

import {
	Separator as AriaSeparator,
	SeparatorContext as AriaSeparatorContext,
	useSlottedContext,
} from "react-aria-components";
import type React from "react";

import { useStyles } from "./styles";

// MARK: separatorStyles

interface SeparatorProps extends React.ComponentProps<typeof AriaSeparator> {}

const Separator = ({ orientation, className, ...props }: SeparatorProps) => {
	const separatorStyles = useStyles();
	const ctx = useSlottedContext(AriaSeparatorContext);

	return (
		<AriaSeparator
			orientation={orientation}
			className={separatorStyles({
				orientation: orientation ?? ctx?.orientation,
				className,
			})}
			{...props}
		/>
	);
};

export type { SeparatorProps };
export { Separator };
