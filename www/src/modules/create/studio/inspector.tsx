'use client'

import { XIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

import { Button } from '@/registry/ui/button'

import { BindingDot } from '../panel/primitives'
import type { Control } from '../panel/types'
import { sectionById } from './sections'
import { useStudio } from './store'

/* ----------------------------------------------------------------------------
 * The inspector — a docked, collapsible column showing the active domain's
 * controls. It reuses the panel-lab control *widgets* (every input already wired
 * to the live design system) but renders its own row chrome, so it's decoupled
 * from the lab's PanelConfig. Slides in from the dock; the canvas reflows.
 * -------------------------------------------------------------------------- */

export function Inspector() {
  const { activeDomain, setActiveDomain } = useStudio()
  const section = sectionById(activeDomain)

  // One persistent panel: it animates only on open/close (width). Switching
  // domains swaps the content in place — no keyed exit/enter — which keeps the
  // panel put (the Figma/Linear feel) and avoids stranded half-collapsed panes.
  return (
    <AnimatePresence initial={false}>
      {section && (
        <motion.aside
          key="inspector"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 304, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{
            type: 'tween',
            duration: 0.28,
            ease: [0.32, 0.72, 0, 1],
          }}
          className="z-20 shrink-0 overflow-hidden border-r bg-card"
        >
          <div className="flex h-full w-[304px] flex-col">
            <header className="flex items-center gap-2 border-b px-4 py-3">
              <section.icon className="size-4 text-fg-muted" />
              <h2 className="flex-1 text-sm font-medium">{section.label}</h2>
              <span className="font-mono text-[10px] text-fg-muted/70 tabular-nums">
                {section.controls.length}
              </span>
              <Button
                size="sm"
                variant="quiet"
                isIconOnly
                className="size-6"
                aria-label="Close inspector"
                onPress={() => setActiveDomain(null)}
              >
                <XIcon />
              </Button>
            </header>

            <div
              key={section.id}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4"
            >
              <div className="flex flex-col gap-5">
                {section.controls.map((control) => (
                  <StudioControlRow key={control.id} control={control} />
                ))}
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

/**
 * One control's chrome. `block` widgets own their full layout (e.g. the color
 * engine, component anatomy); the rest get a stacked label + description + input.
 */
function StudioControlRow({ control }: { control: Control }) {
  if (control.block) {
    return (
      <div className="flex flex-col gap-2.5" data-control={control.id}>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-fg">{control.label}</span>
          <BindingDot binding={control.binding} />
        </div>
        {control.description && (
          <p className="text-xs leading-snug text-fg-muted">
            {control.description}
          </p>
        )}
        <control.Widget />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5" data-control={control.id}>
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-medium text-fg">{control.label}</span>
        <BindingDot binding={control.binding} />
      </div>
      {control.description && (
        <p className="text-xs leading-snug text-fg-muted">
          {control.description}
        </p>
      )}
      <control.Widget />
    </div>
  )
}
