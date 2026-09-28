import { useRef, useState } from "react"
import type { RefObject } from "react"
import { CheckIcon, SaveIcon, Share2Icon } from "lucide-react"

import { useIsMobile } from "@/registry/hooks/use-mobile"
import { Button } from "@/registry/ui/button"
import { HeaderActions } from "@/components/layout/header-slot"
import { useShortcut } from "@/modules/studio/history"
import { NameDialog, saveRequest } from "@/modules/studio/name-dialog"
import type { NameRequest } from "@/modules/studio/name-dialog"
import { useCurrent } from "@/modules/studio/selection"
import { useWorkspace } from "@/modules/studio/workspace"

import { ExportDialog } from "./export-dialog"
import { SharePopover } from "./share-popover"

/** The studio's header actions — Save, Share, Export — portaled into the
 *  global header so they stay visible from both mobile panes. */
export function StudioHeaderActions() {
  const isMobile = useIsMobile()
  const shareRef = useRef<HTMLButtonElement>(null)

  return (
    <HeaderActions>
      <SaveButton isMobile={isMobile} nextRef={shareRef} />
      <SharePopover>
        <Button
          ref={shareRef}
          variant="quiet"
          size="sm"
          isIconOnly={isMobile}
          aria-label={isMobile ? "Share" : undefined}
        >
          {isMobile ? <Share2Icon /> : "Share"}
        </Button>
      </SharePopover>
      <ExportDialog>
        <Button variant="primary" size="sm">
          Export
        </Button>
      </ExportDialog>
    </HeaderActions>
  )
}

/** Saves the unsaved slot as a system, also on ⌘S; the user's systems save
 *  themselves. */
function SaveButton({
  isMobile,
  nextRef,
}: {
  isMobile: boolean
  /** Takes focus back from the dialog: saved, this button disables. */
  nextRef: RefObject<HTMLButtonElement | null>
}) {
  const { sel, doc } = useCurrent()
  const workspace = useWorkspace()
  const [naming, setNaming] = useState<NameRequest>()
  const ref = useRef<HTMLButtonElement>(null)
  const label = doc ? "Saved" : "Save"
  const save = () => {
    // Never over an open dialog or menu, this one's included.
    if (naming || document.activeElement?.closest("[role=dialog],[role=menu]"))
      return
    const request = sel.kind === "unsaved" && saveRequest(workspace)
    if (!request) return
    if (document.activeElement === ref.current) nextRef.current?.focus()
    setNaming(request)
  }
  useShortcut("save", save)
  return (
    <>
      <Button
        ref={ref}
        variant="quiet"
        size="sm"
        isIconOnly={isMobile}
        aria-label={isMobile ? label : undefined}
        isDisabled={sel.kind !== "unsaved"}
        onPress={save}
        className="disabled:bg-transparent"
      >
        {isMobile ? (
          doc ? (
            <CheckIcon />
          ) : (
            <SaveIcon />
          )
        ) : (
          // As wide as either label: the header never shifts between them.
          <span className="grid *:col-start-1 *:row-start-1">
            <span className={doc ? "invisible" : undefined}>Save</span>
            <span className={doc ? undefined : "invisible"}>Saved</span>
          </span>
        )}
      </Button>
      <NameDialog request={naming} onClose={() => setNaming(undefined)} />
    </>
  )
}
