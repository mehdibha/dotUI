"use client";

import * as React from "react";

import { useStyles } from "./styles";

// MARK: scrollFadeStyles

const SCROLL_TIMEOUT = 300;
const SCROLL_EDGE_TOLERANCE_PX = 1;
const OVERFLOW_EDGE_THRESHOLD = 0;

const overflowVars = [
	"--scroll-area-overflow-x-start",
	"--scroll-area-overflow-x-end",
	"--scroll-area-overflow-y-start",
	"--scroll-area-overflow-y-end",
] as const;

let overflowVarsRegistered = false;
let rtlScrollType: "negative" | "positive-ascending" | "positive-descending" | undefined;

interface ScrollFadeProps extends React.ComponentProps<"div"> {}

function ScrollFade({ ref, className, style, tabIndex, ...props }: ScrollFadeProps) {
	const { root } = useStyles()();
	const rootRef = React.useRef<HTMLDivElement | null>(null);
	const userScrollRef = React.useRef(false);
	const scrollEndTimeoutRef = React.useRef<number | null>(null);
	const scrollingTimeoutRef = React.useRef<number | null>(null);

	const setRootRef = React.useCallback(
		(node: HTMLDivElement | null) => {
			rootRef.current = node;
			setRef(ref, node);
		},
		[ref],
	);

	const computeOverflow = React.useCallback(() => {
		const element = rootRef.current;
		if (!element) return;

		const scrollableWidth = element.scrollWidth;
		const scrollableHeight = element.scrollHeight;
		const viewportWidth = element.clientWidth;
		const viewportHeight = element.clientHeight;
		const maxScrollLeft = Math.max(0, scrollableWidth - viewportWidth);
		const maxScrollTop = Math.max(0, scrollableHeight - viewportHeight);
		const hasOverflowX = maxScrollLeft > SCROLL_EDGE_TOLERANCE_PX;
		const hasOverflowY = maxScrollTop > SCROLL_EDGE_TOLERANCE_PX;

		const direction = getComputedStyle(element).direction;
		const scrollLeftFromStart = hasOverflowX
			? normalizeScrollOffset(getScrollLeftFromStart(element, direction, maxScrollLeft), maxScrollLeft)
			: 0;
		const scrollTopFromStart = hasOverflowY ? normalizeScrollOffset(element.scrollTop, maxScrollTop) : 0;
		const scrollLeftFromEnd = hasOverflowX ? maxScrollLeft - scrollLeftFromStart : 0;
		const scrollTopFromEnd = hasOverflowY ? maxScrollTop - scrollTopFromStart : 0;

		element.style.setProperty("--scroll-area-overflow-x-start", `${scrollLeftFromStart}px`);
		element.style.setProperty("--scroll-area-overflow-x-end", `${scrollLeftFromEnd}px`);
		element.style.setProperty("--scroll-area-overflow-y-start", `${scrollTopFromStart}px`);
		element.style.setProperty("--scroll-area-overflow-y-end", `${scrollTopFromEnd}px`);

		setBooleanAttribute(element, "data-has-overflow-x", hasOverflowX);
		setBooleanAttribute(element, "data-has-overflow-y", hasOverflowY);
		setBooleanAttribute(
			element,
			"data-overflow-x-start",
			hasOverflowX && scrollLeftFromStart > OVERFLOW_EDGE_THRESHOLD,
		);
		setBooleanAttribute(element, "data-overflow-x-end", hasOverflowX && scrollLeftFromEnd > OVERFLOW_EDGE_THRESHOLD);
		setBooleanAttribute(element, "data-overflow-y-start", hasOverflowY && scrollTopFromStart > OVERFLOW_EDGE_THRESHOLD);
		setBooleanAttribute(element, "data-overflow-y-end", hasOverflowY && scrollTopFromEnd > OVERFLOW_EDGE_THRESHOLD);

		if (tabIndex == null) {
			element.tabIndex = hasOverflowX || hasOverflowY ? 0 : -1;
		}
	}, [tabIndex]);

	React.useLayoutEffect(() => {
		registerOverflowProperties();
		computeOverflow();

		const element = rootRef.current;
		if (!element) return;

		function markUserScroll() {
			userScrollRef.current = true;
		}

		function handleScroll() {
			computeOverflow();

			if (userScrollRef.current) {
				element?.setAttribute("data-scrolling", "");
				clearWindowTimeout(scrollingTimeoutRef.current);
				scrollingTimeoutRef.current = window.setTimeout(() => {
					element?.removeAttribute("data-scrolling");
				}, SCROLL_TIMEOUT);
			}

			clearWindowTimeout(scrollEndTimeoutRef.current);
			scrollEndTimeoutRef.current = window.setTimeout(() => {
				userScrollRef.current = false;
			}, 100);
		}

		const animationFrame = requestAnimationFrame(computeOverflow);
		let resizeObserver: ResizeObserver | undefined;
		let mutationObserver: MutationObserver | undefined;

		element.addEventListener("scroll", handleScroll, { passive: true });
		element.addEventListener("wheel", markUserScroll, { passive: true });
		element.addEventListener("touchmove", markUserScroll, { passive: true });
		element.addEventListener("pointermove", markUserScroll, { passive: true });
		element.addEventListener("pointerenter", markUserScroll, { passive: true });
		element.addEventListener("keydown", markUserScroll);

		if (typeof ResizeObserver !== "undefined") {
			resizeObserver = new ResizeObserver(computeOverflow);
			resizeObserver.observe(element);
			for (const child of element.children) {
				resizeObserver.observe(child);
			}
		}

		if (typeof MutationObserver !== "undefined") {
			mutationObserver = new MutationObserver(() => {
				if (resizeObserver) {
					resizeObserver.disconnect();
					resizeObserver.observe(element);
					for (const child of element.children) {
						resizeObserver.observe(child);
					}
				}
				computeOverflow();
			});
			mutationObserver.observe(element, {
				childList: true,
				characterData: true,
				subtree: true,
			});
		}

		const animations = element.getAnimations?.({ subtree: true }) ?? [];
		if (animations.length > 0) {
			Promise.allSettled(animations.map((animation) => animation.finished))
				.then(computeOverflow)
				.catch(() => {});
		}

		return () => {
			cancelAnimationFrame(animationFrame);
			element.removeEventListener("scroll", handleScroll);
			element.removeEventListener("wheel", markUserScroll);
			element.removeEventListener("touchmove", markUserScroll);
			element.removeEventListener("pointermove", markUserScroll);
			element.removeEventListener("pointerenter", markUserScroll);
			element.removeEventListener("keydown", markUserScroll);
			resizeObserver?.disconnect();
			mutationObserver?.disconnect();
		};
	}, [computeOverflow]);

	React.useEffect(() => {
		return () => {
			clearWindowTimeout(scrollEndTimeoutRef.current);
			clearWindowTimeout(scrollingTimeoutRef.current);
		};
	}, []);

	return (
		<div
			ref={setRootRef}
			data-slot="scroll-fade"
			role="presentation"
			className={root({ className })}
			style={style}
			tabIndex={tabIndex}
			{...props}
		/>
	);
}

