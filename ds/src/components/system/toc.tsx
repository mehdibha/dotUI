'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import { getSectionList } from './registry'

export type TocItem = { id: string; label: string }

/** Tracks which section is currently in view (the last one scrolled past the header). */
export function useActiveSection(items: TocItem[]) {
  const [activeId, setActiveId] = useState(() => items[0]?.id ?? '')

  useEffect(() => {
    const ids = items.map((item) => item.id)
    const offset = 100

    const compute = () => {
      let index = 0
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i]
        if (!id) continue
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= offset) index = i
        else break
      }
      const nextId = ids[index]
      if (nextId) setActiveId(nextId)
    }

    compute()
    window.addEventListener('scroll', compute, { passive: true })
    window.addEventListener('resize', compute)
    return () => {
      window.removeEventListener('scroll', compute)
      window.removeEventListener('resize', compute)
    }
  }, [items])

  return activeId
}

export function scrollToSection(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/**
 * In-page TOC for the left gutter — floats out of flow so it never shifts the
 * centered content. Two representations: the full list when the gutter is wide
 * enough, and a compact stack of "lines" (with a hover/focus panel) when it
 * isn't. Below lg the header dropdown takes over.
 */
export function SystemDesktopToc({
  slug,
  className,
}: {
  slug: string
  className?: string
}) {
  const items = getSectionList(slug)
  const active = useActiveSection(items)
  if (items.length === 0) return null

  return (
    <div className={className}>
      {/* Full list — wide gutters only. */}
      <nav
        aria-label="On this page"
        className="hidden w-32 flex-col min-[1300px]:flex"
      >
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => scrollToSection(item.id)}
            aria-current={active === item.id ? 'true' : undefined}
            className={cn(
              'cursor-pointer py-1 text-left text-[0.8rem] text-fg-muted transition-colors first:pt-0 last:pb-0 hover:text-fg',
              active === item.id && 'text-fg',
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Lines — narrow gutters (lg to 1300). */}
      <div className="group relative min-[1300px]:hidden">
        <div className="flex flex-col items-start">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              aria-label={item.label}
              aria-current={active === item.id ? 'true' : undefined}
              className="flex h-3.5 cursor-pointer items-center"
            >
              <span
                className={cn(
                  'h-0.5 w-5 rounded-full bg-border transition-all',
                  active === item.id && 'w-6 bg-fg',
                )}
              />
            </button>
          ))}
        </div>
        <div className="invisible absolute top-0 left-full origin-top-left scale-95 pl-2.5 opacity-0 transition-[opacity,scale,visibility] duration-150 ease-out group-focus-within:visible group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:visible group-hover:scale-100 group-hover:opacity-100">
          <nav
            aria-label="On this page"
            className="flex max-h-[70svh] w-56 scrollbar-none flex-col overflow-auto rounded-xl border bg-popover p-2 text-sm shadow-md"
          >
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                aria-current={active === item.id ? 'true' : undefined}
                className={cn(
                  'cursor-pointer rounded-md px-2 py-1 text-left text-[0.8rem] text-fg-muted transition-colors hover:bg-muted hover:text-fg',
                  active === item.id && 'text-fg',
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
