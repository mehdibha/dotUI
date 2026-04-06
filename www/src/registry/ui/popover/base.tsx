"use client";

import { OverlayArrow as AriaOverlayArrow, Popover as AriaPopover, composeRenderProps } from "react-aria-components";
import type React from "react";

import { useStyles } from "./styles";

// MARK: popoverStyles

interface PopoverProps extends React.ComponentProps<typeof AriaPopover> {
	showArrow?: boolean;
}
function Popover({ className, showArrow = false, ...props }: PopoverProps) {
	const { popover } = useStyles()();
	return (
		<AriaPopover
			data-popover=""
			className={composeRenderProps(className, (className) => popover({ className }))}
			{...props}
		>
			{composeRenderProps(props.children, (children) => (
				<>
					{children}
					{showArrow && <PopoverArrow />}
				</>
			))}
		</AriaPopover>
	);
}

interface PopoverArrowProps extends React.ComponentProps<"svg"> {}
function PopoverArrow({ className, ...props }: PopoverArrowProps) {
	const { arrow } = useStyles()();
	return (
		<AriaOverlayArrow>
			<svg width={12} height={12} viewBox="0 0 8 8" className={arrow({ className })} {...props}>
				<path d="M0 0 L4 4 L8 0" />
			</svg>
		</AriaOverlayArrow>
	);
}

export type { PopoverProps };
export { Popover };
