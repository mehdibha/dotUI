"use client";

import React from "react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as ListBoxPrimitives from "react-aria-components/ListBox";
import type * as MenuPrimitives from "react-aria-components/Menu";

// --------------------------------------------------------------------------
// Global CSS (scrollbar hiding) — injected once per document.
// --------------------------------------------------------------------------

const STYLE_TAG_ID = "dotui-wheel-picker-styles";
const GLOBAL_CSS = `
.dotui-wheel-picker-scroller { -ms-overflow-style: none; scrollbar-width: none; }
.dotui-wheel-picker-scroller::-webkit-scrollbar { display: none; }
`;

function useInjectedStyles() {
	React.useEffect(() => {
		if (typeof document === "undefined") return;
		if (document.getElementById(STYLE_TAG_ID)) return;
		const tag = document.createElement("style");
		tag.id = STYLE_TAG_ID;
		tag.textContent = GLOBAL_CSS;
		document.head.appendChild(tag);
	}, []);
}

const FADE_MASK = "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)";

// --------------------------------------------------------------------------
// Context (so WheelPickerItem picks up itemHeight automatically)
// --------------------------------------------------------------------------

type WheelPickerContextValue = { itemHeight: number };
const WheelPickerContext = React.createContext<WheelPickerContextValue | null>(null);

function useWheelPickerContext() {
	const ctx = React.useContext(WheelPickerContext);
	if (!ctx) {
		throw new Error("WheelPickerItem must be used inside a WheelPicker.");
	}
	return ctx;
}

// --------------------------------------------------------------------------
// WheelPicker
// --------------------------------------------------------------------------

interface WheelPickerProps<T>
	extends Omit<
		ListBoxPrimitives.ListBoxProps<T>,
		| "layout"
		| "orientation"
		| "selectionMode"
		| "selectionBehavior"
		| "disallowEmptySelection"
		| "selectedKeys"
		| "defaultSelectedKeys"
		| "onSelectionChange"
	> {
	/** Selected item id. */
	value?: MenuPrimitives.Key;
	/** Uncontrolled default. */
	defaultValue?: MenuPrimitives.Key;
	/** Fires when the committed value changes. */
	onValueChange?: (value: MenuPrimitives.Key) => void;
	/** Pixel height of each row. Default 36. */
	itemHeight?: number;
	/** Number of rows visible at once (odd numbers center nicely). Default 5. */
	visibleCount?: number;
}

