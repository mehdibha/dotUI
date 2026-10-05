/* What the film may put on screen. The site's showcase cards and studio
   blocks are real products, and some carry things a launch film can't: charts
   (their colors are being rewritten), real people's names, other companies'
   names and logos, remote images (they load nondeterministically between
   frames). Scenes pick from these lists only. Re-audit when a card changes. */

/** Landing showcase cards — `@/components/showcase/<name>`. */
export const SAFE_SHOWCASE = [
  "agent-tasks",
  "appearance",
  "approval-prompt",
  "booking",
  "color-editor",
  "command-menu",
  "controls",
  "cookie-preferences",
  "custom-domain",
  "display-settings",
  "faq",
  "pricing-plans",
  "storage",
  "support-chat",
  "team-name",
  "two-factor",
] as const

/** Excluded showcase cards, and why. */
export const UNSAFE_SHOWCASE = {
  metrics: "sparkline chart",
  filters: "price histogram (reads as a chart)",
  "ai-prompt": "chart",
  "usage-credits": "AI model names",
  "connected-tools": "GitHub, Linear",
  "computer-use": "Claude",
  payment: "Apple Pay, Link",
  "empty-state": "GitHub",
  "invite-members": "real people's names",
  notifications: "real people's names",
  "account-menu": "remote avatar image",
  "upload-avatar": "remote avatar image",
  "login-form": "Google / GitHub logos",
} as const

/** Studio blocks — default exports of `@/modules/studio/preview/blocks/<slug>`. */
export const SAFE_BLOCKS = [
  "mail",
  "customers",
  "file-manager",
  "code-review",
  "checkout",
  "invoice",
  "messaging",
  "music-player",
] as const

export const UNSAFE_BLOCKS = {
  dashboard: "charts",
  banking: "charts",
  "ai-chat": "chart card, Stripe",
  logs: "Stripe",
  settings: "GitHub, Linear, Stripe, Google Drive integrations",
  "notifications-center": "chart",
  "search-results": "package names",
} as const
