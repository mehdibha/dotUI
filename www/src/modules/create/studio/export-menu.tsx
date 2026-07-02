'use client'

import { ChevronDownIcon, DownloadIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { Dialog, DialogContent } from '@/registry/ui/dialog'
import { Popover } from '@/registry/ui/popover'

import { CommandCard, DeeplinkButton } from '../export/renderers'
import { EXPORT_TARGETS } from '../export/targets'
import { useExportUrl } from '../export/use-export-url'

const SOON = ['Bolt', 'Lovable', 'Claude', 'Figma']

export function ExportMenu() {
  const presetUrl = useExportUrl()

  return (
    <Dialog>
      <Button variant="primary" size="sm" className="gap-1.5">
        <DownloadIcon />
        Export
        <ChevronDownIcon data-icon-end="" />
      </Button>
      <Popover placement="bottom end" className="w-80">
        <DialogContent className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold">Export your system</h3>
            <p className="text-[11px] text-fg-muted">
              Code you own — into your codebase or any builder.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {EXPORT_TARGETS.map((target) =>
              target.kind === 'command' ? (
                <div key={target.id} className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-medium text-fg-muted">
                    shadcn CLI
                  </span>
                  <CommandCard
                    label={target.label}
                    command={target.command(presetUrl)}
                  />
                </div>
              ) : (
                <DeeplinkButton
                  key={target.id}
                  label={target.label}
                  ariaLabel={target.ariaLabel}
                  icon={target.icon}
                  href={target.href(presetUrl)}
                />
              ),
            )}
          </div>

          <div className="flex flex-col gap-2 border-t pt-3">
            <span className="text-[11px] font-medium text-fg-muted">
              More targets
            </span>
            <div className="grid grid-cols-2 gap-2">
              {SOON.map((name) => (
                <div
                  key={name}
                  className="flex items-center justify-between rounded-md border border-dashed px-2.5 py-2 text-[13px] text-fg-muted"
                >
                  {name}
                  <span className="rounded-full bg-neutral px-1.5 py-0.5 text-[9px] font-medium tracking-wide uppercase">
                    Soon
                  </span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Popover>
    </Dialog>
  )
}
