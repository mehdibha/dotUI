'use client'

import { useEffect, useRef, useState } from 'react'
import { SearchIcon, XIcon } from 'lucide-react'
import * as AutocompletePrimitive from 'react-aria-components/Autocomplete'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { Input } from '@/registry/ui/input'
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from '@/registry/ui/list-box'
import { SearchField } from '@/registry/ui/search-field'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

import { getComponentDisplayName, paramComponents } from '../components'
import { SECTIONS } from './schema'

/** A search jump target: a section control or a component's param editors. */
export interface CommandTarget {
  kind: 'control' | 'component'
  sectionId: string
  /** Control id, or component name for `kind: 'component'`. */
  id: string
}

/** Entrance shared by the bar and the suggestions card — they move as one
 * unit. Fast (the search is a frequent gesture) and skipped on reduced motion. */
const REVEAL =
  'motion-safe:animate-[create-search-in_150ms_cubic-bezier(0.165,0.84,0.44,1)]'

/**
 * The panel's inline search — the header's search button expands into a
 * combobox over the header bar, with suggestions anchored below it. Selecting
 * jumps the rail to the owning section and scrolls/flashes the control (the
 * panel owns that behavior via `onJump`).
 *
 * Renders the trigger button in place; the bar and suggestions card position
 * against the header (the nearest positioned ancestor).
 *
 * ⌘P, not ⌘K: the site header's docs search owns ⌘K everywhere, /create included.
 */
export function PanelSearch({
  onJump,
}: {
  onJump: (target: CommandTarget) => void
}) {
  const [isOpen, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const { contains } = AutocompletePrimitive.useFilter({
    sensitivity: 'base',
    ignorePunctuation: true,
  })

  // Global shortcut — ⌘P / Ctrl+P toggles from anywhere on the page.
  // `preventDefault` also suppresses the browser's print dialog; `repeat`
  // keeps a held chord from toggling every key-repeat tick.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return
      if (event.key === 'p' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((open) => !open)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Click/tap anywhere outside dismisses — without stealing focus back.
  useEffect(() => {
    if (!isOpen) return
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    return () =>
      document.removeEventListener('pointerdown', onPointerDown, true)
  }, [isOpen])

  // Keyboard-initiated closes hand focus back to the trigger.
  function close() {
    setOpen(false)
    buttonRef.current?.focus()
  }

  function jump(target: CommandTarget) {
    close()
    onJump(target)
  }

  return (
    <>
      <Tooltip delay={300}>
        <Button
          ref={buttonRef}
          size="sm"
          variant="quiet"
          isIconOnly
          aria-label="Search controls"
          onPress={() => setOpen(true)}
        >
          <SearchIcon />
        </Button>
        <TooltipContent>Search controls ⌘P</TooltipContent>
      </Tooltip>
      {isOpen && (
        <div
          ref={wrapperRef}
          className="contents"
          onKeyDown={(event) => {
            // SearchField preventDefaults Escape while it has text (to clear);
            // an unprevented Escape means the input was already empty — close.
            if (event.key === 'Escape' && !event.defaultPrevented) close()
          }}
          onBlur={(event) => {
            // Tab-away closes; a null relatedTarget (scrollbar clicks) doesn't.
            if (
              event.relatedTarget &&
              !event.currentTarget.contains(event.relatedTarget)
            )
              setOpen(false)
          }}
        >
          <AutocompletePrimitive.Autocomplete filter={contains}>
            {/* The bar — takes over the header while searching. */}
            <div
              className={cn(
                'absolute inset-0 z-10 flex origin-top-right items-center gap-2 rounded-xl bg-neutral px-3',
                REVEAL,
              )}
            >
              <SearchIcon className="size-4 shrink-0 text-fg-muted" />
              <SearchField
                autoFocus
                aria-label="Search controls"
                className="flex min-w-0 flex-1 flex-row items-center gap-1"
              >
                <Input
                  placeholder="Search every control…"
                  className="h-full w-full border-0 bg-transparent px-0 shadow-none focus:ring-0"
                />
                {/* RAC wires this to clear-and-refocus; hidden until there's text. */}
                <Button
                  variant="quiet"
                  size="sm"
                  isIconOnly
                  aria-label="Clear search"
                  className="group-data-empty/search-field:hidden"
                >
                  <XIcon />
                </Button>
              </SearchField>
            </div>
            {/* The suggestions card — same chrome and rhythm as the header. */}
            <div
              className={cn(
                // Solid bg — backdrop-blur can't sample past the header's own
                // backdrop-filter (it bounds the backdrop root), so glass here
                // would just bleed the cards through crisply.
                'absolute inset-x-0 top-full z-10 mt-3 origin-top overflow-hidden rounded-xl border border-border/45 bg-neutral shadow-[0_4px_16px_-4px_rgb(0_0_0/0.2),0_2px_6px_-2px_rgb(0_0_0/0.12)]',
                REVEAL,
              )}
            >
              <ListBox
                aria-label="Controls"
                className="max-h-80 overflow-y-auto p-1"
                renderEmptyState={() => (
                  <div className="px-3 py-6 text-center text-sm text-fg-muted">
                    No matching controls
                  </div>
                )}
              >
                {SECTIONS.map((section) => (
                  <ListBoxSection key={section.id}>
                    <ListBoxSectionHeader>{section.label}</ListBoxSectionHeader>
                    {section.controls.map((control) => (
                      <ListBoxItem
                        key={control.id}
                        id={control.id}
                        textValue={[
                          control.label,
                          section.label,
                          ...(control.keywords ?? []),
                        ].join(' ')}
                        onAction={() =>
                          jump({
                            kind: 'control',
                            sectionId: section.id,
                            id: control.id,
                          })
                        }
                      >
                        <span className="truncate">{control.label}</span>
                      </ListBoxItem>
                    ))}
                  </ListBoxSection>
                ))}
                <ListBoxSection>
                  <ListBoxSectionHeader>Components</ListBoxSectionHeader>
                  {paramComponents.map((comp) => (
                    <ListBoxItem
                      key={comp.name}
                      id={`component-${comp.name}`}
                      textValue={`${getComponentDisplayName(comp.name)} component`}
                      onAction={() =>
                        jump({
                          kind: 'component',
                          sectionId: 'components',
                          id: comp.name,
                        })
                      }
                    >
                      <span className="truncate">
                        {getComponentDisplayName(comp.name)}
                      </span>
                    </ListBoxItem>
                  ))}
                </ListBoxSection>
              </ListBox>
            </div>
          </AutocompletePrimitive.Autocomplete>
        </div>
      )}
    </>
  )
}
