type ColorFormat = "hex" | "rgb" | "hsl" | "hsb";

/**
 * Missing description.
 */
export interface ColorEditorProps extends React.ComponentProps<"div"> {
	/**
	 * The initial color format to display.
	 * @default 'hex'
	 */
	colorFormat?: ColorFormat;

	/**
	 * Whether to show the alpha channel slider.
	 * @default false
	 */
	showAlphaChannel?: boolean;

	/**
	 * Whether to show the color format selector.
	 * @default true
	 */
	showFormatSelector?: boolean;
}
