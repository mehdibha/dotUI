import { createFileRoute } from '@tanstack/react-router'

import { HomePage } from '@/modules/marketing/home-page'

export const Route = createFileRoute('/_app/')({
  head: () => ({
    // Markdown alternate for AI agents (also served via Accept negotiation).
    links: [{ rel: 'alternate', type: 'text/markdown', href: '/home.md' }],
  }),
  component: HomePage,
})