function WheelPicker<T extends object>({
	itemHeight = 36,
	visibleCount = 5,
	value: valueProp,
	defaultValue,
	onValueChange,
	className,
	style,
	children,
	items,
	...props
}: WheelPickerProps<T>) {
	useInjectedStyles();

	const scrollerRef = React.useRef<HTMLDivElement>(null);
	const settleTimer = React.useRef<number | null>(null);
	const suppressScrollSyncUntil = React.useRef(0);

	const isControlled = valueProp !== undefined;
	const [uncontrolled, setUncontrolled] = React.useState<MenuPrimitives.Key | undefined>(defaultValue);
	const value = isControlled ? valueProp : uncontrolled;

	// ----- Ordered key list (for scroll-to-index math) ---------------------
	const keys = React.useMemo(() => {
		const arr: MenuPrimitives.Key[] = [];
		if (items) {
			for (const item of items as Iterable<unknown>) {
				const any = item as { id?: MenuPrimitives.Key; key?: MenuPrimitives.Key };
				const id = any.id ?? any.key;
				if (id != null) arr.push(id);
			}
		} else {
			React.Children.toArray(children as React.ReactNode).forEach((child) => {
				if (React.isValidElement(child)) {
					const p = child.props as { id?: MenuPrimitives.Key };
					if (p.id != null) arr.push(p.id);
				}
			});
		}
		return arr;
	}, [items, children]);

	const indexByKey = React.useMemo(() => {
		const m = new Map<MenuPrimitives.Key, number>();
		keys.forEach((k, i) => m.set(k, i));
		return m;
	}, [keys]);

	const containerHeight = itemHeight * visibleCount;
	const padding = (containerHeight - itemHeight) / 2;

	const selectionSet: MenuPrimitives.Selection = React.useMemo(
		() => (value != null ? new Set<MenuPrimitives.Key>([value]) : new Set<MenuPrimitives.Key>()),
		[value],
	);

	const setValue = React.useCallback(
		(next: MenuPrimitives.Key) => {
			if (!isControlled) setUncontrolled(next);
			onValueChange?.(next);
		},
		[isControlled, onValueChange],
	);

	// ----- Commit on scroll settle -----------------------------------------
	const commitFromScroll = React.useCallback(() => {
		const el = scrollerRef.current;
		if (!el) return;
		const idx = Math.round(el.scrollTop / itemHeight);
		const clamped = Math.max(0, Math.min(keys.length - 1, idx));
		const next = keys[clamped];
		if (next == null || next === value) return;
		setValue(next);
	}, [itemHeight, keys, value, setValue]);

	React.useEffect(() => {
		const el = scrollerRef.current;
		if (!el) return;

		const supportsSnapChange = "onscrollsnapchange" in el;
		const supportsScrollEnd = "onscrollend" in el;

		const handleSettle = () => {
			if (performance.now() < suppressScrollSyncUntil.current) return;
			commitFromScroll();
		};
		const onScrollFallback = () => {
			if (performance.now() < suppressScrollSyncUntil.current) return;
			if (settleTimer.current) window.clearTimeout(settleTimer.current);
			settleTimer.current = window.setTimeout(commitFromScroll, 120);
		};

		if (supportsSnapChange) {
			el.addEventListener("scrollsnapchange", handleSettle);
		} else if (supportsScrollEnd) {
			el.addEventListener("scrollend", handleSettle);
		} else {
			el.addEventListener("scroll", onScrollFallback, { passive: true });
		}

		return () => {
			if (settleTimer.current) window.clearTimeout(settleTimer.current);
			if (supportsSnapChange) {
				el.removeEventListener("scrollsnapchange", handleSettle);
			} else if (supportsScrollEnd) {
				el.removeEventListener("scrollend", handleSettle);
			} else {
				el.removeEventListener("scroll", onScrollFallback);
			}
		};
	}, [commitFromScroll]);

	// ----- Sync value → scroll position ------------------------------------
	const isInitialSync = React.useRef(true);
	React.useLayoutEffect(() => {
		const el = scrollerRef.current;
		if (!el || value == null) return;
		const idx = indexByKey.get(value);
		if (idx == null) return;
		const target = idx * itemHeight;
		if (Math.abs(el.scrollTop - target) < 1) return;
		suppressScrollSyncUntil.current = performance.now() + 500;
		el.scrollTo({
			top: target,
			behavior: isInitialSync.current ? "auto" : "smooth",
		});
		// Reassert once more after the next frame. When the scroller is inside
		// a portal/overlay that finishes positioning after our effect runs,
		// the overlay can clobber the scrollTop we just set.
		const wasInitial = isInitialSync.current;
		isInitialSync.current = false;
		if (wasInitial) {
			const raf = requestAnimationFrame(() => {
				const node = scrollerRef.current;
				if (node && Math.abs(node.scrollTop - target) > 1) {
					node.scrollTop = target;
				}
			});
			return () => cancelAnimationFrame(raf);
		}
	}, [value, indexByKey, itemHeight]);

	// ----- RAC selection (clicks, keyboard) --------------------------------
	const handleSelectionChange = React.useCallback(
		(next: MenuPrimitives.Selection) => {
			if (next === "all") return;
			const first = [...next][0];
			if (first != null && first !== value) setValue(first);
		},
		[value, setValue],
	);

	const ctx = React.useMemo(() => ({ itemHeight }), [itemHeight]);

	return (
		<WheelPickerContext.Provider value={ctx}>
			<div
				className={className}
				style={{
					position: "relative",
					height: containerHeight,
					WebkitMaskImage: FADE_MASK,
					maskImage: FADE_MASK,
					...style,
				}}
			>
				<ListBoxPrimitives.ListBox
					{...props}
					ref={scrollerRef}
					items={items}
					selectionMode="single"
					disallowEmptySelection
					selectedKeys={selectionSet}
					onSelectionChange={handleSelectionChange}
					className="dotui-wheel-picker-scroller outline-none"
					style={{
						display: "block",
						boxSizing: "border-box",
						width: "100%",
						height: "100%",
						padding: 0,
						paddingTop: padding,
						paddingBottom: padding,
						overflowY: "scroll",
						scrollSnapType: "y mandatory",
						overscrollBehavior: "contain",
					}}
				>
					{children}
				</ListBoxPrimitives.ListBox>
			</div>
		</WheelPickerContext.Provider>
	);
}

// --------------------------------------------------------------------------
// WheelPickerItem
// --------------------------------------------------------------------------

interface WheelPickerItemProps<T> extends ListBoxPrimitives.ListBoxItemProps<T> {}

function WheelPickerItem<T extends object>({ className, style, children, ...props }: WheelPickerItemProps<T>) {
	const { itemHeight } = useWheelPickerContext();

	return (
		<ListBoxPrimitives.ListBoxItem
			{...props}
			className={composeRenderProps(className, (cn) =>
				[
					"flex cursor-pointer select-none items-center justify-center font-medium text-sm tabular-nums outline-hidden",
					"text-fg-muted transition-colors data-[selected]:text-fg",
					cn,
				]
					.filter(Boolean)
					.join(" "),
			)}
			style={composeRenderProps(
				style,
				(s): React.CSSProperties => ({
					boxSizing: "border-box",
					height: itemHeight,
					scrollSnapAlign: "center",
					...s,
				}),
			)}
		>
			{children}
		</ListBoxPrimitives.ListBoxItem>
	);
}

export type { WheelPickerItemProps, WheelPickerProps };
export { WheelPicker, WheelPickerItem };