function setBooleanAttribute(element: HTMLElement, attribute: string, value: boolean) {
	if (value) {
		element.setAttribute(attribute, "");
	} else {
		element.removeAttribute(attribute);
	}
}

function setRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
	if (typeof ref === "function") {
		ref(value);
	} else if (ref) {
		ref.current = value;
	}
}

function clearWindowTimeout(timeoutId: number | null) {
	if (timeoutId != null) {
		window.clearTimeout(timeoutId);
	}
}

function clamp(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, value));
}

function normalizeScrollOffset(value: number, max: number) {
	if (max <= 0) {
		return 0;
	}

	const clamped = clamp(value, 0, max);
	const startDistance = clamped;
	const endDistance = max - clamped;
	const withinStartTolerance = startDistance <= SCROLL_EDGE_TOLERANCE_PX;
	const withinEndTolerance = endDistance <= SCROLL_EDGE_TOLERANCE_PX;

	if (withinStartTolerance && withinEndTolerance) {
		return startDistance <= endDistance ? 0 : max;
	}

	if (withinStartTolerance) {
		return 0;
	}

	if (withinEndTolerance) {
		return max;
	}

	return clamped;
}

function getScrollLeftFromStart(element: HTMLElement, direction: string, maxScrollLeft: number) {
	if (direction !== "rtl") {
		return element.scrollLeft;
	}

	switch (getRtlScrollType()) {
		case "negative":
			return -element.scrollLeft;
		case "positive-descending":
			return maxScrollLeft - element.scrollLeft;
		case "positive-ascending":
			return element.scrollLeft;
	}
}

function getRtlScrollType() {
	if (rtlScrollType) {
		return rtlScrollType;
	}

	if (typeof document === "undefined") {
		rtlScrollType = "negative";
		return rtlScrollType;
	}

	const outer = document.createElement("div");
	const inner = document.createElement("div");

	outer.dir = "rtl";
	outer.style.cssText =
		"position:absolute;left:-9999px;top:-9999px;width:4px;height:1px;overflow:scroll;visibility:hidden;";
	inner.style.cssText = "width:8px;height:1px;";
	outer.append(inner);
	document.body.append(outer);

	const initial = outer.scrollLeft;
	outer.scrollLeft = 1;

	if (outer.scrollLeft === 0) {
		rtlScrollType = "negative";
	} else if (initial > 0) {
		rtlScrollType = "positive-descending";
	} else {
		rtlScrollType = "positive-ascending";
	}

	outer.remove();
	return rtlScrollType;
}

function registerOverflowProperties() {
	if (overflowVarsRegistered || isWebKit()) {
		return;
	}

	if (typeof CSS !== "undefined" && "registerProperty" in CSS) {
		for (const name of overflowVars) {
			try {
				CSS.registerProperty({
					name,
					syntax: "<length>",
					inherits: false,
					initialValue: "0px",
				});
			} catch {
				// Property may already be registered by another ScrollFade instance.
			}
		}
	}

	overflowVarsRegistered = true;
}

function isWebKit() {
	if (typeof navigator === "undefined") {
		return false;
	}

	return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

export type { ScrollFadeProps };
export { ScrollFade };
