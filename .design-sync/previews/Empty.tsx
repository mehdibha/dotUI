import { FolderIcon, PlusIcon, SearchIcon } from 'lucide-react'
import {
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from 'www'

export const WithIcon = () => (
  <Empty style={{ width: 420 }}>
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
      <Button variant="primary">
        <PlusIcon />
        New project
      </Button>
    </EmptyContent>
  </Empty>
)

export const Bordered = () => (
  <Empty className="border" style={{ width: 420 }}>
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <SearchIcon />
      </EmptyMedia>
      <EmptyTitle>No results found</EmptyTitle>
      <EmptyDescription>
        We couldn't find anything matching your search. Try a different query.
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <Button variant="default">Clear filters</Button>
    </EmptyContent>
  </Empty>
)

export const TitleOnly = () => (
  <Empty style={{ width: 420 }}>
    <EmptyHeader>
      <EmptyTitle>Your inbox is empty</EmptyTitle>
      <EmptyDescription>New messages will appear here.</EmptyDescription>
    </EmptyHeader>
  </Empty>
)
