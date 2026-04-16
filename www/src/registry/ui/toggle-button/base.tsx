"use client";

import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as ToggleButtonPrimitives from "react-aria-components/ToggleButton";
import type * as React from "react";
import type { VariantProps } from "tailwind-variants";

import { createVariantsContext } from "@/registry/lib/context";

import { toggleButtonStyles, useStyles } from "./styles";
import type { ToggleButtonStyles } from "./styles";

// MARK: toggleButtonStyles

type ToggleButtonVariants = VariantProps<ToggleButtonStyles>;

// MARK: seperator

const [ToggleButtonProvider, useContextProps] = createVariantsContext<
	ToggleButtonVariants,
	React.ComponentProps<typeof ToggleButtonPrimitives.ToggleButton>
>(ToggleButtonPrimitives.ToggleButtonContext);

// MARK: seperator

interface ToggleButtonProps extends React.ComponentProps<typeof ToggleButtonPrimitives.ToggleButton>, ToggleButtonVariants {}

const ToggleButton = (localProps: ToggleButtonProps) => {
	const styles = useStyles();
	const {
		variant = "default",
		size = "md",
		className,
		children,
		...props
	} = useContextProps(localProps);

	return (
		<ToggleButtonPrimitives.ToggleButton
			data-slot="button"
			data-variant={variant}
			data-size={size}
			className={composeRenderProps(className, (cn) =>
				styles({
					variant,
					size,
					className: cn,
				}),
			)}
			{...props}
		>
			{composeRenderProps(children, (children) => (
				<>{typeof children === "string" ? <span className="truncate">{children}</span> : children}</>
			))}
		</ToggleButtonPrimitives.ToggleButton>
	);
};

// MARK: seperator

export type { ToggleButtonProps };
export { ToggleButton, ToggleButtonProvider, toggleButtonStyles };
