'use client'

import { useState } from 'react'

import { Button } from '@/registry/ui/button'
import { Dialog } from '@/registry/ui/dialog'
import { EmojiPicker } from '@/registry/ui/emoji-picker'
import { Popover } from '@/registry/ui/popover'

export default function Demo() {
  const [emoji, setEmoji] = useState('🙂')
  return (
    <Dialog>
      <Button variant="default">
        <span aria-hidden="true">{emoji}</span>
        Add reaction
      </Button>
      <Popover>
        <EmojiPicker onEmojiSelect={(selected) => setEmoji(selected.emoji)} />
      </Popover>
    </Dialog>
  )
}
