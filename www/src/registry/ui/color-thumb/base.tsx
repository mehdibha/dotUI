"use client";

import * as ColorThumbPrimitives from "react-aria-components/ColorThumb";

import { useStyles } from "./styles";

// MARK: colorThumbStyles

interface ColorThumbProps extends Omit<ColorThumbPrimitives.ColorThumbProps, "className"> {
	className?: string;
}
const ColorThumb = ({ className, ...props }: ColorThumbProps) => {
	const styles = useStyles();
	return <ColorThumbPrimitives.ColorThumb data-slot="color-thumb" className={styles({ className })} {...props} />;
};

export type { ColorThumbProps };
export { ColorThumb };
