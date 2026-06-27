'use client'

import { DicesIcon, DownloadIcon, SparklesIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { Dialog, DialogContent } from '@/registry/ui/dialog'
import { Overlay } from '@/registry/ui/overlay'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

import { CodeOptionsDialog } from '../code-options'
import { ExportFooter } from '../export'
import { useReroll } from '../panel/macros'
import { useStudio } from './studio-context'

export function StudioHeader() {
  const { name, setName, setActiveSection } = useStudio()
  const reroll = useReroll()

  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b bg-card px-3">
      {/* Brand + editable name */}
      <div className="flex min-w-0 items-center gap-2">
        <span className="size-5 shrink-0 rounded-md bg-accent" aria-hidden />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="Design system name"
          spellCheck={false}
          className="max-w-56 min-w-0 truncate rounded-md bg-transparent px-1.5 py-1 text-sm font-medium outline-none hover:bg-neutral/60 focus:bg-neutral focus:ring-2 focus:ring-border-focus"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <Tooltip>
          <Button
            size="sm"
            variant="quiet"
            isIconOnly
            aria-label="Re-roll"
            onPress={reroll}
          >
            <DicesIcon />
          </Button>
          <TooltipContent>Surprise me</TooltipContent>
        </Tooltip>

        <Button
          size="sm"
          variant="default"
          className="gap-1.5"
          onPress={() => setActiveSection('generate')}
        >
          <SparklesIcon className="size-3.5 text-fg-accent" />
          Ask AI
        </Button>

        <Dialog>
          <Button size="sm" variant="primary" className="gap-1.5">
            <DownloadIcon data-icon-start="" />
            Export
          </Button>
          <Overlay
            type="modal"
            mobileType="drawer"
            modalProps={{ className: 'w-[min(28rem,92vw)]' }}
          >
            <DialogContent showCloseButton aria-label="Export" className="p-5">
              <h2 className="text-base font-semibold">
                Export your design system
              </h2>
              <p className="mt-0.5 mb-4 text-sm text-fg-muted">
                Install via the shadcn CLI, or open it straight in v0.
              </p>
              <ExportFooter />
              <div className="mt-3 border-t pt-3">
                <CodeOptionsDialog />
              </div>
            </DialogContent>
          </Overlay>
        </Dialog>
      </div>
    </header>
  )
}
