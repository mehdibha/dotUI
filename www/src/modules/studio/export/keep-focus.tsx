import { useEffect, useRef } from "react"

/** Inside a dialog whose contents swap as a publish resolves: when the
 *  focused button unmounts, focus returns to the dialog so Esc and Tab keep
 *  working. */
export function KeepFocus() {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const dialog = ref.current?.closest<HTMLElement>("[role=dialog]")
    if (!dialog) return
    const observer = new MutationObserver(() => {
      if (document.activeElement === document.body) dialog.focus()
    })
    observer.observe(dialog, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])
  return <span ref={ref} hidden />
}
