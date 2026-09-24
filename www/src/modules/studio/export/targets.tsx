import type { ReactNode } from "react"

import { V0Icon } from "@/components/icons/v0"

import type { ExportUrl } from "./types"

/**
 * An external tool that boots a new project from the design system. Listed
 * under "New project" as secondary actions next to the CLI command; adding one
 * (Bolt, Lovable, …) is one entry here plus, if it needs its own artifact, a
 * `routes/r/` endpoint.
 */
export interface OpenInTarget {
  id: string
  name: string
  /** Brand wordmark, tinted by `currentColor`. */
  wordmark: ReactNode
  href: (url: ExportUrl) => string
}

export const OPEN_IN_TARGETS: OpenInTarget[] = [
  {
    id: "v0",
    name: "v0",
    wordmark: <V0Icon className="h-3 w-auto" />,
    // v0 fetches the item server-side, so this only works from the deployed
    // origin (never localhost).
    href: (url) =>
      `https://v0.dev/chat/api/open?url=${encodeURIComponent(url("v0"))}`,
  },
]
