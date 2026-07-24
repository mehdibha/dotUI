'use client'

import { useEffect } from 'react'

import { Command } from '@/registry/ui/command'
import { DialogContent } from '@/registry/ui/dialog'
import { Input } from '@/registry/ui/input'
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from '@/registry/ui/list-box'
import { Modal } from '@/registry/ui/modal'
import { SearchField } from '@/registry/ui/search-field'

import { getComponentDisplayName, paramComponents } from '../components'
import { SECTIONS } from './schema'

/** A palette jump target: a section control or a component's param editors. */
export interface CommandTarget {
  kind: 'control' | 'component'
  sectionId: string
  /** Control id, or component name for `kind: 'component'`. */
  id: string
}

/**
 * The global ⌘K palette — reaches every control and every component's params
 * in two keystrokes. Selecting jumps the rail to the owning section and
 * scrolls/flashes the control (the panel owns that behavior via `onJump`).
 */
export function CommandPalette({
  isOpen,
  onOpenChange,
  onJump,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onJump: (target: CommandTarget) => void
}) {
  // Global shortcut — ⌘K / Ctrl+K from anywhere on the page.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        onOpenChange(!isOpen)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onOpenChange])

  function jump(target: CommandTarget) {
    onOpenChange(false)
    onJump(target)
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="w-full sm:max-w-md"
    >
      <DialogContent aria-label="Search controls" className="p-2">
        <Command>
          <SearchField autoFocus aria-label="Search controls">
            <Input placeholder="Search every control…" />
          </SearchField>
          <ListBox className="mt-2 max-h-80 overflow-y-auto">
            {SECTIONS.map((section) => (
              <ListBoxSection key={section.id}>
                <ListBoxSectionHeader>{section.label}</ListBoxSectionHeader>
                {section.controls.map((control) => (
                  <ListBoxItem
                    key={control.id}
                    id={control.id}
                    textValue={[
                      control.label,
                      section.label,
                      ...(control.keywords ?? []),
                    ].join(' ')}
                    onAction={() =>
                      jump({
                        kind: 'control',
                        sectionId: section.id,
                        id: control.id,
                      })
                    }
                  >
                    <span className="truncate">{control.label}</span>
                  </ListBoxItem>
                ))}
              </ListBoxSection>
            ))}
            <ListBoxSection>
              <ListBoxSectionHeader>Components</ListBoxSectionHeader>
              {paramComponents.map((comp) => (
                <ListBoxItem
                  key={comp.name}
                  id={`component-${comp.name}`}
                  textValue={`${getComponentDisplayName(comp.name)} component`}
                  onAction={() =>
                    jump({
                      kind: 'component',
                      sectionId: 'components',
                      id: comp.name,
                    })
                  }
                >
                  <span className="truncate">
                    {getComponentDisplayName(comp.name)}
                  </span>
                </ListBoxItem>
              ))}
            </ListBoxSection>
          </ListBox>
        </Command>
      </DialogContent>
    </Modal>
  )
}
