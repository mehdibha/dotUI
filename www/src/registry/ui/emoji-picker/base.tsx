'use client'

import { EmojiPicker as EmojiPickerPrimitive } from 'frimousse'
import type {
  EmojiPickerListCategoryHeaderProps,
  EmojiPickerListEmojiProps,
  EmojiPickerListRowProps,
  EmojiPickerRootProps,
} from 'frimousse'

import { useStyles } from './styles'

// MARK: EmojiPicker

interface EmojiPickerProps extends EmojiPickerRootProps {}

const EmojiPicker = ({ className, ...props }: EmojiPickerProps) => {
  const { root, search, viewport, list, message } = useStyles()()
  return (
    <EmojiPickerPrimitive.Root
      data-emoji-picker=""
      className={root({ className })}
      {...props}
    >
      <EmojiPickerPrimitive.Search
        className={search()}
        placeholder="Search emoji…"
      />
      <EmojiPickerPrimitive.Viewport className={viewport()}>
        <EmojiPickerPrimitive.Loading className={message()}>
          Loading…
        </EmojiPickerPrimitive.Loading>
        <EmojiPickerPrimitive.Empty className={message()}>
          No emoji found.
        </EmojiPickerPrimitive.Empty>
        <EmojiPickerPrimitive.List
          className={list()}
          components={{ CategoryHeader, Row, Emoji }}
        />
      </EmojiPickerPrimitive.Viewport>
    </EmojiPickerPrimitive.Root>
  )
}

// MARK: List components

const CategoryHeader = ({
  category,
  className,
  ...props
}: EmojiPickerListCategoryHeaderProps) => {
  const { categoryHeader } = useStyles()()
  return (
    <div className={categoryHeader({ className })} {...props}>
      {category.label}
    </div>
  )
}

const Row = ({ className, ...props }: EmojiPickerListRowProps) => {
  const { row } = useStyles()()
  return <div className={row({ className })} {...props} />
}

const Emoji = ({ emoji, className, ...props }: EmojiPickerListEmojiProps) => {
  const { emoji: emojiButton } = useStyles()()
  return (
    <button
      data-active={emoji.isActive || undefined}
      className={emojiButton({ className })}
      {...props}
    >
      {emoji.emoji}
    </button>
  )
}

// MARK: Separator

export type { EmojiPickerProps }
export { EmojiPicker }
