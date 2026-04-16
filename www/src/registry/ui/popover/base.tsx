"use client";

import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as PopoverPrimitives from "react-aria-components/Popover";
import type React from "react";

import { useStyles } from "./styles";

// MARK: popoverStyles

interface PopoverProps extends React.ComponentProps<typeof PopoverPrimitives.Popover> {
	showArrow?: boolean;
}
function Popover({ className, showArrow = false, ...props }: PopoverProps) {
	const { popover } = useStyles()();
	return (
		<PopoverPrimitives.Popover
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
		</PopoverPrimitives.Popover>
	);
}

interface PopoverArrowProps extends React.ComponentProps<"svg"> {}
function PopoverArrow({ className, ...props }: PopoverArrowProps) {
	const { arrow } = useStyles()();
	return (
		<PopoverPrimitives.OverlayArrow>
			<svg width={12} height={12} viewBox="0 0 8 8" className={arrow({ className })} {...props}>
				<path d="M0 0 L4 4 L8 0" />
			</svg>
		</PopoverPrimitives.OverlayArrow>
	);
}

export type { PopoverProps };
export { Popover };
