'use client'

import { useState } from 'react'
import { ArrowUpIcon, SparklesIcon } from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'

import { useStudio } from '../store'
import { QUICK_PROMPTS } from './engine'

/* ----------------------------------------------------------------------------
 * The command bar — the always-on AI entry under the stage. Type a system or a
 * change in plain language; it proposes a reviewable diff in the dock. The
 * chips are one-tap canned intents so the capability is discoverable.
 * -------------------------------------------------------------------------- */

export function CommandBar() {
  const { submitPrompt } = useStudio()
  const [value, setValue] = useState('')

  function submit() {
    if (!value.trim()) return
    submitPrompt(value)
    setValue('')
  }

  return (
    <div className="shrink-0">
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        {QUICK_PROMPTS.map((p) => (
          <ButtonPrimitives.Button
            key={p}
            onPress={() => submitPrompt(p)}
            className="rounded-full border bg-card px-2.5 py-1 text-xs text-fg-muted focus-reset transition-colors hover:bg-neutral hover:text-fg focus-visible:focus-ring"
          >
            {p}
          </ButtonPrimitives.Button>
        ))}
      </div>
      <div
        className={cn(
          'flex items-center gap-2 rounded-xl border bg-card px-3 py-2',
          'focus-within:ring-2 focus-within:ring-primary/40',
        )}
      >
        <SparklesIcon className="size-4 shrink-0 text-primary" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              submit()
            }
          }}
          placeholder="Describe your design system, or a change — “make it feel like Linear”"
          aria-label="Ask the design assistant"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-fg-muted"
        />
        <ButtonPrimitives.Button
          onPress={submit}
          isDisabled={!value.trim()}
          aria-label="Send"
          className="text-primary-fg flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary focus-reset transition-opacity hover:opacity-90 focus-visible:focus-ring disabled:opacity-40"
        >
          <ArrowUpIcon className="size-4" />
        </ButtonPrimitives.Button>
      </div>
    </div>
  )
}
