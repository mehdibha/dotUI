import { createFileRoute } from "@tanstack/react-router"

import { INTERNAL_PAGES } from "@/modules/internal/enabled"
import { ComparePage } from "@/modules/preset-lab/compare-page"

interface CompareSearch {
  /** The reference pack, and the preset the studio opens on. */
  preset?: string
  mode?: "light" | "dark"
  sheet?: string
  view?: "side" | "onion" | "swipe" | "difference"
}

const VIEWS = ["side", "onion", "swipe", "difference"] as const

export const Route = createFileRoute("/internal/compare")({
  validateSearch: (search: Record<string, unknown>): CompareSearch => ({
    preset: typeof search.preset === "string" ? search.preset : undefined,
    mode:
      search.mode === "light" || search.mode === "dark"
        ? search.mode
        : undefined,
    sheet: typeof search.sheet === "string" ? search.sheet : undefined,
    view: VIEWS.find((view) => view === search.view),
  }),
  ssr: false,
  component: INTERNAL_PAGES ? ComparePage : undefined,
  head: INTERNAL_PAGES
    ? () => ({ meta: [{ title: "Compare · dotUI" }] })
    : undefined,
})
