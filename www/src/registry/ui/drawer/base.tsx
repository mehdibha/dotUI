"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
import { ClearPressResponder } from "react-aria/private/interactions/PressResponder";
import { OverlayTriggerStateContext } from "react-aria-components/Dialog";
import { useOverlayTriggerState } from "react-stately";

import { useStyles } from "./styles";

// MARK: drawerStyles

// MARK: Separator

type DrawerPlacement = "top" | "bottom" | "left" | "right";

const swipeDirectionMap = {
	top: "up",
	bottom: "down",
	left: "left",
	right: "right",
} satisfies Record<DrawerPlacement, DrawerPrimitive.Root.Props["swipeDirection"]>;

const DrawerPlacementContext = React.createContext<DrawerPlacement>("bottom");

type DrawerPopupRenderProps = React.HTMLAttributes<HTMLDivElement> & {
	ref?: React.Ref<HTMLDivElement>;
};

function resolveClassName<TState>(
	className: string | ((state: TState) => string | undefined) | undefined,
	state: TState,
) {
	return typeof className === "function" ? className(state) : className;
}

function mergeClassNames<TState>(
	state: TState,
	...classNames: Array<string | ((state: TState) => string | undefined) | undefined>
) {
	return (
		classNames
			.map((className) => resolveClassName(className, state))
			.filter(Boolean)
			.join(" ") || undefined
	);
}

function stripPopupDialogProps(props: DrawerPopupRenderProps) {
	const {
		"aria-describedby": _ariaDescribedBy,
		"aria-labelledby": _ariaLabelledBy,
		role: _role,
		...presentationProps
	} = props;

	return presentationProps;
}

function getInitialFocusTarget(popupElement: HTMLDivElement | null) {
	return (
		popupElement?.querySelector<HTMLElement>(
			'[role="dialog"], [role="menu"], [role="listbox"], [role="tree"], [tabindex]',
		) ?? true
	);
}

interface DrawerProps
	extends Omit<
		DrawerPrimitive.Root.Props,
		"children" | "defaultOpen" | "disablePointerDismissal" | "onOpenChange" | "open" | "swipeDirection"
	> {
	placement?: DrawerPlacement;
	open?: boolean;
	isOpen?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	isDismissable?: boolean;
	isKeyboardDismissDisabled?: boolean;
	swipeToDismiss?: boolean;
	swipeFromHandleOnly?: boolean;
	swipeDirection?: DrawerPrimitive.Root.Props["swipeDirection"];
	swipeThreshold?: number;
	ignoreSelector?: string;
	onSwipeStart?: (event: PointerEvent) => void;
	onSwipeMove?: (info: { progress: number; movement: number }) => void;
	onSwipeEnd?: (info: { dismissed: boolean; velocity: number }) => void;
	overlayProps?: DrawerPrimitive.Backdrop.Props;
	portalProps?: DrawerPrimitive.Portal.Props;
	viewportProps?: DrawerPrimitive.Viewport.Props;
	popupProps?: DrawerPrimitive.Popup.Props;
	className?: DrawerPrimitive.Popup.Props["className"];
	style?: DrawerPrimitive.Popup.Props["style"];
	children?: React.ReactNode;
}

