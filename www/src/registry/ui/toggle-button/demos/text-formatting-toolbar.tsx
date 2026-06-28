'use client'

import { useState } from 'react'
import { BoldIcon, ItalicIcon, UnderlineIcon } from 'lucide-react'

import { ToggleButton } from '@/registry/ui/toggle-button'

export default function Demo() {
  const [formats, setFormats] = useState<string[]>(['bold'])

  const toggle = (format: string) => (isSelected: boolean) =>
    setFormats((prev) =>
      isSelected ? [...prev, format] : prev.filter((f) => f !== format),
    )

  return (
    <div className="flex w-fit items-center gap-1 rounded-lg border p-1">
      <ToggleButton
        variant="quiet"
        isIconOnly
        isSelected={formats.includes('bold')}
        onChange={toggle('bold')}
        aria-label="Bold"
      >
        <BoldIcon />
      </ToggleButton>
      <ToggleButton
        variant="quiet"
        isIconOnly
        isSelected={formats.includes('italic')}
        onChange={toggle('italic')}
        aria-label="Italic"
      >
        <ItalicIcon />
      </ToggleButton>
      <ToggleButton
        variant="quiet"
        isIconOnly
        isSelected={formats.includes('underline')}
        onChange={toggle('underline')}
        aria-label="Underline"
      >
        <UnderlineIcon />
      </ToggleButton>
    </div>
  )
}
