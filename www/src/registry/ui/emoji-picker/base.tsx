'use client'

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type React from 'react'
import * as AutocompletePrimitive from 'react-aria-components/Autocomplete'
import { Collection } from 'react-aria-components/Collection'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'

import {
  GridList,
  GridListItem,
  GridListSection,
  GridListSectionHeader,
} from '@/registry/ui/grid-list'
import type { GridListProps } from '@/registry/ui/grid-list'
import { Loader } from '@/registry/ui/loader'
import { SearchField } from '@/registry/ui/search-field'
import type { SearchFieldProps } from '@/registry/ui/search-field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/registry/ui/select'
import type { SelectProps } from '@/registry/ui/select'

import { useStyles } from './styles'

// MARK: Data

type EmojiSkinTone =
  | 'none'
  | 'light'
  | 'medium-light'
  | 'medium'
  | 'medium-dark'
  | 'dark'

interface Emoji {
  /** The emoji character, with the active skin tone applied. */
  emoji: string
  /** The emoji's display name, e.g. "grinning face". */
  label: string
  /** The emoji's unicode hexcode, stable across skin tones. */
  hexcode: string
}

interface EmojiItem extends Emoji {
  tags: string[]
  skins?: Partial<Record<Exclude<EmojiSkinTone, 'none'>, string>>
}

interface EmojiGroup {
  key: string
  label: string
  emojis: EmojiItem[]
}

const EMOJIBASE_URL = 'https://cdn.jsdelivr.net/npm/emojibase-data@17.0.0/en'
const SKIN_TONE_KEYS = [
  'light',
  'medium-light',
  'medium',
  'medium-dark',
  'dark',
] as const
// Fitzpatrick modifier codepoints, in SKIN_TONE_KEYS order.
const TONE_HEXCODES = ['1F3FB', '1F3FC', '1F3FD', '1F3FE', '1F3FF']

interface CompactEmoji {
  group?: number
  hexcode: string
  label: string
  unicode: string
  tags?: string[]
  skins?: CompactEmoji[]
}

function toEmojiItem(raw: CompactEmoji): EmojiItem {
  const item: EmojiItem = {
    emoji: raw.unicode,
    label: raw.label,
    hexcode: raw.hexcode,
    tags: raw.tags ?? [],
  }
  for (const skin of raw.skins ?? []) {
    // Multi-person emojis mix tones (🤝 light + dark); only uniform skins apply.
    const tones = new Set(
      skin.hexcode.split('-').filter((cp) => TONE_HEXCODES.includes(cp)),
    )
    if (tones.size !== 1) continue
    const key = SKIN_TONE_KEYS[TONE_HEXCODES.indexOf([...tones][0]!)]
    if (!key) continue
    item.skins ??= {}
    item.skins[key] = skin.unicode
  }
  return item
}

let emojiGroupsCache: EmojiGroup[] | null = null
let emojiGroupsPromise: Promise<EmojiGroup[]> | null = null

function loadEmojiGroups(): Promise<EmojiGroup[]> {
  emojiGroupsPromise ??= Promise.all([
    fetch(`${EMOJIBASE_URL}/compact.json`).then((res) => res.json()),
    fetch(`${EMOJIBASE_URL}/messages.json`).then((res) => res.json()),
  ]).then(
    ([emojis, messages]: [
      CompactEmoji[],
      { groups: { key: string; message: string; order: number }[] },
    ]) => {
      const groups = new Map<number, EmojiGroup>(
        messages.groups
          .filter((group) => group.key !== 'component')
          .map((group) => [
            group.order,
            {
              key: group.key,
              label:
                group.message.charAt(0).toUpperCase() + group.message.slice(1),
              emojis: [],
            },
          ]),
      )
      for (const raw of emojis) {
        if (raw.group === undefined) continue
        groups.get(raw.group)?.emojis.push(toEmojiItem(raw))
      }
      emojiGroupsCache = [...groups.values()].filter(
        (group) => group.emojis.length > 0,
      )
      return emojiGroupsCache
    },
  )
  return emojiGroupsPromise
}

function useEmojiGroups() {
  const [groups, setGroups] = useState(emojiGroupsCache)
  const [error, setError] = useState(false)
  useEffect(() => {
    if (groups) return
    let cancelled = false
    loadEmojiGroups()
      .then((data) => !cancelled && setGroups(data))
      .catch(() => !cancelled && setError(true))
    return () => {
      cancelled = true
    }
  }, [groups])
  return { groups, error }
}

function applySkinTone(emoji: EmojiItem, skinTone: EmojiSkinTone): string {
  if (skinTone === 'none') return emoji.emoji
  return emoji.skins?.[skinTone] ?? emoji.emoji
}

