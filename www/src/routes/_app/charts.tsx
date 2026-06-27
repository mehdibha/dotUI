import { createFileRoute } from '@tanstack/react-router'

import { siteConfig } from '@/config/site'
import { ChartsPage } from '@/modules/charts/charts-page'

const TITLE = 'Charts'
const DESCRIPTION =
  'A complete set of accessible, copy-paste chart components built on Recharts — every series themed by your design system, in light and dark.'

export const Route = createFileRoute('/_app/charts')({
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
        { property: 'og:url', content: `${siteConfig.url}/charts` },
        { property: 'og:image', content: ogImageUrl },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: TITLE },
        { name: 'twitter:description', content: DESCRIPTION },
        { name: 'twitter:image', content: ogImageUrl },
        { name: 'twitter:creator', content: siteConfig.twitter.creator },
      ],
    }
  },
  component: ChartsPage,
})
