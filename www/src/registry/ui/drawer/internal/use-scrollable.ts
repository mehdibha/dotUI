// Scroll-container detection. Ported from Base UI's utils/scrollable.ts.
// We only care about the axis matching our drawer's swipe axis.

type Axis = "x" | "y";

const SCROLLABLE_OVERFLOW = /(auto|scroll|overlay)/;

export function isScrollableOnAxis(el: Element, axis: Axis): boolean {
	const style = getComputedStyle(el);
	const overflow = axis === "y" ? style.overflowY : style.overflowX;
	if (!SCROLLABLE_OVERFLOW.test(overflow)) return false;
	if (axis === "y") return el.scrollHeight > el.clientHeight;
	return el.scrollWidth > el.clientWidth;
}

/**
 * Walk up from `target` to `boundary` finding the first scrollable container
 * on the given axis. Returns null if none.
 */
export function findScrollableAncestor(
	target: Element | null,
	boundary: Element,
	axis: Axis,
): Element | null {
	let node: Element | null = target;
	while (node && node !== boundary && boundary.contains(node)) {
		if (node !== boundary && isScrollableOnAxis(node, axis)) return node;
		node = node.parentElement;
	}
	return null;
}

/**
 * Returns true if the scrollable container is at the edge in the dismiss
 * direction, so a swipe should take over from native scrolling.
 *
 * `dismissSign` is +1 for bottom/right placements (drag in +axis dismisses)
 * or -1 for top/left.
 */
export function isAtScrollEdgeForDismiss(
	scrollable: Element,
	axis: Axis,
	dismissSign: 1 | -1,
	delta: number,
): boolean {
	if (axis === "y") {
		const max = scrollable.scrollHeight - scrollable.clientHeight;
		const top = scrollable.scrollTop;
		// Dragging downward (delta>0) dismisses a bottom drawer when at top.
		// Dragging upward dismisses a top drawer when at bottom.
		if (dismissSign > 0) return top <= 0 && delta > 0;
		return top >= max - 1 && delta < 0;
	}
	const max = scrollable.scrollWidth - scrollable.clientWidth;
	const left = scrollable.scrollLeft;
	if (dismissSign > 0) return left <= 0 && delta > 0;
	return left >= max - 1 && delta < 0;
}
