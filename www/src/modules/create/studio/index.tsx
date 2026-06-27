'use client'

import { useEffect, useRef, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  DicesIcon,
  MoreHorizontalIcon,
  RotateCcwIcon,
  Undo2Icon,
} from 'lucide-react'
import { AnimatePresence, motion, type Transition } from 'motion/react'

import { cn } from '@/registry/lib/utils'
import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import { Menu, MenuContent, MenuItem } from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

import { CodeOptionsDialog } from '../code-options'
import { ExportFooter } from '../export'
import { useDesignSystem } from '../preset'
import { useStudioActions } from './actions'
import { CommandPalette } from './command'
import { StudioHome } from './home'
import { DetailHeader, Segmented } from './primitives'
import { StudioProvider, useStudio } from './store'
import { resolveView } from './views'

const routeApi = getRouteApi('/_app/create')

const stackTransition: Transition = {
  x: { type: 'tween', duration: 0.34, ease: [0.32, 0.72, 0, 1] },
}

export function StudioPanel({ className }: { className?: string }) {
  return (
    <StudioProvider>
      <PanelInner className={className} />
    </StudioProvider>
  )
}

function PanelInner({ className }: { className?: string }) {
  const { level, setLevel, stack, back } = useStudio()

  return (
    <div
      className={cn(
        'relative flex w-full flex-1 flex-col overflow-hidden rounded-xl border bg-card lg:w-80 lg:flex-none lg:shrink-0',
        className,
      )}
    >
      <Header />

      {/* Audience posture */}
      <div className="border-b px-3 py-2">
        <Segmented
          ariaLabel="Editing mode"
          value={level}
          onChange={setLevel}
          options={[
            { value: 'simple', label: 'Simple' },
            { value: 'pro', label: 'Pro' },
          ]}
        />
      </div>

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

/* -------------------------------- Header -------------------------------- */

function Header() {
  const { name, setName } = useStudio()
  const { designSystem } = useDesignSystem()
  const { reroll, resetAll } = useStudioActions()
  const accent =
    (designSystem.color ?? DEFAULT_COLOR_CONFIG).seeds.accent ?? '#6366f1'

  return (
    <div className="flex items-center gap-2 border-b px-3 py-2.5">
      <span
        className="size-5 shrink-0 rounded-md ring-1 ring-black/10 ring-inset"
        style={{ backgroundColor: accent }}
        aria-hidden
      />
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        aria-label="System name"
        spellCheck={false}
        className="min-w-0 flex-1 truncate rounded-sm bg-transparent text-sm font-medium outline-none focus-visible:bg-neutral focus-visible:px-1.5 focus-visible:py-0.5"
      />
      <div className="flex shrink-0 items-center gap-0.5">
        <CommandPalette />
        <UndoButton />
        <Menu>
          <Button size="sm" variant="quiet" isIconOnly aria-label="More">
            <MoreHorizontalIcon />
          </Button>
          <Popover placement="bottom end" className="min-w-44">
            <MenuContent>
              <MenuItem onAction={reroll}>
                <DicesIcon />
                Surprise me
              </MenuItem>
              <MenuItem onAction={resetAll}>
                <RotateCcwIcon />
                Reset to defaults
              </MenuItem>
            </MenuContent>
          </Popover>
        </Menu>
      </div>
    </div>
  )
}

/* --------------------------------- Undo --------------------------------- */

/**
 * Walks back through past preset values. Every edit lands in `?preset=` with
 * `replace:true`, so the browser back button can't undo edits — we keep our own
 * stack. Watching `preset` captures changes from every editor regardless of
 * which `useDesignSystem()` instance made them.
 */
function UndoButton() {
  const { preset } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const historyRef = useRef<(string | undefined)[]>([])
  const prevRef = useRef<string | undefined>(preset)
  const undoingRef = useRef(false)
  const [canUndo, setCanUndo] = useState(false)

  useEffect(() => {
    if (prevRef.current === preset) return
    if (undoingRef.current) {
      undoingRef.current = false
    } else {
      historyRef.current.push(prevRef.current)
      setCanUndo(true)
    }
    prevRef.current = preset
  }, [preset])

  function undo() {
    if (historyRef.current.length === 0) return
    const previous = historyRef.current.pop()
    undoingRef.current = true
    navigate({
      search: (prev) => ({ ...prev, preset: previous }),
      replace: true,
    })
    setCanUndo(historyRef.current.length > 0)
  }

  return (
    <Tooltip delay={300}>
      <Button
        size="sm"
        variant="quiet"
        isIconOnly
        onPress={undo}
        isDisabled={!canUndo}
        aria-label="Undo"
      >
        <Undo2Icon />
      </Button>
      <TooltipContent>Undo</TooltipContent>
    </Tooltip>
  )
}
