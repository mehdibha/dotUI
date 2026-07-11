import React from 'react'
import type * as PageTree from 'fumadocs-core/page-tree'

import { Responsive } from '@/registry/lib/responsive'
import { Dialog, DialogContent } from '@/registry/ui/dialog'
import { Drawer } from '@/registry/ui/drawer'
import {
  ModalBackdrop,
  ModalOverlay,
  ModalPanel,
  ModalViewport,
} from '@/registry/ui/modal'

// The dialog body pulls in the Orama search client, the fumadocs search hook and
// react-aria's Autocomplete (~24 KB gz). Load it lazily on first open so it stays
// off every page's critical path — the trigger and shell below are cheap.
const SearchDialog = React.lazy(() => import('./search-dialog'))

interface SearchCommandProps {
  items: PageTree.Node[]
  keyboardShortcut?: boolean
  children: React.ReactNode
}

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
      {/* Modal on desktop, Drawer on mobile; content remounts on open so the search resets. */}
      <Responsive
        render={(isMobile) => {
          const content = (
            <DialogContent
              aria-label="Search documentation"
              className="flex flex-col gap-0 overflow-hidden p-0!"
            >
              <React.Suspense
                fallback={<div className="h-14" aria-hidden="true" />}
              >
                <SearchDialog items={items} onClose={() => setIsOpen(false)} />
              </React.Suspense>
            </DialogContent>
          )
          return isMobile ? (
            // Match the desktop modal's raised surface.
            <Drawer className="bg-(--neutral-200)">{content}</Drawer>
          ) : (
            // Composed (not <Modal>) so the panel AND backdrop appear
            // instantly — duration-0 on both. Mirror shadcn.com: max-w-lg
            // (512px), top-15%.
            <ModalOverlay>
              <ModalBackdrop className="duration-0 group-exiting/modal:duration-0" />
              <ModalViewport>
                <ModalPanel className="mt-[15vh] self-start duration-0 [--modal-background:var(--neutral-200)] [--modal-radius:var(--radius-2xl)] sm:max-w-lg entering:scale-100 exiting:scale-100">
                  {content}
                </ModalPanel>
              </ModalViewport>
            </ModalOverlay>
          )
        }}
      />
    </Dialog>
  )
}
