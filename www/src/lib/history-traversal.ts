import type { RouterHistory } from "@tanstack/react-router"

/* Whether the page got to its location through Back/Forward rather than by
   opening it: a link opened that way is history, not a request. Replaces
   keep the kind of the navigation they follow. */

let traversed = false

export function trackTraversal(history: RouterHistory) {
  if (typeof window === "undefined") return
  const [load] = performance.getEntriesByType(
    "navigation",
  ) as PerformanceNavigationTiming[]
  traversed = load?.type === "back_forward"
  history.subscribe(({ action }) => {
    if (action.type === "PUSH") traversed = false
    else if (action.type !== "REPLACE") traversed = true
  })
}

export const traversedHistory = () => traversed
