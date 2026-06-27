'use client'

import { useEffect, useRef } from 'react'
import { SparklesIcon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'

import type { ChatMessage } from '../studio-context'

/* The shared conversation view — used by the Generate panel and the canvas
 * command bar so they read from one thread. */

export function MessageList({
  messages,
  className,
}: {
  messages: ChatMessage[]
  className?: string
}) {
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {messages.map((m) =>
        m.role === 'user' ? (
          <UserBubble key={m.id} text={m.text} />
        ) : (
          <AssistantBubble key={m.id} message={m} />
        ),
      )}
      <div ref={endRef} />
    </div>
  )
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-neutral px-3 py-1.5 text-sm">
        {text}
      </div>
    </div>
  )
}

function AssistantBubble({ message }: { message: ChatMessage }) {
  return (
    <div className="flex gap-2">
      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-muted text-fg-accent">
        <SparklesIcon className="size-3" />
      </span>
      <div className="flex min-w-0 flex-col gap-1.5">
        {message.pending ? (
          <ThinkingDots />
        ) : (
          <>
            <p className="text-sm text-pretty">{message.text}</p>
            {message.changes && message.changes.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {message.changes.map((change) => (
                  <span
                    key={change}
                    className="rounded-md bg-neutral px-1.5 py-0.5 font-mono text-[11px] text-fg-muted tabular-nums"
                  >
                    {change}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export function ThinkingDots() {
  return (
    <span className="flex h-5 items-center gap-1" aria-label="Thinking">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 animate-bounce rounded-full bg-fg-muted/70"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.9s' }}
        />
      ))}
    </span>
  )
}
