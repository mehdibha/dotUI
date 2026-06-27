'use client'

import { lazy, Suspense } from 'react'
import { CodeIcon, LoaderCircleIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { Dialog, DialogContent } from '@/registry/ui/dialog'
import { Modal } from '@/registry/ui/modal'

// Code-split the body: it pulls in the syntax highlighter, which shouldn't ship
// in the charts route until someone actually opens a modal.
const ChartCodeModalContent = lazy(() => import('./chart-code-modal-content'))

interface ChartCodeModalProps {
  /** Demo key, e.g. `chart-bar/demos/multiple`. */
  demoKey: string
  /** Human label, e.g. `multiple` — the modal title. */
  label: string
}

/**
 * The card's "Show code" action: a quiet trigger that opens a large modal with
 * the live preview and install command on the left and the variant's source on
 * the right.
 */
export function ChartCodeModal({ demoKey, label }: ChartCodeModalProps) {
  return (
    <Dialog>
      <Button variant="quiet" size="sm" className="text-fg-muted hover:text-fg">
        <CodeIcon />
        Show code
      </Button>
      <Modal className="h-[80vh] w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl">
        <DialogContent
          aria-label={`${label} chart code`}
          className="flex h-full min-h-0 flex-col gap-0 overflow-hidden p-0"
        >
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center">
                <LoaderCircleIcon className="size-5 animate-spin text-fg-muted" />
              </div>
            }
          >
            <ChartCodeModalContent demoKey={demoKey} label={label} />
          </Suspense>
        </DialogContent>
      </Modal>
    </Dialog>
  )
}
