"use client";

import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as DropZonePrimitives from "react-aria-components/DropZone";
import * as TextPrimitives from "react-aria-components/Text";
import type * as React from "react";

import { useStyles } from "./styles";

// MARK: dropZoneStyles

// MARK: Separator

interface DropZoneProps extends React.ComponentProps<typeof DropZonePrimitives.DropZone> {}
const DropZone = ({ className, ...props }: DropZoneProps) => {
	const { dropzone } = useStyles()();
	return (
		<DropZonePrimitives.DropZone
			className={composeRenderProps(className, (className) => dropzone({ className }))}
			{...props}
		/>
	);
};

// MARK: Separator

interface DropZoneLabelProps extends Omit<React.ComponentProps<typeof TextPrimitives.Text>, "slot"> {}
const DropZoneLabel = ({ className, ...props }: DropZoneLabelProps) => {
	const { label } = useStyles()();
	return <TextPrimitives.Text slot="label" className={label({ className })} {...props} />;
};

// MARK: Separator

export type { DropZoneLabelProps, DropZoneProps };
export { DropZone, DropZoneLabel };
