"use client";

import * as ColorSwatchPickerPrimitives from "react-aria-components/ColorSwatchPicker";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import { tv } from "tailwind-variants";
import type React from "react";

import { ColorSwatch } from "@/registry/ui/color-swatch";

const colorSwatchPickerStyles = tv({
	slots: {
		root: "cn-color-swatch-picker flex flex-wrap",
		item: [
			"cn-color-swatch-picker-item relative rounded-(--color-swatch-picker-item-radius) transition-shadow focus:z-10 *:data-[slot=color-swatch]:size-full *:data-[slot=color-swatch]:rounded-[inherit]",
			// focus state
			"focus-reset focus-visible:focus-ring",
			// disabled state
			"disabled:cursor-not-allowed disabled:*:data-[slot=color-swatch]:[background:color-mix(in_oklab,var(--color-disabled)_90%,var(--color))]!",
			// selected state
			"before:absolute before:inset-0 before:scale-90 selected:before:scale-100 before:rounded-[inherit] before:bg-bg before:opacity-0 selected:before:opacity-100 before:outline-2 before:outline-inverse before:transition-[opacity,scale] before:duration-100 before:content-['']",
		],
	},
});

const { root, item } = colorSwatchPickerStyles();

interface ColorSwatchPickerProps extends React.ComponentProps<typeof ColorSwatchPickerPrimitives.ColorSwatchPicker> {}

const ColorSwatchPicker = ({ className, ...props }: ColorSwatchPickerProps) => {
	return (
		<ColorSwatchPickerPrimitives.ColorSwatchPicker
			className={composeRenderProps(className, (className) => root({ className }))}
			{...props}
		/>
	);
};

interface ColorSwatchPickerItemProps
	extends React.ComponentProps<typeof ColorSwatchPickerPrimitives.ColorSwatchPickerItem> {}
const ColorSwatchPickerItem = ({ className, style, ...props }: ColorSwatchPickerItemProps) => {
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

const CompoundColorSwatchPicker = Object.assign(ColorSwatchPicker, {
	Item: ColorSwatchPickerItem,
});

export type { ColorSwatchPickerItemProps, ColorSwatchPickerProps };
export { ColorSwatchPickerItem, CompoundColorSwatchPicker as ColorSwatchPicker };
