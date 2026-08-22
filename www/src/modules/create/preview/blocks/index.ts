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
  { slug: "data-table", name: "Data Table" },
  { slug: "mail", name: "Mail" },
  { slug: "kanban", name: "Kanban Board" },
  { slug: "scheduling", name: "Scheduling" },
  { slug: "file-manager", name: "File Manager" },
  { slug: "notifications-center", name: "Notifications" },
  { slug: "search-results", name: "Search" },
  { slug: "user-management", name: "User Management" },
  { slug: "ai-chat", name: "AI Chat" },
  { slug: "ai-playground", name: "AI Playground" },
  { slug: "code-review", name: "Code Review" },
  { slug: "api-keys", name: "API Keys" },
  { slug: "logs", name: "Logs" },
  { slug: "deployments", name: "Deployments" },
  { slug: "product-page", name: "Product Page" },
  { slug: "checkout", name: "Checkout" },
  { slug: "orders", name: "Orders" },
  { slug: "banking", name: "Banking" },
  { slug: "invoice", name: "Invoice" },
  { slug: "pricing", name: "Pricing" },
  { slug: "landing", name: "Landing Page" },
  { slug: "blog-article", name: "Blog Article" },
  { slug: "docs-page", name: "Documentation" },
  { slug: "changelog", name: "Changelog" },
  { slug: "social-feed", name: "Social Feed" },
  { slug: "messaging", name: "Messaging" },
  { slug: "music-player", name: "Music Player" },
  { slug: "onboarding", name: "Onboarding" },
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
