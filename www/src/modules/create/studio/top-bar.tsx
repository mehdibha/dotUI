'use client'

import { useEffect, useRef, useState } from 'react'
import {
  ArrowUpRightIcon,
  MoonIcon,
  ScanSearchIcon,
  SparklesIcon,
  SunIcon,
} from 'lucide-react'
import { useTheme } from 'starter-themes'

import { cn } from '@/registry/lib/utils'
import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import { Dialog, DialogContent } from '@/registry/ui/dialog'
import { Overlay } from '@/registry/ui/overlay'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

import { ExportFooter } from '../export'
import { useDesignSystem } from '../preset'
import { useStudio } from './store'

/* ----------------------------------------------------------------------------
 * The top bar — identity on the left, an always-on AI command field in the
 * middle (⌘K), and view + export actions on the right. The AI field is the
 * fastest path to a change from anywhere on the page; it routes into the same
 * copilot thread so history stays in one place.
 * -------------------------------------------------------------------------- */

export function TopBar() {
  const { name, setName } = useStudio()
  const { designSystem } = useDesignSystem()
  const accent =
    (designSystem.color ?? DEFAULT_COLOR_CONFIG).seeds.accent ?? '#438cd6'

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-card px-3">
      {/* Identity */}
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          className="size-6 shrink-0 rounded-md ring-1 ring-black/10 ring-inset"
          style={{ backgroundColor: accent }}
          aria-hidden
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="System name"
          spellCheck={false}
          className="max-w-[12rem] min-w-0 truncate rounded-sm bg-transparent text-sm font-medium outline-none focus-visible:bg-neutral focus-visible:px-1.5 focus-visible:py-0.5"
        />
        <span className="hidden rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-wide text-fg-muted uppercase sm:inline-block">
          Studio
        </span>
      </div>

      <CommandField />

      <div className="flex shrink-0 items-center gap-1">
        <InspectToggle />
        <ModeToggle />
        <div className="mx-1 h-5 w-px bg-border" />
        <ExportButton />
      </div>
    </header>
  )
}

/* ---------------------------- AI command field ---------------------------- */

function CommandField() {
  const { runPrompt, setCopilotOpen, thinking } = useStudio()
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // ⌘K / Ctrl-K focuses the command field from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function submit() {
    const text = value.trim()
    if (!text || thinking) return
    setCopilotOpen(true)
    runPrompt(text)
    setValue('')
    inputRef.current?.blur()
  }

  return (
    <div className="mx-auto flex h-9 w-full max-w-xl items-center gap-2 rounded-full border bg-bg px-3 transition-colors focus-within:border-border-focus">
      <SparklesIcon className="size-4 shrink-0 text-primary" />
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit()
        }}
        placeholder="Ask AI to change anything — “make it feel like Linear”"
        aria-label="Ask AI"
        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-fg-muted"
      />
      <kbd className="hidden shrink-0 rounded border bg-card px-1.5 py-0.5 font-mono text-[10px] text-fg-muted sm:block">
        ⌘K
      </kbd>
    </div>
  )
}

/* ------------------------------- View toggles ------------------------------- */

function InspectToggle() {
  const { inspectMode, setInspectMode } = useStudio()
  return (
    <Tooltip delay={300}>
      <Button
        size="sm"
        variant="quiet"
        isIconOnly
        aria-label="Inspect mode"
        aria-pressed={inspectMode}
        onPress={() => setInspectMode(!inspectMode)}
        className={cn(inspectMode && 'bg-primary/10 text-primary')}
      >
        <ScanSearchIcon />
      </Button>
      <TooltipContent>Inspect — edit on the canvas</TooltipContent>
    </Tooltip>
  )
}

function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  return (
    <Tooltip delay={300}>
      <Button
        size="sm"
        variant="quiet"
        isIconOnly
        aria-label="Toggle theme"
        onPress={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      >
        {resolvedTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </Button>
      <TooltipContent>Toggle light / dark</TooltipContent>
    </Tooltip>
  )
}

function ExportButton() {
  return (
    <Dialog>
      <Button size="sm" variant="primary">
        <ArrowUpRightIcon data-icon-start="" />
        Export
      </Button>
      <Overlay type="modal" mobileType="drawer">
        <DialogContent
          aria-label="Export"
          className="w-[min(28rem,92vw)] gap-0 p-0"
        >
          <div className="flex flex-col gap-1 border-b p-4">
            <h2 className="text-sm font-medium">Export your system</h2>
            <p className="text-xs text-fg-muted">
              Install via the shadcn CLI, or open it straight in v0.
            </p>
          </div>
          <div className="flex flex-col gap-2 p-4">
            <ExportFooter />
          </div>
        </DialogContent>
      </Overlay>
    </Dialog>
  )
}
