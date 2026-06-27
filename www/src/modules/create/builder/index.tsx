'use client'

import { useEffect, useRef } from 'react'
import { ChevronLeftIcon } from 'lucide-react'
import { AnimatePresence, motion, type Transition } from 'motion/react'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'

import { getGroupDisplayName } from '../components'
import {
  BrandCard,
  DensityCard,
  ElevationCard,
  IconsCard,
  InteractionCard,
  ModesCard,
  MotionCard,
  ShapeCard,
  TypographyCard,
} from './cards'
import { ColorCard, ColorLab } from './color'
import { CommandPalette } from './command-palette'
import { ComponentAnatomy, ComponentsCard } from './components-panel'
import { BuilderFooter } from './footer'
import { IdentityBar } from './identity-bar'
import { BuilderUiProvider, useBuilderUi } from './use-builder-ui'

const drillTransition: Transition = {
  x: { type: 'tween', duration: 0.35, ease: [0.32, 0.72, 0, 1] },
}

/**
 * The redesigned /create builder — "Lens". One zoomable rail: every card shows
 * a live readout of its own output collapsed, and its full controls expanded.
 * Two deep editors (the OKLCH color lab, a synced group's anatomy) take over the
 * rail when summoned. Everything writes one shared DesignSystem; Essentials ⇄
 * Everything is a pure view toggle; honest live/preview-only signals throughout.
 */
export function BuilderPanel({ className }: { className?: string }) {
  return (
    <BuilderUiProvider>
      <BuilderColumn className={className} />
    </BuilderUiProvider>
  )
}

function BuilderColumn({ className }: { className?: string }) {
  const { flashId } = useBuilderUi()
  const scrollRef = useRef<HTMLDivElement>(null)

  // ⌘K jump: scroll the flashed card into view (it's already opened + pulsed).
  useEffect(() => {
    if (!flashId) return
    const el = scrollRef.current?.querySelector(`[data-card="${flashId}"]`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [flashId])

  return (
    <div
      className={cn(
        'relative flex w-full flex-1 flex-col overflow-hidden rounded-xl border bg-card lg:w-80 lg:flex-none lg:shrink-0',
        className,
      )}
    >
      <IdentityBar />

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div
          ref={scrollRef}
          className="absolute inset-0 overflow-y-auto overscroll-contain"
        >
          <BrandCard />
          <ColorCard />
          <TypographyCard />
          <ShapeCard />
          <DensityCard />
          <ElevationCard />
          <MotionCard />
          <InteractionCard />
          <IconsCard />
          <ModesCard />
          <ComponentsCard />
        </div>

        <DrillLayer />
      </div>

      <BuilderFooter />
      <CommandPalette />
    </div>
  )
}

function DrillLayer() {
  const { drill, setDrill } = useBuilderUi()

  const title =
    drill?.kind === 'color'
      ? 'Color lab'
      : drill?.kind === 'component'
        ? getGroupDisplayName(drill.group)
        : ''

  const drillKey =
    drill?.kind === 'color'
      ? 'color'
      : drill?.kind === 'component'
        ? `component:${drill.group}`
        : ''

  return (
    <AnimatePresence initial={false}>
      {drill && (
        <motion.div
          key={drillKey}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={drillTransition}
          className="absolute inset-0 z-10 flex flex-col bg-card"
        >
          <div className="flex shrink-0 items-center gap-1.5 border-b px-2.5 py-2">
            <Button
              variant="quiet"
              size="sm"
              isIconOnly
              aria-label="Back"
              onPress={() => setDrill(null)}
              className="size-7"
            >
              <ChevronLeftIcon />
            </Button>
            <h2 className="text-sm font-medium text-fg">{title}</h2>
          </div>
          <div className="scrollbar-none flex-1 overflow-y-auto overscroll-contain p-3">
            {drill.kind === 'color' && <ColorLab />}
            {drill.kind === 'component' && (
              <ComponentAnatomy group={drill.group} />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
