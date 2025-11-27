/**
 * Centralized configuration for the API docs builder
 * All constants related to type extraction and processing
 */

/**
 * Types that should be resolved and included in typeLinks
 * These are typically RenderProps types that users want to explore
 */
export const RESOLVABLE_TYPE_PATTERNS = [
  /RenderProps$/,
  /Props$/,
  /State$/,
  /Context$/,
  /Event$/, // But not DOM events
];

/**
 * Types that should NEVER be resolved (built-in types)
 * These are handled by external documentation (MDN, React docs)
 */
export const SKIP_RESOLVE_TYPES = new Set([
  // DOM types
  "Window",
  "Document",
  "Element",
  "HTMLElement",
  "SVGElement",
  "Node",
  "EventTarget",
  "Navigator",
  // DOM Events (native)
  "Event",
  "MouseEvent",
  "KeyboardEvent",
  "FocusEvent",
  "PointerEvent",
  "TouchEvent",
  "DragEvent",
  // React types
  "ReactNode",
  "ReactElement",
  "CSSProperties",
  "RefObject",
  "Ref",
  // Primitives
  "string",
  "number",
  "boolean",
  "null",
  "undefined",
  "void",
  "any",
  "unknown",
  "never",
]);

/**
 * Types that should ALWAYS be expanded to show their full definition.
 * These are custom utility types where the expanded form is more readable.
 */
export const ALWAYS_EXPAND_TYPES = new Set([
  "ChildrenOrFunction",
  "ClassNameOrFunction",
  "StyleOrFunction",
]);

/**
 * Standard order for React Aria event props.
 * This ensures consistent ordering regardless of TypeScript's internal caching.
 * Order matches the declaration order in React Aria's type definitions.
 */
export const REACT_ARIA_EVENT_ORDER = [
  // Press events (from PressEvents)
  "onPress",
  "onPressStart",
  "onPressEnd",
  "onPressChange",
  "onPressUp",
  "onClick",
  // Focus events (from FocusableProps -> FocusEvents)
  "onFocus",
  "onBlur",
  "onFocusChange",
  // Keyboard events (from KeyboardEvents)
  "onKeyDown",
  "onKeyUp",
  // Hover events (from HoverEvents)
  "onHoverStart",
  "onHoverEnd",
  "onHoverChange",
];
