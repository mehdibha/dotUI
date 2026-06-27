export const siteConfig = {
  url: 'https://dotui.org',
  name: 'dotUI',
  title: 'dotUI',
  description:
    'Build your design system in seconds, so your app looks like your brand, not a preset.',
  keywords: [
    'dotUI',
    'React',
    'Tailwind CSS',
    'React components',
    'React Aria',
    'Accessible components',
  ],
  authors: [
    {
      name: 'mehdibha',
      url: 'https://www.mehdibha.com',
    },
  ],
  creator: 'mehdibha',
  thumbnail: '/images/thumbnail.png',
  twitter: {
    creator: '@mehdibha',
  },
  og: {
    title: 'Ship unique.',
    description:
      'Build your design system in seconds, so your app looks like your brand, not a preset.',
  },
  links: {
    github: 'https://github.com/mehdibha/dotUI',
    twitter: 'https://x.com/mehdibha',
    discord: 'https://discord.gg/DXpj5V2fU8',
    creatorGithub: 'https://github.com/mehdibha',
  },
} as const

export const navItems: {
  name: string
  /** Pathname prefix used for active-state highlighting. */
  match: string
  /** Router link target. Docs entries target the splat route (`/docs/$`) rather
   *  than the bare `/docs` layout route: linking the layout route generates a
   *  path that re-matches to its splat child, tripping TanStack's
   *  `params.stringify` dev warning on every render. */
  to: string
  params?: { _splat: string }
}[] = [
  { name: 'Docs', match: '/docs', to: '/docs/$', params: { _splat: '' } },
  {
    name: 'Components',
    match: '/docs/components',
    to: '/docs/$',
    params: { _splat: 'components' },
  },
  { name: 'Charts', match: '/charts', to: '/charts' },
  { name: 'Create', match: '/create', to: '/create' },
]
