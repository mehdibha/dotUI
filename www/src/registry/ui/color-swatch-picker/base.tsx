"use client";

import {
	ColorSwatchPicker as AriaColorSwatchPicker,
	ColorSwatchPickerItem as AriaColorSwatchPickerItem,
	composeRenderProps,
} from "react-aria-components";
import type React from "react";

import { ColorSwatch } from "@/registry/ui/color-swatch";

import { useStyles } from "./styles";

// MARK: colorSwatchPickerStyles

// MARK: seperator

interface ColorSwatchPickerProps extends React.ComponentProps<typeof AriaColorSwatchPicker> {}

const ColorSwatchPicker = ({ className, ...props }: ColorSwatchPickerProps) => {
	const { root } = useStyles()();
	return (
		<AriaColorSwatchPicker className={composeRenderProps(className, (className) => root({ className }))} {...props} />
	);
};

// MARK: seperator

interface ColorSwatchPickerItemProps extends React.ComponentProps<typeof AriaColorSwatchPickerItem> {}
const ColorSwatchPickerItem = ({ className, style, ...props }: ColorSwatchPickerItemProps) => {
	const { item } = useStyles()();
	return (
		<AriaColorSwatchPickerItem
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
		</AriaColorSwatchPickerItem>
	);
};

// MARK: seperator

const CompoundColorSwatchPicker = Object.assign(ColorSwatchPicker, {
	Item: ColorSwatchPickerItem,
});

export type { ColorSwatchPickerProps, ColorSwatchPickerItemProps };
export { CompoundColorSwatchPicker as ColorSwatchPicker, ColorSwatchPickerItem };
