import { useCallback, useEffect, useRef } from 'react'
import { ChevronDownIcon, SearchIcon, XIcon } from 'lucide-react'

import {
  DEFAULT_BODY_FAMILY,
  DEFAULT_MONO_FAMILY,
  ensureFontStylesheets,
  familyFromStack,
  FONT_CATALOG,
  FONT_HEADING_VAR,
  FONT_MONO_VAR,
  FONT_SANS_VAR,
  fontStack,
  loadFontPreview,
} from '@/lib/fonts'
import type { FontCategory } from '@/lib/fonts'
import { Button } from '@/registry/ui/button'
import { Command } from '@/registry/ui/command'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'
import { SearchField } from '@/registry/ui/search-field'
import { Select, SelectValue } from '@/registry/ui/select'

import { useDesignSystem } from '../preset'

const CATEGORY_LABELS: Record<FontCategory, string> = {
  'sans-serif': 'Sans serif',
  serif: 'Serif',
  display: 'Display',
  handwriting: 'Handwriting',
  mono: 'Monospace',
}

/** Load families into THIS document (the panel page, not the preview iframe). */
export function useLoadedFamilies(families: (string | null)[]) {
  const key = families.filter(Boolean).join('\n')
  useEffect(() => {
    if (key) ensureFontStylesheets(document, key.split('\n'))
  }, [key])
}

export function useTypography() {
  const { designSystem, setToken } = useDesignSystem()
  const { tokens } = designSystem

  const bodyFamily = tokens[FONT_SANS_VAR]
    ? familyFromStack(tokens[FONT_SANS_VAR])
    : DEFAULT_BODY_FAMILY
  const headingFamily = tokens[FONT_HEADING_VAR]
    ? familyFromStack(tokens[FONT_HEADING_VAR])
    : null
  const monoFamily = tokens[FONT_MONO_VAR]
    ? familyFromStack(tokens[FONT_MONO_VAR])
    : DEFAULT_MONO_FAMILY

  // Picking the theme default clears the token so the state stays minimal.
  const setBody = (family: string) =>
    setToken(
      FONT_SANS_VAR,
      family === DEFAULT_BODY_FAMILY ? undefined : fontStack(family),
    )
  // With no heading token the heading follows the body font, so picking the
  // body family here clears the token rather than pinning a redundant value.
  const setHeading = (family: string) =>
    setToken(
      FONT_HEADING_VAR,
      family === bodyFamily ? undefined : fontStack(family),
    )
  const setMono = (family: string) =>
    setToken(
      FONT_MONO_VAR,
      family === DEFAULT_MONO_FAMILY ? undefined : fontStack(family),
    )

  return { bodyFamily, headingFamily, monoFamily, setBody, setHeading, setMono }
}

/**
 * Lazily loads each font's preview face as its row nears the listbox viewport —
 * a ~500-font list fetches only the handful actually seen instead of every face
 * up front. Driven by scroll position (rows carry `data-preview-family`); the
 * callback ref wires it when the popover's ListBox mounts and tears it down on
 * unmount. `loadFontPreview` is idempotent, so re-scanning on scroll is cheap.
 */
function useLazyFontPreviews() {
  const cleanupRef = useRef<(() => void) | null>(null)

  return useCallback((wrapper: HTMLElement | null) => {
    cleanupRef.current?.()
    cleanupRef.current = null
    // The registry ListBox doesn't forward a ref, so reach the scroll container
    // through a `display:contents` wrapper.
    const root = wrapper?.querySelector<HTMLElement>('[role="listbox"]')
    if (!root) return

    const loadVisible = () => {
      const box = root.getBoundingClientRect()
      for (const el of root.querySelectorAll<HTMLElement>(
        '[data-preview-family]',
      )) {
        const r = el.getBoundingClientRect()
        if (r.top > box.bottom + 200) break // rows below the window; stop
        if (r.bottom >= box.top - 200 && el.dataset.previewFamily) {
          loadFontPreview(document, el.dataset.previewFamily)
        }
      }
    }

    let timer: ReturnType<typeof setTimeout> | undefined
    const schedule = () => {
      if (timer) return
      timer = setTimeout(() => {
        timer = undefined
        loadVisible()
      }, 100)
    }
    loadVisible()
    root.addEventListener('scroll', schedule, { passive: true })
    // Filtering rewrites the rows, changing what's at the top; rescan then too.
    const mo = new MutationObserver(schedule)
    mo.observe(root, { childList: true, subtree: true })
    cleanupRef.current = () => {
      root.removeEventListener('scroll', schedule)
      mo.disconnect()
      clearTimeout(timer)
    }
  }, [])
}

/**
 * A searchable font select whose label lives inside the trigger and whose
 * value renders in its own typeface — the control doubles as the specimen.
 */
export const FontPicker = ({
  label,
  categories,
  selectedKey,
  onChange,
}: {
  label: string
  categories: FontCategory[]
  selectedKey: string
  onChange: (family: string) => void
}) => {
  const listRef = useLazyFontPreviews()
  useLoadedFamilies([selectedKey])
  return (
    <Select
      className="w-full"
      selectedKey={selectedKey}
      onSelectionChange={(key) => onChange(key as string)}
      aria-label={label}
    >
      <Button
        size="sm"
        className="h-auto w-full justify-start gap-2 py-1.5 pl-2.5"
      >
        <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
          <span className="text-xs font-normal text-fg-muted">{label}</span>
          <SelectValue
            className="w-full truncate text-left"
            style={{ fontFamily: fontStack(selectedKey) }}
          />
        </div>
        <ChevronDownIcon data-icon-end="" className="text-fg-muted" />
      </Button>
      <Popover className="w-(--trigger-width) outline-hidden">
        <Command>
          <SearchField autoFocus aria-label="Search fonts">
            <InputGroup>
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <Input placeholder="Search fonts..." />
              <InputGroupAddon className="[--addon-button-inset:--spacing(1.5)]">
                <Button variant="quiet" isIconOnly>
                  <XIcon aria-hidden="true" />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </SearchField>
          {/* `overflow-y-auto!` beats the Command's `**:data-listbox:overflow-visible`
              rule so the ListBox is the scroll container the observer watches.
              The `display:contents` wrapper only exists to give the observer a
              handle on that listbox (the ListBox itself forwards no ref). */}
          <div ref={listRef} className="contents">
            <ListBox className="max-h-64 overflow-y-auto! overscroll-contain">
              {categories.map((category) => (
                <ListBoxSection key={category}>
                  <ListBoxSectionHeader>
                    {CATEGORY_LABELS[category]}
                  </ListBoxSectionHeader>
                  {FONT_CATALOG.filter(
                    (font) => font.category === category,
                  ).map((font) => (
                    <ListBoxItem
                      key={font.family}
                      id={font.family}
                      textValue={font.family}
                    >
                      <span
                        data-preview-family={font.family}
                        style={{ fontFamily: fontStack(font.family) }}
                      >
                        {font.family}
                      </span>
                    </ListBoxItem>
                  ))}
                </ListBoxSection>
              ))}
            </ListBox>
          </div>
        </Command>
      </Popover>
    </Select>
  )
}
