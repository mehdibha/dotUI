"use client";

import { composeRenderProps } from "react-aria-components/composeRenderProps";

import * as DrawerPrimitives from "./internal";
import { useStyles } from "./styles";

// MARK: drawerStyles

// MARK: Separator

interface DrawerProps extends DrawerPrimitives.DrawerProps {}

function Drawer({ className, style, overlayProps, placement = "bottom", ...props }: DrawerProps) {
	const { overlay, underlay } = useStyles()();
	return (
		<DrawerPrimitives.Drawer
			placement={placement}
			overlayProps={{
				...overlayProps,
				className: composeRenderProps(overlayProps?.className, (cn) => underlay({ className: cn })),
			}}
			className={composeRenderProps(className, (cn) => overlay({ placement, className: cn }))}
			style={composeRenderProps(style, (s) => ({
				"--drawer-margin": "--spacing(24)",
				...s,
			}))}
			{...props}
		/>
	);
}

// MARK: Separator

interface DrawerHandleProps extends DrawerPrimitives.DrawerHandleProps {}

function DrawerHandle({ className, ...props }: DrawerHandleProps) {
	const { handle } = useStyles()();
	return <DrawerPrimitives.DrawerHandle className={handle({ className })} {...props} />;
}

// MARK: Separator

interface DrawerSwipeAreaProps extends DrawerPrimitives.DrawerSwipeAreaProps {}

function DrawerSwipeArea({ className, ...props }: DrawerSwipeAreaProps) {
	return <DrawerPrimitives.DrawerSwipeArea className={className} {...props} />;
}

// MARK: Separator

interface DrawerProviderProps extends DrawerPrimitives.DrawerProviderProps {}

function DrawerProvider(props: DrawerProviderProps) {
	return <DrawerPrimitives.DrawerProvider {...props} />;
}

// MARK: Separator

interface DrawerIndentProps extends DrawerPrimitives.DrawerIndentProps {}

function DrawerIndent({ className, ...props }: DrawerIndentProps) {
	const { indent } = useStyles()();
	return <DrawerPrimitives.DrawerIndent className={indent({ className })} {...props} />;
}

// MARK: Separator

interface DrawerIndentBackgroundProps extends DrawerPrimitives.DrawerIndentBackgroundProps {}

function DrawerIndentBackground({ className, ...props }: DrawerIndentBackgroundProps) {
	const { indentBackground } = useStyles()();
	return (
		<DrawerPrimitives.DrawerIndentBackground className={indentBackground({ className })} {...props} />
	);
}

export type {
	DrawerHandleProps,
	DrawerIndentBackgroundProps,
	DrawerIndentProps,
	DrawerProps,
	DrawerProviderProps,
	DrawerSwipeAreaProps,
};
export {
	Drawer,
	DrawerHandle,
	DrawerIndent,
	DrawerIndentBackground,
	DrawerProvider,
	DrawerSwipeArea,
};
