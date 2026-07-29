import { createFileRoute } from '@tanstack/react-router'

import { siteConfig } from '@/config/site'
import { ComponentsPage } from '@/modules/components/components-page'

const TITLE = 'Components'
const DESCRIPTION =
  'Browse every component in the library — accessible, composable, and styled to match your design system.'

export const Route = createFileRoute('/_app/components')({
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
        { property: 'og:url', content: `${siteConfig.url}/components` },
        { property: 'og:image', content: ogImageUrl },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: TITLE },
        { name: 'twitter:description', content: DESCRIPTION },
        { name: 'twitter:image', content: ogImageUrl },
        { name: 'twitter:creator', content: siteConfig.twitter.creator },
      ],
    }
  },
  component: ComponentsPage,
})
