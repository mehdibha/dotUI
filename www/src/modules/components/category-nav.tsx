'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/registry/lib/utils'

/**
 * Sticky pill row of category anchor links — the page's table of contents.
 * Tracks the section currently under the header (the last one whose top has
 * scrolled past it) and highlights its pill.
 */
export function CategoryNav({
  categories,
  className,
}: {
  categories: { title: string; slug: string }[]
  className?: string
}) {
  const [active, setActive] = useState(categories[0]?.slug)

  useEffect(() => {
    const sections = categories
      .map(({ slug }) => document.getElementById(slug))
      .filter((el) => el !== null)

    const update = () => {
      // The sections' scroll-mt aligns their top just below this bar, so a
      // section is "current" once its top crosses ~1/3 of the viewport.
      const threshold = window.innerHeight / 3
      let current = sections[0]
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= threshold) current = section
      }
      if (current) setActive(current.id)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [categories])

  return (
    <div
      className={cn(
        'sticky top-(--header-height) z-20 border-b bg-bg/85 backdrop-blur-md',
        className,
      )}
    >
      <nav aria-label="Component categories" className="container">
        <div className="mx-auto no-scrollbar flex max-w-6xl gap-1 overflow-x-auto py-2.5">
          {categories.map(({ title, slug }) => (
            <a
              key={slug}
              href={`#${slug}`}
              aria-current={active === slug ? 'true' : undefined}
              className={cn(
                'shrink-0 rounded-full px-3 py-1.5 text-sm whitespace-nowrap transition-colors',
                active === slug
                  ? 'bg-muted text-fg'
                  : 'text-fg-muted hover:text-fg',
              )}
            >
              {title}
            </a>
          ))}
        </div>
      </nav>
    </div>
  )
}
