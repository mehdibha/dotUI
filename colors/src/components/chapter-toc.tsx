'use client'

import { type ComponentProps, useEffect, useState } from 'react'
import { useMatch } from '@tanstack/react-router'
import { ChevronDownIcon } from 'lucide-react'
import { Button } from 'react-aria-components/Button'
import { Select } from 'react-aria-components/Select'

import { cn } from '@/lib/utils'
import { SelectContent, SelectItem } from '@/ui/select'

export type TocItem = { id: string; label: string; depth: number }

/** Serialized heading from the route loader (`#id`, flattened title, depth). */
export type SerializedTocItem = { url: string; title: string; depth: number }

export function toTocItems(items: SerializedTocItem[]): TocItem[] {
  return items.map((item) => ({
    id: item.url.replace(/^#/, ''),
    label: item.title,
    depth: item.depth,
  }))
}

/** Tracks which heading is currently in view (the last one scrolled past the header). */
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
 * centered content. Full list when the gutter is wide, a compact stack of
 * "lines" (with a hover/focus panel) when it isn't. Below lg the header
 * dropdown takes over.
 */
export function ChapterDesktopToc({
  items,
  className,
}: {
  items: TocItem[]
  className?: string
}) {
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
              item.depth > 2 && 'pl-3',
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
                  item.depth > 2 && 'pl-4',
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

/**
 * Small-screen "on this page" control for the header. Reads the current
 * chapter's headings from the route match and renders null everywhere else.
 */
export function ChapterTocSelect({ className }: { className?: string }) {
  const toc = useMatch({
    from: '/$slug',
    shouldThrow: false,
    select: (match) => match.loaderData?.toc,
  })
  const scrolled = useScrolled()
  const items = toc ? toTocItems(toc) : []
  if (items.length === 0 || !scrolled) return null
  return <TocSelect items={items} className={className} />
}

function useScrolled() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return scrolled
}

function TocSelect({
  items,
  className,
}: {
  items: TocItem[]
  className?: string
}) {
  const activeId = useActiveSection(items)
  const activeIndex = items.findIndex((item) => item.id === activeId)
  const active = items[activeIndex] ?? items[0]
  const progress = items.length > 0 ? (activeIndex + 1) / items.length : 0

  return (
    <Select
      aria-label="On this page"
      selectedKey={activeId}
      onSelectionChange={(key) => scrollToSection(String(key))}
      className={cn('flex', className)}
    >
      <Button className="flex cursor-pointer items-center gap-1.5 text-sm text-fg-muted transition-colors outline-none hover:text-fg data-pressed:text-fg">
        <ProgressCircle value={progress} className="shrink-0" />
        <span className="max-w-36 truncate">{active?.label ?? ''}</span>
        <ChevronDownIcon className="size-4 shrink-0" />
      </Button>
      <SelectContent
        placement="bottom start"
        className="max-h-[60svh] min-w-56"
      >
        {items.map((item) => (
          <SelectItem key={item.id} id={item.id} textValue={item.label}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/** A ring that fills as you move down the page — one heading's worth per step. */
function ProgressCircle({
  value,
  className,
  ...props
}: ComponentProps<'svg'> & { value: number }) {
  const size = 16
  const strokeWidth = 2
  const radius = size / 2 - strokeWidth
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(1, Math.max(0, value)) * circumference
  const circle = {
    cx: size / 2,
    cy: size / 2,
    r: radius,
    fill: 'none',
    strokeWidth,
  }

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden
      className={cn('size-4', className)}
      {...props}
    >
      <circle {...circle} className="stroke-current/20" />
      <circle
        {...circle}
        stroke="currentColor"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="transition-[stroke-dashoffset] duration-300 ease-out"
      />
    </svg>
  )
}
