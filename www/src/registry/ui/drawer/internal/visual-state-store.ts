// Tiny pub-sub for inter-component drawer state.
// Mirrors Base UI's createNestedSwipeProgressStore + visualStateStore approach
// so high-frequency swipe updates don't trigger React re-renders.

type Placement = "top" | "bottom" | "left" | "right";

export interface VisualState {
	/** Stack of open drawer ids, bottom-most first. Last entry is topmost. */
	stack: string[];
	/** Map of id → placement. */
	placements: Record<string, Placement>;
	/** Map of id → measured height in px (updated via ResizeObserver). */
	heights: Record<string, number>;
	/** Number of currently-open drawers. (`stack.length`, kept for fast reads.) */
	openCount: number;
	/** Topmost drawer's progress. 1 fully open, 0 fully off, 0..1 during swipe. */
	progress: number;
	/** True while a pointer drag is in flight on the topmost drawer. */
	isSwiping: boolean;
	/** Placement of the topmost drawer, if any. */
	placement: Placement | null;
}

export interface VisualStateStore {
	get: () => VisualState;
	subscribe: (listener: () => void) => () => void;
	/** Register an open drawer. Returns an unregister function. */
	registerOpen: (id: string, placement: Placement) => () => void;
	/** Called by a drawer per-frame; only the topmost drawer's call updates the global progress. */
	setProgress: (id: string, progress: number, isSwiping: boolean) => void;
	/** Publish a drawer's measured height (used by parents to position above the topmost). */
	setHeight: (id: string, height: number) => void;
}

const isTopmost = (state: VisualState, id: string) =>
	state.stack[state.stack.length - 1] === id;

export function createVisualStateStore(): VisualStateStore {
	const state: VisualState = {
		stack: [],
		placements: {},
		heights: {},
		openCount: 0,
		progress: 0,
		isSwiping: false,
		placement: null,
	};
	let snapshot: VisualState = { ...state, stack: [], placements: {}, heights: {} };
	const listeners = new Set<() => void>();
	const emit = () => {
		snapshot = {
			...state,
			stack: [...state.stack],
			placements: { ...state.placements },
			heights: { ...state.heights },
		};
		for (const l of listeners) l();
	};

	const syncTop = () => {
		const topId = state.stack[state.stack.length - 1];
		state.placement = topId ? (state.placements[topId] ?? null) : null;
		// When the top changes, restore "fully open" — the new top hasn't reported any swipe yet.
		state.progress = topId ? 1 : 0;
		state.isSwiping = false;
	};

	return {
		get: () => snapshot,
		subscribe(listener) {
			listeners.add(listener);
			return () => {
				listeners.delete(listener);
			};
		},
		registerOpen(id, placement) {
			if (!state.stack.includes(id)) state.stack.push(id);
			state.placements[id] = placement;
			state.openCount = state.stack.length;
			syncTop();
			emit();
			return () => {
				const idx = state.stack.indexOf(id);
				if (idx >= 0) state.stack.splice(idx, 1);
				delete state.placements[id];
				delete state.heights[id];
				state.openCount = state.stack.length;
				syncTop();
				emit();
			};
		},
		setProgress(id, progress, isSwiping) {
			if (!isTopmost(state, id)) return;
			if (state.progress === progress && state.isSwiping === isSwiping) return;
			state.progress = progress;
			state.isSwiping = isSwiping;
			emit();
		},
		setHeight(id, height) {
			if (state.heights[id] === height) return;
			state.heights[id] = height;
			emit();
		},
	};
}

// Module-level fallback so users don't need an explicit <DrawerProvider>
// for the common single-drawer case.
export const defaultVisualStateStore = createVisualStateStore();
