import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from '@/registry/ui/emoji-picker'

export default function Demo() {
  return (
    <div className="rounded-md border bg-card shadow-sm">
      <EmojiPicker>
        <EmojiPickerSearch />
        <EmojiPickerContent />
        <EmojiPickerFooter />
      </EmojiPicker>
    </div>
  )
}