function Drawer({
	children,
	className,
	defaultOpen,
	isDismissable = true,
	isKeyboardDismissDisabled = false,
	isOpen,
	onOpenChange,
	open,
	overlayProps,
	placement = "bottom",
	popupProps,
	portalProps,
	ignoreSelector: _ignoreSelector,
	swipeDirection,
	swipeFromHandleOnly: _swipeFromHandleOnly,
	swipeThreshold: _swipeThreshold,
	swipeToDismiss = true,
	onSwipeEnd: _onSwipeEnd,
	onSwipeMove: _onSwipeMove,
	onSwipeStart: _onSwipeStart,
	style,
	viewportProps,
	...props
}: DrawerProps) {
	const { backdrop, popup, viewport } = useStyles()();
	const popupRender = popupProps?.render;
	const popupRef = React.useRef<HTMLDivElement>(null);
	const contextState = React.useContext(OverlayTriggerStateContext);
	const controlledOpen = isOpen ?? open;
	const localState = useOverlayTriggerState({
		isOpen: controlledOpen,
		defaultOpen,
		onOpenChange,
	});
	const state = controlledOpen !== undefined || defaultOpen !== undefined || !contextState ? localState : contextState;

	return (
		<DrawerPlacementContext.Provider value={placement}>
			<DrawerPrimitive.Root
				open={state.isOpen}
				disablePointerDismissal={!isDismissable}
				onOpenChange={(nextOpen, eventDetails) => {
					if (!nextOpen && isKeyboardDismissDisabled && eventDetails.reason === "escape-key") {
						eventDetails.cancel();
						return;
					}
					if (!nextOpen && !swipeToDismiss && eventDetails.reason === "swipe") {
						eventDetails.cancel();
						return;
					}
					if (nextOpen) state.open();
					else state.close();
				}}
				swipeDirection={swipeDirection ?? swipeDirectionMap[placement]}
				{...props}
			>
				<DrawerPrimitive.Portal {...portalProps}>
					<ClearPressResponder>
						<DrawerPrimitive.Backdrop
							{...overlayProps}
							className={(state) => backdrop({ className: resolveClassName(overlayProps?.className, state) })}
						/>
						<DrawerPrimitive.Viewport
							{...viewportProps}
							className={(state) =>
								viewport({ placement, className: resolveClassName(viewportProps?.className, state) })
							}
						>
							<DrawerPrimitive.Popup
								{...popupProps}
								data-base-ui-swipe-ignore={swipeToDismiss ? undefined : ""}
								initialFocus={popupProps?.initialFocus ?? (() => getInitialFocusTarget(popupRef.current))}
								className={(state) =>
									popup({
										placement,
										className: mergeClassNames(state, className, popupProps?.className),
									})
								}
								render={(renderProps, renderState) => {
									const presentationProps = stripPopupDialogProps(renderProps);

									if (typeof popupRender === "function") {
										return popupRender(presentationProps, renderState);
									}

									if (React.isValidElement(popupRender)) {
										return React.cloneElement(popupRender, presentationProps);
									}

									return <div {...presentationProps} />;
								}}
								ref={popupRef}
								style={{ ...style, ...popupProps?.style }}
							>
								{children}
							</DrawerPrimitive.Popup>
						</DrawerPrimitive.Viewport>
					</ClearPressResponder>
				</DrawerPrimitive.Portal>
			</DrawerPrimitive.Root>
		</DrawerPlacementContext.Provider>
	);
}

// MARK: Separator

interface DrawerHandleProps extends React.ComponentProps<"div"> {}

function DrawerHandle({ className, ...props }: DrawerHandleProps) {
	const { handle } = useStyles()();
	const placement = React.useContext(DrawerPlacementContext);
	const orientation = placement === "top" || placement === "bottom" ? "horizontal" : "vertical";

	return (
		<div
			role="presentation"
			aria-hidden="true"
			data-orientation={orientation}
			data-placement={placement}
			data-slot="drawer-handle"
			className={handle({ className })}
			{...props}
		/>
	);
}

// MARK: Separator

interface DrawerSwipeAreaProps extends DrawerPrimitive.SwipeArea.Props {}

function DrawerSwipeArea({ className, ...props }: DrawerSwipeAreaProps) {
	const { swipeArea } = useStyles()();
	const placement = React.useContext(DrawerPlacementContext);

	return (
		<DrawerPrimitive.SwipeArea
			className={(state) => swipeArea({ placement, className: resolveClassName(className, state) })}
			data-slot="drawer-swipe-area"
			{...props}
		/>
	);
}

// MARK: Separator

interface DrawerProviderProps extends DrawerPrimitive.Provider.Props {}

function DrawerProvider(props: DrawerProviderProps) {
	return <DrawerPrimitive.Provider {...props} />;
}

// MARK: Separator

interface DrawerIndentProps extends DrawerPrimitive.Indent.Props {}

function DrawerIndent({ className, ...props }: DrawerIndentProps) {
	const { indent } = useStyles()();
	return (
		<DrawerPrimitive.Indent
			className={(state) => indent({ className: resolveClassName(className, state) })}
			{...props}
		/>
	);
}

// MARK: Separator

interface DrawerIndentBackgroundProps extends DrawerPrimitive.IndentBackground.Props {}

function DrawerIndentBackground({ className, ...props }: DrawerIndentBackgroundProps) {
	const { indentBackground } = useStyles()();
	return (
		<DrawerPrimitive.IndentBackground
			className={(state) => indentBackground({ className: resolveClassName(className, state) })}
			{...props}
		/>
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
export { Drawer, DrawerHandle, DrawerIndent, DrawerIndentBackground, DrawerProvider, DrawerSwipeArea };
