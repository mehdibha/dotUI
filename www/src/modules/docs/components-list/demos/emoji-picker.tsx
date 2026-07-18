import { EmojiPicker, EmojiPickerSearch } from '@/registry/ui/emoji-picker'
import { GridList, GridListItem } from '@/registry/ui/grid-list'

// A static sample so the gallery never fetches the full emoji dataset.
const EMOJIS = [
  { emoji: '😀', label: 'grinning face' },
  { emoji: '😂', label: 'face with tears of joy' },
  { emoji: '🥰', label: 'smiling face with hearts' },
  { emoji: '😎', label: 'smiling face with sunglasses' },
  { emoji: '🤔', label: 'thinking face' },
  { emoji: '👍', label: 'thumbs up' },
  { emoji: '🙏', label: 'folded hands' },
  { emoji: '🔥', label: 'fire' },
  { emoji: '🎉', label: 'party popper' },
  { emoji: '❤️', label: 'red heart' },
  { emoji: '🚀', label: 'rocket' },
  { emoji: '🌈', label: 'rainbow' },
  { emoji: '🍕', label: 'pizza' },
  { emoji: '⚽', label: 'soccer ball' },
  { emoji: '🐣', label: 'hatching chick' },
  { emoji: '☀️', label: 'sun' },
]

export function EmojiPickerDemo() {
  return (
    <EmojiPicker className="w-60">
      <EmojiPickerSearch />
      <GridList
        aria-label="Emojis"
        layout="grid"
        className="grid-cols-[repeat(auto-fill,minmax(--spacing(8),1fr))] p-2 text-lg"
      >
        {EMOJIS.map((item) => (
          <GridListItem
            key={item.emoji}
            id={item.emoji}
            textValue={item.label}
            className="h-8 min-h-0 justify-center rounded-(--emoji-picker-cell-radius) p-0"
          >
            {item.emoji}
          </GridListItem>
        ))}
      </GridList>
    </EmojiPicker>
  )
}
