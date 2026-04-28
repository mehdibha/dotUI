"use client";

import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as GroupPrimitives from "react-aria-components/Group";
import * as SeparatorPrimitives from "react-aria-components/Separator";
import { Provider } from "react-aria-components/slots";
import * as TextPrimitives from "react-aria-components/Text";
import type * as React from "react";
import type { VariantProps } from "tailwind-variants";

import { useStyles } from "./styles";
import type { GroupStyles } from "./styles";

// MARK: groupStyles

// MARK: Separator

interface GroupProps extends React.ComponentProps<typeof GroupPrimitives.Group>, VariantProps<GroupStyles> {}

const Group = ({ orientation = "horizontal", className, ...props }: GroupProps) => {
	const { root, separator, text } = useStyles()();
	return (
		<Provider
			values={[
				[
					SeparatorPrimitives.SeparatorContext,
					{
						orientation: orientation === "horizontal" ? "vertical" : "horizontal",
						className: separator({ orientation }),
					},
				],
				[TextPrimitives.TextContext, { className: text({ orientation }) }],
			]}
		>
			<GroupPrimitives.Group
				data-slot="group"
				className={composeRenderProps(className, (className) => root({ className, orientation }))}
				{...props}
			/>
		</Provider>
	);
};

// MARK: Separator

export type { GroupProps };
export { Group };
