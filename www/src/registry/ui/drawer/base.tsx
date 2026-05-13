"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
import { DismissButton } from "react-aria/Overlay";
import { useIsHidden } from "react-aria/private/collections/Hidden";
import { ClearPressResponder } from "react-aria/private/interactions/PressResponder";
import { isScrollable } from "react-aria/private/utils/isScrollable";
import { useInteractOutside } from "react-aria/useInteractOutside";
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
const useIsomorphicLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;
const VISUAL_VIEWPORT_OFFSET_THRESHOLD = 8;
const VISUAL_VIEWPORT_REDUCTION_THRESHOLD = 120;
const NON_TEXT_INPUT_TYPES = new Set([
	"button",
	"checkbox",
	"color",
	"file",
	"hidden",
	"image",
	"radio",
	"range",
	"reset",
	"submit",
]);

type DrawerPopupRenderProps = React.HTMLAttributes<HTMLDivElement> & {
	ref?: React.Ref<HTMLDivElement>;
};

type DrawerViewportStyle = React.CSSProperties & {
	"--drawer-viewport-height"?: string;
	"--page-height"?: string;
	"--page-width"?: string;
	"--screen-bottom-offset"?: string;
	"--screen-height"?: string;
	"--screen-top-offset"?: string;
	"--visual-viewport-height"?: string;
	"--visual-viewport-page-left"?: string;
	"--visual-viewport-page-top"?: string;
	"--visual-viewport-width"?: string;
};

type VisualViewportSnapshot = {
	height: number;
	offsetLeft: number;
	offsetTop: number;
	pageLeft: number;
	pageTop: number;
	scale: number;
	width: number;
};

type LockedPageScroll = {
	left: number;
	top: number;
} | null;

function resolveClassName<TState>(
	className: string | ((state: TState) => string | undefined) | undefined,
	state: TState,
) {
	return typeof className === "function" ? className(state) : className;
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

function getPageSize() {
	if (typeof document === "undefined") {
		return {};
	}

	const scrollingElement = isScrollable(document.body)
		? document.body
		: document.scrollingElement || document.documentElement;
	const rect = scrollingElement.getBoundingClientRect();
	const fractionalWidthDifference = rect.width % 1;
	const fractionalHeightDifference = rect.height % 1;

	return {
		pageWidth: scrollingElement.scrollWidth - fractionalWidthDifference,
		pageHeight: scrollingElement.scrollHeight - fractionalHeightDifference,
	};
}

function getScreenHeight() {
	if (typeof window === "undefined") return 0;

	return window.screen?.height ?? window.innerHeight;
}

function canUseScreenViewportHeight() {
	if (typeof navigator === "undefined") return false;

	return (
		/iP(ad|hone|od)/.test(navigator.platform) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
	);
}

function measureViewportUnitHeight(unit: "lvh") {
	if (typeof document === "undefined") return 0;

	const probe = document.createElement("div");

	probe.style.cssText = [
		"position:fixed",
		"top:0",
		"left:0",
		"width:0",
		`height:100${unit}`,
		"visibility:hidden",
		"pointer-events:none",
	].join(";");

	document.documentElement.appendChild(probe);
	const height = probe.getBoundingClientRect().height;
	probe.remove();

	return height;
}

function useViewportUnitHeight(unit: "lvh") {
	const [height, setHeight] = React.useState(0);

	useIsomorphicLayoutEffect(() => {
		const updateHeight = () => {
			setHeight(measureViewportUnitHeight(unit));
		};

		updateHeight();

		window.addEventListener("resize", updateHeight);
		window.visualViewport?.addEventListener("resize", updateHeight);

		return () => {
			window.removeEventListener("resize", updateHeight);
			window.visualViewport?.removeEventListener("resize", updateHeight);
		};
	}, [unit]);

	return height;
}

function getVisualViewportSnapshot(): VisualViewportSnapshot {
	if (typeof window === "undefined") {
		return {
			height: 0,
			offsetLeft: 0,
			offsetTop: 0,
			pageLeft: 0,
			pageTop: 0,
			scale: 1,
			width: 0,
		};
	}

	const visualViewport = window.visualViewport;

	return {
		height: visualViewport?.height ?? document.documentElement.clientHeight,
		offsetLeft: visualViewport?.offsetLeft ?? 0,
		offsetTop: visualViewport?.offsetTop ?? 0,
		pageLeft: window.scrollX + (visualViewport?.offsetLeft ?? 0),
		pageTop: window.scrollY + (visualViewport?.offsetTop ?? 0),
		scale: visualViewport?.scale ?? 1,
		width: visualViewport?.width ?? document.documentElement.clientWidth,
	};
}

function areVisualViewportSnapshotsEqual(a: VisualViewportSnapshot, b: VisualViewportSnapshot) {
	return (
		a.height === b.height &&
		a.offsetLeft === b.offsetLeft &&
		a.offsetTop === b.offsetTop &&
		a.pageLeft === b.pageLeft &&
		a.pageTop === b.pageTop &&
		a.scale === b.scale &&
		a.width === b.width
	);
}

function useVisualViewportSnapshot() {
	const [snapshot, setSnapshot] = React.useState(getVisualViewportSnapshot);

	useIsomorphicLayoutEffect(() => {
		let animationFrame: number | undefined;
		let focusUpdateTimer: number | undefined;
		const updateSnapshot = () => {
			setSnapshot((currentSnapshot) => {
				const nextSnapshot = getVisualViewportSnapshot();

				return areVisualViewportSnapshotsEqual(currentSnapshot, nextSnapshot) ? currentSnapshot : nextSnapshot;
			});
		};
		const updateAfterFocusChange = () => {
			updateSnapshot();
			if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);
			if (focusUpdateTimer !== undefined) window.clearTimeout(focusUpdateTimer);
			animationFrame = requestAnimationFrame(updateSnapshot);
			focusUpdateTimer = window.setTimeout(updateSnapshot, 250);
		};

		updateSnapshot();

		window.addEventListener("focusin", updateAfterFocusChange);
		window.addEventListener("focusout", updateAfterFocusChange);
		window.addEventListener("scroll", updateSnapshot, { passive: true });
		window.addEventListener("resize", updateSnapshot);
		window.visualViewport?.addEventListener("scroll", updateSnapshot);
		window.visualViewport?.addEventListener("resize", updateSnapshot);

		return () => {
			if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);
			if (focusUpdateTimer !== undefined) window.clearTimeout(focusUpdateTimer);
			window.removeEventListener("focusin", updateAfterFocusChange);
			window.removeEventListener("focusout", updateAfterFocusChange);
			window.removeEventListener("scroll", updateSnapshot);
			window.removeEventListener("resize", updateSnapshot);
			window.visualViewport?.removeEventListener("scroll", updateSnapshot);
			window.visualViewport?.removeEventListener("resize", updateSnapshot);
		};
	}, []);

	return snapshot;
}

