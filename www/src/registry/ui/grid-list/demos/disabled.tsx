import { GridList, GridListItem } from '@/registry/ui/grid-list'

export default function Demo() {
  return (
    <div className="w-64 rounded-md border bg-card shadow-sm">
      <GridList
        aria-label="Environments"
        selectionMode="single"
        disabledKeys={['production']}
      >
        <GridListItem id="development">Development</GridListItem>
        <GridListItem id="preview">Preview</GridListItem>
        <GridListItem id="production">Production</GridListItem>
      </GridList>
    </div>
  )
}
