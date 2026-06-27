import React from 'react'
import type * as PageTree from 'fumadocs-core/page-tree'
import {
  ArrowRightIcon,
  ChevronsUpDownIcon,
  CircleDashedIcon,
  CornerDownLeftIcon,
  FileTextIcon,
  SearchIcon,
} from 'lucide-react'

import { Responsive } from '@/registry/lib/responsive'
import { Button } from '@/registry/ui/button'
import { Command } from '@/registry/ui/command'
import { Dialog, DialogContent } from '@/registry/ui/dialog'
import { Drawer } from '@/registry/ui/drawer'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import {
  MenuContent,
  MenuItem,
  MenuSection,
  MenuSectionHeader,
} from '@/registry/ui/menu'
import { Modal } from '@/registry/ui/modal'
import { SearchField } from '@/registry/ui/search-field'

interface SearchCommandProps {
  items: PageTree.Node[]
  keyboardShortcut?: boolean
  children: React.ReactNode
}

const TOP_LEVEL_LINKS = [
  { label: 'Docs', href: '/docs' },
  { label: 'Components', href: '/docs/components' },
] as const

export function SearchCommand({
  items,
  keyboardShortcut = false,
  children,
}: SearchCommandProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    if (!keyboardShortcut) return

    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        const target = e.target
        if (
          (target instanceof HTMLElement && target.isContentEditable) ||
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          target instanceof HTMLSelectElement
        ) {
          return
        }

        e.preventDefault()
        setIsOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [keyboardShortcut])

  return (
    <Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
      {children}
      {/* Modal on desktop, Drawer on mobile; content remounts on open so the Autocomplete resets. */}
      <Responsive
        render={(isMobile) => {
          const content = (
            <DialogContent
              aria-label="Search documentation"
              className="flex h-100 max-h-[70vh] flex-col overflow-hidden p-0!"
            >
              <Command
                aria-label="Search documentation"
                className="min-h-0 flex-1 overflow-y-hidden"
              >
                <SearchField autoFocus aria-label="Search">
                  <InputGroup>
                    <InputGroupAddon>
                      <SearchIcon />
                    </InputGroupAddon>
                    <Input placeholder="Search documentation..." />
                  </InputGroup>
                </SearchField>
                <MenuContent
                  aria-label="Search results"
                  className="min-h-0 flex-1 overflow-y-auto"
                  onAction={() => setIsOpen(false)}
                  renderEmptyState={() => (
                    <div className="py-8 text-center text-sm text-fg-muted">
                      No results found.
                    </div>
                  )}
                >
                  <MenuSection>
                    <MenuSectionHeader>Menu</MenuSectionHeader>
                    {TOP_LEVEL_LINKS.map((item) => (
                      <MenuItem
                        key={item.href}
                        href={item.href}
                        textValue={item.label}
                      >
                        <ArrowRightIcon className="text-fg-muted!" />
                        {item.label}
                      </MenuItem>
                    ))}
                  </MenuSection>
                  {items.map((group, index) => {
                    if (group.type !== 'folder') return null
                    return (
                      // oxlint-disable-next-line react/no-array-index-key -- items is static navigation data
                      <MenuSection key={index}>
                        <MenuSectionHeader>{group.name}</MenuSectionHeader>
                        {group.children.map((item) => {
                          if (item.type !== 'page') return null
                          return (
                            <MenuItem
                              key={item.url}
                              href={item.url}
                              textValue={item.name as string}
                            >
                              {group.name === 'Components' ? (
                                <CircleDashedIcon className="text-fg-muted!" />
                              ) : (
                                <FileTextIcon className="text-fg-muted!" />
                              )}
                              {item.name}
                            </MenuItem>
                          )
                        })}
                      </MenuSection>
                    )
                  })}
                </MenuContent>
              </Command>
              <div className="flex items-center gap-4 border-t px-3 py-2.5 text-xs text-fg-muted [&_svg]:size-3.5">
                <span className="flex items-center gap-1.5">
                  <ChevronsUpDownIcon />
                  Navigate
                </span>
                <span className="flex items-center gap-1.5">
                  <CornerDownLeftIcon />
                  Go to
                </span>
                <Button
                  slot="close"
                  variant="quiet"
                  size="sm"
                  className="ml-auto h-6 px-1.5 text-xs font-normal text-fg-muted"
                >
                  Esc
                </Button>
              </div>
            </DialogContent>
          )
          return isMobile ? (
            <Drawer>{content}</Drawer>
          ) : (
            <Modal className="mt-[15vh] self-start duration-0 entering:scale-100 exiting:scale-100">
              {content}
            </Modal>
          )
        }}
      />
    </Dialog>
  )
}
