"use client"

import { type ReactNode, useEffect, useLayoutEffect, useRef } from "react"

const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect

/**
 * Mirrors interaction states onto the real React Aria state attributes
 * (`data-pressed`, `data-focused`…) of elements inside, so a preview shows a
 * component's own pressed/focused styles without interaction. Re-applied on
 * every DOM change because React Aria rewrites the attributes from its (idle)
 * state and mounts collection items after the first render. `states` maps a
 * selector to the attributes to set.
 */
export function DemoState({
  states,
  children,
}: {
  states: Record<string, string[]>
  children: ReactNode
}) {
  const ref = useRef<HTMLSpanElement>(null)
  useIsoLayoutEffect(() => {
    const host = ref.current
    if (!host) return
    const apply = () => {
      for (const [selector, attrs] of Object.entries(states)) {
        for (const el of host.querySelectorAll(selector)) {
          for (const attr of attrs) {
            if (!el.hasAttribute(attr)) el.setAttribute(attr, "")
          }
        }
      }
    }
    apply()
    const observer = new MutationObserver(apply)
    observer.observe(host, { subtree: true, childList: true, attributes: true })
    return () => observer.disconnect()
  })
  return (
    <span ref={ref} style={{ display: "contents" }}>
      {children}
    </span>
  )
}
