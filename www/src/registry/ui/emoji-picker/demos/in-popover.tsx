'use client'

import { useState } from 'react'
import { SmilePlusIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { Dialog, DialogContent } from '@/registry/ui/dialog'
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from '@/registry/ui/emoji-picker'
import { Popover } from '@/registry/ui/popover'

export default function Demo() {
  const [emoji, setEmoji] = useState<string | null>(null)

  return (
    <Dialog>
      <Button isIconOnly aria-label="Add reaction">
        {emoji ?? <SmilePlusIcon />}
      </Button>
      <Popover>
        <DialogContent className="p-0">
          {({ close }) => (
            <EmojiPicker
              onEmojiSelect={(selected) => {
                setEmoji(selected.emoji)
                close()
              }}
            >
              <EmojiPickerSearch autoFocus />
              <EmojiPickerContent />
              <EmojiPickerFooter />
            </EmojiPicker>
          )}
        </DialogContent>
      </Popover>
    </Dialog>
  )
}
