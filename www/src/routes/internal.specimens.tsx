import { createFileRoute } from "@tanstack/react-router"

import { SpecimenPage } from "@/modules/preset-lab/page"

export interface SpecimenSearch {
  preset?: string
  mode?: "light" | "dark"
  sheet?: string
}

export const Route = createFileRoute("/internal/specimens")({
  validateSearch: (search: Record<string, unknown>): SpecimenSearch => ({
    preset: typeof search.preset === "string" ? search.preset : undefined,
    mode:
      search.mode === "light" || search.mode === "dark"
        ? search.mode
        : undefined,
    sheet: typeof search.sheet === "string" ? search.sheet : undefined,
  }),
  ssr: false,
  component: import.meta.env.DEV ? SpecimenPage : undefined,
  head: import.meta.env.DEV
    ? () => ({ meta: [{ title: "Specimens · dotUI" }] })
    : undefined,
})
