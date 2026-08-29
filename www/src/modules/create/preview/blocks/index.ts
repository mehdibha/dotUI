import type { ComponentType } from "react"

export interface BlockMeta {
  slug: string
  name: string
}

// Every planned real-world block. A block appears in the /create preview picker
// once its `./<slug>.tsx` file lands — entries without a file are simply not
// offered yet, so this list can stay ahead of the implementations.
// Slugs share a namespace with component and group-example slugs and are looked
// up first — never reuse one of those (e.g. "calendar" → "scheduling" here).
export const BLOCKS: BlockMeta[] = [
  { slug: "dashboard", name: "Dashboard" },
  { slug: "settings", name: "Settings" },
  { slug: "customers", name: "Customers" },
  { slug: "mail", name: "Mail" },
  { slug: "kanban", name: "Kanban" },
  { slug: "scheduling", name: "Scheduling" },
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

export const BlocksIndex: Record<
  string,
  () => Promise<{ default: ComponentType }>
> = {}
for (const block of BLOCKS) {
  const load = modules[`./${block.slug}.tsx`]
  if (load) BlocksIndex[block.slug] = load
}

export const AVAILABLE_BLOCKS = BLOCKS.filter((b) => b.slug in BlocksIndex)
