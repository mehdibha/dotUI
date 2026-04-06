"use client";

import { ColorSwatch as AriaColorSwatch, composeRenderProps } from "react-aria-components";

import { useStyles } from "./styles";

// MARK: colorSwatchStyles

interface ColorSwatchProps extends React.ComponentProps<typeof AriaColorSwatch> {}
const ColorSwatch = ({ className, style, ...props }: ColorSwatchProps) => {
	const styles = useStyles();
	return (
		<AriaColorSwatch
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