function useLockedPageScroll(isEnabled: boolean): LockedPageScroll {
	const [lockedPageScroll, setLockedPageScroll] = React.useState<LockedPageScroll>(null);

	useIsomorphicLayoutEffect(() => {
		if (!isEnabled || typeof window === "undefined" || !canUseScreenViewportHeight()) {
			setLockedPageScroll(null);
			return undefined;
		}

		const lockedScrollLeft = window.scrollX;
		const lockedScrollTop = window.scrollY;
		let animationFrame: number | undefined;

		setLockedPageScroll({
			left: lockedScrollLeft,
			top: lockedScrollTop,
		});

		const restoreScroll = () => {
			if (window.scrollX === lockedScrollLeft && window.scrollY === lockedScrollTop) {
				return;
			}

			window.scrollTo(lockedScrollLeft, lockedScrollTop);
		};

		const queueRestoreScroll = () => {
			restoreScroll();

			if (animationFrame !== undefined) {
				return;
			}

			animationFrame = requestAnimationFrame(() => {
				animationFrame = undefined;
				restoreScroll();
			});
		};

		// iOS Safari can scroll the layout viewport when focusing controls, even
		// while the drawer's modal scroll lock has overflow hidden on the page.
		const scrollListenerOptions = { capture: true, passive: true };
		const focusListenerOptions = { capture: true };
		window.addEventListener("scroll", queueRestoreScroll, scrollListenerOptions);
		window.addEventListener("focusin", queueRestoreScroll, focusListenerOptions);
		window.addEventListener("focusout", queueRestoreScroll, focusListenerOptions);

		return () => {
			if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);
			window.removeEventListener("scroll", queueRestoreScroll, scrollListenerOptions);
			window.removeEventListener("focusin", queueRestoreScroll, focusListenerOptions);
			window.removeEventListener("focusout", queueRestoreScroll, focusListenerOptions);
			restoreScroll();
		};
	}, [isEnabled]);

	return lockedPageScroll;
}

