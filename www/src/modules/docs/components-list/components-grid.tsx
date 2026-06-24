'use client'

import { ComponentCard } from './component-card'
import { componentsData } from './components-data'

// Categories with large components (calendars, tables, cards, color pickers,
// the command palette) get a taller card so those components can scale down
// into it while staying legible. Everything else uses the default height.
const CATEGORY_PREVIEW_HEIGHT: Record<string, string> = {
  dates: 'h-52',
  navigation: 'h-52',
  'data-display': 'h-52',
  colors: 'h-52',
  charts: 'h-72',
}

/**
 * Renders the component previews for a single category, identified by its slug
 * (see components-data.ts). The category heading itself lives in the MDX so it
 * feeds the page's table of contents like any other docs heading.
 */
export function ComponentsGrid({ category }: { category: string }) {
  const data = componentsData.find((c) => c.slug === category)

  if (!data) {
    if (import.meta.env.DEV) {
      console.warn(
        `<ComponentsGrid category="${category}" /> — no matching category in components-data.ts`,
      )
    }
    return null
  }

  return (
    <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
      {data.components.map((component) => (
        <ComponentCard
          key={component.slug}
          name={component.name}
          slug={component.slug}
          href={component.href}
          scale={component.scale}
          fill={component.fill}
          stretch={component.stretch}
          previewClassName={CATEGORY_PREVIEW_HEIGHT[category]}
        />
      ))}
    </div>
  )
}
