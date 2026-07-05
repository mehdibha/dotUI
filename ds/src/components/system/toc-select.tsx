'use client'

import { useEffect, useState } from 'react'
import { useMatch } from '@tanstack/react-router'
import { ChevronDownIcon } from 'lucide-react'
import { Button } from 'react-aria-components/Button'
import { Select } from 'react-aria-components/Select'

import { cn } from '@/lib/utils'
import { SelectContent, SelectItem } from '@/ui/select'

import { getSectionList } from './registry'
import { scrollToSection, useActiveSection } from './toc'
import type { TocItem } from './toc'

/**
 * Small-screen "on this page" control for the header. The header lives above the
 * system page, so it reads the current system from the route match and derives
 * its sections. A Select whose value tracks the section in view.
 */
export function SystemTocSelect({ className }: { className?: string }) {
  const system = useMatch({
    from: '/systems/$slug',
    shouldThrow: false,
    select: (match) => match.loaderData?.system,
  })
  const scrolled = useScrolled()
  const items = system ? getSectionList(system.slug) : []
  // Only surfaces once scrolled — at the top the page title is still in view.
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
  const active = items.find((item) => item.id === activeId) ?? items[0]

  return (
    <Select
      aria-label="On this page"
      selectedKey={activeId}
      onSelectionChange={(key) => scrollToSection(String(key))}
      className={cn('flex', className)}
    >
      <Button className="flex cursor-pointer items-center gap-1 text-sm text-fg-muted transition-colors outline-none hover:text-fg data-pressed:text-fg">
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
