import { createFileRoute } from '@tanstack/react-router'

import { siteConfig } from '@/config/site'
import { BlocksPage } from '@/modules/blocks/blocks-page'

const TITLE = 'Blocks'
const DESCRIPTION =
  'Ready-made screens and layouts — a login, an app shell, a dashboard — themed by your design system and exported as code you own.'

export const Route = createFileRoute('/_app/blocks')({
  head: () => {
    const ogImageUrl = `${siteConfig.url}/og?title=${encodeURIComponent(
      TITLE,
    )}&description=${encodeURIComponent(DESCRIPTION)}`
    return {
      meta: [
        { title: `${TITLE} - ${siteConfig.name}` },
        { name: 'description', content: DESCRIPTION },
        { property: 'og:title', content: TITLE },
        { property: 'og:description', content: DESCRIPTION },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: `${siteConfig.url}/blocks` },
        { property: 'og:image', content: ogImageUrl },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: TITLE },
        { name: 'twitter:description', content: DESCRIPTION },
        { name: 'twitter:image', content: ogImageUrl },
        { name: 'twitter:creator', content: siteConfig.twitter.creator },
      ],
    }
  },
  component: BlocksPage,
})
