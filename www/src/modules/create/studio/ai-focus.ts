/**
 * Tiny decoupled bridge between the top bar's "Ask dotUI" command (and its ⌘K
 * shortcut) and the docked AI bar input. The bar registers a focuser on mount;
 * the command fires it. Keeps the two zones independent — no prop-drilling a ref
 * up through the studio shell.
 */

type Focuser = () => void

let focuser: Focuser | null = null

export function registerAiFocuser(fn: Focuser): () => void {
  focuser = fn
  return () => {
    if (focuser === fn) focuser = null
  }
}

export function focusAiBar(): void {
  focuser?.()
}
