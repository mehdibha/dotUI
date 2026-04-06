"use client";

import { DropZone as AriaDropZone, Text as AriaText, composeRenderProps } from "react-aria-components";
import type * as React from "react";

import { useStyles } from "./styles";

// MARK: dropZoneStyles

// MARK: seperator

interface DropZoneProps extends React.ComponentProps<typeof AriaDropZone> {}
const DropZone = ({ className, ...props }: DropZoneProps) => {
	const { dropzone } = useStyles()();
	return <AriaDropZone className={composeRenderProps(className, (className) => dropzone({ className }))} {...props} />;
};

// MARK: seperator

interface DropZoneLabelProps extends Omit<React.ComponentProps<typeof AriaText>, "slot"> {}
const DropZoneLabel = ({ className, ...props }: DropZoneLabelProps) => {
	const { label } = useStyles()();
	return <AriaText slot="label" className={label({ className })} {...props} />;
};

// MARK: seperator

export type { DropZoneLabelProps, DropZoneProps };
export { DropZone, DropZoneLabel };
