import { ArrowUpRightIcon } from '@/registry/__generated__/icons'
import { Button, LinkButton } from '@/registry/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/registry/ui/empty'

export default function Demo() {
  return (
    <Empty>
      <EmptyHeader>
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
  )
}
