import { createFileRoute } from "@tanstack/react-router"

import { INTERNAL_PAGES } from "@/modules/internal/enabled"
import { RegistriesPage } from "@/modules/registries/page"

export const Route = createFileRoute("/internal/registries")({
  component: INTERNAL_PAGES ? RegistriesPage : undefined,
  head: INTERNAL_PAGES
    ? () => ({ meta: [{ title: "Registry directory · dotUI" }] })
    : undefined,
})
