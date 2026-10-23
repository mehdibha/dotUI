import { createFileRoute } from "@tanstack/react-router"

import { INTERNAL_PAGES } from "@/modules/internal/enabled"
import { SpecimenPage } from "@/modules/preset-lab/page"

interface SpecimenSearch {
  preset?: string
  mode?: "light" | "dark"
  sheet?: string
  /** JSON of studio keys over the preset's state. */
  diff?: string
}

export const Route = createFileRoute("/internal/specimens")({
  validateSearch: (search: Record<string, unknown>): SpecimenSearch => ({
    preset: typeof search.preset === "string" ? search.preset : undefined,
    mode:
      search.mode === "light" || search.mode === "dark"
        ? search.mode
        : undefined,
    sheet: typeof search.sheet === "string" ? search.sheet : undefined,
    diff: typeof search.diff === "string" ? search.diff : undefined,
  }),
  ssr: false,
  component: INTERNAL_PAGES ? SpecimenPage : undefined,
  head: INTERNAL_PAGES
    ? () => ({ meta: [{ title: "Specimens · dotUI" }] })
    : undefined,
})
