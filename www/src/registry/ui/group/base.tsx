"use client";

import {
	Group as AriaGroup,
	SeparatorContext as AriaSeparatorContext,
	TextContext as AriaTextContext,
	composeRenderProps,
	Provider,
} from "react-aria-components";
import type * as React from "react";
import type { VariantProps } from "tailwind-variants";

import { useStyles } from "./styles";
import type { GroupStyles } from "./styles";

// MARK: groupStyles

// MARK: seperator

interface GroupProps extends React.ComponentProps<typeof AriaGroup>, VariantProps<GroupStyles> {}

const Group = ({ orientation = "horizontal", className, ...props }: GroupProps) => {
	const { root, separator, text } = useStyles()();
	return (
		<Provider
			values={[
				[
					AriaSeparatorContext,
					{
						orientation: orientation === "horizontal" ? "vertical" : "horizontal",
						className: separator({ orientation }),
					},
				],
				[AriaTextContext, { className: text({ orientation }) }],
			]}
		>
			<AriaGroup
				data-slot="group"
				className={composeRenderProps(className, (className) => root({ className, orientation }))}
				{...props}
			/>
		</Provider>
	);
};

// MARK: seperator

export { Group };

export type { GroupProps };
