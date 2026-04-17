"use client";

import { useContext } from "react";
import * as ColorPickerPrimitives from "react-aria-components/ColorPicker";
import { composeRenderProps } from "react-aria-components/composeRenderProps";

import { Button } from "@/registry/ui/button";
import { ColorSwatch } from "@/registry/ui/color-swatch";
import { Dialog, DialogContent } from "@/registry/ui/dialog";
import { Overlay } from "@/registry/ui/overlay";
import type { ButtonProps } from "@/registry/ui/button";
import type { DialogContentProps, DialogProps } from "@/registry/ui/dialog";

interface ColorPickerProps extends ColorPickerPrimitives.ColorPickerProps, Omit<DialogProps, "children"> {}

const ColorPicker = ({ defaultOpen, isOpen, onOpenChange, ...props }: ColorPickerProps) => {
	return (
		<ColorPickerPrimitives.ColorPicker {...props}>
			{composeRenderProps(props.children, (children) => (
				<Dialog defaultOpen={defaultOpen} isOpen={isOpen} onOpenChange={onOpenChange}>
					{children}
				</Dialog>
			))}
		</ColorPickerPrimitives.ColorPicker>
	);
};

/* -----------------------------------------------------------------------------------------------*/

interface ColorPickerTriggerProps extends Omit<ButtonProps, "children"> {
	children?: React.ReactNode | ((props: ColorPickerPrimitives.ColorPickerState) => React.ReactNode);
}

const ColorPickerTrigger = ({ children, ...props }: ColorPickerTriggerProps) => {
	const state = useContext(ColorPickerPrimitives.ColorPickerStateContext)!;
	return (
		<Button {...props}>
			{children ? (
				typeof children === "function" ? (
					children(state)
				) : (
					children
				)
			) : (
				<>
					<ColorSwatch />
					<span className="truncate">{state.color.toString("hex")}</span>
				</>
			)}
		</Button>
	);
};

/* -----------------------------------------------------------------------------------------------*/

interface ColorPickerContentProps extends DialogContentProps {}
const ColorPickerContent = ({ children, ...props }: ColorPickerContentProps) => {
	return (
		<Overlay type="popover">
			<DialogContent {...props}>{children}</DialogContent>
		</Overlay>
	);
};

/* -----------------------------------------------------------------------------------------------*/

export type { ColorPickerContentProps, ColorPickerProps, ColorPickerTriggerProps };
export { ColorPicker, ColorPickerContent, ColorPickerTrigger };
