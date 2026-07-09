import type * as React from 'react'
import { RotateCcwIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/ui/button'

interface PlaygroundProps extends React.ComponentProps<'div'> {
  question: string
  onReset?: () => void
}

/** Shared frame for every chapter playground: eyebrow, the chapter's question, and the interactive body. */
export function Playground({
  question,
  onReset,
  className,
  children,
  ...props
}: PlaygroundProps) {
  return (
    <div
      className={cn(
        'my-8 overflow-hidden rounded-xl border bg-card',
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-4 border-b px-5 py-4">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[0.7rem] tracking-wider text-fg-muted uppercase">
            Playground
          </span>
          <span className="text-sm font-medium text-balance">{question}</span>
        </div>
        {onReset && (
          <Button
            variant="quiet"
            size="sm"
            onPress={onReset}
            aria-label="Reset"
            className="-mt-1 -mr-1 shrink-0"
          >
            <RotateCcwIcon />
            Reset
          </Button>
        )}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}
