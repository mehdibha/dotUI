'use client'

import { useEffect } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  BoxIcon,
  RotateCcwIcon,
  SearchIcon,
  ShuffleIcon,
  WandSparklesIcon,
} from 'lucide-react'

import { Command } from '@/registry/ui/command'
import { DialogContent } from '@/registry/ui/dialog'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { Kbd } from '@/registry/ui/kbd'
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from '@/registry/ui/list-box'
import { Modal } from '@/registry/ui/modal'
import { registryUi } from '@/registry/ui/registry'
import { SearchField } from '@/registry/ui/search-field'

import { ExamplesIndex } from '../__generated__/examples'
import { useStudioActions } from './actions'
import { type AxisId, AXES } from './axes'
import { useStudio } from './store'

const routeApi = getRouteApi('/_app/create')

const TWEAKABLE = registryUi
  .filter((i) => i.params && Object.keys(i.params).length > 0)
  .sort((a, b) => a.name.localeCompare(b.name))

function titleCase(slug: string) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function CommandPalette() {
  const navigate = routeApi.useNavigate()
  const {
    setAxis,
    setSelectedComponent,
    setOnboardingOpen,
    commandOpen: open,
    setCommandOpen: setOpen,
  } = useStudio()
  const { shuffle, reset } = useStudioActions()

  // ⌘K / Ctrl-K toggles the palette from anywhere in the studio.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(!open)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  function run(key: string) {
    if (key.startsWith('axis:')) {
      setAxis(key.slice(5) as AxisId)
    } else if (key.startsWith('comp:')) {
      const name = key.slice(5)
      setAxis('components')
      setSelectedComponent(name)
      if (name in ExamplesIndex) {
        navigate({ search: (p) => ({ ...p, preview: name }) })
      }
    } else if (key === 'act:shuffle') {
      shuffle()
    } else if (key === 'act:reset') {
      reset()
    } else if (key === 'act:generate') {
      setOnboardingOpen(true)
    }
    setOpen(false)
  }

  return (
    <Modal isOpen={open} onOpenChange={setOpen} isDismissable>
      <DialogContent className="w-full max-w-xl p-0">
        <Command aria-label="Command palette">
          <SearchField aria-label="Search the studio" autoFocus>
            <InputGroup size="lg">
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <Input placeholder="Jump to an axis, component or action…" />
              <InputGroupAddon>
                <Kbd className="bg-transparent">Esc</Kbd>
              </InputGroupAddon>
            </InputGroup>
          </SearchField>
          <ListBox
            aria-label="Commands"
            onAction={(key) => run(String(key))}
            className="max-h-80"
          >
            <ListBoxSection>
              <ListBoxSectionHeader>Go to</ListBoxSectionHeader>
              {AXES.map((axis) => (
                <ListBoxItem
                  key={axis.id}
                  id={`axis:${axis.id}`}
                  textValue={axis.label}
                >
                  <axis.icon />
                  <span>{axis.label}</span>
                  <span className="ml-auto text-[11px] text-fg-muted">
                    {axis.tagline}
                  </span>
                </ListBoxItem>
              ))}
            </ListBoxSection>

            <ListBoxSection>
              <ListBoxSectionHeader>Actions</ListBoxSectionHeader>
              <ListBoxItem id="act:generate" textValue="Generate from brand">
                <WandSparklesIcon />
                <span>Generate from brand</span>
              </ListBoxItem>
              <ListBoxItem id="act:shuffle" textValue="Surprise me shuffle">
                <ShuffleIcon />
                <span>Surprise me</span>
              </ListBoxItem>
              <ListBoxItem id="act:reset" textValue="Reset to defaults">
                <RotateCcwIcon />
                <span>Reset to defaults</span>
              </ListBoxItem>
            </ListBoxSection>

            <ListBoxSection>
              <ListBoxSectionHeader>Components</ListBoxSectionHeader>
              {TWEAKABLE.map((item) => (
                <ListBoxItem
                  key={item.name}
                  id={`comp:${item.name}`}
                  textValue={titleCase(item.name)}
                >
                  <BoxIcon />
                  <span>{titleCase(item.name)}</span>
                </ListBoxItem>
              ))}
            </ListBoxSection>
          </ListBox>
        </Command>
      </DialogContent>
    </Modal>
  )
}
