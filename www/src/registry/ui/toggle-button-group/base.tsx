"use client";

import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as ToggleButtonGroupPrimitives from "react-aria-components/ToggleButtonGroup";
import type { VariantProps } from "tailwind-variants";

import { ToggleButtonProvider } from "@/registry/ui/toggle-button";
import type { toggleButtonStyles } from "@/registry/ui/toggle-button";

import { useStyles } from "./styles";

// MARK: toggleGroupStyles

// MARK: Separator

interface ToggleButtonGroupProps
	extends React.ComponentProps<typeof ToggleButtonGroupPrimitives.ToggleButtonGroup>,
		VariantProps<typeof toggleButtonStyles> {}

const ToggleButtonGroup = ({
	variant,
	size,
	orientation = "horizontal",
	className,
	...props
}: ToggleButtonGroupProps) => {
	const { root, item } = useStyles()();
	return (
		<ToggleButtonProvider variant={variant} size={size} className={item({ orientation })}>
			<ToggleButtonGroupPrimitives.ToggleButtonGroup
				orientation={orientation}
				className={composeRenderProps(className, (className) =>
					root({
						orientation,
						className,
					}),
				)}
				{...props}
			/>
		</ToggleButtonProvider>
	);
};

export type { ToggleButtonGroupProps };
export { ToggleButtonGroup };
