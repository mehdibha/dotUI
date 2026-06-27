'use client'

import type { ReactNode } from 'react'
import { SparklesIcon, Undo2Icon } from 'lucide-react'
import { AnimatePresence, motion, type Transition } from 'motion/react'

import { cn } from '@/registry/lib/utils'
import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import { Button } from '@/registry/ui/button'

import { CodeOptionsDialog } from '../code-options'
import { ExportFooter } from '../export'
import { useDesignSystem } from '../preset'
import { ColorLab } from './color-lab'
import { ComponentScreen, ComponentsBrowser } from './components-browser'
import { FOUNDATION_SCREENS } from './foundations'
import { Home } from './home'
import { StudioProvider, useStudio } from './nav'

/* ------------------------------------------------------------------ *
 * dotUI Studio — the redesigned /create control surface.
 *
 * Persistent identity header · a slide-stack of Home → editors · the
 * export footer. All design edits flow to the live preview through the
 * shared `?preset=` design-system state.
 * ------------------------------------------------------------------ */

const stackTransition: Transition = {
  x: { type: 'tween', duration: 0.34, ease: [0.32, 0.72, 0, 1] },
}

export function StudioPanel({ className }: { className?: string }) {
  return (
    <StudioProvider>
      <StudioShell className={className} />
    </StudioProvider>
  )
}

function StudioShell({ className }: { className?: string }) {
  const { stack } = useStudio()

  return (
    <div
      className={cn(
        'relative flex w-full flex-1 flex-col overflow-hidden rounded-xl border bg-card lg:w-[340px] lg:flex-none lg:shrink-0',
        className,
      )}
    >
      <Header />

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

/* ------------------------------ Header ------------------------------ */

function Header() {
  const { name, setName, reroll, undo, canUndo } = useStudio()
  const { designSystem } = useDesignSystem()
  const accent = (designSystem.color ?? DEFAULT_COLOR_CONFIG).seeds.accent

  return (
    <div className="flex items-center gap-2 border-b p-2.5 pl-3">
      <span
        className="size-3 shrink-0 rounded-full ring-1 ring-black/10 ring-inset"
        style={{ backgroundColor: accent }}
        aria-hidden
      />
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        aria-label="System name"
        spellCheck={false}
        className="min-w-0 flex-1 rounded-sm bg-transparent text-sm font-semibold outline-none placeholder:text-fg-muted focus-visible:bg-neutral focus-visible:px-1"
      />
      <IconAction label="Surprise me" onPress={reroll}>
        <SparklesIcon />
      </IconAction>
      <IconAction label="Undo" onPress={undo} isDisabled={!canUndo}>
        <Undo2Icon />
      </IconAction>
    </div>
  )
}

function IconAction({
  label,
  onPress,
  isDisabled,
  children,
}: {
  label: string
  onPress: () => void
  isDisabled?: boolean
  children: ReactNode
}) {
  return (
    <Button
      variant="quiet"
      size="sm"
      isIconOnly
      aria-label={label}
      onPress={onPress}
      isDisabled={isDisabled}
      className="size-7"
    >
      {children}
    </Button>
  )
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
