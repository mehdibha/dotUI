import { Share2Icon } from "lucide-react"

import { useIsMobile } from "@/registry/hooks/use-mobile"
import { Button } from "@/registry/ui/button"
import { HeaderActions } from "@/components/layout/header-slot"

import { ExportDialog } from "./export-dialog"
import { SharePopover } from "./share-popover"

/** The studio's header actions — Share and Export — portaled into the
 *  global header so they stay visible from both mobile panes. */
export function StudioHeaderActions() {
  const isMobile = useIsMobile()

  return (
    <HeaderActions>
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
