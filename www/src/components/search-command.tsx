import React from "react"
import type * as PageTree from "fumadocs-core/page-tree"

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

// The header swaps its trigger at lg (1024px): below it the hamburger is the
// only way in, so the drawer branch must cover the same range. The registry
// useIsMobile splits at 768px, which would hand 768–1023px an autofocused
// desktop modal instead.
function useIsBelowLg() {
  const [isBelow, setIsBelow] = React.useState(false)
  React.useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)")
    const onChange = () => setIsBelow(mql.matches)
    mql.addEventListener("change", onChange)
    onChange()
    return () => mql.removeEventListener("change", onChange)
  }, [])
  return isBelow
}

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
  const isMobile = useIsBelowLg()

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
      {/* Modal on desktop, Drawer below lg; content remounts on open so the search resets. */}
      {(() => {
        const content = (
          <DialogContent
            aria-label="Search documentation"
            className="flex flex-col gap-0 overflow-hidden p-0! max-lg:min-h-0 max-lg:flex-1"
          >
            {SearchDialog && (
              <SearchDialog
                items={items}
                // The drawer doubles as the nav menu — opening with the
                // keyboard up would punish browse intent.
                autoFocus={!isMobile}
                onClose={() => setIsOpen(false)}
              />
            )}
          </DialogContent>
        )
        return isMobile ? (
          // Match the desktop modal's raised surface. Near-full-height sheet:
          // the results list flexes above the input, which sits at the
          // bottom — the drawer's keyboard inset keeps it above the keyboard.
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
      })()}
    </Dialog>
  )
}
