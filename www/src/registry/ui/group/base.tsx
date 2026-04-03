"use client";

import {
	Group as AriaGroup,
	SeparatorContext as AriaSeparatorContext,
	TextContext as AriaTextContext,
	composeRenderProps,
	Provider,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type * as React from "react";
import type { VariantProps } from "tailwind-variants";

const groupStyles = tv({
	slots: {
		root: [
			"flex w-fit items-stretch",
			"has-data-[slot=group]:gap-2",
			"*:hover:z-1 *:focus-visible:z-10 *:has-[input]:z-2 *:[input]:z-2",
			// "*:focus-visible:z-10 *:focus-within:z-10 *:focus:z-10! *:data-[slot=input]:z-2 *:hover:z-3 *:pressed:z-10 *:has-[input]:z-2 *:data-[slot=input]:not-data-focused:z-2",

			// "[&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit",
			// "[&>input]:flex-1",
			// "has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md",
			// "[&>[data-slot=select]>[data-slot=button]]:bg-blue-500",

			"*:data-[slot=label]:rounded-md *:data-[slot=label]:border *:data-[slot=label]:bg-card *:data-[slot=label]:px-4",
		],
		separator: "",
		text: "flex items-center gap-2 rounded-md border bg-card px-4 font-medium text-sm shadow-xs [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
	},
	variants: {
		orientation: {
			horizontal: {
				root: [
					"-space-x-px not-has-[>[data-slot=group]]:*:not-last:rounded-r-none not-has-[>[data-slot=group]]:*:not-first:rounded-l-none",
					"not-has-[>[data-slot=group]]:*:not-last:data-[slot=select]:*:data-[slot=button]:rounded-r-none not-has-[>[data-slot=group]]:*:not-[:nth-child(2)]:data-[slot=select]:*:data-[slot=button]:rounded-l-none",
				],
				separator: "",
			},
			vertical: {
				root: "flex-col not-has-[>[data-slot=group]]:*:not-first:rounded-t-none not-has-[>[data-slot=group]]:*:not-last:rounded-b-none",
				separator: "",
			},
		},
	},
});

const { root, separator, text } = groupStyles();

/* -----------------------------------------------------------------------------------------------*/

interface GroupProps extends React.ComponentProps<typeof AriaGroup>, VariantProps<typeof groupStyles> {}

const Group = ({ orientation = "horizontal", className, ...props }: GroupProps) => {
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

/* -----------------------------------------------------------------------------------------------*/

export { Group };

export type { GroupProps };
