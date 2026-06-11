import { ArrowUpRightIcon, FolderIcon } from '@/registry/__generated__/icons'
import { Button, LinkButton } from '@/registry/ui/button'
import { Card, CardContent } from '@/registry/ui/card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/registry/ui/empty'

export default function Demo() {
  return (
    <Card className="w-full">
      <CardContent>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderIcon />
            </EmptyMedia>
            <EmptyTitle>No projects yet</EmptyTitle>
            <EmptyDescription>
              You haven't created any projects yet. Get started by creating your
              first project.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <LinkButton variant="primary" href="#">
                Create project
              </LinkButton>
              <Button variant="default">Import project</Button>
            </div>
            <LinkButton variant="link" href="#" className="text-fg-muted">
              Learn more <ArrowUpRightIcon />
            </LinkButton>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  )
}
