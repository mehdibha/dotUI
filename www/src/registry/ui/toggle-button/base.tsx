"use client";

import {
	ToggleButton as AriaToggleButton,
	ToggleButtonContext as AriaToggleButtonContext,
	composeRenderProps,
} from "react-aria-components";
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
	React.ComponentProps<typeof AriaToggleButton>
>(AriaToggleButtonContext);

// MARK: seperator

interface ToggleButtonProps extends React.ComponentProps<typeof AriaToggleButton>, ToggleButtonVariants {}

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
		<AriaToggleButton
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
		</AriaToggleButton>
	);
};

// MARK: seperator

export type { ToggleButtonProps };
export { ToggleButton, ToggleButtonProvider, toggleButtonStyles };
