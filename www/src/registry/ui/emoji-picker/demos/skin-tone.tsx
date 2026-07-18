import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerSearch,
  EmojiPickerSkinToneSelector,
} from '@/registry/ui/emoji-picker'

export default function Demo() {
  return (
    <div className="rounded-md border bg-card shadow-sm">
      <EmojiPicker defaultSkinTone="medium">
        <div className="m-2 mb-0 flex gap-2">
          <EmojiPickerSearch className="m-0 flex-1" />
          <EmojiPickerSkinToneSelector />
        </div>
        <EmojiPickerContent />
      </EmojiPicker>
    </div>
  )
}
