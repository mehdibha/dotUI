"use client";

import * as SeparatorPrimitives from "react-aria-components/Separator";
import { useSlottedContext } from "react-aria-components/slots";
import type React from "react";

import { useStyles } from "./styles";

// MARK: separatorStyles

interface SeparatorProps extends React.ComponentProps<typeof SeparatorPrimitives.Separator> {}

const Separator = ({ orientation, className, ...props }: SeparatorProps) => {
	const separatorStyles = useStyles();
	const ctx = useSlottedContext(SeparatorPrimitives.SeparatorContext);

	return (
		<SeparatorPrimitives.Separator
			data-separator=""
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
