import type { ComponentType } from "react"

// Slugs share a namespace with component and group-example slugs and are looked
// up first — never reuse one of those (e.g. a calendar block must not be
// slugged "calendar", which is a component).
export const AVAILABLE_BLOCKS = [
  { slug: "dashboard", name: "Dashboard" },
  { slug: "settings", name: "Settings" },
  { slug: "customers", name: "Customers" },
  { slug: "mail", name: "Mail" },
  { slug: "file-manager", name: "File Manager" },
  { slug: "notifications-center", name: "Notifications" },
  { slug: "search-results", name: "Search Results" },
  { slug: "ai-chat", name: "AI Chat" },
  { slug: "code-review", name: "Code Review" },
  { slug: "logs", name: "Logs" },
  { slug: "checkout", name: "Checkout" },
  { slug: "banking", name: "Banking" },
  { slug: "invoice", name: "Invoice" },
  { slug: "messaging", name: "Messaging" },
  { slug: "music-player", name: "Music Player" },
]

const modules = import.meta.glob<{ default: ComponentType }>("./*.tsx")

export const BlocksIndex = Object.fromEntries(
  AVAILABLE_BLOCKS.map(({ slug }) => [slug, modules[`./${slug}.tsx`]]),
)
