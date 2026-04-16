"use client";

import * as ColorSwatchPickerPrimitives from "react-aria-components/ColorSwatchPicker";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import type React from "react";

import { ColorSwatch } from "@/registry/ui/color-swatch";

import { useStyles } from "./styles";

// MARK: colorSwatchPickerStyles

// MARK: seperator

interface ColorSwatchPickerProps extends React.ComponentProps<typeof ColorSwatchPickerPrimitives.ColorSwatchPicker> {}

const ColorSwatchPicker = ({ className, ...props }: ColorSwatchPickerProps) => {
	const { root } = useStyles()();
	return (
		<ColorSwatchPickerPrimitives.ColorSwatchPicker className={composeRenderProps(className, (className) => root({ className }))} {...props} />
	);
};

// MARK: seperator

interface ColorSwatchPickerItemProps extends React.ComponentProps<typeof ColorSwatchPickerPrimitives.ColorSwatchPickerItem> {}
const ColorSwatchPickerItem = ({ className, style, ...props }: ColorSwatchPickerItemProps) => {
	const { item } = useStyles()();
	return (
		<ColorSwatchPickerPrimitives.ColorSwatchPickerItem
			className={composeRenderProps(className, (className) => item({ className }))}
			style={composeRenderProps(
				style,
				(style, { color }) =>
					({
						"--color": color.toString(),
						...style,
					}) as React.CSSProperties,
			)}
			{...props}
		>
			<ColorSwatch className="size-full rounded-[inherit]" />
		</ColorSwatchPickerPrimitives.ColorSwatchPickerItem>
	);
};

// MARK: seperator

const CompoundColorSwatchPicker = Object.assign(ColorSwatchPicker, {
	Item: ColorSwatchPickerItem,
});

export type { ColorSwatchPickerItemProps, ColorSwatchPickerProps };
export { ColorSwatchPickerItem, CompoundColorSwatchPicker as ColorSwatchPicker };
