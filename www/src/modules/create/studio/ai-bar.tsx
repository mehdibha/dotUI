'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUpIcon, SparklesIcon } from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'

import { useDesignSystem } from '../preset'
import { registerAiFocuser } from './ai-focus'
import { applyDelta } from './vibes'

const REFINE_CHIPS = [
  'More contrast',
  'Softer corners',
  'Tighter density',
  'More playful',
  'Surprise me',
]

interface Message {
  role: 'you' | 'dotui'
  text: string
}

export function AiBar({ className }: { className?: string }) {
  const ds = useDesignSystem()
  const [text, setText] = useState('')
  const [log, setLog] = useState<Message[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Let the top bar's "Ask dotUI" command (and ⌘K) jump focus straight here.
  useEffect(() => registerAiFocuser(() => inputRef.current?.focus()), [])

  function run(input: string) {
    if (!input.trim()) return
    const reply = applyDelta(ds, input)
    setLog((prev) => [
      ...prev.slice(-2),
      { role: 'you', text: input },
      { role: 'dotui', text: reply },
    ])
    setText('')
  }

  return (
    <div className={cn('flex w-full max-w-xl flex-col gap-2', className)}>
      {log.length > 0 && (
        <div className="flex flex-col gap-1 rounded-xl border bg-card/95 p-2.5 text-xs shadow-lg backdrop-blur">
          {log.map((m, i) => (
            <div
              key={i}
              className={m.role === 'you' ? 'text-fg' : 'text-fg-muted'}
            >
              <span className="font-medium">
                {m.role === 'you' ? 'You' : 'dotUI'}:
              </span>{' '}
              {m.text}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 rounded-full border bg-card/95 p-1.5 pl-3 shadow-lg backdrop-blur">
        <SparklesIcon className="size-4 shrink-0 text-primary" />
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') run(text)
          }}
          placeholder="Tell dotUI what to change…"
          aria-label="Refine the design system"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-fg-muted"
        />
        <Button
          size="sm"
          isIconOnly
          aria-label="Send"
          onPress={() => run(text)}
        >
          <ArrowUpIcon />
        </Button>
      </div>

      <div className="flex flex-wrap justify-center gap-1.5">
        {REFINE_CHIPS.map((chip) => (
          <ButtonPrimitives.Button
            key={chip}
            onPress={() => run(chip)}
            className="rounded-full border bg-card/95 px-2.5 py-1 text-xs text-fg-muted shadow-sm focus-reset backdrop-blur transition-colors hover:text-fg focus-visible:focus-ring"
          >
            {chip}
          </ButtonPrimitives.Button>
        ))}
      </div>
    </div>
  )
}
