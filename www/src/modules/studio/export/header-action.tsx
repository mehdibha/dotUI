import { useState } from "react"
import { SaveIcon, Share2Icon } from "lucide-react"

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

  return (
    <HeaderActions>
      <SaveButton isMobile={isMobile} />
      <SharePopover>
        <Button
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
function SaveButton({ isMobile }: { isMobile: boolean }) {
  const { sel, doc } = useCurrent()
  const workspace = useWorkspace()
  const [naming, setNaming] = useState<NameRequest>()
  const label = doc ? "Saved" : "Save"
  const save = () => {
    const request = sel.kind === "unsaved" && saveRequest(workspace)
    if (request && !naming) setNaming(request)
  }
  useShortcut("save", save)
  return (
    <>
      <Button
        variant="quiet"
        size="sm"
        isIconOnly={isMobile}
        aria-label={isMobile ? label : undefined}
        isDisabled={sel.kind !== "unsaved"}
        onPress={save}
        className="disabled:bg-transparent"
      >
        {isMobile ? <SaveIcon /> : label}
      </Button>
      <NameDialog request={naming} onClose={() => setNaming(undefined)} />
    </>
  )
}
