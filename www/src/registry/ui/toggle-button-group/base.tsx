"use client";

import { ToggleButtonGroup as AriaToggleButtonGroup, composeRenderProps } from "react-aria-components";
import type { VariantProps } from "tailwind-variants";

import { ToggleButtonProvider } from "@/registry/ui/toggle-button";
import type { toggleButtonStyles } from "@/registry/ui/toggle-button";

import { useStyles } from "./styles";

// MARK: toggleGroupStyles

// MARK: seperator

interface ToggleButtonGroupProps
	extends React.ComponentProps<typeof AriaToggleButtonGroup>,
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
			<AriaToggleButtonGroup
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
