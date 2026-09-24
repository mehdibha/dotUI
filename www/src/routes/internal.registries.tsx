import { createFileRoute } from "@tanstack/react-router"

import { RegistriesPage } from "@/modules/registries/page"

export const Route = createFileRoute("/internal/registries")({
  component: import.meta.env.DEV ? RegistriesPage : undefined,
  head: import.meta.env.DEV
    ? () => ({ meta: [{ title: "Registry directory · dotUI" }] })
    : undefined,
})
