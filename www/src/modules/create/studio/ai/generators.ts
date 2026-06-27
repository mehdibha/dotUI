/* ----------------------------------------------------------------------------
 * "Generate from …" — the inputs a real model would accept (an image, a URL, a
 * raw vibe). Here each is a *curated demo*: a believable, undoable result that
 * shows what extracting-a-system-from-anything feels like. Production swaps the
 * baked `mutate` for a vision/scrape call returning the same shape.
 * -------------------------------------------------------------------------- */

import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'

import { RADIUS_FACTOR_VAR } from '../../layout'
import type { Density, DesignSystem } from '../../preset'

function build(
  ds: DesignSystem,
  opts: {
    accent?: string
    neutral?: string
    radius?: number
    density?: Density
  },
): DesignSystem {
  const base = ds.color ?? DEFAULT_COLOR_CONFIG
  return {
    ...ds,
    density: opts.density ?? ds.density,
    tokens:
      opts.radius != null
        ? { ...ds.tokens, [RADIUS_FACTOR_VAR]: String(opts.radius) }
        : ds.tokens,
    color: {
      ...base,
      seeds: {
        ...base.seeds,
        ...(opts.accent ? { accent: opts.accent } : {}),
        ...(opts.neutral ? { neutral: opts.neutral } : {}),
      },
    },
  }
}

export interface Generator {
  id: 'image' | 'url' | 'screenshot'
  label: string
  userText: string
  assistantText: string
  mutate: (ds: DesignSystem) => DesignSystem
}

/** Rotating demo results so repeated taps feel generative, not canned. */
export const GENERATORS: Record<Generator['id'], Generator[]> = {
  image: [
    {
      id: 'image',
      label: 'sunset.jpg',
      userText: 'Extract a system from sunset.jpg',
      assistantText:
        'Pulled a warm 5-color palette from your image — coral brand on warm-tinted grays, soft corners.',
      mutate: (ds) =>
        build(ds, { accent: '#fb6f54', neutral: '#8a807c', radius: 1 }),
    },
    {
      id: 'image',
      label: 'forest.png',
      userText: 'Extract a system from forest.png',
      assistantText:
        'Read a cool, organic palette — emerald brand, faintly green-tinted neutrals.',
      mutate: (ds) =>
        build(ds, { accent: '#2f9e64', neutral: '#7c847e', radius: 0.6 }),
    },
  ],
  url: [
    {
      id: 'url',
      label: 'stripe.com',
      userText: 'Match the brand at stripe.com',
      assistantText:
        'Scraped stripe.com — indigo-violet brand, tidy 0.85× corners, default density.',
      mutate: (ds) =>
        build(ds, { accent: '#635bff', radius: 0.85, density: 'default' }),
    },
    {
      id: 'url',
      label: 'vercel.com',
      userText: 'Match the brand at vercel.com',
      assistantText:
        'Scraped vercel.com — monochrome brand, crisp square corners, compact.',
      mutate: (ds) =>
        build(ds, { accent: '#171717', radius: 0.35, density: 'compact' }),
    },
  ],
  screenshot: [
    {
      id: 'screenshot',
      label: 'dribbble shot',
      userText: 'Rebuild the look in this screenshot',
      assistantText:
        'Matched the screenshot — violet brand, generous radius, comfortable spacing.',
      mutate: (ds) =>
        build(ds, { accent: '#7c5cff', radius: 1.4, density: 'comfortable' }),
    },
  ],
}
