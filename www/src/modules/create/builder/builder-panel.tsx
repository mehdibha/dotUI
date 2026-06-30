'use client'

import { useCallback, useRef, useState } from 'react'
import { CheckIcon, XIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

import { cn } from '@/registry/lib/utils'

import { CodeOptionsDialog } from '../code-options'
import { ExportFooter } from '../export'
import { CommandPalette } from './command-palette'
import { ComponentsZone } from './components-zone'
import { FOUNDATION_AXES, FoundationsZone } from './foundations'
import { IntakeGate } from './intake'

export function BuilderPanel({
  className,
  showIntake,
  onCloseIntake,
  cmdOpen,
  onCloseCommand,
}: {
  className?: string
  showIntake: boolean
  onCloseIntake: () => void
  cmdOpen: boolean
  onCloseCommand: () => void
}) {
  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set(['f:colors']),
  )
  const [ribbonDismissed, setRibbonDismissed] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  /* --------------------------- Open / accordion ------------------------ */
  // One-open accordion within each namespace ('f:' foundations, 'c:' components):
  // opening a row collapses its siblings so the column never runs away.
  const toggle = useCallback((id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        return next
      }
      const ns = id.split(':')[0]
      for (const open of next) {
        if (open.split(':')[0] === ns) next.delete(open)
      }
      next.add(id)
      return next
    })
  }, [])

  const jump = useCallback((rowId: string) => {
    setOpenIds((prev) => {
      if (prev.has(rowId)) return prev
      const next = new Set(prev)
      const ns = rowId.split(':')[0]
      for (const open of next) if (open.split(':')[0] === ns) next.delete(open)
      next.add(rowId)
      return next
    })
    requestAnimationFrame(() => {
      document
        .querySelector(`[data-row="${rowId}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  return (
    <div
      className={cn(
        'relative flex w-full flex-1 flex-col overflow-hidden rounded-xl border bg-card lg:w-[360px] lg:flex-none lg:shrink-0',
        className,
      )}
    >
      {/* Body */}
      <AnimatePresence mode="wait" initial={false}>
        {showIntake ? (
          <IntakeGate key="intake" onGenerate={onCloseIntake} />
        ) : (
          <motion.div
            key="spine"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div
              ref={scrollRef}
              className="scrollbar-none flex-1 overflow-y-auto p-2"
            >
              {!ribbonDismissed && (
                <CompletionRibbon onDismiss={() => setRibbonDismissed(true)} />
              )}

              <FoundationsZone openIds={openIds} onToggle={toggle} />

              <div className="mt-4 mb-1 flex items-center gap-2 px-3">
                <span className="text-[10px] font-semibold tracking-widest text-fg-muted/70 uppercase">
                  Components
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <ComponentsZone openIds={openIds} onToggle={toggle} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      {!showIntake && (
        <div className="flex shrink-0 flex-col gap-2 border-t p-3">
          <CodeOptionsDialog />
          <ExportFooter />
        </div>
      )}

      <CommandPalette open={cmdOpen} onClose={onCloseCommand} onJump={jump} />
    </div>
  )
}

function CompletionRibbon({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-1 mb-2 flex items-center gap-2 rounded-lg border border-success/30 bg-success-muted/40 px-3 py-2 text-xs"
    >
      <span className="grid size-4 shrink-0 place-items-center rounded-full bg-success text-fg-on-success">
        <CheckIcon className="size-2.5" />
      </span>
      <span className="flex-1 text-fg-muted">
        Complete system — refine anything below.
      </span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="grid size-4 place-items-center rounded text-fg-muted hover:text-fg"
      >
        <XIcon className="size-3" />
      </button>
    </motion.div>
  )
}

// re-export for any external nav needs
export { FOUNDATION_AXES }
