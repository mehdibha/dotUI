import React from "react"
import type * as PageTree from "fumadocs-core/page-tree"

import { Responsive } from "@/registry/lib/responsive"
import { Dialog, DialogContent } from "@/registry/ui/dialog"
import { Drawer, DrawerHandle } from "@/registry/ui/drawer"
import {
  ModalBackdrop,
  ModalOverlay,
  ModalPanel,
  ModalViewport,
} from "@/registry/ui/modal"

// The dialog body pulls in the Orama search client, the fumadocs search hook
// and react-aria's Autocomplete (~25 KB gz). Load it lazily on first open so it
// stays off every page's critical path — the trigger and shell below are cheap.
// A module var instead of React.lazy: lazy suspends once even on a resolved
// import, committing the fallback before the content — a potential flash.
let SearchDialog: (typeof import("./search-dialog"))["default"] | null = null
const loadSearchDialog = () =>
  import("./search-dialog").then((module) => {
    SearchDialog = module.default
  })

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

  // A cold open (first ⌘K, nothing warmed) waits for the chunk — a few ms,
  // since the open request itself starts the fetch — instead of flashing the
  // Suspense fallback. Once loaded, opens are synchronous.
  const requestOpen = (open: boolean) => {
    if (!open || SearchDialog) {
      setIsOpen(open)
      return
    }
    const show = () => setIsOpen(true)
    void loadSearchDialog().then(show, show)
  }

  React.useEffect(() => {
    if (!keyboardShortcut) return

    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
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
        if (isOpen) setIsOpen(false)
        else requestOpen(true)
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  })

  return (
    <Dialog isOpen={isOpen} onOpenChange={requestOpen}>
      {/* Hover/focus intent on the trigger warms the lazy chunk so first open
          feels instant. display:contents keeps the trigger's press wiring —
          RAC's DialogTrigger reaches pressables via context, not cloning. */}
      <span
        className="contents"
        onPointerEnter={() => void loadSearchDialog()}
        onFocus={() => void loadSearchDialog()}
      >
        {children}
      </span>
      {/* Modal on desktop, Drawer on mobile; content remounts on open so the search resets. */}
      <Responsive
        render={(isMobile) => {
          const content = (
            <DialogContent
              aria-label="Search documentation"
              className="flex flex-col gap-0 overflow-hidden p-0! max-md:min-h-0 max-md:flex-1"
            >
              {SearchDialog && (
                <SearchDialog
                  items={items}
                  // The mobile drawer doubles as the nav menu — opening with
                  // the keyboard up would punish browse intent.
                  autoFocus={!isMobile}
                  onClose={() => setIsOpen(false)}
                />
              )}
            </DialogContent>
          )
          return isMobile ? (
            // Match the desktop modal's raised surface. Near-full-height sheet
            // (mirrors base-ui.com's mobile search): the input sits at the top,
            // structurally clear of the iOS keyboard, and the results list
            // flexes below it. The drawer's keyboard inset keeps the list's
            // bottom above the keyboard.
            <Drawer className="h-[calc(100dvh_-_3rem_+_var(--drawer-bleed))] bg-(--neutral-100)">
              <DrawerHandle />
              {content}
            </Drawer>
          ) : (
            // Composed (not <Modal>) so the panel AND backdrop appear
            // instantly — duration-0 on both. Mirror shadcn.com: max-w-lg
            // (512px), top-15%.
            <ModalOverlay>
              <ModalBackdrop className="duration-0 group-exiting/modal:duration-0" />
              <ModalViewport>
                <ModalPanel className="mt-[15vh] self-start duration-0 [--modal-background:var(--neutral-100)] [--modal-radius:var(--radius-2xl)] sm:max-w-lg entering:scale-100 exiting:scale-100">
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
