'use client'

import { Tree } from '@/registry/ui/tree'

export default function Demo() {
  return (
    <Tree
      aria-label="Files"
      className="h-40 w-72"
      renderEmptyState={() => (
        <span className="text-sm text-fg-muted">No files found.</span>
      )}
    >
      {[]}
    </Tree>
  )
}
