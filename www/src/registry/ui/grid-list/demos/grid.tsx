import { GridList, GridListItem } from '@/registry/ui/grid-list'

export default function Demo() {
  return (
    <div className="w-80 rounded-md border bg-card shadow-sm">
      <GridList
        aria-label="Frameworks"
        layout="grid"
        selectionMode="multiple"
        className="grid-cols-2"
      >
        <GridListItem id="next">Next.js</GridListItem>
        <GridListItem id="remix">Remix</GridListItem>
        <GridListItem id="astro">Astro</GridListItem>
        <GridListItem id="gatsby">Gatsby</GridListItem>
        <GridListItem id="solid">SolidStart</GridListItem>
        <GridListItem id="qwik">Qwik City</GridListItem>
      </GridList>
    </div>
  )
}
