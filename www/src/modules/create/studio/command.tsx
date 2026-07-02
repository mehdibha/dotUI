'use client'

import { useEffect, useState } from 'react'
import {
  DicesIcon,
  type LucideIcon,
  RotateCcwIcon,
  SearchIcon,
} from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { Command } from '@/registry/ui/command'
import { Dialog, DialogContent } from '@/registry/ui/dialog'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { Kbd } from '@/registry/ui/kbd'
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from '@/registry/ui/list-box'
import { Overlay } from '@/registry/ui/overlay'
import { SearchField } from '@/registry/ui/search-field'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

import { getComponentDisplayName } from '../components'
import { useStudioActions } from './actions'
import { TWEAKABLE_COMPONENTS } from './components-browser'
import { useStudio } from './store'
import { FOUNDATION_INDEX } from './views'

/* ----------------------------------------------------------------------------
 * ⌘K command palette — jump to any foundation, any component, or fire a macro
 * from one keystroke. This is the "control anything, instantly" power surface.
 * -------------------------------------------------------------------------- */

const ACTIONS: ReadonlyArray<{ id: string; label: string; icon: LucideIcon }> =
  [
    {
      id: 'action:reroll',
      label: 'Surprise me — re-roll the system',
      icon: DicesIcon,
    },
    { id: 'action:reset', label: 'Reset to defaults', icon: RotateCcwIcon },
  ]

export function CommandPalette() {
  const { open: openStack } = useStudio()
  const { reroll, resetAll } = useStudioActions()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function onAction(key: React.Key) {
    const id = String(key)
    setOpen(false)
    if (id === 'action:reroll') return reroll()
    if (id === 'action:reset') return resetAll()
    if (id.startsWith('component:')) return openStack(['components', id])
    openStack([id])
  }

  return (
    <Dialog isOpen={open} onOpenChange={setOpen}>
      <Tooltip delay={300}>
        <Button size="sm" variant="quiet" isIconOnly aria-label="Search (⌘K)">
          <SearchIcon />
        </Button>
        <TooltipContent>
          Search <Kbd>⌘K</Kbd>
        </TooltipContent>
      </Tooltip>
      <Overlay
        type="modal"
        mobileType="drawer"
        modalProps={{ className: 'w-[min(38rem,92vw)] sm:max-w-none' }}
      >
        <DialogContent aria-label="Command palette" className="p-0">
          <Command className="max-h-[60vh]">
            <SearchField aria-label="Search" autoFocus className="border-b p-2">
              <InputGroup>
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
                <Input placeholder="Jump to anything…" />
              </InputGroup>
            </SearchField>
            <ListBox
              aria-label="Commands"
              onAction={onAction}
              className="max-h-[50vh] overflow-y-auto p-2"
            >
              <ListBoxSection>
                <ListBoxSectionHeader>Actions</ListBoxSectionHeader>
                {ACTIONS.map((a) => (
                  <ListBoxItem key={a.id} id={a.id} textValue={a.label}>
                    <a.icon />
                    <span>{a.label}</span>
                  </ListBoxItem>
                ))}
              </ListBoxSection>
              <ListBoxSection>
                <ListBoxSectionHeader>Foundations</ListBoxSectionHeader>
                {FOUNDATION_INDEX.map((f) => (
                  <ListBoxItem key={f.id} id={f.id} textValue={f.label}>
                    <f.icon />
                    <span>{f.label}</span>
                  </ListBoxItem>
                ))}
              </ListBoxSection>
              <ListBoxSection>
                <ListBoxSectionHeader>Components</ListBoxSectionHeader>
                {TWEAKABLE_COMPONENTS.map((item) => (
                  <ListBoxItem
                    key={item.name}
                    id={`component:${item.name}`}
                    textValue={getComponentDisplayName(item.name)}
                  >
                    <span>{getComponentDisplayName(item.name)}</span>
                  </ListBoxItem>
                ))}
              </ListBoxSection>
            </ListBox>
          </Command>
        </DialogContent>
      </Overlay>
    </Dialog>
  )
}
