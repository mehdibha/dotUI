import { useCallback, useEffect, useRef } from 'react'
import { SearchIcon, XIcon } from 'lucide-react'

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
import { Label } from '@/registry/ui/field'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'
import { SearchField } from '@/registry/ui/search-field'
import { Select, SelectTrigger } from '@/registry/ui/select'

import { useDesignSystem } from '../preset'

const CATEGORY_LABELS: Record<FontCategory, string> = {
  'sans-serif': 'Sans serif',
  serif: 'Serif',
  display: 'Display',
  handwriting: 'Handwriting',
  mono: 'Monospace',
}

/** Load families into THIS document (the panel page, not the preview iframe). */
function useLoadedFamilies(families: (string | null)[]) {
  const key = families.filter(Boolean).join('\n')
  useEffect(() => {
    if (key) ensureFontStylesheets(document, key.split('\n'))
  }, [key])
}

function useTypography() {
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

export function TypographyConfig() {
  const {
    bodyFamily,
    headingFamily,
    monoFamily,
    setBody,
    setHeading,
    setMono,
  } = useTypography()

  return (
    <div className="flex flex-col gap-3">
      <FontPicker
        label="Heading font"
        categories={['sans-serif', 'serif', 'display', 'handwriting']}
        selectedKey={headingFamily ?? bodyFamily}
        onChange={setHeading}
      />
      <FontPicker
        label="Body font"
        categories={['sans-serif', 'serif']}
        selectedKey={bodyFamily}
        onChange={setBody}
      />
      <FontPicker
        label="Mono font"
        categories={['mono']}
        selectedKey={monoFamily}
        onChange={setMono}
      />
    </div>
  )
}

/** The customizer home tile — the selected families, rendered in themselves. */
export function TypographySummary() {
  const { bodyFamily, headingFamily, monoFamily } = useTypography()
  const effectiveHeading = headingFamily ?? bodyFamily
  useLoadedFamilies([effectiveHeading, bodyFamily, monoFamily])

  const rows = [
    { label: 'Heading', family: effectiveHeading, sampleClass: 'text-2xl' },
    { label: 'Body', family: bodyFamily, sampleClass: 'text-base' },
    { label: 'Mono', family: monoFamily, sampleClass: 'text-base' },
  ]

  return (
    <div className="flex flex-col gap-1.5">
      {rows.map(({ label, family, sampleClass }) => (
        <div key={label} className="flex items-center justify-between">
          <div className="flex flex-col items-start gap-1">
            <span className="text-[10px] tracking-widest text-fg-muted uppercase">
              {label}
            </span>
            <p className="font-medium">{family}</p>
          </div>
          <p
            className={`${sampleClass} leading-none tracking-tight`}
            style={{ fontFamily: fontStack(family) }}
          >
            Ag
          </p>
        </div>
      ))}
    </div>
  )
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

const FontPicker = ({
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
  return (
    <Select
      className="w-full"
      selectedKey={selectedKey}
      onSelectionChange={(key) => onChange(key as string)}
    >
      <Label>{label}</Label>
      <SelectTrigger className="w-full" />
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