function useOverlayViewportStyle(lockedPageScroll: LockedPageScroll): DrawerViewportStyle {
	const viewport = useVisualViewportSnapshot();
	const largeViewportHeight = useViewportUnitHeight("lvh");
	const { pageHeight, pageWidth } = getPageSize();
	const canUseScreenHeight = canUseScreenViewportHeight();
	const screenHeight = canUseScreenHeight ? getScreenHeight() : viewport.height;
	const hasReducedViewportHeight =
		largeViewportHeight > 0 && largeViewportHeight - viewport.height > VISUAL_VIEWPORT_REDUCTION_THRESHOLD;
	const hasViewportPageOffset = viewport.offsetTop > VISUAL_VIEWPORT_OFFSET_THRESHOLD;
	const isVisualViewportReduced =
		canUseScreenHeight &&
		(hasReducedViewportHeight || hasViewportPageOffset || (pageWidth !== undefined && viewport.width < pageWidth - 1));
	const drawerViewportHeight = isVisualViewportReduced ? viewport.height : screenHeight;
	// Mobile Safari starts the document below top chrome, while screen.height includes it.
	// This correction lets the bottom drawer align with the physical screen bottom.
	const screenTopOffset =
		!isVisualViewportReduced && largeViewportHeight ? Math.max(0, (screenHeight - largeViewportHeight) / 2) : 0;
	const screenBottomOffset = isVisualViewportReduced
		? 0
		: Math.max(0, screenHeight - viewport.height - screenTopOffset);
	const viewportPageLeft = lockedPageScroll ? lockedPageScroll.left + viewport.offsetLeft : viewport.pageLeft;
	const viewportPageTop = lockedPageScroll ? lockedPageScroll.top + viewport.offsetTop : viewport.pageTop;

	return {
		"--drawer-viewport-height": `${drawerViewportHeight}px`,
		"--visual-viewport-width": `${viewport.width}px`,
		"--visual-viewport-height": `${viewport.height}px`,
		"--visual-viewport-page-left": `${viewportPageLeft}px`,
		"--visual-viewport-page-top": `${viewportPageTop}px`,
		"--page-width": pageWidth !== undefined ? `${pageWidth}px` : undefined,
		"--page-height": pageHeight !== undefined ? `${pageHeight}px` : undefined,
		"--screen-height": `${screenHeight}px`,
		"--screen-top-offset": `${screenTopOffset}px`,
		"--screen-bottom-offset": `${screenBottomOffset}px`,
	};
}

function getInitialFocusTarget(popupElement: HTMLDivElement | null) {
	return (
		popupElement?.querySelector<HTMLElement>(
			'[role="dialog"], [role="menu"], [role="listbox"], [role="tree"], [tabindex]',
		) ?? true
	);
}

function getTextControlFromEventTarget(target: EventTarget | null) {
	if (!(target instanceof Element)) return null;

	const control = target.closest("input, textarea");

	if (control instanceof HTMLTextAreaElement) return control;
	if (!(control instanceof HTMLInputElement)) return null;
	if (NON_TEXT_INPUT_TYPES.has(control.type)) return null;

	return control;
}

function focusTextControlWithoutPageScroll(event: React.PointerEvent<HTMLElement> | React.TouchEvent<HTMLElement>) {
	if (!canUseScreenViewportHeight() || event.defaultPrevented) return;
	if ("pointerType" in event && event.pointerType === "mouse") return;

	const control = getTextControlFromEventTarget(event.target);

	if (!control || !event.currentTarget.contains(control) || control.disabled || control === document.activeElement) {
		return;
	}

	event.preventDefault();
	control.focus({ preventScroll: true });
}

interface DrawerProps {
	placement?: DrawerPlacement;
	isOpen?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	isDismissable?: boolean;
	isKeyboardDismissDisabled?: boolean;
	swipeToDismiss?: boolean;
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
	placement = "bottom",
	swipeToDismiss = true,
	style,
}: DrawerProps) {
	const isHidden = useIsHidden();
	const { backdrop, overlay, popup, viewport } = useStyles()();
	const popupRef = React.useRef<HTMLDivElement>(null);
	const contextState = React.useContext(OverlayTriggerStateContext);
	const localState = useOverlayTriggerState({
		isOpen,
		defaultOpen,
		onOpenChange,
	});
	const state = isOpen !== undefined || defaultOpen !== undefined || !contextState ? localState : contextState;
	const lockedPageScroll = useLockedPageScroll(state.isOpen);
	const overlayStyle = useOverlayViewportStyle(lockedPageScroll);

	useInteractOutside({
		ref: popupRef,
		isDisabled: !state.isOpen || !isDismissable,
		onInteractOutside: () => state.close(),
	});

	if (isHidden) {
		return <>{children}</>;
	}

	return (
		<DrawerPlacementContext.Provider value={placement}>
			<DrawerPrimitive.Root
				open={state.isOpen}
				disablePointerDismissal
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
				swipeDirection={swipeDirectionMap[placement]}
			>
				<DrawerPrimitive.Portal>
					<ClearPressResponder>
						<div className={overlay()} style={overlayStyle}>
							<DrawerPrimitive.Backdrop className={backdrop()} />
							<DrawerPrimitive.Viewport className={viewport({ placement })}>
								<DrawerPrimitive.Popup
									data-base-ui-swipe-ignore={swipeToDismiss ? undefined : ""}
									initialFocus={() => getInitialFocusTarget(popupRef.current)}
									onPointerDownCapture={focusTextControlWithoutPageScroll}
									onTouchStartCapture={focusTextControlWithoutPageScroll}
									className={(state) =>
										popup({
											placement,
											className: resolveClassName(className, state),
										})
									}
									render={(renderProps) => {
										const presentationProps = stripPopupDialogProps(renderProps);

										return <div {...presentationProps} />;
									}}
									ref={popupRef}
									style={style}
								>
									<OverlayTriggerStateContext.Provider value={state}>
										{isDismissable && <DismissButton onDismiss={state.close} />}
										{children}
										{isDismissable && <DismissButton onDismiss={state.close} />}
									</OverlayTriggerStateContext.Provider>
								</DrawerPrimitive.Popup>
							</DrawerPrimitive.Viewport>
						</div>
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
