import { createFileRoute } from '@tanstack/react-router'

import { siteConfig } from '@/config/site'
import { PresetsPage } from '@/modules/presets/presets-page'

const TITLE = 'Presets'
const DESCRIPTION =
  'Browse ready-made design systems — preview each one live on real components, then open it in the editor and make it yours.'

export const Route = createFileRoute('/_app/presets')({
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
        { property: 'og:url', content: `${siteConfig.url}/presets` },
        { property: 'og:image', content: ogImageUrl },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: TITLE },
        { name: 'twitter:description', content: DESCRIPTION },
        { name: 'twitter:image', content: ogImageUrl },
        { name: 'twitter:creator', content: siteConfig.twitter.creator },
      ],
    }
  },
  component: PresetsPage,
})
