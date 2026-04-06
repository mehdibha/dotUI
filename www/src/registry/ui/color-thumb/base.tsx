"use client";

import { ColorThumb as AriaColorThumb } from "react-aria-components";
import type { ColorThumbProps as AriaColorThumbProps } from "react-aria-components";

import { useStyles } from "./styles";

// MARK: colorThumbStyles

interface ColorThumbProps extends Omit<AriaColorThumbProps, "className"> {
	className?: string;
}
const ColorThumb = ({ className, ...props }: ColorThumbProps) => {
	const styles = useStyles();
	return <AriaColorThumb data-slot="color-thumb" className={styles({ className })} {...props} />;
};

export type { ColorThumbProps };
export { ColorThumb };
