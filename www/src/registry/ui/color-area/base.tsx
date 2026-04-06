"use client";

import { ColorArea as AriaColorArea, composeRenderProps } from "react-aria-components";

import { ColorThumb } from "@/registry/ui/color-thumb";

import { useStyles } from "./styles";

// MARK: colorAreaStyles

// MARK: seperator

type ColorAreaProps = React.ComponentProps<typeof AriaColorArea>;

const ColorArea = ({ className, ...props }: ColorAreaProps) => {
	const styles = useStyles();
	return (
		<AriaColorArea className={composeRenderProps(className, (className) => styles({ className }))} {...props}>
			{props.children || <ColorThumb />}
		</AriaColorArea>
	);
};

// MARK: seperator

export type { ColorAreaProps };
export { ColorArea };
