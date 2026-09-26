import { Share2Icon } from "lucide-react"

import { useIsMobile } from "@/registry/hooks/use-mobile"
import { Button } from "@/registry/ui/button"
import { HeaderActions } from "@/components/layout/header-slot"
import { useCurrent } from "@/modules/studio/selection"

import { ExportDialog } from "./export-dialog"
import { PublishButton } from "./publish-button"
import { SharePopover } from "./share-popover"

/**
 * The studio's header actions — Share, Publish, Export — portaled into the
 * global header so they stay visible from both mobile panes. Views have
 * nothing to publish; on phones Publish sits in the Share drawer.
 */
export function StudioHeaderActions() {
  const { doc } = useCurrent()
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
      {doc && <PublishButton doc={doc} className="max-md:hidden" />}
      <ExportDialog>
        <Button variant="primary" size="sm">
          Export
        </Button>
      </ExportDialog>
    </HeaderActions>
  )
}
