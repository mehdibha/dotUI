"use client"

import { DemoPreset } from "../demo-preset"
import { PreviewVeil } from "../preview-controls"
import { ComponentCard } from "./component-card"
import { componentsData } from "./components-data"

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
    <DemoPreset>
      <div className="relative mt-6 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
        <PreviewVeil />
        {data.components.map((component) => (
          <ComponentCard
            key={component.slug}
            name={component.name}
            slug={component.slug}
            href={component.href}
            scale={component.scale}
            fill={component.fill}
            stretch={component.stretch}
          />
        ))}
      </div>
    </DemoPreset>
  )
}
