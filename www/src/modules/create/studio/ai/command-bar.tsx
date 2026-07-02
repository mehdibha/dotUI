'use client'

import { useEffect, useState } from 'react'
import {
  ArrowUpIcon,
  CheckIcon,
  ChevronUpIcon,
  SparklesIcon,
  XIcon,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'

import { useStudio } from '../studio-context'
import { COPILOT_SUGGESTIONS } from './interpret'
import { MessageList } from './thread'

/* The persistent copilot — docked over the bottom of the canvas so a tweak is
 * always one sentence away, whatever section you're in. Expands into the full
 * conversation; collapses to a single input with a transient "applied" toast. */

export function CommandBar() {
  const { thread, send, isThinking, flash, clearFlash } = useStudio()
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const [expanded, setExpanded] = useState(false)

  // Auto-dismiss the applied-change toast.
  useEffect(() => {
    if (!flash || expanded) return
    const t = window.setTimeout(clearFlash, 3500)
    return () => window.clearTimeout(t)
  }, [flash, expanded, clearFlash])

  function submit() {
    if (!value.trim() || isThinking) return
    send(value)
    setValue('')
    clearFlash()
  }

  const showSuggestions = focused && !value && !expanded

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-4">
      <div className="pointer-events-auto flex w-full max-w-xl flex-col gap-2">
        {/* Expanded conversation */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, y: 12, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 12, height: 0 }}
              transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
              className="overflow-hidden rounded-2xl border bg-card shadow-xl"
            >
              <div className="flex items-center justify-between border-b px-3 py-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold">
                  <SparklesIcon className="size-3.5 text-fg-accent" />
                  Copilot
                </span>
                <Button
                  size="sm"
                  variant="quiet"
                  isIconOnly
                  aria-label="Collapse"
                  onPress={() => setExpanded(false)}
                >
                  <XIcon />
                </Button>
              </div>
              <div className="max-h-[42vh] overflow-y-auto p-3">
                {thread.length > 0 ? (
                  <MessageList messages={thread} />
                ) : (
                  <p className="py-6 text-center text-xs text-fg-muted">
                    Ask for any change — “make it rounder”, “calmer accent”,
                    “increase contrast”.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Applied-change toast (collapsed only) */}
        <AnimatePresence>
          {flash && !expanded && (
            <motion.button
              type="button"
              onClick={() => setExpanded(true)}
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
              className="flex items-center gap-2 self-center rounded-full border bg-card px-3 py-1.5 text-xs shadow-lg"
            >
              <CheckIcon className="size-3.5 text-fg-success" />
              <span className="font-medium">{flash.title}</span>
              {flash.changes[0] && (
                <span className="font-mono text-[11px] text-fg-muted">
                  {flash.changes[0]}
                </span>
              )}
            </motion.button>
          )}
        </AnimatePresence>

        {/* Suggestion chips */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.16 }}
              className="flex flex-wrap justify-center gap-1.5"
            >
              {COPILOT_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  // onMouseDown (not onClick) so it fires before the input blur.
                  onMouseDown={(e) => {
                    e.preventDefault()
                    send(s)
                  }}
                  className="rounded-full border bg-card px-2.5 py-1 text-xs shadow-sm transition-colors hover:bg-neutral"
                >
                  {s}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input */}
        <div className="flex items-center gap-2 rounded-full border bg-card/95 py-1.5 pr-1.5 pl-3 shadow-xl backdrop-blur-sm focus-within:border-border-focus">
          <SparklesIcon className="size-4 shrink-0 text-fg-accent" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                submit()
              }
            }}
            placeholder="Ask AI to change anything…"
            aria-label="Ask the copilot"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-fg-muted"
          />
          {thread.length > 0 && (
            <Button
              size="sm"
              variant="quiet"
              isIconOnly
              aria-label={
                expanded ? 'Collapse conversation' : 'Expand conversation'
              }
              onPress={() => setExpanded((e) => !e)}
              className={cn(expanded && 'bg-neutral')}
            >
              <ChevronUpIcon
                className={cn('transition-transform', expanded && 'rotate-180')}
              />
            </Button>
          )}
          <Button
            size="sm"
            variant="primary"
            isIconOnly
            aria-label="Send"
            onPress={submit}
            isDisabled={!value.trim() || isThinking}
          >
            <ArrowUpIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
