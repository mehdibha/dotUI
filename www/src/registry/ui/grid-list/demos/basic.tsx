import { GridList, GridListItem } from '@/registry/ui/grid-list'

export default function Demo() {
  return (
    <div className="w-64 rounded-md border bg-card shadow-sm">
      <GridList aria-label="Projects" selectionMode="none">
        <GridListItem id="design-system">Design system</GridListItem>
        <GridListItem id="marketing-site">Marketing site</GridListItem>
        <GridListItem id="mobile-app">Mobile app</GridListItem>
        <GridListItem id="docs">Documentation</GridListItem>
      </GridList>
    </div>
  )
}
