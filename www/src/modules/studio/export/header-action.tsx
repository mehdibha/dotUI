import { LinkIcon } from "lucide-react"

import { useIsMobile } from "@/registry/hooks/use-mobile"
import { Button } from "@/registry/ui/button"
import { HeaderActions } from "@/components/layout/header-slot"
import { useDockStacked } from "@/modules/studio/rows"

import { ExportDialog } from "./export-dialog"
import { SharePopover } from "./share-popover"

/** The studio's header actions — Share and Export — portaled into the
 *  global header so they stay visible from both mobile panes. A phone held
 *  upright keeps Export alone, touch-sized. */
export function StudioHeaderActions() {
  const isMobile = useIsMobile()
  const stacked = useDockStacked()

  return (
    <HeaderActions>
      <div className="flex shrink-0 items-center gap-2">
        {!stacked && (
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
        )}
        <ExportDialog>
          <Button
            variant="primary"
            size="sm"
            className={stacked ? "h-10 px-4 text-[15px]" : undefined}
          >
            Export
          </Button>
        </ExportDialog>
      </div>
    </HeaderActions>
  )
}
