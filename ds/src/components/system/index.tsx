'use client'

import { useEffect, useState } from 'react'

import type { RosterEntry, SystemWithColors } from '@/data/schema'

import { SystemNav } from './nav'
import { ALL_SECTIONS, SECTION_GROUPS } from './registry'

/** Highlights the section whose top has scrolled nearest the viewport top. */
function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? '')
  const key = ids.join('|')

  useEffect(() => {
    const onScroll = () => {
      let current = ids[0] ?? ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 160) current = id
      }
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4
      if (atBottom) current = ids[ids.length - 1] ?? current
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return [active, setActive] as const
}

export function Spectrum2Explorer({
  system,
  rosterEntry,
}: {
  system: SystemWithColors
  rosterEntry?: RosterEntry
}) {
  const ids = ALL_SECTIONS.map((section) => section.id)
  const [active, setActive] = useScrollSpy(ids)

  const goTo = (id: string) => {
    setActive(id)
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pt-8 pb-28">
      <div className="lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
        <aside className="lg:h-fit">
          <SystemNav groups={SECTION_GROUPS} active={active} onSelect={goTo} />
        </aside>
        <div className="min-w-0">
          {SECTION_GROUPS.map((group) => (
            <div
              key={group.id}
              className={group.id === 'overview' ? '' : 'mt-20 border-t pt-12'}
            >
              {group.id !== 'overview' && (
                <header className="mb-12 max-w-2xl">
                  <h2 className="font-mono text-xs tracking-[0.2em] text-fg-muted uppercase">
                    {group.label}
                  </h2>
                  <p className="mt-2 text-lg text-balance text-fg">
                    {group.blurb}
                  </p>
                </header>
              )}
              <div className="flex flex-col gap-16">
                {group.sections.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-24"
                  >
                    <section.Component
                      system={system}
                      rosterEntry={rosterEntry}
                    />
                  </section>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
