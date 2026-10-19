"use client"

import { FolderIcon, PlusIcon } from "@/registry/icons"
import { Button } from "@/registry/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  type EmptyMediaProps,
} from "@/registry/ui/empty"

export default function Demo({
  variant = "default",
  title = "No projects yet",
  description = "Get started by creating your first project.",
  showAction = true,
}: {
  variant?: EmptyMediaProps["variant"]
  title?: string
  description?: string
  showAction?: boolean
} = {}) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia data-control-target variant={variant}>
          <FolderIcon />
        </EmptyMedia>
        {title && <EmptyTitle>{title}</EmptyTitle>}
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      {showAction && (
        <EmptyContent>
          <Button variant="primary">
            <PlusIcon />
            New project
          </Button>
        </EmptyContent>
      )}
    </Empty>
  )
}
