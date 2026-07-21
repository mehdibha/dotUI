import { useEffect } from 'react'
import { SearchIcon, XIcon } from 'lucide-react'

import {
  DEFAULT_BODY_FAMILY,
  DEFAULT_MONO_FAMILY,
  ensureFontPreviewStylesheet,
  ensureFontStylesheets,
  familyFromStack,
  FONT_CATALOG,
  FONT_HEADING_VAR,
  FONT_MONO_VAR,
  FONT_SANS_VAR,
  fontStack,
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
import { useTweak } from '@/dev/tweaker'

import { useDesignSystem } from '../preset'

/** How each font shows in the picker list — its name set in itself, or the
 *  name in the UI font with a separate "Ag" specimen set in the font. */
type OptionDisplay = 'name' | 'ag'

const CATEGORY_LABELS: Record<FontCategory, string> = {
  'sans-serif': 'Sans serif',
  serif: 'Serif',
  display: 'Display',
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

  // Opening the section signals intent to browse fonts: load the subsetted
  // preview faces so every picker item can render its name in itself.
  useEffect(() => {
    ensureFontPreviewStylesheet(document)
  }, [])

  // TWEAK: comparing two ways to preview a font in the option row.
  const optionDisplay = useTweak('Font option preview', {
    type: 'select',
    options: ['name', 'ag'],
    default: 'name',
    group: 'Font picker',
  }) as OptionDisplay

  return (
    <div className="flex flex-col gap-3">
      <FontPicker
        label="Heading font"
        categories={['sans-serif', 'serif', 'display']}
        selectedKey={headingFamily ?? bodyFamily}
        onChange={setHeading}
        optionDisplay={optionDisplay}
      />
      <FontPicker
        label="Body font"
        categories={['sans-serif', 'serif']}
        selectedKey={bodyFamily}
        onChange={setBody}
        optionDisplay={optionDisplay}
      />
      <FontPicker
        label="Mono font"
        categories={['mono']}
        selectedKey={monoFamily}
        onChange={setMono}
        optionDisplay={optionDisplay}
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

const FontPreview = ({
  family,
  display,
}: {
  family: string
  display: OptionDisplay
}) => {
  const stack = fontStack(family)
  if (display === 'ag') {
    return (
      <span className="flex w-full items-center gap-3">
        <span className="flex-1 truncate">{family}</span>
        <span
          style={{ fontFamily: stack }}
          className="shrink-0 text-lg leading-none text-fg-muted"
        >
          Ag
        </span>
      </span>
    )
  }
  return <span style={{ fontFamily: stack }}>{family}</span>
}

const FontPicker = ({
  label,
  categories,
  selectedKey,
  onChange,
  optionDisplay,
}: {
  label: string
  categories: FontCategory[]
  selectedKey: string
  onChange: (family: string) => void
  optionDisplay: OptionDisplay
}) => {
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
              rule so the ListBox itself is the scroll container. Rows use
              `content-visibility:auto` so the browser skips layout/paint — and the
              font download — for off-screen items, keeping ~77 previews cheap. */}
          <ListBox className="max-h-64 overflow-y-auto! overscroll-contain">
            {categories.map((category) => (
              <ListBoxSection key={category}>
                <ListBoxSectionHeader>
                  {CATEGORY_LABELS[category]}
                </ListBoxSectionHeader>
                {FONT_CATALOG.filter((font) => font.category === category).map(
                  (font) => (
                    <ListBoxItem
                      key={font.family}
                      id={font.family}
                      textValue={font.family}
                      className="[contain-intrinsic-size:auto_2rem] [content-visibility:auto]"
                    >
                      <FontPreview
                        family={font.family}
                        display={optionDisplay}
                      />
                    </ListBoxItem>
                  ),
                )}
              </ListBoxSection>
            ))}
          </ListBox>
        </Command>
      </Popover>
    </Select>
  )
}