// MARK: Separator

interface EmojiPickerContextValue {
  skinTone: EmojiSkinTone
  setSkinTone: (skinTone: EmojiSkinTone) => void
  setActiveEmoji: (emoji: Emoji | null) => void
  onEmojiSelect?: (emoji: Emoji) => void
}

const EmojiPickerContext = createContext<EmojiPickerContextValue | null>(null)
// Held separately so hovering an emoji only re-renders the footer, not every cell.
const ActiveEmojiContext = createContext<Emoji | null>(null)

function useEmojiPickerContext() {
  const context = use(EmojiPickerContext)
  if (!context) {
    throw new Error('EmojiPicker parts must be used within an <EmojiPicker>.')
  }
  return context
}

// MARK: Separator

interface EmojiPickerProps extends Omit<
  React.ComponentProps<'div'>,
  'onSelect'
> {
  /** Handler called when the user picks an emoji. */
  onEmojiSelect?: (emoji: Emoji) => void
  /** The active skin tone (controlled). */
  skinTone?: EmojiSkinTone
  /** The initial skin tone (uncontrolled). */
  defaultSkinTone?: EmojiSkinTone
  /** Handler called when the active skin tone changes. */
  onSkinToneChange?: (skinTone: EmojiSkinTone) => void
}

const EmojiPicker = ({
  className,
  onEmojiSelect,
  skinTone: skinToneProp,
  defaultSkinTone = 'none',
  onSkinToneChange,
  ...props
}: EmojiPickerProps) => {
  const { root } = useStyles()()
  const [internalSkinTone, setInternalSkinTone] = useState(defaultSkinTone)
  const [activeEmoji, setActiveEmoji] = useState<Emoji | null>(null)
  const skinTone = skinToneProp ?? internalSkinTone

  const setSkinTone = useCallback(
    (nextSkinTone: EmojiSkinTone) => {
      setInternalSkinTone(nextSkinTone)
      onSkinToneChange?.(nextSkinTone)
    },
    [onSkinToneChange],
  )

  const context = useMemo(
    () => ({ skinTone, setSkinTone, setActiveEmoji, onEmojiSelect }),
    [skinTone, setSkinTone, onEmojiSelect],
  )

  const { contains } = AutocompletePrimitive.useFilter({ sensitivity: 'base' })
  const filter = useCallback<
    NonNullable<AutocompletePrimitive.AutocompleteProps<EmojiItem>['filter']>
  >(
    (textValue, inputValue, node) => {
      const emoji = node.value as EmojiItem | null
      // Every word must match the label or a keyword ("heart eyes" → 😍).
      return inputValue
        .trim()
        .split(/\s+/)
        .every(
          (term) =>
            contains(textValue, term) ||
            !!emoji?.tags.some((tag) => contains(tag, term)),
        )
    },
    [contains],
  )

  return (
    <EmojiPickerContext value={context}>
      <ActiveEmojiContext value={activeEmoji}>
        <AutocompletePrimitive.Autocomplete filter={filter}>
          <div
            data-emoji-picker=""
            className={root({ className })}
            {...props}
          />
        </AutocompletePrimitive.Autocomplete>
      </ActiveEmojiContext>
    </EmojiPickerContext>
  )
}

// MARK: Separator

interface EmojiPickerSearchProps extends SearchFieldProps {}

const EmojiPickerSearch = ({
  className,
  placeholder = 'Search emojis',
  ...props
}: EmojiPickerSearchProps) => {
  const { search } = useStyles()()
  return (
    <SearchField
      data-emoji-picker-search=""
      aria-label="Search emojis"
      placeholder={placeholder}
      className={composeRenderProps(className, (cn) =>
        search({ className: cn }),
      )}
      {...props}
    />
  )
}

// MARK: Separator

interface EmojiPickerContentProps extends Omit<
  GridListProps<EmojiItem>,
  'children' | 'items' | 'layout'
> {}

const EmojiPickerContent = ({
  className,
  ...props
}: EmojiPickerContentProps) => {
  const { content, placeholder, sectionHeader } = useStyles()()
  const { groups, error } = useEmojiGroups()

  if (!groups) {
    return (
      <div data-emoji-picker-content="" className={placeholder()}>
        {error ? (
          'Failed to load emojis.'
        ) : (
          <Loader aria-label="Loading emojis" />
        )}
      </div>
    )
  }

  return (
    <GridList
      data-emoji-picker-content=""
      aria-label="Emojis"
      layout="grid"
      renderEmptyState={() => 'No emoji found.'}
      className={composeRenderProps(className, (cn) =>
        content({ className: cn }),
      )}
      {...props}
    >
      {groups.map((group) => (
        <GridListSection key={group.key} id={group.key}>
          <GridListSectionHeader className={sectionHeader()}>
            {group.label}
          </GridListSectionHeader>
          <Collection items={group.emojis}>
            {(emoji) => <EmojiPickerCell emoji={emoji} />}
          </Collection>
        </GridListSection>
      ))}
    </GridList>
  )
}

