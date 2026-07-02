'use client'

import { AnimatePresence, motion, type Transition } from 'motion/react'

import { cn } from '@/registry/lib/utils'

import { CodeOptionsDialog } from '../code-options'
import { ExportFooter } from '../export'
import { StudioHome } from './home'
import { DetailHeader } from './primitives'
import { useStudio } from './store'
import { resolveView } from './views'

export { StudioProvider } from './store'
export { StudioTopBar } from './top-bar'

const stackTransition: Transition = {
  x: { type: 'tween', duration: 0.34, ease: [0.32, 0.72, 0, 1] },
}

/**
 * The editor panel. Its chrome (system name, Simple/Pro posture, ⌘K, undo and
 * the macros menu) has moved up to `StudioTopBar` so there's one bar on /create,
 * never two stacked — the panel is now just the slide-in body plus the export
 * footer. Render it inside a `StudioProvider` (shared with the top bar).
 */
export function StudioPanel({ className }: { className?: string }) {
  const { level, stack, back } = useStudio()

  return (
    <div
      className={cn(
        'relative flex w-full flex-1 flex-col overflow-hidden rounded-xl border bg-card lg:w-80 lg:flex-none lg:shrink-0',
        className,
      )}
    >
      {/* Body — home + slide-in detail stack */}
      <div className="relative flex-1 overflow-hidden">
        <motion.div
          initial={false}
          animate={{
            x: stack.length > 0 ? '-25%' : 0,
            opacity: stack.length > 0 ? 0.4 : 1,
          }}
          transition={stackTransition}
          className="absolute inset-0 overflow-y-auto overscroll-contain"
        >
          <StudioHome />
        </motion.div>

        <AnimatePresence initial={false}>
          {stack.map((view, index) => {
            const isCovered = index < stack.length - 1
            const resolved = resolveView(view)
            return (
              <motion.div
                key={stack.slice(0, index + 1).join('/')}
                initial={{ x: '100%' }}
                animate={{ x: isCovered ? '-25%' : 0 }}
                exit={{ x: '100%' }}
                transition={stackTransition}
                className="absolute inset-0 overflow-y-auto overscroll-contain bg-card p-3"
              >
                {resolved && (
                  <>
                    <DetailHeader
                      title={resolved.title}
                      subtitle={resolved.subtitle}
                      onBack={back}
                    />
                    {resolved.node}
                  </>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Footer — code style + export */}
      <div className="flex flex-col gap-2 border-t p-3">
        {level === 'pro' && <CodeOptionsDialog />}
        <ExportFooter />
      </div>
    </div>
  )
}
