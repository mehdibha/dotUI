export type ChapterStatus = 'published' | 'planned'

export interface Chapter {
  slug: string
  number: number
  title: string
  status: ChapterStatus
}

export interface Part {
  number: 1 | 2 | 3
  title: string
  tagline: string
  chapters: Chapter[]
}

export const curriculum: Part[] = [
  {
    number: 1,
    title: 'Foundations',
    tagline: 'Understand color',
    chapters: [
      {
        slug: 'color-is-a-perception',
        number: 1,
        title: 'Color is a perception, not a number',
        status: 'published',
      },
      {
        slug: 'what-is-a-color-space',
        number: 2,
        title: 'What even is a color space?',
        status: 'published',
      },
      {
        slug: 'gamma-and-linear-light',
        number: 3,
        title: 'Gamma and the two grays',
        status: 'planned',
      },
      {
        slug: 'why-hsl-lies',
        number: 4,
        title: 'Why HSL lies',
        status: 'planned',
      },
      {
        slug: 'perceptual-color-spaces',
        number: 5,
        title: 'Perceptual spaces: from Lab to OKLCH',
        status: 'planned',
      },
      {
        slug: 'gamut',
        number: 6,
        title: 'Gamut: the edge of the screen',
        status: 'planned',
      },
      {
        slug: 'mixing-and-interpolation',
        number: 7,
        title: 'Mixing and interpolation',
        status: 'planned',
      },
      {
        slug: 'contrast',
        number: 8,
        title: 'Contrast: WCAG 2 vs APCA',
        status: 'planned',
      },
      {
        slug: 'seeing-differently',
        number: 9,
        title: 'Seeing differently: CVD and user preferences',
        status: 'planned',
      },
    ],
  },
  {
    number: 2,
    title: 'Building a color system',
    tagline: 'The decisions',
    chapters: [
      {
        slug: 'anatomy-of-a-scale',
        number: 10,
        title: 'Anatomy of a scale: steps are jobs',
        status: 'planned',
      },
      {
        slug: 'lightness-curves',
        number: 11,
        title: 'Lightness curves and the three philosophies',
        status: 'planned',
      },
      {
        slug: 'chroma-curves',
        number: 12,
        title: 'Chroma curves and the gamut ceiling',
        status: 'planned',
      },
      {
        slug: 'hue-along-the-ramp',
        number: 13,
        title: 'Hue along the ramp',
        status: 'planned',
      },
      {
        slug: 'seed-to-scale',
        number: 14,
        title: 'Seed to scale: any brand color in',
        status: 'planned',
      },
      {
        slug: 'neutrals',
        number: 15,
        title: 'Neutrals and tinted grays',
        status: 'planned',
      },
      {
        slug: 'dark-mode',
        number: 16,
        title: 'Dark mode is a second design',
        status: 'planned',
      },
      {
        slug: 'semantic-tokens',
        number: 17,
        title: 'Semantic tokens: tiers, naming, pairing',
        status: 'planned',
      },
      {
        slug: 'states-alpha-status',
        number: 18,
        title: 'States, alpha, and status colors',
        status: 'planned',
      },
      {
        slug: 'data-viz-palettes',
        number: 19,
        title: 'Color for data visualization',
        status: 'planned',
      },
      {
        slug: 'shipping-color',
        number: 20,
        title: 'Shipping color in CSS',
        status: 'planned',
      },
    ],
  },
  {
    number: 3,
    title: 'How the greats did it',
    tagline: 'Case studies',
    chapters: [
      {
        slug: 'radix-colors',
        number: 21,
        title: 'Radix Colors',
        status: 'planned',
      },
      {
        slug: 'tailwind',
        number: 22,
        title: 'Tailwind CSS',
        status: 'planned',
      },
      {
        slug: 'material-hct',
        number: 23,
        title: 'Material 3 & HCT',
        status: 'planned',
      },
      {
        slug: 'spectrum-leonardo',
        number: 24,
        title: 'Adobe Spectrum & Leonardo',
        status: 'planned',
      },
      {
        slug: 'geist',
        number: 25,
        title: 'Vercel Geist',
        status: 'planned',
      },
    ],
  },
]

export const allChapters: Chapter[] = curriculum.flatMap(
  (part) => part.chapters,
)

export const publishedChapters: Chapter[] = allChapters.filter(
  (chapter) => chapter.status === 'published',
)

export function getChapter(slug: string): Chapter | undefined {
  return allChapters.find((chapter) => chapter.slug === slug)
}

export function getPartForChapter(slug: string): Part | undefined {
  return curriculum.find((part) =>
    part.chapters.some((chapter) => chapter.slug === slug),
  )
}

/** Prev/next over published chapters only, in curriculum order. */
export function getPublishedNeighbours(slug: string): {
  previous?: Chapter
  next?: Chapter
} {
  const index = publishedChapters.findIndex((chapter) => chapter.slug === slug)
  if (index === -1) return {}
  return {
    previous: index > 0 ? publishedChapters[index - 1] : undefined,
    next:
      index < publishedChapters.length - 1
        ? publishedChapters[index + 1]
        : undefined,
  }
}
