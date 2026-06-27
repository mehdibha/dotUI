'use client'

import { useEffect, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  BoxIcon,
  DicesIcon,
  MoonIcon,
  RotateCcwIcon,
  SearchIcon,
  SparklesIcon,
  SunIcon,
} from 'lucide-react'
import { useTheme } from 'starter-themes'

import { Button } from '@/registry/ui/button'
import {
  Command,
  CommandContent,
  CommandInput,
  CommandItem,
  CommandSection,
  CommandSectionHeader,
} from '@/registry/ui/command'
import { Dialog, DialogContent } from '@/registry/ui/dialog'
import { Input } from '@/registry/ui/input'
import { Kbd } from '@/registry/ui/kbd'
import { Overlay } from '@/registry/ui/overlay'
import { registryUi } from '@/registry/ui/registry'

import { ExamplesIndex } from '../__generated__/examples'
import { CHAPTERS, PRESETS } from './data'
import { useStudioActions } from './hooks'
import { useStudio } from './store'

const routeApi = getRouteApi('/_app/create')

function titleCase(slug: string) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

const components = registryUi
  .filter((i) => i.params && Object.keys(i.params).length > 0)
  .sort((a, b) => a.name.localeCompare(b.name))

/**
 * ⌘K — the power-user spine. Jump to any chapter, load a preset, open any
 * component (and couple the preview to it), or fire an action. The index is
 * derived from the same data the panel renders, so it can never drift.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const { setChapter, setActiveComponent } = useStudio()
  const { applyPreset, reroll, reset } = useStudioActions()
  const { resolvedTheme, setTheme } = useTheme()
  const navigate = routeApi.useNavigate()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function run(key: string) {
    setOpen(false)
    const [kind, id] = key.split(':')
    if (kind === 'chapter') {
      setChapter(id as never)
      if (id !== 'components') setActiveComponent(null)
    } else if (kind === 'preset') {
      const preset = PRESETS.find((p) => p.id === id)
      if (preset) applyPreset(preset)
    } else if (kind === 'component') {
      setChapter('components')
      setActiveComponent(id ?? null)
      if (id && id in ExamplesIndex) {
        navigate({ search: (p) => ({ ...p, preview: id }) })
      }
    } else if (kind === 'action') {
      if (id === 'reroll') reroll()
      if (id === 'reset') reset()
      if (id === 'theme') setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    }
  }

  return (
    <Dialog isOpen={open} onOpenChange={setOpen}>
      <Button
        size="sm"
        aria-label="Open command palette"
        className="h-8 w-full justify-start gap-2 px-2.5 text-xs font-normal text-fg-muted"
      >
        <SearchIcon className="size-3.5" />
        <span>Search</span>
        <Kbd className="ml-auto">⌘K</Kbd>
      </Button>
      <Overlay
        type="modal"
        mobileType={null}
        modalProps={{
          className:
            'top-[12vh] w-[min(38rem,92vw)] translate-y-0 sm:max-w-none',
        }}
      >
        <DialogContent
          aria-label="Command palette"
          className="gap-0 overflow-hidden p-0"
        >
          <Command className="max-h-[60vh]">
            <CommandInput
              autoFocus
              aria-label="Search controls, presets, components"
              className="border-b p-2"
            >
              <Input placeholder="Jump to anything…" className="w-full" />
            </CommandInput>
            <CommandContent
              onAction={(key) => run(String(key))}
              className="max-h-[50vh] overflow-y-auto p-1"
            >
              <CommandSection>
                <CommandSectionHeader>Go to</CommandSectionHeader>
                {CHAPTERS.map((c) => (
                  <CommandItem
                    key={c.id}
                    id={`chapter:${c.id}`}
                    textValue={c.label}
                  >
                    <c.icon data-icon-start="" />
                    {c.label}
                  </CommandItem>
                ))}
              </CommandSection>

              <CommandSection>
                <CommandSectionHeader>Presets</CommandSectionHeader>
                {PRESETS.map((p) => (
                  <CommandItem
                    key={p.id}
                    id={`preset:${p.id}`}
                    textValue={`Preset ${p.label}`}
                  >
                    <span
                      data-icon-start=""
                      className="size-3.5 rounded-[4px] ring-1 ring-black/10 ring-inset"
                      style={{ backgroundColor: p.accent }}
                    />
                    {p.label}
                    <span className="ml-auto text-xs text-fg-muted">
                      {p.hint}
                    </span>
                  </CommandItem>
                ))}
              </CommandSection>

              <CommandSection>
                <CommandSectionHeader>Actions</CommandSectionHeader>
                <CommandItem id="action:reroll" textValue="Re-roll surprise me">
                  <DicesIcon data-icon-start="" />
                  Re-roll the system
                </CommandItem>
                <CommandItem
                  id="action:theme"
                  textValue="Toggle light dark theme"
                >
                  {resolvedTheme === 'dark' ? (
                    <SunIcon data-icon-start="" />
                  ) : (
                    <MoonIcon data-icon-start="" />
                  )}
                  Toggle light / dark
                </CommandItem>
                <CommandItem
                  id="action:reset"
                  textValue="Reset to default system"
                >
                  <RotateCcwIcon data-icon-start="" />
                  Reset to default
                </CommandItem>
              </CommandSection>

              <CommandSection>
                <CommandSectionHeader>Components</CommandSectionHeader>
                {components.map((c) => (
                  <CommandItem
                    key={c.name}
                    id={`component:${c.name}`}
                    textValue={`Component ${titleCase(c.name)}`}
                  >
                    <BoxIcon data-icon-start="" />
                    {titleCase(c.name)}
                  </CommandItem>
                ))}
              </CommandSection>

              <CommandSection>
                <CommandSectionHeader>Help</CommandSectionHeader>
                <CommandItem
                  id="chapter:brand"
                  textValue="Start one seed magic"
                >
                  <SparklesIcon data-icon-start="" />
                  Generate from one color
                </CommandItem>
              </CommandSection>
            </CommandContent>
          </Command>
        </DialogContent>
      </Overlay>
    </Dialog>
  )
}
