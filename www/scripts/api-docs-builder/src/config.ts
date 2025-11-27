/**
 * Centralized configuration for the API docs builder
 * All constants related to type extraction and processing
 */

/**
 * Types that should NEVER be expanded - show as simple identifiers
 * These are complex recursive types that would explode if expanded
 */
export const NEVER_EXPAND_TYPES = new Set([
  // React node types (recursive, complex)
  "ReactNode",
  "ReactElement",
  "ReactChild",
  "ReactFragment",
  "ReactPortal",
  "AwaitedReactNode",
  "JSXElementConstructor",
  // React component types
  "Component",
  "ComponentClass",
  "FunctionComponent",
  "FC",
  "ForwardRefExoticComponent",
  "MemoExoticComponent",
  "LazyExoticComponent",
  // React utility types
  "PropsWithChildren",
  "PropsWithRef",
  "ComponentProps",
  "ComponentPropsWithRef",
  "ComponentPropsWithoutRef",
  // CSS/Style types
  "CSSProperties",
  // HTML attribute types (from React's type definitions)
  "HTMLAttributeAnchorTarget",
  "HTMLAttributeReferrerPolicy",
  "HTMLInputTypeAttribute",
  "HTMLInputAutoComplete",
  // DOM types
  "Element",
  "HTMLElement",
  "SVGElement",
  "Node",
  "Document",
  "Window",
  // Event types
  "Event",
  "SyntheticEvent",
  "UIEvent",
  "FocusEvent",
  "KeyboardEvent",
  "MouseEvent",
  "PointerEvent",
  "TouchEvent",
  "DragEvent",
  "ClipboardEvent",
  "WheelEvent",
  "AnimationEvent",
  "TransitionEvent",
  "FormEvent",
  "ChangeEvent",
  // React Aria specific
  "FocusableElement",
  "DOMAttributes",
  "AriaAttributes",
  "HTMLAttributes",
  "DOMProps",
  // Utility types
  "Key",
  "Ref",
  "RefObject",
  "MutableRefObject",
  "RefCallback",
  "LegacyRef",
  "ForwardedRef",
  // Collection types
  "Iterable",
  "Iterator",
  "AsyncIterable",
  "AsyncIterator",
  // Promise types
  "Promise",
  "PromiseLike",
]);

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
