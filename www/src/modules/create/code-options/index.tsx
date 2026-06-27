/**
 * Footer entry point for `codeOptions`: a "Code style" button that opens a
 * split modal — the controls on the left, a live preview of the exported
 * button component on the right.
 */

import type { ReactNode } from 'react'
import { Code2Icon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { Dialog, DialogContent } from '@/registry/ui/dialog'
import { Overlay } from '@/registry/ui/overlay'

import { CodeOptionsControls } from './controls'
import { CodeOptionsPreview } from './preview'

/**
 * The "Code style" modal. `trigger` overrides the default full-width button with
 * a caller-supplied trigger (e.g. a compact icon) — it must be a React-Aria
 * pressable, since `Dialog` is a `DialogTrigger`.
 */
export function CodeOptionsDialog({ trigger }: { trigger?: ReactNode }) {
  return (
    <Dialog>
      {trigger ?? (
        <Button variant="default" size="sm" className="w-full">
          <Code2Icon data-icon-start="" />
          Code style
        </Button>
      )}
      <Overlay
        type="modal"
        mobileType={null}
        modalProps={{
          className: 'h-[min(38rem,82vh)] w-[min(64rem,92vw)] sm:max-w-none',
        }}
      >
        <DialogContent
          showCloseButton
          aria-label="Code style"
          className="gap-0 overflow-hidden p-0"
        >
          <div className="flex h-full min-h-0 flex-col md:flex-row">
            <div className="flex w-full shrink-0 flex-col overflow-y-auto border-b p-4 md:w-80 md:border-r md:border-b-0">
              <h2 className="text-sm font-medium">Code style</h2>
              <p className="mt-0.5 mb-4 text-xs text-fg-muted">
                Shape the exported code to match your codebase.
              </p>
              <CodeOptionsControls />
            </div>
            <CodeOptionsPreview />
          </div>
        </DialogContent>
      </Overlay>
    </Dialog>
  )
}
