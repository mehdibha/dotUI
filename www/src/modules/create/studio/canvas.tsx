'use client'

import { ScanSearchIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'

import { PreviewPanel } from '../preview/preview-panel'
import { useStudio } from './store'

/* ----------------------------------------------------------------------------
 * The canvas — the hero. It reuses the real live `PreviewPanel` (iframe +
 * device / zoom / mode toolbar) and layers an "inspect" overlay on top: tap a
 * region of the design and jump straight to the controls that shape it. This is
 * the "edit the thing you see" affordance, without coupling to the iframe's DOM.
 * -------------------------------------------------------------------------- */

interface Hotspot {
  domain: string
  label: string
  /** Position as CSS percentages over the canvas. */
  top: string
  left: string
}

const HOTSPOTS: Hotspot[] = [
  { domain: 'color', label: 'Color', top: '16%', left: '24%' },
  { domain: 'states', label: 'Buttons & states', top: '40%', left: '60%' },
  { domain: 'shape', label: 'Radius & shape', top: '64%', left: '30%' },
  { domain: 'typography', label: 'Type', top: '26%', left: '74%' },
  { domain: 'surface', label: 'Surface', top: '76%', left: '68%' },
]

export function Canvas() {
  const { inspectMode, setInspectMode, setActiveDomain } = useStudio()

  return (
    <div className="relative min-w-0 flex-1 p-3">
      <PreviewPanel className="h-full" />

      <AnimatePresence>
        {inspectMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-3 z-30 overflow-hidden rounded-xl"
          >
            {/* Dim the canvas slightly so the pins read. Click-through closes. */}
            <button
              type="button"
              aria-label="Exit inspect mode"
              onClick={() => setInspectMode(false)}
              className="absolute inset-0 cursor-crosshair bg-primary/[0.06] backdrop-saturate-[1.05]"
            />

            <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center pt-4">
              <span className="pointer-events-none flex items-center gap-1.5 rounded-full border bg-card/90 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur-sm">
                <ScanSearchIcon className="size-3.5 text-primary" />
                Inspect — tap a region to edit its tokens
              </span>
            </div>

            {HOTSPOTS.map((h) => (
              <Pin
                key={h.domain}
                hotspot={h}
                onPress={() => {
                  setActiveDomain(h.domain)
                  setInspectMode(false)
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Pin({ hotspot, onPress }: { hotspot: Hotspot; onPress: () => void }) {
  return (
    <ButtonPrimitives.Button
      onPress={onPress}
      style={{ top: hotspot.top, left: hotspot.left }}
      className={cn(
        'group absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border bg-card/95 py-1 pr-3 pl-1 text-xs font-medium shadow-lg transition-transform outline-none hover:scale-105 focus-visible:focus-ring',
      )}
    >
      <span className="relative flex size-5 items-center justify-center">
        <span className="absolute size-2.5 rounded-full bg-primary" />
        <span className="absolute size-5 animate-ping rounded-full bg-primary/40 [animation-duration:2s]" />
      </span>
      {hotspot.label}
    </ButtonPrimitives.Button>
  )
}
