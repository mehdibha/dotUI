import { GridList, GridListItem } from '@/registry/ui/grid-list'

export default function Demo() {
  return (
    <div className="w-64 rounded-md border bg-card shadow-sm">
      <GridList
        aria-label="Toppings"
        selectionMode="multiple"
        defaultSelectedKeys={['mushroom', 'olives']}
      >
        <GridListItem id="mushroom">Mushroom</GridListItem>
        <GridListItem id="olives">Olives</GridListItem>
        <GridListItem id="onion">Onion</GridListItem>
        <GridListItem id="pepperoni">Pepperoni</GridListItem>
        <GridListItem id="basil">Fresh basil</GridListItem>
      </GridList>
    </div>
  )
}
