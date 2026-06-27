'use client'

import type { ReactNode } from 'react'
import { AnimatePresence, motion, type Transition } from 'motion/react'

import { cn } from '@/registry/lib/utils'

import { CodeOptionsDialog } from '../code-options'
import { ExportFooter } from '../export'
import { ColorLab } from './color-lab'
import { ComponentScreen, ComponentsBrowser } from './components-browser'
import { FOUNDATION_SCREENS } from './foundations'
import { Home } from './home'
import { useStudio } from './nav'

/* ------------------------------------------------------------------ *
 * dotUI Studio — the redesigned /create control surface.
 *
 * A slide-stack of Home → editors plus the export footer. The system
 * identity and global actions (name, reroll, undo, Quick/Pro depth) live
 * in the page top bar (see CreateTopBar) so there's a single cohesive
 * chrome. All design edits flow to the live preview through the shared
 * `?preset=` design-system state.
 *
 * Must be rendered inside a <StudioProvider> (mounted in the /create
 * route so the top bar shares the same studio context).
 * ------------------------------------------------------------------ */

const stackTransition: Transition = {
  x: { type: 'tween', duration: 0.34, ease: [0.32, 0.72, 0, 1] },
}

export function StudioPanel({ className }: { className?: string }) {
  const { stack } = useStudio()

  return (
    <div
      className={cn(
        'relative flex w-full flex-1 flex-col overflow-hidden rounded-xl border bg-card lg:w-[340px] lg:flex-none lg:shrink-0',
        className,
      )}
    >
      <div className="relative flex-1 overflow-hidden">
        {/* Home — always mounted, slides left when covered. */}
        <motion.div
          initial={false}
          animate={{ x: stack.length > 0 ? '-28%' : 0 }}
          transition={stackTransition}
          className="absolute inset-0 scrollbar-none overflow-y-auto p-4"
          aria-hidden={stack.length > 0}
        >
          <Home />
        </motion.div>

        {/* Drill-in layers — each covers the one below. */}
        <AnimatePresence initial={false}>
          {stack.map((id, index) => {
            const covered = index < stack.length - 1
            return (
              <motion.div
                key={stack.slice(0, index + 1).join('/')}
                initial={{ x: '100%' }}
                animate={{ x: covered ? '-28%' : 0 }}
                exit={{ x: '100%' }}
                transition={stackTransition}
                className="absolute inset-0 scrollbar-none overflow-y-auto overscroll-contain bg-card p-4"
                aria-hidden={covered}
              >
                {renderScreen(id)}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  )
}

function renderScreen(id: string): ReactNode {
  if (id === 'color') return <ColorLab />
  if (id === 'components') return <ComponentsBrowser />
  const Screen = FOUNDATION_SCREENS[id]
  if (Screen) return <Screen />
  return <ComponentScreen name={id} />
}

/* ------------------------------ Footer ------------------------------ */

function Footer() {
  return (
    <div className="flex flex-col gap-2 border-t p-3">
      <CodeOptionsDialog />
      <ExportFooter />
    </div>
  )
}
