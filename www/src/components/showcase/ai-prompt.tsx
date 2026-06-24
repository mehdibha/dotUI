'use client'

import {
  AudioLinesIcon,
  ChevronDownIcon,
  CodeXmlIcon,
  CoffeeIcon,
  GraduationCapIcon,
  LightbulbIcon,
  MicIcon,
  PencilIcon,
  PlusIcon,
} from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { TextArea } from '@/registry/ui/input'
import { TextField } from '@/registry/ui/text-field'

// The chips below the composer — each a quick-start mode, mirroring a real
// assistant's prompt suggestions. Buttons (not badges) so they read as the
// tappable shortcuts they are and showcase the button's small/rounded variants.
const suggestions = [
  { label: 'Write', icon: PencilIcon },
  { label: 'Learn', icon: GraduationCapIcon },
  { label: 'Code', icon: CodeXmlIcon },
  { label: 'Life stuff', icon: CoffeeIcon },
  { label: "Claude's choice", icon: LightbulbIcon },
]

// The showcase's hero card: a full AI prompt composer (input + model picker +
// dictation + voice + attachment) over a row of suggestion chips. Unlike the
// other showcase cards it isn't wrapped in <Card>; the composer *is* the surface,
// so it stacks the bordered composer over free-standing chips. Every visual goes
// through design-system tokens (--card-radius, bg-card, text-fg-muted…) so it
// re-themes live with the rest of the grid.
export function AiPrompt({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex h-full flex-col gap-4', className)} {...props}>
      {/* Composer — grows to fill the featured card so it reads as a tall hero
          (matching the height of the cards stacked to its left) instead of a
          short box floating in empty space. */}
      <div className="flex flex-1 flex-col rounded-(--card-radius) border bg-card p-2 shadow-sm">
        <TextField aria-label="Prompt" className="flex w-full flex-1 flex-col">
          <TextArea
            placeholder="How can I help you today?"
            rows={4}
            className="h-full min-h-24 flex-1 resize-none border-0 bg-transparent px-2 pt-2 text-base shadow-none focus:border-0 focus:ring-0"
          />
        </TextField>
        <div className="flex items-center justify-between gap-2 pt-1">
          <Button
            variant="quiet"
            size="sm"
            isIconOnly
            aria-label="Add attachment"
            className="rounded-full"
          >
            <PlusIcon />
          </Button>
          <div className="flex items-center gap-0.5">
            <Button variant="quiet" size="sm" className="font-normal">
              Opus 4.8
            </Button>
            <Button
              variant="quiet"
              size="sm"
              className="gap-1 font-normal text-fg-muted"
            >
              High
              <ChevronDownIcon />
            </Button>
            <Button
              variant="quiet"
              size="sm"
              isIconOnly
              aria-label="Dictate"
              className="rounded-full"
            >
              <MicIcon />
            </Button>
            <Button
              variant="quiet"
              size="sm"
              isIconOnly
              aria-label="Voice mode"
              className="rounded-full"
            >
              <AudioLinesIcon />
            </Button>
          </div>
        </div>
      </div>

      {/* Suggestion chips */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {suggestions.map(({ label, icon: Icon }) => (
          <Button key={label} size="sm" className="rounded-full font-normal">
            <Icon />
            {label}
          </Button>
        ))}
      </div>
    </div>
  )
}
