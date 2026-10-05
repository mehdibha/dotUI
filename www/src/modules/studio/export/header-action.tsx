import { LinkIcon } from "lucide-react"

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
      <div className="flex items-center gap-2">
        <SharePopover>
          <Button
            variant="secondary"
            size="sm"
            isIconOnly={isMobile}
            aria-label={isMobile ? "Share" : undefined}
          >
            <LinkIcon />
            {!isMobile && "Share"}
          </Button>
        </SharePopover>
        <ExportDialog>
          <Button variant="primary" size="sm">
            Export
          </Button>
        </ExportDialog>
      </div>
    </HeaderActions>
  )
}
