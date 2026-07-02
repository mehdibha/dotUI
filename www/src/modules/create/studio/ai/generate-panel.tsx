'use client'

import { useState } from 'react'
import { ArrowUpIcon, ImageIcon, SparklesIcon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'

import { useStudio } from '../studio-context'
import { MessageList } from './thread'
import { VIBES } from './vibes'

export function GeneratePanel() {
  const { thread, generate, applyVibe, isThinking } = useStudio()
  const [value, setValue] = useState('')

  function submit() {
    if (!value.trim() || isThinking) return
    generate(value)
    setValue('')
  }

  const hasThread = thread.length > 0

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-col gap-4 border-b p-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-md bg-accent text-fg-on-accent">
              <SparklesIcon className="size-3.5" />
            </span>
            <h2 className="text-sm font-semibold">Generate with AI</h2>
          </div>
          <p className="text-xs text-pretty text-fg-muted">
            Describe the system you want — I'll set the palette, shape, density
            and type, then you refine.
          </p>
        </div>

        {/* Prompt */}
        <div className="flex flex-col gap-2 rounded-xl border bg-bg p-2 focus-within:border-border-focus">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                submit()
              }
            }}
            rows={3}
            placeholder="A trustworthy fintech dashboard, dense and calm…"
            className="w-full resize-none bg-transparent px-1.5 py-1 text-sm outline-none placeholder:text-fg-muted"
          />
          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-xs text-fg-muted transition-colors hover:bg-neutral hover:text-fg">
              <ImageIcon className="size-3.5" />
              Image
              <input type="file" accept="image/*" className="sr-only" />
            </label>
            <Button
              size="sm"
              variant="primary"
              isIconOnly
              aria-label="Generate"
              onPress={submit}
              isDisabled={!value.trim() || isThinking}
            >
              <ArrowUpIcon />
            </Button>
          </div>
        </div>

        {/* Vibe chips */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-semibold tracking-wider text-fg-muted uppercase">
            Or start from a vibe
          </span>
          <div className="flex flex-wrap gap-1.5">
            {VIBES.map((vibe) => (
              <button
                key={vibe.id}
                type="button"
                onClick={() => applyVibe(vibe)}
                title={vibe.summary}
                className={cn(
                  'group flex items-center gap-1.5 rounded-full border py-1 pr-2.5 pl-1 text-xs font-medium focus-reset transition-colors hover:bg-neutral focus-visible:focus-ring',
                )}
              >
                <span
                  className="size-4 rounded-full ring-1 ring-black/10 ring-inset"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${vibe.swatch[0]}, ${vibe.swatch[1]})`,
                  }}
                />
                {vibe.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conversation */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
        {hasThread ? (
          <MessageList messages={thread} />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
            <SparklesIcon className="size-5 text-fg-muted/50" />
            <p className="max-w-[22ch] text-xs text-balance text-fg-muted">
              Your generations and edits will show up here as a conversation.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
