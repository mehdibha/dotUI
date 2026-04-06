"use client";

import {
	OverlayArrow as AriaOverlayArrow,
	Tooltip as AriaTooltip,
	TooltipTrigger as AriaTooltipTrigger,
	composeRenderProps,
} from "react-aria-components";
import type * as React from "react";
import type { VariantProps } from "tailwind-variants";

import { useStyles } from "./styles";
import type { TooltipStyles } from "./styles";

// MARK: tooltipStyles

// MARK: seperator
interface TooltipProps extends React.ComponentProps<typeof AriaTooltipTrigger> {}

const Tooltip = ({ delay = 700, closeDelay = 0, ...props }: TooltipProps) => (
	<AriaTooltipTrigger delay={delay} closeDelay={closeDelay} {...props} />
);

// MARK: seperator

interface TooltipContentProps extends React.ComponentProps<typeof AriaTooltip>, VariantProps<TooltipStyles> {
	hideArrow?: boolean;
}

function TooltipContent({ offset = 10, hideArrow = false, className, ...props }: TooltipContentProps) {
	const { content } = useStyles()();
	return (
		<AriaTooltip
			data-slot="tooltip"
			offset={offset}
			className={composeRenderProps(className, (className) => content({ className }))}
			{...props}
		>
			{composeRenderProps(props.children, (children) => (
				<>
					{children}
					{!hideArrow && <TooltipArrow />}
				</>
			))}
		</AriaTooltip>
	);
}

// MARK: seperator

interface TooltipArrowProps extends React.ComponentProps<"svg"> {}

function TooltipArrow({ className }: TooltipArrowProps) {
	const { arrow } = useStyles()();
	return (
		<AriaOverlayArrow className={arrow({ className })}>
			<svg data-slot="tooltip-arrow" width={8} height={8} viewBox="0 0 8 8">
				<path d="M0 0 L4 4 L8 0" />
			</svg>
		</AriaOverlayArrow>
	);
}

// MARK: seperator

export type { TooltipContentProps, TooltipProps };
export { Tooltip, TooltipContent };
