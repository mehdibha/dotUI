import { type ComponentProps, useEffect, useState } from 'react'
import { useMatch } from '@tanstack/react-router'
import { ChevronDownIcon } from 'lucide-react'
import { Button } from 'react-aria-components/Button'
import { Select } from 'react-aria-components/Select'

import { cn } from '@/registry/lib/utils'
import { SelectContent, SelectItem } from '@/registry/ui/select'

type TocEntry = { url: string; title: string; depth: number }

/**
 * Small-screen "on this page" control for the header. The header lives above
 * the docs page's TOCProvider, so it reads the toc from route data (exposed by
 * the /docs/$ loader) rather than context. It's a Select whose value tracks the
 * section currently in view; opening it highlights that section.
 */
export function DocsTocSelect({ className }: { className?: string }) {
  const toc = useMatch({
    from: '/_app/docs/$',
    shouldThrow: false,
    select: (match) => match.loaderData?.toc,
  })
  const scrolled = useScrolled()
  // Only surfaces once scrolled — at the top the page title is still in view.
  if (!toc || toc.length === 0 || !scrolled) return null
  return <TocSelect toc={toc} className={className} />
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
  toc,
  className,
}: {
  toc: TocEntry[]
  className?: string
}) {
  const activeId = useActiveSection(toc)
  const activeIndex = toc.findIndex((item) => item.url === activeId)
  const active = toc[activeIndex] ?? toc[0]
  const progress = toc.length > 0 ? (activeIndex + 1) / toc.length : 0

  return (
    <Select
      aria-label="On this page"
      selectedKey={activeId}
      onSelectionChange={(key) => scrollToSection(String(key))}
      className={cn('flex', className)}
    >
      <Button className="flex items-center gap-1.5 text-sm text-fg-muted transition-colors outline-none hover:text-fg data-pressed:text-fg">
        <ProgressCircle value={progress} className="shrink-0" />
        <span className="max-w-36 truncate">{active?.title ?? ''}</span>
        <ChevronDownIcon className="size-4 shrink-0" />
      </Button>
      <SelectContent
        placement="bottom start"
        className="max-h-[60svh] min-w-56"
      >
        {toc.map((item) => (
          <SelectItem
            key={item.url}
            id={item.url}
            textValue={item.title}
            className={cn(
              item.depth === 3 && 'pl-6',
              item.depth >= 4 && 'pl-9',
            )}
          >
            {item.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/**
 * A ring that fills as you move down the page — one heading's worth per step,
 * smoothed by the dash-offset transition. Borrowed from fumadocs' mobile TOC.
 */
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

function scrollToSection(url: string) {
  const el = document.getElementById(url.replace(/^#/, ''))
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  history.replaceState(null, '', url)
}

/** Tracks which heading is currently in view (the last one scrolled past the header). */
function useActiveSection(toc: TocEntry[]) {
  const [activeId, setActiveId] = useState(() => toc[0]?.url ?? '')

  useEffect(() => {
    const ids = toc.map((item) => item.url)
    const offset = 100 // header height + a little breathing room

    const compute = () => {
      let index = 0
      for (let i = 0; i < ids.length; i++) {
        const url = ids[i]
        if (!url) continue
        const el = document.getElementById(url.replace(/^#/, ''))
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
  }, [toc])

  return activeId
}
