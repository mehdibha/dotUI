/* The history shortcuts, shared by the studio and its preview iframe (which
   hands them up): dependency-free, since the iframe hooks load at the root. */

const TEXT_ENTRY =
  "textarea, [contenteditable]:not([contenteditable='false']), input:not([type='range'], [type='checkbox'], [type='radio'], [type='button'], [type='color'])"

/** Whether a key event's target keeps the key for itself (a text field). */
export const inTextEntry = (target: EventTarget | null) =>
  target instanceof Element && !!target.closest(TEXT_ENTRY)

/** ⌘Z / ⇧⌘Z (or Ctrl+Y) outside text fields, which keep their own undo. */
export function historyKey(e: KeyboardEvent): "undo" | "redo" | undefined {
  if (!(e.metaKey || e.ctrlKey) || e.altKey || inTextEntry(e.target)) return
  const key = e.key.toLowerCase()
  if (key === "z") return e.shiftKey ? "redo" : "undo"
  if (key === "y" && e.ctrlKey) return "redo"
}
