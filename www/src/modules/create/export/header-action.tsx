import { Button } from '@/registry/ui/button'
import { HeaderActions } from '@/components/layout/header-slot'

import { ExportDialog } from './export-dialog'

/**
 * The create page's header CTA, portaled into the global header so it stays
 * visible from both mobile panes (customize / preview).
 */
export function ExportHeaderAction() {
  return (
    <HeaderActions>
      <ExportDialog>
        <Button variant="primary" size="sm" className="ml-1.5">
          Export
        </Button>
      </ExportDialog>
    </HeaderActions>
  )
}
