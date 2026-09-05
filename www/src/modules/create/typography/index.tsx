"use client"

import { useCallback, useEffect, useRef } from "react"

import { ensureFontStylesheets, loadFontPreview } from "@/lib/fonts"

/** Load families into THIS document (the panel page, not the preview iframe). */
export function useLoadedFamilies(families: (string | null)[]) {
  const key = families.filter(Boolean).join("\n")
  useEffect(() => {
    if (key) ensureFontStylesheets(document, key.split("\n"))
  }, [key])
}

/**
 * Lazily loads each font's preview face as its row nears the listbox viewport —
 * a ~500-font list fetches only the handful actually seen instead of every face
 * up front. Driven by scroll position (rows carry `data-preview-family`); the
 * callback ref wires it when the popover's ListBox mounts and tears it down on
 * unmount. `loadFontPreview` is idempotent, so re-scanning on scroll is cheap.
 */
export function useLazyFontPreviews() {
  const cleanupRef = useRef<(() => void) | null>(null)

  return useCallback((wrapper: HTMLElement | null) => {
    cleanupRef.current?.()
    cleanupRef.current = null
    // The registry ListBox doesn't forward a ref, so reach the scroll container
    // through a `display:contents` wrapper.
    const root = wrapper?.querySelector<HTMLElement>('[role="listbox"]')
    if (!root) return

    const loadVisible = () => {
      const box = root.getBoundingClientRect()
      for (const el of root.querySelectorAll<HTMLElement>(
        "[data-preview-family]",
      )) {
        const r = el.getBoundingClientRect()
        if (r.top > box.bottom + 200) break // rows below the window; stop
        if (r.bottom >= box.top - 200 && el.dataset.previewFamily) {
          loadFontPreview(document, el.dataset.previewFamily)
        }
      }
    }

    let timer: ReturnType<typeof setTimeout> | undefined
    const schedule = () => {
      if (timer) return
      timer = setTimeout(() => {
        timer = undefined
        loadVisible()
      }, 100)
    }
    loadVisible()
    root.addEventListener("scroll", schedule, { passive: true })
    // Filtering rewrites the rows, changing what's at the top; rescan then too.
    const mo = new MutationObserver(schedule)
    mo.observe(root, { childList: true, subtree: true })
    cleanupRef.current = () => {
      root.removeEventListener("scroll", schedule)
      mo.disconnect()
      clearTimeout(timer)
    }
  }, [])
}
