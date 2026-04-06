"use client";

import {
	ToggleButton as AriaToggleButton,
	ToggleButtonContext as AriaToggleButtonContext,
	composeRenderProps,
} from "react-aria-components";
import type * as React from "react";
import type { VariantProps } from "tailwind-variants";

import { useButtonAspect } from "@/registry/hooks/use-button-aspect";
import { createVariantsContext } from "@/registry/lib/context";

import { useStyles } from "./styles";
import { toggleButtonStyles } from "./styles";
import type { ToggleButtonStyles } from "./styles";

// MARK: toggleButtonStyles

type ToggleButtonVariants = VariantProps<ToggleButtonStyles>;

// MARK: seperator

const [ToggleButtonProvider, useContextProps] = createVariantsContext<
	ToggleButtonVariants,
	React.ComponentProps<typeof AriaToggleButton>
>(AriaToggleButtonContext);

// MARK: seperator

interface ToggleButtonProps extends React.ComponentProps<typeof AriaToggleButton>, ToggleButtonVariants {
	aspect?: "default" | "square" | "auto";
}

const ToggleButton = (localProps: ToggleButtonProps) => {
	const styles = useStyles();
	const {
		variant = "default",
		size = "md",
		aspect = "auto",
		className,
		children,
		...props
	} = useContextProps(localProps);

	const isIconOnly = useButtonAspect(children, aspect);

	return (
		<AriaToggleButton
			data-slot="button"
			data-icon-only={isIconOnly || undefined}
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

export { ToggleButton, ToggleButtonProvider, toggleButtonStyles };

export type { ToggleButtonProps };
