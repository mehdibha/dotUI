'use client'

import { cn } from '@/lib/utils'

import type { SectionGroup } from './registry'

function NavList({
  groups,
  active,
  onSelect,
}: {
  groups: SectionGroup[]
  active: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="flex flex-col gap-5">
      {groups.map((group) => (
        <div key={group.id}>
          <p className="mb-2 font-mono text-[10px] font-medium tracking-wider text-fg-muted uppercase">
            {group.label}
          </p>
          <ul className="flex flex-col gap-1 border-l pl-3">
            {group.sections.map((section) => (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => onSelect(section.id)}
                  aria-current={active === section.id ? 'true' : undefined}
                  className={cn(
                    'block w-full cursor-pointer text-left text-[13px] leading-tight text-fg-muted transition-colors hover:text-fg',
                    active === section.id && 'font-medium text-fg',
                  )}
                >
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export function SystemNav({
  groups,
  active,
  onSelect,
}: {
  groups: SectionGroup[]
  active: string
  onSelect: (id: string) => void
}) {
  return (
    <>
      <details className="mb-8 rounded-xl border lg:hidden">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium">
          On this page
        </summary>
        <div className="border-t px-4 py-4">
          <NavList groups={groups} active={active} onSelect={onSelect} />
        </div>
      </details>
      <nav
        aria-label="Sections"
        className="hidden lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto"
      >
        <NavList groups={groups} active={active} onSelect={onSelect} />
      </nav>
    </>
  )
}
