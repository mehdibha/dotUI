import { useEffect } from 'react'

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
import { Command } from '@/registry/ui/command'
import { Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
  ListBoxVirtualizer,
} from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'
import { SearchField } from '@/registry/ui/search-field'
import { Select, SelectTrigger } from '@/registry/ui/select'

import { useDesignSystem } from '../preset'

/** Sentinel key for "heading follows the body font" (no heading token). */
const MATCH_BODY = 'match-body'

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
  const setHeading = (family: string) =>
    setToken(
      FONT_HEADING_VAR,
      family === MATCH_BODY ? undefined : fontStack(family),
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

  return (
    <div className="flex flex-col gap-3">
      <FontPicker
        label="Heading font"
        categories={['sans-serif', 'serif', 'display']}
        selectedKey={headingFamily ?? MATCH_BODY}
        onChange={setHeading}
        matchBodyOption
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

const FontPicker = ({
  label,
  categories,
  selectedKey,
  onChange,
  matchBodyOption = false,
}: {
  label: string
  categories: FontCategory[]
  selectedKey: string
  onChange: (family: string) => void
  matchBodyOption?: boolean
}) => {
  return (
    <Select
      className="w-full"
      selectedKey={selectedKey}
      onSelectionChange={(key) => onChange(key as string)}
    >
      <Label>{label}</Label>
      <SelectTrigger className="w-full" />
      <Popover>
        <Command>
          <SearchField
            aria-label="Search fonts"
            autoFocus
            className="w-full p-2"
          >
            <Input className="w-full" />
          </SearchField>
          <ListBoxVirtualizer
            layoutOptions={{ rowHeight: 32, headingHeight: 24, padding: 4 }}
          >
            <ListBox className="max-h-72 overflow-auto overscroll-contain">
              {matchBodyOption && (
                <ListBoxItem id={MATCH_BODY} textValue="Match body font">
                  Match body font
                </ListBoxItem>
              )}
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
                      <span style={{ fontFamily: fontStack(font.family) }}>
                        {font.family}
                      </span>
                    </ListBoxItem>
                  ))}
                </ListBoxSection>
              ))}
            </ListBox>
          </ListBoxVirtualizer>
        </Command>
      </Popover>
    </Select>
  )
}
