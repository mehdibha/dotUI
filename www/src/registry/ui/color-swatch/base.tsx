"use client";

import * as ColorSwatchPrimitives from "react-aria-components/ColorSwatch";
import { composeRenderProps } from "react-aria-components/composeRenderProps";

import { useStyles } from "./styles";

// MARK: colorSwatchStyles

interface ColorSwatchProps extends React.ComponentProps<typeof ColorSwatchPrimitives.ColorSwatch> {}
const ColorSwatch = ({ className, style, ...props }: ColorSwatchProps) => {
	const styles = useStyles();
	return (
		<ColorSwatchPrimitives.ColorSwatch
			data-slot="color-swatch"
			className={composeRenderProps(className, (className) => styles({ className }))}
			style={composeRenderProps(style, (style, { color }) => ({
				...style,
				background: `linear-gradient(${color}, ${color}),
        repeating-conic-gradient(#CCC 0% 25%, white 0% 50%) 50% / 16px 16px`,
			}))}
			{...props}
		/>
	);
};

export type { ColorSwatchProps };
export { ColorSwatch };