// MARK: Separator

const EmojiPickerCell = ({ emoji }: { emoji: EmojiItem }) => {
  const { cell } = useStyles()()
  const { skinTone, onEmojiSelect } = useEmojiPickerContext()
  const char = applySkinTone(emoji, skinTone)

  return (
    <GridListItem
      id={emoji.hexcode}
      textValue={emoji.label}
      className={cell()}
      onAction={() =>
        onEmojiSelect?.({
          emoji: char,
          label: emoji.label,
          hexcode: emoji.hexcode,
        })
      }
    >
      {({ isHovered, isFocused }) => (
        <>
          <ActiveEmojiReporter
            char={char}
            label={emoji.label}
            hexcode={emoji.hexcode}
            isActive={isHovered || isFocused}
          />
          {char}
        </>
      )}
    </GridListItem>
  )
}

/** Mirrors the hovered/focused emoji into context for EmojiPickerFooter. */
const ActiveEmojiReporter = ({
  char,
  label,
  hexcode,
  isActive,
}: {
  char: string
  label: string
  hexcode: string
  isActive: boolean
}) => {
  const { setActiveEmoji } = useEmojiPickerContext()
  useEffect(() => {
    if (!isActive) return
    setActiveEmoji({ emoji: char, label, hexcode })
    return () => setActiveEmoji(null)
  }, [isActive, char, label, hexcode, setActiveEmoji])
  return null
}

// MARK: Separator

const SKIN_TONES: { id: EmojiSkinTone; label: string; emoji: string }[] = [
  { id: 'none', label: 'No skin tone', emoji: '✋' },
  { id: 'light', label: 'Light', emoji: '✋🏻' },
  { id: 'medium-light', label: 'Medium-light', emoji: '✋🏼' },
  { id: 'medium', label: 'Medium', emoji: '✋🏽' },
  { id: 'medium-dark', label: 'Medium-dark', emoji: '✋🏾' },
  { id: 'dark', label: 'Dark', emoji: '✋🏿' },
]

interface EmojiPickerSkinToneSelectorProps extends Omit<
  SelectProps<object>,
  'children' | 'selectedKey' | 'defaultSelectedKey' | 'onSelectionChange'
> {}

const EmojiPickerSkinToneSelector = ({
  className,
  ...props
}: EmojiPickerSkinToneSelectorProps) => {
  const { skinToneSelector } = useStyles()()
  const { skinTone, setSkinTone } = useEmojiPickerContext()
  const activeTone = SKIN_TONES.find((tone) => tone.id === skinTone)

  return (
    <Select
      data-emoji-picker-skin-tone-selector=""
      aria-label="Skin tone"
      selectedKey={skinTone}
      onSelectionChange={(key) => setSkinTone(key as EmojiSkinTone)}
      className={composeRenderProps(className, (cn) =>
        skinToneSelector({ className: cn }),
      )}
      {...props}
    >
      <SelectTrigger>{activeTone?.emoji}</SelectTrigger>
      <SelectContent items={SKIN_TONES}>
        {(tone) => (
          <SelectItem id={tone.id} textValue={tone.label}>
            {tone.emoji} {tone.label}
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  )
}

// MARK: Separator

interface EmojiPickerFooterProps extends React.ComponentProps<'div'> {}

const EmojiPickerFooter = ({
  className,
  children,
  ...props
}: EmojiPickerFooterProps) => {
  const { footer, footerEmoji, footerLabel } = useStyles()()
  const activeEmoji = use(ActiveEmojiContext)

  return (
    <div
      data-emoji-picker-footer=""
      className={footer({ className })}
      {...props}
    >
      {children ??
        (activeEmoji ? (
          <>
            <span className={footerEmoji()}>{activeEmoji.emoji}</span>
            <span className={footerLabel()}>{activeEmoji.label}</span>
          </>
        ) : (
          <span className={footerLabel({ className: 'text-fg-muted' })}>
            Select an emoji…
          </span>
        ))}
    </div>
  )
}

export type {
  Emoji,
  EmojiPickerContentProps,
  EmojiPickerFooterProps,
  EmojiPickerProps,
  EmojiPickerSearchProps,
  EmojiPickerSkinToneSelectorProps,
  EmojiSkinTone,
}
export {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
  EmojiPickerSkinToneSelector,
}
