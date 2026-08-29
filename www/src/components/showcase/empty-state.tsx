"use client"

import { FolderIcon, PlusIcon } from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { Card, CardContent } from "@/registry/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/ui/empty"

export function EmptyState({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <Card className={cn("justify-center", className)} {...props}>
      <CardContent className="py-2">
        <Empty className="p-2">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderIcon />
            </EmptyMedia>
            <EmptyTitle>No projects yet</EmptyTitle>
            <EmptyDescription>
              Create a project to start deploying, or import one from GitHub.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button variant="primary">
                <PlusIcon />
                New project
              </Button>
              <Button variant="quiet">Import</Button>
            </div>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  )
}
