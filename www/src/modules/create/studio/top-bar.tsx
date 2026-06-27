'use client'

import { useEffect, useRef, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  CheckIcon,
  Link2Icon,
  RotateCcwIcon,
  SearchIcon,
  ShuffleIcon,
  Undo2Icon,
} from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { Kbd } from '@/registry/ui/kbd'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

import { useStudioActions } from './actions'
import { ExportMenu } from './export-menu'
import { PresetsButton } from './presets'
import { useStudio } from './store'

const routeApi = getRouteApi('/_app/create')

export function TopBar() {
  const { preset } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const { shuffle, reset } = useStudioActions()
  const { setCommandOpen } = useStudio()
  const [name, setName] = useState('Untitled system')
  const [copied, setCopied] = useState(false)

  // Undo history over the encoded `?preset=` param (edits use replace:true, so
  // the browser back button can't step through them — keep our own stack).
  const history = useRef<(string | undefined)[]>([])
  const prev = useRef<string | undefined>(preset)
  const undoing = useRef(false)
  const [canUndo, setCanUndo] = useState(false)

  useEffect(() => {
    if (prev.current === preset) return
    if (undoing.current) undoing.current = false
    else {
      history.current.push(prev.current)
      setCanUndo(true)
    }
    prev.current = preset
  }, [preset])

  function undo() {
    if (history.current.length === 0) return
    const previous = history.current.pop()
    undoing.current = true
    navigate({ search: (p) => ({ ...p, preset: previous }), replace: true })
    setCanUndo(history.current.length > 0)
  }

  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      /* no-op */
    }
  }

  return (
    <header className="flex h-12 shrink-0 items-center gap-3 px-4">
      {/* Identity */}
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary to-primary/70 text-fg-on-primary shadow-sm">
          <span className="text-xs font-bold">d</span>
        </div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="System name"
          spellCheck={false}
          className="min-w-0 flex-1 truncate rounded-md bg-transparent px-1.5 py-1 text-sm font-semibold outline-none hover:bg-neutral focus:bg-neutral focus-visible:focus-ring sm:max-w-44 sm:flex-none"
        />
        <span className="hidden rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-wide text-fg-muted uppercase sm:inline">
          Draft
        </span>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1">
        <PresetsButton />

        {/* Command palette opener — keyboard ⌘K works anywhere. */}
        <Button
          size="sm"
          variant="quiet"
          onPress={() => setCommandOpen(true)}
          aria-label="Open command palette"
          className="gap-1.5 text-fg-muted max-sm:hidden"
        >
          <SearchIcon />
          <span className="text-[12px]">Search</span>
          <Kbd className="text-[10px]">⌘K</Kbd>
        </Button>

        <div className="mx-1 h-5 w-px bg-border max-sm:hidden" />

        {/* Secondary actions collapse first on narrow screens. */}
        <div className="flex items-center gap-1 max-sm:hidden">
          <Tooltip>
            <Button
              size="sm"
              variant="quiet"
              isIconOnly
              onPress={shuffle}
              aria-label="Surprise me"
            >
              <ShuffleIcon />
            </Button>
            <TooltipContent>Surprise me</TooltipContent>
          </Tooltip>
          <Tooltip>
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
          <Tooltip>
            <Button
              size="sm"
              variant="quiet"
              isIconOnly
              onPress={reset}
              aria-label="Reset to defaults"
            >
              <RotateCcwIcon />
            </Button>
            <TooltipContent>Reset to defaults</TooltipContent>
          </Tooltip>

          <div className="mx-1 h-5 w-px bg-border" />
        </div>

        <Button
          size="sm"
          variant="default"
          onPress={share}
          aria-label="Share"
          className={cn('gap-1.5', copied && 'text-success')}
        >
          {copied ? <CheckIcon /> : <Link2Icon />}
          <span className="max-sm:hidden">{copied ? 'Copied' : 'Share'}</span>
        </Button>
        <ExportMenu />
      </div>
    </header>
  )
}
