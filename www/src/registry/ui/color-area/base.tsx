"use client";

import * as ColorAreaPrimitives from "react-aria-components/ColorArea";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import { tv } from "tailwind-variants";

import { ColorThumb } from "@/registry/ui/color-thumb";

const colorAreaStyles = tv({
	base: "cn-color-area block min-w-20 rounded-(--color-area-radius) disabled:[background:var(--color-disabled)]!",
});

type ColorAreaProps = React.ComponentProps<typeof ColorAreaPrimitives.ColorArea>;

const ColorArea = ({ className, ...props }: ColorAreaProps) => {
	return (
		<ColorAreaPrimitives.ColorArea
			className={composeRenderProps(className, (className) => colorAreaStyles({ className }))}
			{...props}
		>
			{props.children || <ColorThumb />}
		</ColorAreaPrimitives.ColorArea>
	);
};

export type { ColorAreaProps };
export { ColorArea };
