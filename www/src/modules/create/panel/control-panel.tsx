'use client'

import {
  DicesIcon,
  MoonIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  SunIcon,
} from 'lucide-react'
import { useTheme } from 'starter-themes'

import { cn } from '@/registry/lib/utils'
import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

import { ExportDialog } from '../export'
import { useDesignSystem } from '../preset'
import {
  DEFAULT_DESIGN_SYSTEM_NAME,
  saveDesignSystemName,
  useDesignSystemName,
} from '../preset/storage'
import { usePanelConfig } from './config'
import { PanelBody } from './layouts'
import { useReroll } from './macros'

export function ControlPanel({ className }: { className?: string }) {
  const { config } = usePanelConfig()
  const { header } = config

  return (
    <div
      style={{ width: config.width }}
      className={cn(
        'flex max-w-full shrink-0 flex-col overflow-hidden rounded-xl border bg-card',
        className,
      )}
    >
      <PanelHeader />

      <PanelBody />

      {config.stickyFooter && (
        <div className="flex flex-col gap-2 border-t p-3">
          <ExportDialog>
            <Button variant="primary" size="sm" className="w-full">
              Export
            </Button>
          </ExportDialog>
        </div>
      )}

      {/* Honest footnote — this is a prototype, not the shipped panel. */}
      <p className="border-t px-3 py-1.5 font-mono text-[10px] text-fg-muted/70">
        panel lab · {header.showSearch ? '⌘K to search' : 'prototype'}
      </p>
    </div>
  )
}

function PanelHeader() {
  const { config, setConfig } = usePanelConfig()
  const { header } = config
  const { designSystem } = useDesignSystem()
  const { resolvedTheme, setTheme } = useTheme()
  const reroll = useReroll()
  const name = useDesignSystemName()

  const accent =
    (designSystem.color ?? DEFAULT_COLOR_CONFIG).seeds.accent ?? '#6366f1'

  return (
    <div
      className={cn(
        'flex items-center gap-2 border-b px-3',
        header.tall ? 'h-14' : 'h-12',
      )}
    >
      {header.showBrand && (
        <span
          className="size-5 shrink-0 rounded-[6px] ring-1 ring-black/10 ring-inset"
          style={{ backgroundColor: accent }}
          aria-hidden
        />
      )}
      {header.showName ? (
        <input
          value={name}
          onChange={(e) => saveDesignSystemName(e.target.value)}
          placeholder={DEFAULT_DESIGN_SYSTEM_NAME}
          aria-label="System name"
          spellCheck={false}
          className="min-w-0 flex-1 truncate rounded-sm bg-transparent text-sm font-medium outline-none focus-visible:bg-neutral focus-visible:px-1"
        />
      ) : (
        <div className="flex-1" />
      )}

      <div className="flex shrink-0 items-center gap-0.5">
        {header.showSearch && (
          <Tooltip delay={300}>
            <Button
              size="sm"
              variant="quiet"
              isIconOnly
              aria-label="Search controls"
              onPress={() => setConfig({ layout: 'command' })}
            >
              <SearchIcon />
            </Button>
            <TooltipContent>Search controls</TooltipContent>
          </Tooltip>
        )}
        {header.showMode && (
          <Tooltip delay={300}>
            <Button
              size="sm"
              variant="quiet"
              isIconOnly
              aria-label="Toggle mode"
              onPress={() =>
                setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
              }
            >
              {resolvedTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </Button>
            <TooltipContent>Toggle mode</TooltipContent>
          </Tooltip>
        )}
        {header.showReroll && (
          <Tooltip delay={300}>
            <Button
              size="sm"
              variant="quiet"
              isIconOnly
              aria-label="Re-roll"
              onPress={reroll}
            >
              <DicesIcon />
            </Button>
            <TooltipContent>Re-roll the system</TooltipContent>
          </Tooltip>
        )}
        <Tooltip delay={300}>
          <Button
            size="sm"
            variant="quiet"
            isIconOnly
            aria-label="Open panel lab"
            // The lab toggles its own visibility; this is a convenience focus.
            onPress={() =>
              document
                .querySelector<HTMLButtonElement>('[data-panel-lab-toggle]')
                ?.click()
            }
          >
            <SlidersHorizontalIcon />
          </Button>
          <TooltipContent>Panel lab</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
