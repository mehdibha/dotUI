'use client'

import {
  AudioLinesIcon,
  ChevronDownIcon,
  MicIcon,
  PlusIcon,
} from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { TextArea } from '@/registry/ui/input'
import { TextField } from '@/registry/ui/text-field'

// The showcase's lead card: an AI prompt composer — a text input with a toolbar
// for attachment, a model + effort picker (Opus 4.8 / High), dictation and voice.
// Unlike the other showcase cards it isn't wrapped in <Card>; the bordered
// composer *is* the surface — a short, wide banner across the top of the grid's
// main region. Every visual goes through design-system tokens (--card-radius,
// bg-card, text-fg-muted…) so it re-themes live with the rest of the grid.
export function AiPrompt({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-(--card-radius) border bg-card p-2 shadow-sm',
        className,
      )}
      {...props}
    >
      <TextField aria-label="Prompt" className="flex w-full flex-col">
        <TextArea
          placeholder="How can I help you today?"
          rows={3}
          className="min-h-20 resize-none border-0 bg-transparent px-2 pt-2 text-base shadow-none focus:border-0 focus:ring-0"
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
  )
}
