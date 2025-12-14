import { useEffect } from "react";

export interface UseKeyboardShortcutOptions {
  /**
   * The key to listen for (e.g., "b", "k", "/")
   */
  key: string;
  /**
   * Whether to require meta/ctrl key
   * @default true
   */
  metaKey?: boolean;
  /**
   * Whether to ignore shortcuts when focus is on input elements
   * @default false
   */
  ignoreInputFocus?: boolean;
  /**
   * The callback to execute when the shortcut is pressed
   */
  onPress: () => void;
  /**
   * Whether the shortcut is enabled
   * @default true
   */
  enabled?: boolean;
}

/**
 * Hook to handle keyboard shortcuts
 *
 * @example
 * ```tsx
 * useKeyboardShortcut({
 *   key: "b",
 *   metaKey: true,
 *   onPress: () => toggleSidebar(),
 * });
 * ```
 */
export function useKeyboardShortcut({
  key,
  metaKey = true,
  ignoreInputFocus = false,
  onPress,
  enabled = true,
}: UseKeyboardShortcutOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if meta/ctrl key is required and pressed
      if (metaKey && !event.metaKey && !event.ctrlKey) {
        return;
      }

      // Check if the key matches
      if (event.key !== key) {
        return;
      }

      // Optionally ignore if focus is on input fields
      if (ignoreInputFocus) {
        const target = event.target;
        if (
          (target instanceof HTMLElement && target.isContentEditable) ||
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          target instanceof HTMLSelectElement
        ) {
          return;
        }
      }

      event.preventDefault();
      onPress();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [key, metaKey, ignoreInputFocus, onPress, enabled]);
}
