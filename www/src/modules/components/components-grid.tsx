'use client'

import { ComponentCard } from './component-card'
import { componentsData } from './components-data'

// Categories with large components (calendars, tables, cards, color pickers,
// the command palette) get a taller card so those components can scale down
// into it while staying legible. Everything else uses the default height.
const CATEGORY_PREVIEW_HEIGHT: Record<string, string> = {
  dates: 'h-64',
  navigation: 'h-64',
  'data-display': 'h-64',
  colors: 'h-64',
  // Overlay scenes (and the pickers' dropdowns) need room for the opened surface.
  overlays: 'h-64',
  pickers: 'h-64',
}

/**
 * Renders the component previews for a single category, identified by its slug
 * (see components-data.ts). The category heading lives in the /components page
 * so it can anchor the sticky category navigation.
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
    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
      {data.components.map((component) => (
        <ComponentCard
          key={component.slug}
          name={component.name}
          slug={component.slug}
          href={component.href}
          scale={component.scale}
          fill={component.fill}
          stretch={component.stretch}
          cursor={component.cursor}
          previewClassName={CATEGORY_PREVIEW_HEIGHT[category]}
        />
      ))}
    </div>
  )
}
